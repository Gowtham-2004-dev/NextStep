import { resumes, newsItems, type Resume, type InsertResume, type NewsItem, type InsertNewsItem } from "@shared/schema";

export interface IStorage {
  // Resume operations
  createResume(resume: InsertResume): Promise<Resume>;
  getResumes(): Promise<Resume[]>;
  
  // News operations
  createNewsItem(newsItem: InsertNewsItem): Promise<NewsItem>;
  getNewsItems(): Promise<NewsItem[]>;
}

export class MemStorage implements IStorage {
  private resumes: Map<number, Resume>;
  private newsItems: Map<number, NewsItem>;
  private resumeId: number;
  private newsItemId: number;

  constructor() {
    this.resumes = new Map();
    this.newsItems = new Map();
    this.resumeId = 1;
    this.newsItemId = 1;
    
    // Initialize with sample news items
    this.initializeNewsItems();
  }

  private initializeNewsItems() {
    const sampleNewsItems: InsertNewsItem[] = [
      {
        title: "Quantum Computing Engineers Now Top IT Recruitment Priority",
        content: "Major tech firms are aggressively hiring quantum computing specialists as commercial applications near market readiness in 2025.",
        date: "March 10, 2025",
        imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80",
      },
      {
        title: "AI-Human Collaboration Models Transform IT Workplace",
        content: "New frameworks for AI assistants working alongside human developers have increased productivity by 300% in early adopting companies.",
        date: "March 5, 2025",
        imageUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80",
      },
      {
        title: "Cybersecurity Roles Evolve with Zero-Trust Architecture Adoption",
        content: "Companies are seeking specialists in zero-trust implementation as traditional security perimeters disappear in the distributed cloud era.",
        date: "February 28, 2025",
        imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      },
      {
        title: "Web3 Development Becomes Mainstream Skill Requirement",
        content: "Blockchain and decentralized application experience now requested in over 40% of frontend and backend developer positions.",
        date: "February 15, 2025",
        imageUrl: "https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      },
      {
        title: "Remote Work Evolves with VR Collaboration Tools",
        content: "IT professionals increasingly using virtual reality workspaces for team collaboration, creating new opportunities for VR specialists.",
        date: "February 3, 2025",
        imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      },
      {
        title: "Sustainable Tech Infrastructure Skills in High Demand",
        content: "Green computing expertise becomes essential as companies push to meet 2030 carbon reduction goals through efficient IT infrastructure.",
        date: "January 20, 2025",
        imageUrl: "https://images.unsplash.com/photo-1500464469892-c0b3d45a89d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      },
    ];

    sampleNewsItems.forEach(item => this.createNewsItem(item));
  }

  async createResume(insertResume: InsertResume): Promise<Resume> {
    const id = this.resumeId++;
    const resume: Resume = { ...insertResume, id };
    this.resumes.set(id, resume);
    return resume;
  }

  async getResumes(): Promise<Resume[]> {
    return Array.from(this.resumes.values());
  }

  async createNewsItem(insertNewsItem: InsertNewsItem): Promise<NewsItem> {
    const id = this.newsItemId++;
    const newsItem: NewsItem = { ...insertNewsItem, id };
    this.newsItems.set(id, newsItem);
    return newsItem;
  }

  async getNewsItems(): Promise<NewsItem[]> {
    return Array.from(this.newsItems.values());
  }
}

export const storage = new MemStorage();
