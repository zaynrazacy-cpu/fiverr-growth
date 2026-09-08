import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db, User } from "../db/store.js";
import { logger } from "../utils/logger.js";

const JWT_SECRET = process.env.JWT_SECRET || "fiverr_growth_super_secure_jwt_secret_2026";
const JWT_EXPIRES_IN = "30d";

export class AuthService {
  public async register(
    email: string,
    username: string,
    password: string,
    fiverr_profile_url?: string
  ): Promise<{ user: Omit<User, "passwordHash">; token: string }> {
    const existingEmail = db.findUserByEmail(email);
    if (existingEmail) {
      logger.warn("AUTH", `Registration rejected: email ${email} already exists`);
      throw new Error("An account with this email already exists.");
    }

    const existingUsername = db.findUserByUsername(username);
    if (existingUsername) {
      logger.warn("AUTH", `Registration rejected: username ${username} is taken`);
      throw new Error("This username is already taken.");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = db.createUser({
      email,
      username,
      passwordHash,
      fiverr_profile_url: fiverr_profile_url || undefined
    });

    // If fiverr profile url was provided, initialize user context immediately
    if (fiverr_profile_url) {
      db.saveUserContext(user.id, {
        fullName: username,
        fiverrUrl: fiverr_profile_url,
      });
    }

    const token = this.generateToken(user);
    const { passwordHash: _, ...safeUser } = user;

    logger.auth("REGISTER", `New user registered successfully: [${user.id}] ${user.username} (${user.email})`);
    return { user: safeUser, token };
  }

  public async login(emailOrUsername: string, password: string): Promise<{ user: Omit<User, "passwordHash">; token: string }> {
    let user = db.findUserByEmail(emailOrUsername);
    if (!user) {
      user = db.findUserByUsername(emailOrUsername);
    }

    if (!user) {
      logger.warn("AUTH", `Login failed: user not found for identifier "${emailOrUsername}"`);
      throw new Error("Invalid credentials. Please check your email/username and password.");
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      logger.warn("AUTH", `Login failed: incorrect password for user [${user.id}] ${user.username}`);
      throw new Error("Invalid credentials. Please check your email/username and password.");
    }

    const token = this.generateToken(user);
    const { passwordHash: _, ...safeUser } = user;

    logger.auth("LOGIN", `User authenticated: [${user.id}] ${user.username}`);
    return { user: safeUser, token };
  }

  public verifyToken(token: string): { userId: string; email: string; username: string } {
    try {
      return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; username: string };
    } catch {
      throw new Error("Invalid or expired authentication token.");
    }
  }

  private generateToken(user: User): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        username: user.username
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }
}

export const authService = new AuthService();
