import { 
  users, projects, materials,
  type User, type InsertUser, 
  type Project, type InsertProject,
  type Material, type InsertMaterial,
  type CostBreakdownItem, type OptimizationSuggestion
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Project methods
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject & {
    totalCost: number;
    materialsCost: number;
    laborCost: number;
    equipmentCost: number;
    overheadCost: number;
    costBreakdown: CostBreakdownItem[];
    optimizations: OptimizationSuggestion[];
  }): Promise<Project>;
  
  // Material methods
  getMaterials(): Promise<Material[]>;
  getMaterialsByCategory(category: string): Promise<Material[]>;
  getMaterial(id: number): Promise<Material | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private materials: Map<number, Material>;
  private userCurrentId: number;
  private projectCurrentId: number;
  private materialCurrentId: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.materials = new Map();
    this.userCurrentId = 1;
    this.projectCurrentId = 1;
    this.materialCurrentId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values())
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA; // Sort by date descending (newest first)
      });
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(project: InsertProject & {
    totalCost: number;
    materialsCost: number;
    laborCost: number;
    equipmentCost: number;
    overheadCost: number;
    costBreakdown: CostBreakdownItem[];
    optimizations: OptimizationSuggestion[];
  }): Promise<Project> {
    const id = this.projectCurrentId++;
    const now = new Date();
    
    const newProject: Project = {
      ...project,
      id,
      createdAt: now,
    };
    
    this.projects.set(id, newProject);
    return newProject;
  }

  // Material methods
  async getMaterials(): Promise<Material[]> {
    return Array.from(this.materials.values());
  }

  async getMaterialsByCategory(category: string): Promise<Material[]> {
    return Array.from(this.materials.values())
      .filter(material => material.category === category);
  }

  async getMaterial(id: number): Promise<Material | undefined> {
    return this.materials.get(id);
  }

  // Helper method to load initial materials data
  loadMaterials(materialsData: InsertMaterial[]): void {
    materialsData.forEach(material => {
      const id = this.materialCurrentId++;
      const newMaterial: Material = { ...material, id };
      this.materials.set(id, newMaterial);
    });
  }
}

// Create storage instance and export it
export const storage = new MemStorage();
