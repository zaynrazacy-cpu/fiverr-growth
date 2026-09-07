import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../../data");
const DB_FILE = path.join(DATA_DIR, "store.json");

interface DatabaseSchema {
  gigs: any[];
  briefs: any[];
  researchHistory: any[];
}

class Store {
  private data: DatabaseSchema;

  constructor() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      try {
        this.data = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
      } catch {
        this.data = { gigs: [], briefs: [], researchHistory: [] };
      }
    } else {
      this.data = { gigs: [], briefs: [], researchHistory: [] };
      this.save();
    }
  }

  private save() {
    fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), "utf-8");
  }

  public saveGig(gig: any) {
    const item = { id: `gig_${Date.now()}`, ...gig, createdAt: new Date().toISOString() };
    this.data.gigs.unshift(item);
    this.save();
    return item;
  }

  public getGigs() {
    return this.data.gigs;
  }

  public saveBrief(brief: any) {
    const item = { id: `brief_${Date.now()}`, ...brief, createdAt: new Date().toISOString() };
    this.data.briefs.unshift(item);
    this.save();
    return item;
  }

  public getBriefs() {
    return this.data.briefs;
  }

  public saveResearch(research: any) {
    const item = { id: `res_${Date.now()}`, ...research, createdAt: new Date().toISOString() };
    this.data.researchHistory.unshift(item);
    this.save();
    return item;
  }

  public getResearchHistory() {
    return this.data.researchHistory;
  }
}

export const db = new Store();
