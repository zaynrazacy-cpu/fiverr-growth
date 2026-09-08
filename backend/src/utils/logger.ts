import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Request, Response, NextFunction } from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOGS_DIR = path.resolve(__dirname, "../../logs");
const LOG_FILE = path.join(LOGS_DIR, "activity.log");

// Ensure logs directory exists
if (!fs.existsSync(LOGS_DIR)) {
  try {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
  } catch (err) {
    console.warn("Could not create logs directory:", err);
  }
}

// ANSI Color Codes for terminal
const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  gray: "\x1b[90m",
};

class Logger {
  private writeToFile(line: string) {
    try {
      const cleanLine = line.replace(/\x1b\[[0-9;]*m/g, ""); // strip ANSI colors for disk log
      fs.appendFileSync(LOG_FILE, cleanLine + "\n", "utf-8");
    } catch {
      // ignore disk write errors
    }
  }

  private timestamp(): string {
    return new Date().toISOString().replace("T", " ").substring(0, 19);
  }

  public http(method: string, url: string, status: number, durationMs: number, bodySummary?: string) {
    const time = this.timestamp();
    const statusColor = status < 300 ? colors.green : status < 400 ? colors.yellow : colors.red;
    const methodColor = method === "GET" ? colors.blue : method === "POST" ? colors.green : colors.yellow;

    const formatted = `[${colors.gray}${time}${colors.reset}] [${colors.cyan}HTTP${colors.reset}] ${methodColor}${method.padEnd(6)}${colors.reset} ${url.padEnd(30)} ${statusColor}${status}${colors.reset} ${colors.dim}(${durationMs}ms)${colors.reset}${bodySummary ? ` - ${colors.gray}${bodySummary}${colors.reset}` : ""}`;
    console.log(formatted);
    this.writeToFile(formatted);
  }

  public auth(action: string, details: string) {
    const time = this.timestamp();
    const formatted = `[${colors.gray}${time}${colors.reset}] [${colors.magenta}AUTH${colors.reset}] ${colors.bold}${action}${colors.reset} -> ${details}`;
    console.log(formatted);
    this.writeToFile(formatted);
  }

  public strategist(action: string, details: string) {
    const time = this.timestamp();
    const formatted = `[${colors.gray}${time}${colors.reset}] [${colors.magenta}STRATEGIST${colors.reset}] ${action} -> ${details}`;
    console.log(formatted);
    this.writeToFile(formatted);
  }

  public research(source: string, details: string) {
    const time = this.timestamp();
    const formatted = `[${colors.gray}${time}${colors.reset}] [${colors.blue}LIVE-RESEARCH${colors.reset}] ${colors.cyan}${source}${colors.reset} -> ${details}`;
    console.log(formatted);
    this.writeToFile(formatted);
  }

  public ai(agent: string, details: string) {
    const time = this.timestamp();
    const formatted = `[${colors.gray}${time}${colors.reset}] [${colors.green}AI-AGENT${colors.reset}] ${colors.bold}${agent}${colors.reset} -> ${details}`;
    console.log(formatted);
    this.writeToFile(formatted);
  }

  public info(category: string, message: string) {
    const time = this.timestamp();
    const formatted = `[${colors.gray}${time}${colors.reset}] [${colors.cyan}${category.toUpperCase()}${colors.reset}] ${message}`;
    console.log(formatted);
    this.writeToFile(formatted);
  }

  public warn(category: string, message: string) {
    const time = this.timestamp();
    const formatted = `[${colors.gray}${time}${colors.reset}] [${colors.yellow}${category.toUpperCase()}${colors.reset}] [WARN] ${message}`;
    console.warn(formatted);
    this.writeToFile(formatted);
  }

  public error(category: string, message: string, err?: any) {
    const time = this.timestamp();
    const errDetail = err?.message || (typeof err === "string" ? err : "");
    const formatted = `[${colors.gray}${time}${colors.reset}] [${colors.red}${category.toUpperCase()}${colors.reset}] [ERROR] ${message} ${errDetail ? `(${errDetail})` : ""}`;
    console.error(formatted);
    this.writeToFile(formatted);
  }
}

export const logger = new Logger();

/**
 * Express Middleware to track all API requests, execution time, and response status
 */
export const httpLoggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const url = req.originalUrl || req.url;

  // Summarize body without passwords
  let bodySummary = "";
  if (req.body && Object.keys(req.body).length > 0) {
    const safeBody = { ...req.body };
    if (safeBody.password) safeBody.password = "******";
    bodySummary = JSON.stringify(safeBody);
    if (bodySummary.length > 80) {
      bodySummary = bodySummary.substring(0, 77) + "...";
    }
  }

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.http(req.method, url, res.statusCode, duration, bodySummary);
  });

  next();
};
