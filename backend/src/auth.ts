import crypto from "crypto";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "horizon_leisure_secure_crm_secret_key_998811";

/**
 * Hashes a plaintext password using bcryptjs.
 */
export function hashPassword(password: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

/**
 * Verifies a plaintext password against a stored hashed password representation using bcryptjs.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    return bcrypt.compareSync(password, storedHash);
  } catch (err) {
    return false;
  }
}

/**
 * Generates an HMAC-signed secure token (equivalent to standard HS256 JWT).
 * Safe, fast, zero native compiler dependencies.
 */
export function generateToken(payload: { id: string; username: string; role: string; passwordHash?: string }): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  
  // Add standard claims (iat - issued at, exp - expires in 24 hours)
  const enrichedPayload = {
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
  };
  const body = Buffer.from(JSON.stringify(enrichedPayload)).toString("base64url");
  
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");
    
  return `${header}.${body}.${signature}`;
}

/**
 * Decrypts and validates a signed JWT token, returning the payload if valid.
 * Validates expiration (exp) and signature integrity.
 */
export function verifyToken(token: string): { id: string; username: string; role: string; passwordHash?: string } | null {
  if (!token) return null;
  
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    
    const [header, body, signature] = parts;
    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${header}.${body}`)
      .digest("base64url");
      
    if (signature !== expectedSignature) {
      return null;
    }
    
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    
    // Check expiration
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
      return null; // Expired
    }
    
    return {
      id: payload.id,
      username: payload.username,
      role: payload.role || "admin",
      passwordHash: payload.passwordHash,
    };
  } catch (err) {
    return null;
  }
}
