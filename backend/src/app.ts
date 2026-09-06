import express, { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { dbService, connectDb } from "./dbService";
import { hashPassword, verifyPassword, generateToken, verifyToken } from "./auth";

const router = express.Router();

// Extends Request interface to include admin data
export interface AuthenticatedRequest extends Request {
  admin?: {
    id: string;
    username: string;
    role: string;
    passwordHash?: string;
  };
}

// ---------------------------------------------------------------------------
// Middlewares
// ---------------------------------------------------------------------------

// Protect admin routes with JWT verification
export async function authenticateAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access Denied. Authorization token is missing or malformed." });
  }
  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(403).json({ error: "Access Denied. Session is invalid or has expired." });
  }

  try {
    const admin = await dbService.getAdminByUsername(payload.username);
    if (!admin) {
      return res.status(403).json({ error: "Access Denied. Administrator record not found." });
    }

    const firstAdmin = await dbService.getFirstAdmin();
    const isSuperAdmin = firstAdmin && (firstAdmin.id === admin.id || firstAdmin.username === admin.username);
    const resolvedRole = isSuperAdmin ? "super_admin" : "secondary_admin";

    // Invalidate active sessions if password hash has changed
    if (admin.passwordHash !== payload.passwordHash) {
      return res.status(403).json({ error: "Access Denied. Your password has been changed. Please log in again." });
    }

    req.admin = {
      id: admin.id,
      username: admin.username,
      role: resolvedRole,
      passwordHash: admin.passwordHash
    };
  } catch (err) {
    console.error("Auth middleware admin verification error:", err);
    return res.status(500).json({ error: "An error occurred during authentication verification." });
  }

  next();
}

// Logger middleware helper
router.use((req, res, next) => {
  console.log(`[API ${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ---------------------------------------------------------------------------
// 1. PUBLIC ENDPOINTS
// ---------------------------------------------------------------------------

// A. Submit Event Booking Form
router.post("/bookings", async (req: Request, res: Response) => {
  try {
    const {
      selectedEventType,
      selectedVenue,
      selectedGuestCount,
      preferredDate,
      fullName,
      phoneNumber,
      emailAddress,
      additionalNotes,
    } = req.body;

    // Server-side validation
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ error: "Full Name is required." });
    }
    if (!phoneNumber || !phoneNumber.trim()) {
      return res.status(400).json({ error: "Phone Number is required." });
    }
    if (!emailAddress || !emailAddress.trim() || !emailAddress.includes("@")) {
      return res.status(400).json({ error: "A valid Email Address is required." });
    }
    if (!selectedEventType) {
      return res.status(400).json({ error: "Event Type selection is required." });
    }
    if (!selectedVenue) {
      return res.status(400).json({ error: "Venue Preference is required." });
    }
    if (!selectedGuestCount) {
      return res.status(400).json({ error: "Guest count preference is required." });
    }
    if (!preferredDate) {
      return res.status(400).json({ error: "Preferred Event Date is required." });
    }

    // Step 1: Customer identity resolution (strictly by phone)
    let customer = await dbService.findCustomerByPhone(phoneNumber);
    
    if (!customer) {
      // Step 2: Create customer profile if they don't exist
      customer = await dbService.createCustomer({
        name: fullName.trim(),
        email: emailAddress ? emailAddress.trim() : undefined,
        phone: phoneNumber.trim(),
      });
      console.log(`[CRM] Created new permanent customer profile for: ${customer.name}`);
    } else {
      // If customer exists, update contact info with potentially new email and name (preserving existing if not provided)
      await dbService.updateCustomerContactInfo(customer.id, fullName.trim(), emailAddress ? emailAddress.trim() : undefined);
      console.log(`[CRM] Linked submission to existing customer profile: ${customer.name} (ID: ${customer.id})`);
    }

    // Step 3: Create event booking associated with this customer
    const booking = await dbService.createBooking({
      customerId: customer.id,
      eventType: selectedEventType,
      guestCount: selectedGuestCount,
      eventDate: preferredDate,
      venue: selectedVenue,
      notes: additionalNotes || "",
      bookingStatus: "Pending",
    });

    return res.status(201).json({
      success: true,
      message: "Event booking inquiry received successfully.",
      booking,
    });
  } catch (err) {
    console.error("Error creating booking:", err);
    return res.status(500).json({ error: "Internal server error occurred while booking event." });
  }
});

// B. Submit Partnership Form
router.post("/partnerships", async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      whatsappNumber,
      city,
      clubName,
      partnershipModel,
      message,
    } = req.body;

    // Server-side validation
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ error: "Full Name is required." });
    }
    if (!whatsappNumber || !whatsappNumber.trim()) {
      return res.status(400).json({ error: "WhatsApp Number is required." });
    }
    if (!city || !city.trim()) {
      return res.status(400).json({ error: "City is required." });
    }
    if (!clubName || !clubName.trim()) {
      return res.status(400).json({ error: "Club or facility name is required." });
    }
    if (!partnershipModel) {
      return res.status(400).json({ error: "Partnership Model is required." });
    }

    // Identity resolution strictly by phone (whatsappNumber)
    let customer = await dbService.findCustomerByPhone(whatsappNumber);

    if (!customer) {
      customer = await dbService.createCustomer({
        name: fullName.trim(),
        phone: whatsappNumber.trim(),
      });
      console.log(`[CRM] Created new permanent customer profile for: ${customer.name}`);
    } else {
      // If customer exists, update contact info with potentially new name
      await dbService.updateCustomerContactInfo(customer.id, fullName.trim(), undefined);
      console.log(`[CRM] Linked partnership request to existing customer profile: ${customer.name}`);
    }

    // Create partnership record associated with this customer
    const partnership = await dbService.createPartnership({
      customerId: customer.id,
      fullName: fullName.trim(),
      whatsappNumber: whatsappNumber.trim(),
      city: city.trim(),
      clubName: clubName.trim(),
      partnershipModel,
      message: message || "",
    });

    return res.status(201).json({
      success: true,
      message: "Partnership consultation request received successfully.",
      partnership,
    });
  } catch (err) {
    console.error("Error creating partnership:", err);
    return res.status(500).json({ error: "Internal server error occurred while submitting partnership details." });
  }
});

// C. Admin Authentication Login
router.get("/auth/setup-status", async (req: Request, res: Response) => {
  try {
    const adminCount = await dbService.countAdmins();
    const isProd = process.env.NODE_ENV === "production";
    return res.json({ 
      exists: adminCount > 0 || isProd,
      isProduction: isProd
    });
  } catch (err) {
    console.error("Setup status check error:", err);
    return res.status(500).json({ error: "Failed to check admin setup status." });
  }
});

router.post("/auth/setup", async (req: Request, res: Response) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({ error: "One-Time Admin Setup is permanently disabled in production environment." });
  }
  try {
    const adminCount = await dbService.countAdmins();
    if (adminCount > 0) {
      return res.status(400).json({ error: "Setup already completed. Initial admin account exists." });
    }

    const { fullName, email, password } = req.body;
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ error: "Full name is required." });
    }
    if (!email || !email.trim() || !email.includes("@")) {
      return res.status(400).json({ error: "A valid email address is required." });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }

    const hash = hashPassword(password);
    const admin = await dbService.createAdmin(email.trim(), hash, fullName.trim());

    const token = generateToken({
      id: admin.id,
      username: admin.username,
      role: admin.role,
      passwordHash: admin.passwordHash,
    });

    return res.status(201).json({
      success: true,
      token,
      user: {
        username: admin.username,
        role: admin.role,
        fullName: admin.fullName,
      }
    });
  } catch (err) {
    console.error("One-time admin setup error:", err);
    return res.status(500).json({ error: "Failed to complete admin setup." });
  }
});

router.post("/admin/reset-db", async (req: Request, res: Response) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({ error: "Database reset is forbidden in production environment." });
  }

  try {
    await dbService.resetLocalDatabase();
    return res.json({ success: true, message: "Local database successfully reset." });
  } catch (err) {
    console.error("Reset database error:", err);
    return res.status(500).json({ error: "Failed to reset database." });
  }
});

router.post("/auth/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    const admin = await dbService.getAdminByUsername(username.trim());
    if (!admin) {
      return res.status(401).json({ error: "Invalid username or password credentials." });
    }

    const isMatch = verifyPassword(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password credentials." });
    }

    const firstAdmin = await dbService.getFirstAdmin();
    const isSuperAdmin = firstAdmin && (firstAdmin.id === admin.id || firstAdmin.username === admin.username);
    const resolvedRole = isSuperAdmin ? "super_admin" : "secondary_admin";

    // Generate secure session token (JWT)
    const token = generateToken({
      id: admin.id,
      username: admin.username,
      role: resolvedRole,
      passwordHash: admin.passwordHash,
    });

    return res.json({
      success: true,
      token,
      user: {
        username: admin.username,
        role: resolvedRole,
        fullName: admin.fullName || "Administrator",
      },
    });
  } catch (err) {
    console.error("Login endpoint error:", err);
    return res.status(500).json({ error: "An internal server error occurred during login." });
  }
});

// Simple in-memory rate limiter for forgot password requests to prevent abuse
const forgotPasswordLimits = new Map<string, { count: number; resetAt: number }>();

router.post("/auth/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ error: "Email address is required." });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // 1. Rate Limiting Protection (per Email / IP)
    const ip = req.ip || "unknown-ip";
    const rateLimitKey = `${ip}:${trimmedEmail}`;
    const now = Date.now();
    const limitInfo = forgotPasswordLimits.get(rateLimitKey);

    if (limitInfo && now < limitInfo.resetAt) {
      if (limitInfo.count >= 3) {
        return res.status(429).json({
          error: "Too many password reset requests. Please wait 15 minutes before trying again."
        });
      }
      limitInfo.count += 1;
    } else {
      // Set new rate limit window: 15 minutes
      forgotPasswordLimits.set(rateLimitKey, {
        count: 1,
        resetAt: now + 15 * 60 * 1000
      });
    }

    // 2. Lookup the Primary/First Administrator
    const firstAdmin = await dbService.getFirstAdmin();

    // 3. User Enumeration Protection
    // Regardless of whether the email exists or matches the first administrator,
    // we return a standard, generic success message.
    const genericSuccessResponse = {
      success: true,
      message: "If the account exists, password reset instructions have been sent."
    };

    if (!firstAdmin) {
      // If there's no admin yet, we shouldn't reveal anything or try to send anything.
      return res.json(genericSuccessResponse);
    }

    // Since only the primary admin is allowed, check if the email matches
    if (trimmedEmail !== firstAdmin.username.toLowerCase()) {
      return res.json(genericSuccessResponse);
    }

    // 4. Generate cryptographically secure random token and its hash
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    // Expiry: 15 minutes
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    // Save token hash & expiry to database (under the primary admin's record)
    await dbService.setAdminResetToken(firstAdmin.username, tokenHash, expires);

    // 5. Construct secure reset link
    const resetUrl = `${req.protocol}://${req.get("host")}/hlg-management-portal?token=${rawToken}`;

    // 6. Print reset url in backend console so it's easily viewable/copyable during development and preview
    console.log("\n========================================");
    console.log("SECURE PASSWORD RESET EMAIL SIMULATION");
    console.log(`To: ${firstAdmin.username}`);
    console.log(`Subject: CRM Primary Administrator Password Reset Request`);
    console.log(`Link: ${resetUrl}`);
    console.log(`Expires: ${expires.toLocaleString()}`);
    console.log("========================================\n");

    return res.json(genericSuccessResponse);
  } catch (err) {
    console.error("Forgot password endpoint error:", err);
    return res.status(500).json({ error: "An unexpected error occurred during the password reset request." });
  }
});

router.post("/auth/reset-password", async (req: Request, res: Response) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Password reset token is required." });
    }

    if (!password) {
      return res.status(400).json({ error: "New password is required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    // Enforce strong password validation: Minimum 8 chars, Uppercase, Lowercase, Number, Special char.
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        error: "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character."
      });
    }

    // Hash incoming token to match stored token hash
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // Retrieve admin by token hash
    const admin = await dbService.getAdminByResetTokenHash(tokenHash);

    if (!admin) {
      return res.status(400).json({ error: "Invalid or Expired Reset Link." });
    }

    // Verify token expiration
    if (!admin.resetPasswordExpires || new Date() > new Date(admin.resetPasswordExpires)) {
      // Clear token even if expired to invalidate it
      await dbService.setAdminResetToken(admin.username, null, null);
      return res.status(400).json({ error: "Invalid or Expired Reset Link." });
    }

    // Verify the admin is indeed the primary admin
    const firstAdmin = await dbService.getFirstAdmin();
    if (!firstAdmin || firstAdmin.username !== admin.username) {
      return res.status(400).json({ error: "Invalid or Expired Reset Link." });
    }

    // Hash the new password using secure bcrypt hashing
    const hash = hashPassword(password);

    // Update password and clear the reset token (making it single-use only)
    await dbService.updateAdminPassword(admin.username, hash);

    return res.json({
      success: true,
      message: "Your password has been successfully reset. All active sessions have been invalidated. Please log in again."
    });
  } catch (err) {
    console.error("Reset password endpoint error:", err);
    return res.status(500).json({ error: "An unexpected error occurred during the password reset." });
  }
});

// ---------------------------------------------------------------------------
// 2. SECURE PORTAL ENDPOINTS (Guarded by authenticateAdmin)
// ---------------------------------------------------------------------------

// A. Get CRM Dashboard Metrics & Upcoming Events
router.get("/hlg-portal/dashboard", authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const stats = await dbService.getDashboardStats();
    return res.json(stats);
  } catch (err) {
    console.error("Dashboard endpoint error:", err);
    return res.status(500).json({ error: "Failed to load CRM dashboard metrics." });
  }
});

// B. Search/List all Customer Profiles
router.get("/hlg-portal/customers", authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const search = req.query.search as string | undefined;
    const sortBy = req.query.sortBy as string | undefined;

    const customers = await dbService.getCustomersList(search, sortBy);
    return res.json(customers);
  } catch (err) {
    console.error("Customers list endpoint error:", err);
    return res.status(500).json({ error: "Failed to retrieve customer profiles." });
  }
});

// C. Get Single Customer Profile with Complete Tabbed History
router.get("/hlg-portal/customers/:id", authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const customerId = req.params.id;
    const history = await dbService.getCustomerWithHistory(customerId);

    if (!history) {
      return res.status(404).json({ error: "Customer profile not found." });
    }

    return res.json(history);
  } catch (err) {
    console.error("Customer detail endpoint error:", err);
    return res.status(500).json({ error: "Failed to load customer profile history." });
  }
});

// D. Edit Event Booking Details (Venue, Event Type, Date, Status, etc.)
router.put("/hlg-portal/bookings/:id", authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const bookingId = req.params.id;
    const updates = req.body;

    const updatedBooking = await dbService.updateBooking(bookingId, updates);
    if (!updatedBooking) {
      return res.status(404).json({ error: "Event booking record not found." });
    }

    return res.json({
      success: true,
      message: "Event booking updated successfully.",
      booking: updatedBooking,
    });
  } catch (err) {
    console.error("Update booking endpoint error:", err);
    return res.status(500).json({ error: "Failed to update booking details." });
  }
});

// E. Delete Event Booking Record
router.delete("/hlg-portal/bookings/:id", authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const bookingId = req.params.id;
    const success = await dbService.deleteBooking(bookingId);

    if (!success) {
      return res.status(404).json({ error: "Event booking record not found." });
    }

    return res.json({
      success: true,
      message: "Event booking record deleted successfully.",
    });
  } catch (err) {
    console.error("Delete booking endpoint error:", err);
    return res.status(500).json({ error: "Failed to delete event booking record." });
  }
});

// F. Delete Partnership Request
router.delete("/hlg-portal/partnerships/:id", authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const partnershipId = req.params.id;
    const success = await dbService.deletePartnership(partnershipId);

    if (!success) {
      return res.status(404).json({ error: "Partnership request not found." });
    }

    return res.json({
      success: true,
      message: "Partnership request deleted successfully.",
    });
  } catch (err) {
    console.error("Delete partnership endpoint error:", err);
    return res.status(500).json({ error: "Failed to delete partnership request." });
  }
});

// G. Get all Bookings List (directly for Bookings Tab)
router.get("/hlg-portal/bookings", authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const bookings = await dbService.getBookingsList();
    return res.json(bookings);
  } catch (err) {
    console.error("Get all bookings error:", err);
    return res.status(500).json({ error: "Failed to retrieve bookings." });
  }
});

// H. Get all Partnerships List (directly for Partnerships Tab)
router.get("/hlg-portal/partnerships", authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const partnerships = await dbService.getPartnershipsList();
    return res.json(partnerships);
  } catch (err) {
    console.error("Get all partnerships error:", err);
    return res.status(500).json({ error: "Failed to retrieve partnerships." });
  }
});

// Primary Admin Email Change: Request (Super Admin only, password-validated, secure token)
router.post("/hlg-portal/admin/request-email-change", authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.admin?.role !== "super_admin") {
      return res.status(403).json({ error: "Access Denied. Only the Super Administrator can access this feature." });
    }

    const { currentPassword, newEmail } = req.body;

    if (!currentPassword) {
      return res.status(400).json({ error: "Current password is required to request an email change." });
    }

    if (!newEmail || !newEmail.trim() || !newEmail.includes("@")) {
      return res.status(400).json({ error: "A valid new email address is required." });
    }

    const trimmedNewEmail = newEmail.trim().toLowerCase();

    // Retrieve Super Admin from database using active username
    const superAdmin = await dbService.getAdminByUsername(req.admin.username);
    if (!superAdmin) {
      return res.status(404).json({ error: "Super Administrator record not found." });
    }

    // Verify password
    const isMatch = verifyPassword(currentPassword, superAdmin.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect current password." });
    }

    // Check if trying to set to same email
    if (trimmedNewEmail === superAdmin.username.toLowerCase()) {
      return res.status(400).json({ error: "The new email address must be different from your current email." });
    }

    // Check if email already exists
    const existingAdmin = await dbService.getAdminByUsername(trimmedNewEmail);
    if (existingAdmin) {
      return res.status(400).json({ error: "The email address is already in use by another administrator." });
    }

    // Generate secure token and token hash
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    // Expiry: 2 hours
    const expires = new Date(Date.now() + 2 * 60 * 60 * 1000);

    // Save pending change
    await dbService.updateAdmin(superAdmin.id, {
      pendingEmail: trimmedNewEmail,
      pendingEmailTokenHash: tokenHash,
      pendingEmailExpires: expires,
    });

    // Simulated email confirmation URL
    const confirmUrl = `${req.protocol}://${req.get("host")}/hlg-management-portal?email_change_token=${rawToken}`;

    console.log("\n======================================================================");
    console.log("SECURE PRIMARY ADMIN EMAIL CHANGE VERIFICATION SIMULATION");
    console.log(`To: ${trimmedNewEmail}`);
    console.log(`Subject: CRM Primary Administrator Email Verification Request`);
    console.log(`Link: ${confirmUrl}`);
    console.log(`Expires: ${expires.toLocaleString()}`);
    console.log("======================================================================\n");

    return res.json({
      success: true,
      message: "An email change verification request has been initialized. Please check the server logs for the secure verification link."
    });
  } catch (err) {
    console.error("Request email change error:", err);
    return res.status(500).json({ error: "Failed to request email change." });
  }
});

// Primary Admin Email Change: Confirm (Super Admin only, secure verification, logs out/invalidates active sessions)
router.post("/hlg-portal/admin/confirm-email-change", authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.admin?.role !== "super_admin") {
      return res.status(403).json({ error: "Access Denied. Only the Super Administrator can access this feature." });
    }

    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: "Verification token is required." });
    }

    // Fetch Super Admin
    const superAdmin = await dbService.getAdminByUsername(req.admin.username);
    if (!superAdmin) {
      return res.status(404).json({ error: "Super Administrator record not found." });
    }

    if (!superAdmin.pendingEmail || !superAdmin.pendingEmailTokenHash || !superAdmin.pendingEmailExpires) {
      return res.status(400).json({ error: "No pending email change request was found." });
    }

    // Check expiration
    if (new Date() > new Date(superAdmin.pendingEmailExpires)) {
      await dbService.updateAdmin(superAdmin.id, {
        pendingEmail: undefined,
        pendingEmailTokenHash: undefined,
        pendingEmailExpires: undefined,
      });
      return res.status(400).json({ error: "The verification link has expired. Please request a new email change." });
    }

    // Verify token hash
    const incomingHash = crypto.createHash("sha256").update(token).digest("hex");
    if (incomingHash !== superAdmin.pendingEmailTokenHash) {
      return res.status(400).json({ error: "Invalid verification token." });
    }

    const newEmail = superAdmin.pendingEmail;

    // Double check email is still available
    const takenCheck = await dbService.getAdminByUsername(newEmail);
    if (takenCheck && takenCheck.id !== superAdmin.id) {
      return res.status(400).json({ error: "The new email address has already been taken by another account." });
    }

    // Update primary email & clear pending
    await dbService.updateAdmin(superAdmin.id, {
      username: newEmail,
      pendingEmail: undefined,
      pendingEmailTokenHash: undefined,
      pendingEmailExpires: undefined,
    });

    console.log(`[CRM Security] Super Admin successfully changed email from '${req.admin.username}' to '${newEmail}'.`);

    return res.json({
      success: true,
      message: "Your primary email has been successfully verified and updated. All active sessions are now invalidated, and you must log in again with your new email."
    });
  } catch (err) {
    console.error("Confirm email change error:", err);
    return res.status(500).json({ error: "Failed to confirm email change." });
  }
});

// Secure Settings Access: Verify password of the logged-in Super Admin
router.post("/hlg-portal/admin/verify-settings-password", authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.admin?.role !== "super_admin") {
      return res.status(403).json({ error: "Access Denied. Only the Super Administrator can access this feature." });
    }

    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: "Password is required." });
    }

    const superAdmin = await dbService.getAdminByUsername(req.admin.username);
    if (!superAdmin) {
      return res.status(404).json({ error: "Super Administrator record not found." });
    }

    const isMatch = verifyPassword(password, superAdmin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password." });
    }

    return res.json({ success: true, message: "Settings access granted." });
  } catch (err) {
    console.error("Verify settings password error:", err);
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
});

// Change Password for Super Admin with validation and current password check
router.post("/hlg-portal/admin/change-password", authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.admin?.role !== "super_admin") {
      return res.status(403).json({ error: "Access Denied. Only the Super Administrator can access this feature." });
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: "All password fields are required." });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    // Enforce strong password validation: Minimum 8 chars, Uppercase, Lowercase, Number, Special char.
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!strongPasswordRegex.test(newPassword)) {
      return res.status(400).json({
        error: "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character."
      });
    }

    const superAdmin = await dbService.getAdminByUsername(req.admin.username);
    if (!superAdmin) {
      return res.status(404).json({ error: "Super Administrator record not found." });
    }

    // Verify current password
    const isMatch = verifyPassword(currentPassword, superAdmin.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect current password." });
    }

    // Hash the new password
    const hash = hashPassword(newPassword);

    // Update password in db
    await dbService.updateAdminPassword(superAdmin.username, hash);

    return res.json({
      success: true,
      message: "Your password has been successfully updated. All active sessions have been invalidated. Please log in again."
    });
  } catch (err) {
    console.error("Change password error:", err);
    return res.status(500).json({ error: "Failed to update password." });
  }
});

// I. User Management: Get list of admins (Super Admin only)
router.get("/hlg-portal/admins", authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.admin?.role !== "super_admin") {
      return res.status(403).json({ error: "Access Denied. Only the Super Administrator can view the admin roster." });
    }
    const admins = await dbService.getAdminsList();
    // Remove password hash from public response
    const sanitized = admins.map(a => ({
      id: a.id,
      username: a.username,
      role: a.role,
      fullName: a.fullName,
      createdAt: a.createdAt
    }));
    return res.json(sanitized);
  } catch (err) {
    console.error("Fetch admins error:", err);
    return res.status(500).json({ error: "Failed to load administrators roster." });
  }
});

// J. User Management: Create secondary admin (Super Admin only)
router.post("/hlg-portal/admins", authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.admin?.role !== "super_admin") {
      return res.status(403).json({ error: "Access Denied. Only the Super Administrator can create secondary admins." });
    }
    const { username, password, fullName } = req.body;
    if (!username || !username.trim() || !username.includes("@")) {
      return res.status(400).json({ error: "A valid email username is required." });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }
    
    const existing = await dbService.getAdminByUsername(username.trim());
    if (existing) {
      return res.status(400).json({ error: "An administrator with this email address already exists." });
    }

    const hash = hashPassword(password);
    const newAdmin = await dbService.createSecondaryAdmin(username.trim(), hash, fullName?.trim() || "Secondary Admin");

    return res.status(201).json({
      success: true,
      message: "Secondary administrator account created successfully.",
      admin: {
        id: newAdmin.id,
        username: newAdmin.username,
        role: newAdmin.role,
        fullName: newAdmin.fullName,
        createdAt: newAdmin.createdAt
      }
    });
  } catch (err) {
    console.error("Create admin error:", err);
    return res.status(500).json({ error: "Failed to create administrator." });
  }
});

// K. User Management: Edit admin/Reset password (Super Admin only)
router.put("/hlg-portal/admins/:id", authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.admin?.role !== "super_admin") {
      return res.status(403).json({ error: "Access Denied. Only the Super Administrator can modify admin accounts." });
    }
    const { id } = req.params;
    const { fullName, password, username } = req.body;

    const firstAdmin = await dbService.getFirstAdmin();
    const isSuperAdminTarget = firstAdmin && firstAdmin.id === id;

    const updates: any = {};
    if (fullName && fullName.trim()) updates.fullName = fullName.trim();
    if (username && username.trim()) {
      if (isSuperAdminTarget && username.trim().toLowerCase() !== firstAdmin.username.toLowerCase()) {
        return res.status(403).json({ error: "Access Denied. Super Administrator email cannot be modified." });
      }
      updates.username = username.trim();
    }
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters." });
      }
      updates.passwordHash = hashPassword(password);
    }

    const success = await dbService.updateAdmin(id, updates);
    if (!success) {
      return res.status(404).json({ error: "Administrator not found." });
    }

    return res.json({
      success: true,
      message: "Administrator account settings updated successfully."
    });
  } catch (err) {
    console.error("Update admin error:", err);
    return res.status(500).json({ error: "Failed to update administrator." });
  }
});

// L. User Management: Delete secondary admin (Super Admin only)
router.delete("/hlg-portal/admins/:id", authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.admin?.role !== "super_admin") {
      return res.status(403).json({ error: "Access Denied. Only the Super Administrator can delete secondary admins." });
    }
    const { id } = req.params;
    const firstAdmin = await dbService.getFirstAdmin();
    if (firstAdmin && firstAdmin.id === id) {
      return res.status(403).json({ error: "Access Denied. The permanent Super Administrator cannot be deleted." });
    }

    const success = await dbService.deleteSecondaryAdmin(id, firstAdmin?.id || "");
    if (!success) {
      return res.status(404).json({ error: "Administrator not found." });
    }

    return res.json({
      success: true,
      message: "Secondary administrator deleted successfully."
    });
  } catch (err) {
    console.error("Delete admin error:", err);
    return res.status(500).json({ error: "Failed to delete administrator." });
  }
});

// ---------------------------------------------------------------------------
// Seed default admin login credential if absent on startup
// ---------------------------------------------------------------------------
export async function seedDefaultAdmin() {
  try {
    const defaultUsername = "admin";
    const defaultPassword = "password123";
    const admin = await dbService.getAdminByUsername(defaultUsername);
    if (!admin) {
      const hash = hashPassword(defaultPassword);
      await dbService.createAdmin(defaultUsername, hash);
      console.log(`[CRM Seed] Seeded default administrator. Username: '${defaultUsername}', Password: '${defaultPassword}'`);
    } else {
      console.log("[CRM Seed] Admin seed check: default admin already exists.");
    }
  } catch (err) {
    console.error("Failed to seed default admin:", err);
  }
}

export default router;
