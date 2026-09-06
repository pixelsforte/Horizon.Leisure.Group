import fs from "fs";
import path from "path";
import mongoose, { Schema, Document } from "mongoose";

function getMongoURI(): string | undefined {
  let uri = process.env.MONGODB_URI;

  const isPlaceholder = (s: string) => 
    s.includes("<db_password>") || 
    s.includes("<password>") || 
    s.includes("username:password") || 
    s.includes("hashimali797_db_user:<db_password>");

  if (!uri || isPlaceholder(uri)) {
    try {
      const envPaths = [
        path.join(process.cwd(), ".env"),
        path.join(process.cwd(), ".env.example")
      ];
      for (const envPath of envPaths) {
        if (fs.existsSync(envPath)) {
          const content = fs.readFileSync(envPath, "utf8");
          const match = content.match(/^MONGODB_URI=(.+)$/m);
          if (match) {
            const foundUri = match[1].trim();
            if (!isPlaceholder(foundUri)) {
              uri = foundUri;
              break;
            }
          }
        }
      }
    } catch (err) {
      console.warn("Failed to read env file for MONGODB_URI:", err);
    }
  }

  if (uri) {
    // Strip both URL-encoded and raw angle brackets
    uri = uri
      .replace(/%3C/g, "")
      .replace(/%3E/g, "")
      .replace(/</g, "")
      .replace(/>/g, "");
  }

  return uri;
}

const MONGODB_URI = getMongoURI();
const JSON_DB_PATH = path.join(process.cwd(), "db.json");

// Define interfaces for TypeScript
export interface ICustomer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  createdAt: Date;
  lastActivity: Date;
  totalBookings: number;
  totalPartnershipRequests: number;
}

export interface IBooking {
  id: string;
  customerId: string;
  eventType: string;
  guestCount: string;
  eventDate: string;
  venue: string;
  notes?: string;
  bookingStatus: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  createdAt: Date;
}

export interface IPartnership {
  id: string;
  customerId: string;
  fullName: string;
  whatsappNumber: string;
  city: string;
  clubName: string;
  partnershipModel: string;
  message?: string;
  createdAt: Date;
}

export interface IAdmin {
  id: string;
  username: string;
  passwordHash: string;
  role: string;
  fullName?: string;
  createdAt: Date;
  resetPasswordTokenHash?: string;
  resetPasswordExpires?: Date;
  pendingEmail?: string;
  pendingEmailTokenHash?: string;
  pendingEmailExpires?: Date;
}

// Global flag to track if we're using Mongoose or JSON fallback
let isMongoConnected = false;

// ---------------------------------------------------------------------------
// 1. Mongoose Setup (Schemas & Models)
// ---------------------------------------------------------------------------

const CustomerSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: false },
  phone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastActivity: { type: Date, default: Date.now },
  totalBookings: { type: Number, default: 0 },
  totalPartnershipRequests: { type: Number, default: 0 },
});

const BookingSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
  eventType: { type: String, required: true },
  guestCount: { type: String, required: true },
  eventDate: { type: String, required: true },
  venue: { type: String, required: true },
  notes: { type: String },
  bookingStatus: {
    type: String,
    enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const PartnershipSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
  fullName: { type: String, required: true },
  whatsappNumber: { type: String, required: true },
  city: { type: String, required: true },
  clubName: { type: String, required: true },
  partnershipModel: { type: String, required: true },
  message: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const AdminSchema = new Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: "admin" },
  fullName: { type: String },
  createdAt: { type: Date, default: Date.now },
  resetPasswordTokenHash: { type: String, required: false },
  resetPasswordExpires: { type: Date, required: false },
  pendingEmail: { type: String, required: false },
  pendingEmailTokenHash: { type: String, required: false },
  pendingEmailExpires: { type: Date, required: false },
});

// Models (declared lazily or conditionally to avoid re-compilation in Next.js/Vite environments)
let CustomerModel: mongoose.Model<any>;
let BookingModel: mongoose.Model<any>;
let PartnershipModel: mongoose.Model<any>;
let AdminModel: mongoose.Model<any>;

function initMongoModels() {
  CustomerModel = mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);
  BookingModel = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
  PartnershipModel = mongoose.models.Partnership || mongoose.model("Partnership", PartnershipSchema);
  AdminModel = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
}

// ---------------------------------------------------------------------------
// 2. Local JSON DB Fallback (Implementation)
// ---------------------------------------------------------------------------

interface IJsonSchema {
  customers: ICustomer[];
  bookings: IBooking[];
  partnerships: IPartnership[];
  admins: IAdmin[];
}

const initialJsonDb: IJsonSchema = {
  customers: [],
  bookings: [],
  partnerships: [],
  admins: [],
};

function readJsonDb(): IJsonSchema {
  if (process.env.NODE_ENV === "production") {
    throw new Error("CRITICAL DATABASE ERROR: JSON database reads are disabled in production environment. MongoDB Atlas connection is required.");
  }
  try {
    if (!fs.existsSync(JSON_DB_PATH)) {
      fs.writeFileSync(JSON_DB_PATH, JSON.stringify(initialJsonDb, null, 2));
      return initialJsonDb;
    }
    const data = fs.readFileSync(JSON_DB_PATH, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading JSON database:", err);
    return initialJsonDb;
  }
}

function writeJsonDb(data: IJsonSchema) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("CRITICAL DATABASE ERROR: JSON database writes are disabled in production environment. MongoDB Atlas connection is required.");
  }
  try {
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing JSON database:", err);
  }
}

// Helper to generate a random string ID for fallback JSON mode
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// ---------------------------------------------------------------------------
// 3. Database Connection Orchestration
// ---------------------------------------------------------------------------

export async function connectDb(): Promise<boolean> {
  // If already connected, skip
  if (isMongoConnected) return true;

  const isProduction = process.env.NODE_ENV === "production";

  if (!MONGODB_URI) {
    if (isProduction) {
      const errMsg = "CRITICAL DATABASE ERROR: MONGODB_URI environment variable is missing in production environment. MongoDB Atlas connection is required.";
      console.error(errMsg);
      throw new Error(errMsg);
    }
    console.warn(
      "WARNING: MONGODB_URI environment variable is missing. Fallback JSON local database will be used for seamless preview in local environment."
    );
    isMongoConnected = false;
    return false;
  }

  try {
    console.log("Connecting to MongoDB Atlas...");
    // Connect with a 3-second timeout so it doesn't hang forever in offline/sandbox environment
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    isMongoConnected = true;
    initMongoModels();
    console.log("SUCCESS: Connected to MongoDB Atlas successfully via Mongoose.");
    return true;
  } catch (err) {
    if (isProduction) {
      const errMsg = `CRITICAL DATABASE ERROR: MongoDB Atlas connection failed in production mode. Reason: ${(err as Error).message}`;
      console.error(errMsg);
      throw new Error(errMsg);
    }
    console.warn(
      `WARNING: MongoDB Atlas connection failed. Fallback JSON local database will be used for seamless preview. Reason: ${(err as Error).message}`
    );
    isMongoConnected = false;
    return false;
  }
}

// Check status dynamically
export function isConnected(): boolean {
  return isMongoConnected && mongoose.connection.readyState === 1;
}

// ---------------------------------------------------------------------------
// 4. Unified Business Logic CRUD API (Seamlessly routes Mongoose or JSON)
// ---------------------------------------------------------------------------

export const dbService = {
  // --- Admin Queries ---
  async getAdminByUsername(username: string): Promise<IAdmin | null> {
    if (isConnected()) {
      const adminDoc = await AdminModel.findOne({ username });
      if (!adminDoc) return null;
      return {
        id: adminDoc._id.toString(),
        username: adminDoc.username,
        passwordHash: adminDoc.passwordHash,
        role: adminDoc.role,
        fullName: adminDoc.fullName,
        createdAt: adminDoc.createdAt,
        resetPasswordTokenHash: adminDoc.resetPasswordTokenHash,
        resetPasswordExpires: adminDoc.resetPasswordExpires,
        pendingEmail: adminDoc.pendingEmail,
        pendingEmailTokenHash: adminDoc.pendingEmailTokenHash,
        pendingEmailExpires: adminDoc.pendingEmailExpires,
      };
    } else {
      const db = readJsonDb();
      const admin = db.admins.find((a) => a.username === username);
      return admin || null;
    }
  },

  async getFirstAdmin(): Promise<IAdmin | null> {
    if (isConnected()) {
      const firstAdminDoc = await AdminModel.findOne({}).sort({ createdAt: 1 });
      if (!firstAdminDoc) return null;
      return {
        id: firstAdminDoc._id.toString(),
        username: firstAdminDoc.username,
        passwordHash: firstAdminDoc.passwordHash,
        role: firstAdminDoc.role,
        fullName: firstAdminDoc.fullName,
        createdAt: firstAdminDoc.createdAt,
        resetPasswordTokenHash: firstAdminDoc.resetPasswordTokenHash,
        resetPasswordExpires: firstAdminDoc.resetPasswordExpires,
        pendingEmail: firstAdminDoc.pendingEmail,
        pendingEmailTokenHash: firstAdminDoc.pendingEmailTokenHash,
        pendingEmailExpires: firstAdminDoc.pendingEmailExpires,
      };
    } else {
      const db = readJsonDb();
      if (db.admins.length === 0) return null;
      const sorted = [...db.admins].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      return sorted[0];
    }
  },

  async createAdmin(username: string, passwordHash: string, fullName?: string): Promise<IAdmin> {
    if (isConnected()) {
      const existing = await AdminModel.findOne({ username });
      if (existing) {
        existing.passwordHash = passwordHash;
        if (fullName) existing.fullName = fullName;
        await existing.save();
        return {
          id: existing._id.toString(),
          username: existing.username,
          passwordHash: existing.passwordHash,
          role: existing.role,
          fullName: existing.fullName,
          createdAt: existing.createdAt,
          resetPasswordTokenHash: existing.resetPasswordTokenHash,
          resetPasswordExpires: existing.resetPasswordExpires,
        };
      }
      const adminDoc = await AdminModel.create({ username, passwordHash, fullName });
      return {
        id: adminDoc._id.toString(),
        username: adminDoc.username,
        passwordHash: adminDoc.passwordHash,
        role: adminDoc.role,
        fullName: adminDoc.fullName,
        createdAt: adminDoc.createdAt,
        resetPasswordTokenHash: adminDoc.resetPasswordTokenHash,
        resetPasswordExpires: adminDoc.resetPasswordExpires,
      };
    } else {
      const db = readJsonDb();
      const existingIndex = db.admins.findIndex((a) => a.username === username);
      const newAdmin: IAdmin = {
        id: existingIndex !== -1 ? db.admins[existingIndex].id : generateId(),
        username,
        passwordHash,
        role: "admin",
        fullName,
        createdAt: existingIndex !== -1 ? db.admins[existingIndex].createdAt : new Date(),
      };
      if (existingIndex !== -1) {
        db.admins[existingIndex] = newAdmin;
      } else {
        db.admins.push(newAdmin);
      }
      writeJsonDb(db);
      return newAdmin;
    }
  },

  async countAdmins(): Promise<number> {
    if (isConnected()) {
      return await AdminModel.countDocuments();
    } else {
      const db = readJsonDb();
      return db.admins.length;
    }
  },

  async setAdminResetToken(username: string, tokenHash: string | null, expires: Date | null): Promise<void> {
    if (isConnected()) {
      await AdminModel.updateOne(
        { username },
        { 
          $set: { 
            resetPasswordTokenHash: tokenHash || undefined, 
            resetPasswordExpires: expires || undefined 
          } 
        }
      );
    } else {
      const db = readJsonDb();
      const admin = db.admins.find((a) => a.username === username);
      if (admin) {
        admin.resetPasswordTokenHash = tokenHash || undefined;
        admin.resetPasswordExpires = expires ? new Date(expires) : undefined;
        writeJsonDb(db);
      }
    }
  },

  async getAdminByResetTokenHash(tokenHash: string): Promise<IAdmin | null> {
    if (isConnected()) {
      const adminDoc = await AdminModel.findOne({ resetPasswordTokenHash: tokenHash });
      if (!adminDoc) return null;
      return {
        id: adminDoc._id.toString(),
        username: adminDoc.username,
        passwordHash: adminDoc.passwordHash,
        role: adminDoc.role,
        fullName: adminDoc.fullName,
        createdAt: adminDoc.createdAt,
        resetPasswordTokenHash: adminDoc.resetPasswordTokenHash,
        resetPasswordExpires: adminDoc.resetPasswordExpires,
      };
    } else {
      const db = readJsonDb();
      const admin = db.admins.find((a) => a.resetPasswordTokenHash === tokenHash);
      return admin || null;
    }
  },

  async updateAdminPassword(username: string, passwordHash: string): Promise<void> {
    if (isConnected()) {
      await AdminModel.updateOne(
        { username },
        { 
          $set: { 
            passwordHash 
          },
          $unset: {
            resetPasswordTokenHash: "",
            resetPasswordExpires: ""
          }
        }
      );
    } else {
      const db = readJsonDb();
      const admin = db.admins.find((a) => a.username === username);
      if (admin) {
        admin.passwordHash = passwordHash;
        admin.resetPasswordTokenHash = undefined;
        admin.resetPasswordExpires = undefined;
        writeJsonDb(db);
      }
    }
  },

  async getAdminsList(): Promise<IAdmin[]> {
    if (isConnected()) {
      const docs = await AdminModel.find().sort({ createdAt: 1 });
      return docs.map((doc) => ({
        id: doc._id.toString(),
        username: doc.username,
        passwordHash: doc.passwordHash,
        role: doc.role || "admin",
        fullName: doc.fullName || "Admin",
        createdAt: doc.createdAt,
      }));
    } else {
      const db = readJsonDb();
      return db.admins.map(admin => ({
        ...admin,
        role: admin.role || "admin",
        fullName: admin.fullName || "Admin"
      }));
    }
  },

  async deleteSecondaryAdmin(id: string, superAdminId: string): Promise<boolean> {
    if (id === superAdminId) return false; // Prevent deleting Super Admin
    if (isConnected()) {
      const res = await AdminModel.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
      return res.deletedCount > 0;
    } else {
      const db = readJsonDb();
      const idx = db.admins.findIndex((a) => a.id === id);
      if (idx === -1) return false;
      db.admins.splice(idx, 1);
      writeJsonDb(db);
      return true;
    }
  },

  async updateAdmin(id: string, updates: Partial<IAdmin>): Promise<boolean> {
    if (isConnected()) {
      const adminDoc = await AdminModel.findById(id);
      if (!adminDoc) return false;
      if (updates.username) adminDoc.username = updates.username;
      if (updates.fullName) adminDoc.fullName = updates.fullName;
      if (updates.passwordHash) adminDoc.passwordHash = updates.passwordHash;
      if (updates.role) adminDoc.role = updates.role;
      if (updates.pendingEmail !== undefined) adminDoc.pendingEmail = updates.pendingEmail;
      if (updates.pendingEmailTokenHash !== undefined) adminDoc.pendingEmailTokenHash = updates.pendingEmailTokenHash;
      if (updates.pendingEmailExpires !== undefined) adminDoc.pendingEmailExpires = updates.pendingEmailExpires;
      await adminDoc.save();
      return true;
    } else {
      const db = readJsonDb();
      const idx = db.admins.findIndex((a) => a.id === id);
      if (idx === -1) return false;
      db.admins[idx] = {
        ...db.admins[idx],
        ...updates,
        id: db.admins[idx].id,
        createdAt: db.admins[idx].createdAt,
      };
      writeJsonDb(db);
      return true;
    }
  },

  async createSecondaryAdmin(username: string, passwordHash: string, fullName?: string): Promise<IAdmin> {
    if (isConnected()) {
      const adminDoc = await AdminModel.create({
        username,
        passwordHash,
        fullName,
        role: "secondary_admin",
        createdAt: new Date(),
      });
      return {
        id: adminDoc._id.toString(),
        username: adminDoc.username,
        passwordHash: adminDoc.passwordHash,
        role: adminDoc.role,
        fullName: adminDoc.fullName,
        createdAt: adminDoc.createdAt,
      };
    } else {
      const db = readJsonDb();
      const newAdmin: IAdmin = {
        id: generateId(),
        username,
        passwordHash,
        role: "secondary_admin",
        fullName,
        createdAt: new Date(),
      };
      db.admins.push(newAdmin);
      writeJsonDb(db);
      return newAdmin;
    }
  },

  async resetLocalDatabase(): Promise<void> {
    if (isConnected()) {
      await AdminModel.deleteMany({});
      await BookingModel.deleteMany({});
      await CustomerModel.deleteMany({});
      await PartnershipModel.deleteMany({});
    } else {
      const db = {
        customers: [],
        bookings: [],
        partnerships: [],
        admins: [],
      };
      writeJsonDb(db);
    }
  },

  // --- Customer Profile Queries ---
  async findCustomerByPhone(phone: string): Promise<ICustomer | null> {
    const formattedPhone = phone.trim().replace(/[\s-()]/g, "");

    if (isConnected()) {
      // Find matching customer strictly by phone
      const customerDoc = await CustomerModel.findOne({ phone: formattedPhone });
      if (!customerDoc) return null;
      return {
        id: customerDoc._id.toString(),
        name: customerDoc.name,
        email: customerDoc.email || "",
        phone: customerDoc.phone,
        createdAt: customerDoc.createdAt,
        lastActivity: customerDoc.lastActivity,
        totalBookings: customerDoc.totalBookings,
        totalPartnershipRequests: customerDoc.totalPartnershipRequests,
      };
    } else {
      const db = readJsonDb();
      const customer = db.customers.find((c) => {
        const cPhone = c.phone.trim().replace(/[\s-()]/g, "");
        return cPhone === formattedPhone;
      });
      return customer || null;
    }
  },

  async createCustomer(data: { name: string; email?: string; phone: string }): Promise<ICustomer> {
    const emailFormatted = data.email ? data.email.trim().toLowerCase() : "";
    const phoneFormatted = data.phone.trim().replace(/[\s-()]/g, "");

    if (isConnected()) {
      const customerDoc = await CustomerModel.create({
        name: data.name,
        email: emailFormatted,
        phone: phoneFormatted,
        createdAt: new Date(),
        lastActivity: new Date(),
        totalBookings: 0,
        totalPartnershipRequests: 0,
      });
      return {
        id: customerDoc._id.toString(),
        name: customerDoc.name,
        email: customerDoc.email || "",
        phone: customerDoc.phone,
        createdAt: customerDoc.createdAt,
        lastActivity: customerDoc.lastActivity,
        totalBookings: customerDoc.totalBookings,
        totalPartnershipRequests: customerDoc.totalPartnershipRequests,
      };
    } else {
      const db = readJsonDb();
      const newCustomer: ICustomer = {
        id: generateId(),
        name: data.name,
        email: emailFormatted,
        phone: phoneFormatted,
        createdAt: new Date(),
        lastActivity: new Date(),
        totalBookings: 0,
        totalPartnershipRequests: 0,
      };
      db.customers.push(newCustomer);
      writeJsonDb(db);
      return newCustomer;
    }
  },

  async updateCustomerContactInfo(id: string, name: string, email?: string): Promise<void> {
    const formattedEmail = email ? email.trim().toLowerCase() : undefined;
    if (isConnected()) {
      const customerDoc = await CustomerModel.findById(id);
      if (customerDoc) {
        if (name && name.trim()) customerDoc.name = name.trim();
        if (formattedEmail) customerDoc.email = formattedEmail;
        customerDoc.lastActivity = new Date();
        await customerDoc.save();
      }
    } else {
      const db = readJsonDb();
      const idx = db.customers.findIndex((c) => c.id === id);
      if (idx !== -1) {
        if (name && name.trim()) db.customers[idx].name = name.trim();
        if (formattedEmail) db.customers[idx].email = formattedEmail;
        db.customers[idx].lastActivity = new Date();
        writeJsonDb(db);
      }
    }
  },

  async updateCustomerActivity(id: string, updates: { totalBookingsDelta?: number; totalPartnershipRequestsDelta?: number }): Promise<void> {
    if (isConnected()) {
      const customerDoc = await CustomerModel.findById(id);
      if (customerDoc) {
        if (updates.totalBookingsDelta) customerDoc.totalBookings += updates.totalBookingsDelta;
        if (updates.totalPartnershipRequestsDelta) customerDoc.totalPartnershipRequests += updates.totalPartnershipRequestsDelta;
        customerDoc.lastActivity = new Date();
        await customerDoc.save();
      }
    } else {
      const db = readJsonDb();
      const customerIndex = db.customers.findIndex((c) => c.id === id);
      if (customerIndex !== -1) {
        const customer = db.customers[customerIndex];
        if (updates.totalBookingsDelta) customer.totalBookings += updates.totalBookingsDelta;
        if (updates.totalPartnershipRequestsDelta) customer.totalPartnershipRequests += updates.totalPartnershipRequestsDelta;
        customer.lastActivity = new Date();
        db.customers[customerIndex] = customer;
        writeJsonDb(db);
      }
    }
  },

  async getCustomersList(search?: string, sortBy?: string): Promise<ICustomer[]> {
    let list: ICustomer[] = [];

    if (isConnected()) {
      const query: any = {};
      if (search && search.trim() !== "") {
        const regex = new RegExp(search.trim(), "i");
        query.$or = [{ name: regex }, { email: regex }, { phone: regex }];
      }

      let sortOptions: any = { createdAt: -1 };
      if (sortBy === "oldest") {
        sortOptions = { createdAt: 1 };
      } else if (sortBy === "active") {
        sortOptions = { lastActivity: -1 };
      }

      const docs = await CustomerModel.find(query).sort(sortOptions);
      list = docs.map((doc) => ({
        id: doc._id.toString(),
        name: doc.name,
        email: doc.email,
        phone: doc.phone,
        createdAt: doc.createdAt,
        lastActivity: doc.lastActivity,
        totalBookings: doc.totalBookings,
        totalPartnershipRequests: doc.totalPartnershipRequests,
      }));
    } else {
      const db = readJsonDb();
      list = [...db.customers];

      // Apply Search
      if (search && search.trim() !== "") {
        const term = search.toLowerCase().trim();
        list = list.filter(
          (c) =>
            c.name.toLowerCase().includes(term) ||
            (c.email && c.email.toLowerCase().includes(term)) ||
            c.phone.toLowerCase().includes(term)
        );
      }

      // Apply Sorting
      if (sortBy === "oldest") {
        list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      } else if (sortBy === "active") {
        list.sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
      } else {
        // Default newest
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    }

    return list;
  },

  async getCustomerWithHistory(id: string): Promise<{ customer: ICustomer; bookings: IBooking[]; partnerships: IPartnership[] } | null> {
    if (isConnected()) {
      const customerDoc = await CustomerModel.findById(id);
      if (!customerDoc) return null;

      const customer: ICustomer = {
        id: customerDoc._id.toString(),
        name: customerDoc.name,
        email: customerDoc.email,
        phone: customerDoc.phone,
        createdAt: customerDoc.createdAt,
        lastActivity: customerDoc.lastActivity,
        totalBookings: customerDoc.totalBookings,
        totalPartnershipRequests: customerDoc.totalPartnershipRequests,
      };

      const bookingDocs = await BookingModel.find({ customerId: customerDoc._id }).sort({ createdAt: -1 });
      const bookings: IBooking[] = bookingDocs.map((b) => ({
        id: b._id.toString(),
        customerId: b.customerId.toString(),
        eventType: b.eventType,
        guestCount: b.guestCount,
        eventDate: b.eventDate,
        venue: b.venue,
        notes: b.notes,
        bookingStatus: b.bookingStatus,
        createdAt: b.createdAt,
      }));

      const partnershipDocs = await PartnershipModel.find({ customerId: customerDoc._id }).sort({ createdAt: -1 });
      const partnerships: IPartnership[] = partnershipDocs.map((p) => ({
        id: p._id.toString(),
        customerId: p.customerId.toString(),
        fullName: p.fullName,
        whatsappNumber: p.whatsappNumber,
        city: p.city,
        clubName: p.clubName,
        partnershipModel: p.partnershipModel,
        message: p.message,
        createdAt: p.createdAt,
      }));

      return { customer, bookings, partnerships };
    } else {
      const db = readJsonDb();
      const customer = db.customers.find((c) => c.id === id);
      if (!customer) return null;

      const bookings = db.bookings
        .filter((b) => b.customerId === id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const partnerships = db.partnerships
        .filter((p) => p.customerId === id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return { customer, bookings, partnerships };
    }
  },

  // --- Event Booking Queries ---
  async getBookingsList(): Promise<(IBooking & { customerName?: string; customerEmail?: string; customerPhone?: string })[]> {
    if (isConnected()) {
      const docs = await BookingModel.find().populate("customerId").sort({ createdAt: -1 });
      return docs.map((b) => {
        const customer = b.customerId;
        return {
          id: b._id.toString(),
          customerId: customer ? customer._id.toString() : b.customerId.toString(),
          customerName: customer ? customer.name : "Unknown",
          customerEmail: customer ? customer.email : "Unknown",
          customerPhone: customer ? customer.phone : "Unknown",
          eventType: b.eventType,
          guestCount: b.guestCount,
          eventDate: b.eventDate,
          venue: b.venue,
          notes: b.notes,
          bookingStatus: b.bookingStatus,
          createdAt: b.createdAt,
        };
      });
    } else {
      const db = readJsonDb();
      const enriched = db.bookings.map((b) => {
        const customer = db.customers.find((c) => c.id === b.customerId);
        return {
          ...b,
          customerName: customer ? customer.name : "Unknown",
          customerEmail: customer ? customer.email : "Unknown",
          customerPhone: customer ? customer.phone : "Unknown",
        };
      });
      return enriched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  },

  async createBooking(data: Omit<IBooking, "id" | "createdAt">): Promise<IBooking> {
    if (isConnected()) {
      const doc = await BookingModel.create({
        customerId: new mongoose.Types.ObjectId(data.customerId),
        eventType: data.eventType,
        guestCount: data.guestCount,
        eventDate: data.eventDate,
        venue: data.venue,
        notes: data.notes,
        bookingStatus: data.bookingStatus,
        createdAt: new Date(),
      });
      // Increment total bookings counter
      await this.updateCustomerActivity(data.customerId, { totalBookingsDelta: 1 });

      return {
        id: doc._id.toString(),
        customerId: doc.customerId.toString(),
        eventType: doc.eventType,
        guestCount: doc.guestCount,
        eventDate: doc.eventDate,
        venue: doc.venue,
        notes: doc.notes,
        bookingStatus: doc.bookingStatus,
        createdAt: doc.createdAt,
      };
    } else {
      const db = readJsonDb();
      const newBooking: IBooking = {
        id: generateId(),
        customerId: data.customerId,
        eventType: data.eventType,
        guestCount: data.guestCount,
        eventDate: data.eventDate,
        venue: data.venue,
        notes: data.notes,
        bookingStatus: data.bookingStatus,
        createdAt: new Date(),
      };
      db.bookings.push(newBooking);
      writeJsonDb(db);

      // Increment total bookings counter
      const customerIndex = db.customers.findIndex((c) => c.id === data.customerId);
      if (customerIndex !== -1) {
        db.customers[customerIndex].totalBookings += 1;
        db.customers[customerIndex].lastActivity = new Date();
        writeJsonDb(db);
      }

      return newBooking;
    }
  },

  async updateBooking(id: string, updates: Partial<IBooking>): Promise<IBooking | null> {
    if (isConnected()) {
      const doc = await BookingModel.findById(id);
      if (!doc) return null;

      if (updates.eventType) doc.eventType = updates.eventType;
      if (updates.guestCount) doc.guestCount = updates.guestCount;
      if (updates.eventDate) doc.eventDate = updates.eventDate;
      if (updates.venue) doc.venue = updates.venue;
      if (updates.notes !== undefined) doc.notes = updates.notes;
      if (updates.bookingStatus) doc.bookingStatus = updates.bookingStatus;

      await doc.save();

      // Touch customer last activity
      await this.updateCustomerActivity(doc.customerId.toString(), {});

      return {
        id: doc._id.toString(),
        customerId: doc.customerId.toString(),
        eventType: doc.eventType,
        guestCount: doc.guestCount,
        eventDate: doc.eventDate,
        venue: doc.venue,
        notes: doc.notes,
        bookingStatus: doc.bookingStatus,
        createdAt: doc.createdAt,
      };
    } else {
      const db = readJsonDb();
      const idx = db.bookings.findIndex((b) => b.id === id);
      if (idx === -1) return null;

      const current = db.bookings[idx];
      const updated: IBooking = {
        ...current,
        ...updates,
        id: current.id,
        customerId: current.customerId,
        createdAt: current.createdAt,
      };
      db.bookings[idx] = updated;
      writeJsonDb(db);

      // Touch customer last activity
      const customerIndex = db.customers.findIndex((c) => c.id === current.customerId);
      if (customerIndex !== -1) {
        db.customers[customerIndex].lastActivity = new Date();
        writeJsonDb(db);
      }

      return updated;
    }
  },

  async deleteBooking(id: string): Promise<boolean> {
    if (isConnected()) {
      const doc = await BookingModel.findById(id);
      if (!doc) return false;

      const customerId = doc.customerId.toString();
      await BookingModel.findByIdAndDelete(id);

      // Decrement counter
      await this.updateCustomerActivity(customerId, { totalBookingsDelta: -1 });
      return true;
    } else {
      const db = readJsonDb();
      const idx = db.bookings.findIndex((b) => b.id === id);
      if (idx === -1) return false;

      const customerId = db.bookings[idx].customerId;
      db.bookings.splice(idx, 1);
      writeJsonDb(db);

      // Decrement counter
      const customerIndex = db.customers.findIndex((c) => c.id === customerId);
      if (customerIndex !== -1) {
        db.customers[customerIndex].totalBookings = Math.max(0, db.customers[customerIndex].totalBookings - 1);
        db.customers[customerIndex].lastActivity = new Date();
        writeJsonDb(db);
      }

      return true;
    }
  },

  // --- Partnership Queries ---
  async getPartnershipsList(): Promise<(IPartnership & { customerName?: string; customerEmail?: string; customerPhone?: string })[]> {
    if (isConnected()) {
      const docs = await PartnershipModel.find().populate("customerId").sort({ createdAt: -1 });
      return docs.map((p) => {
        const customer = p.customerId;
        return {
          id: p._id.toString(),
          customerId: customer ? customer._id.toString() : p.customerId.toString(),
          customerName: customer ? customer.name : "Unknown",
          customerEmail: customer ? customer.email : "Unknown",
          customerPhone: customer ? customer.phone : "Unknown",
          fullName: p.fullName,
          whatsappNumber: p.whatsappNumber,
          city: p.city,
          clubName: p.clubName,
          partnershipModel: p.partnershipModel,
          message: p.message,
          createdAt: p.createdAt,
        };
      });
    } else {
      const db = readJsonDb();
      const enriched = db.partnerships.map((p) => {
        const customer = db.customers.find((c) => c.id === p.customerId);
        return {
          ...p,
          customerName: customer ? customer.name : "Unknown",
          customerEmail: customer ? customer.email : "Unknown",
          customerPhone: customer ? customer.phone : "Unknown",
        };
      });
      return enriched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  },

  async createPartnership(data: Omit<IPartnership, "id" | "createdAt">): Promise<IPartnership> {
    if (isConnected()) {
      const doc = await PartnershipModel.create({
        customerId: new mongoose.Types.ObjectId(data.customerId),
        fullName: data.fullName,
        whatsappNumber: data.whatsappNumber,
        city: data.city,
        clubName: data.clubName,
        partnershipModel: data.partnershipModel,
        message: data.message,
        createdAt: new Date(),
      });
      // Increment partnership requests counter
      await this.updateCustomerActivity(data.customerId, { totalPartnershipRequestsDelta: 1 });

      return {
        id: doc._id.toString(),
        customerId: doc.customerId.toString(),
        fullName: doc.fullName,
        whatsappNumber: doc.whatsappNumber,
        city: doc.city,
        clubName: doc.clubName,
        partnershipModel: doc.partnershipModel,
        message: doc.message,
        createdAt: doc.createdAt,
      };
    } else {
      const db = readJsonDb();
      const newPartnership: IPartnership = {
        id: generateId(),
        customerId: data.customerId,
        fullName: data.fullName,
        whatsappNumber: data.whatsappNumber,
        city: data.city,
        clubName: data.clubName,
        partnershipModel: data.partnershipModel,
        message: data.message,
        createdAt: new Date(),
      };
      db.partnerships.push(newPartnership);
      writeJsonDb(db);

      // Increment partnership requests counter
      const customerIndex = db.customers.findIndex((c) => c.id === data.customerId);
      if (customerIndex !== -1) {
        db.customers[customerIndex].totalPartnershipRequests += 1;
        db.customers[customerIndex].lastActivity = new Date();
        writeJsonDb(db);
      }

      return newPartnership;
    }
  },

  async deletePartnership(id: string): Promise<boolean> {
    if (isConnected()) {
      const doc = await PartnershipModel.findById(id);
      if (!doc) return false;

      const customerId = doc.customerId.toString();
      await PartnershipModel.findByIdAndDelete(id);

      // Decrement counter
      await this.updateCustomerActivity(customerId, { totalPartnershipRequestsDelta: -1 });
      return true;
    } else {
      const db = readJsonDb();
      const idx = db.partnerships.findIndex((p) => p.id === id);
      if (idx === -1) return false;

      const customerId = db.partnerships[idx].customerId;
      db.partnerships.splice(idx, 1);
      writeJsonDb(db);

      // Decrement counter
      const customerIndex = db.customers.findIndex((c) => c.id === customerId);
      if (customerIndex !== -1) {
        db.customers[customerIndex].totalPartnershipRequests = Math.max(0, db.customers[customerIndex].totalPartnershipRequests - 1);
        db.customers[customerIndex].lastActivity = new Date();
        writeJsonDb(db);
      }

      return true;
    }
  },

  // --- Combined Dashboard Metrics ---
  async getDashboardStats(): Promise<{
    totalCustomers: number;
    totalBookings: number;
    totalPartnershipRequests: number;
    pendingBookings: number;
    completedBookings: number;
    upcomingEvents: (IBooking & { customerName?: string; customerEmail?: string; customerPhone?: string })[];
  }> {
    const bookings = await this.getBookingsList();
    const partnerships = await this.getPartnershipsList();
    let totalCustomers = 0;

    if (isConnected()) {
      totalCustomers = await CustomerModel.countDocuments();
    } else {
      const db = readJsonDb();
      totalCustomers = db.customers.length;
    }

    const pendingBookings = bookings.filter((b) => b.bookingStatus === "Pending").length;
    const completedBookings = bookings.filter((b) => b.bookingStatus === "Completed").length;

    // Filter and sort bookings for upcoming events: bookings that are "Confirmed" or "Pending", sorted by eventDate ascending
    const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const upcoming = bookings
      .filter((b) => {
        // Any confirmed event is upcoming (unless date passed, but keep all confirmed as safe)
        return b.bookingStatus === "Confirmed" || b.bookingStatus === "Pending";
      })
      .sort((a, b) => a.eventDate.localeCompare(b.eventDate))
      .slice(0, 5); // top 5 closest events

    return {
      totalCustomers,
      totalBookings: bookings.length,
      totalPartnershipRequests: partnerships.length,
      pendingBookings,
      completedBookings,
      upcomingEvents: upcoming,
    };
  },
};
