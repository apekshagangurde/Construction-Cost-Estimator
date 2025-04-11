import express, { type Request, Response } from "express";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { initializeMaterialsDatabase } from "./data/materials";
import { projectFormSchema, type InsertProject, type CostBreakdownItem, type OptimizationSuggestion, type Project } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

// Initialize the materials database
initializeMaterialsDatabase();

export async function registerRoutes(app: Express): Promise<Server> {
  const apiRouter = express.Router();
  
  // Get all materials
  apiRouter.get("/materials", async (_req: Request, res: Response) => {
    try {
      const materials = await storage.getMaterials();
      res.json(materials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch materials" });
    }
  });
  
  // Get materials by category
  apiRouter.get("/materials/:category", async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      const materials = await storage.getMaterialsByCategory(category);
      res.json(materials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch materials" });
    }
  });
  
  // Get all projects
  apiRouter.get("/projects", async (_req: Request, res: Response) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });
  
  // Get a specific project
  apiRouter.get("/projects/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });
  
  // Create a new project with cost calculations
  apiRouter.post("/projects", async (req: Request, res: Response) => {
    try {
      // Validate the project data
      const validatedData = projectFormSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        const errorMessage = fromZodError(validatedData.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const projectData = validatedData.data;
      
      // Calculate project costs
      const { length, width, height, laborRate, laborHours } = projectData;
      const squareFootage = Number(length) * Number(width);
      const volume = squareFootage * Number(height);
      
      // Perform cost calculations based on project dimensions and materials
      const materialsCost = Math.round(volume * 2.5);
      const laborCost = Math.round(Number(laborHours) * Number(laborRate));
      const equipmentCost = Math.round(squareFootage * 2.4);
      const overheadCost = Math.round((materialsCost + laborCost + equipmentCost) * 0.12);
      const totalCost = materialsCost + laborCost + equipmentCost + overheadCost;
      
      // Calculate cost breakdown items
      const costBreakdown: CostBreakdownItem[] = [
        {
          category: "Materials",
          item: "Concrete",
          quantity: Math.round(volume * 0.015),
          unit: "cu yd",
          unitCost: 125,
          total: Math.round(volume * 0.015 * 125)
        },
        {
          category: "Materials",
          item: "Steel",
          quantity: Math.round(volume * 0.0005),
          unit: "tons",
          unitCost: 2200,
          total: Math.round(volume * 0.0005 * 2200)
        },
        {
          category: "Materials",
          item: "Glass",
          quantity: Math.round(squareFootage * 0.4),
          unit: "sq ft",
          unitCost: 32,
          total: Math.round(squareFootage * 0.4 * 32)
        },
        {
          category: "Materials",
          item: "Metal Roofing",
          quantity: Math.round(squareFootage * 1.1),
          unit: "sq ft",
          unitCost: 18,
          total: Math.round(squareFootage * 1.1 * 18)
        },
        {
          category: "Labor",
          item: "Foundation Work",
          quantity: Math.round(Number(laborHours) * 0.15),
          unit: "hours",
          unitCost: Number(laborRate),
          total: Math.round(Number(laborHours) * 0.15 * Number(laborRate))
        },
        {
          category: "Labor",
          item: "Structural Work",
          quantity: Math.round(Number(laborHours) * 0.35),
          unit: "hours",
          unitCost: Number(laborRate),
          total: Math.round(Number(laborHours) * 0.35 * Number(laborRate))
        },
        {
          category: "Labor",
          item: "Finishing Work",
          quantity: Math.round(Number(laborHours) * 0.5),
          unit: "hours",
          unitCost: Number(laborRate),
          total: Math.round(Number(laborHours) * 0.5 * Number(laborRate))
        },
        {
          category: "Equipment",
          item: "Heavy Machinery",
          quantity: Math.round(Number(laborHours) / 80),
          unit: "days",
          unitCost: 1200,
          total: Math.round((Number(laborHours) / 80) * 1200)
        },
        {
          category: "Equipment",
          item: "Scaffolding",
          quantity: Math.round(squareFootage * 0.8),
          unit: "sq ft",
          unitCost: 2.5,
          total: Math.round(squareFootage * 0.8 * 2.5)
        }
      ];
      
      // Generate optimization suggestions
      const steelSavings = Math.round(volume * 0.0005 * 2200 * 0.125); // 12.5% savings on steel
      const glassSavings = Math.round(squareFootage * 0.4 * (42 - 32)); // savings from using double instead of triple glazed
      const columnSpacingSavings = Math.round(totalCost * 0.012); // 1.2% savings on total
      const roofDesignSavings = Math.round(squareFootage * 1.1 * 18 * 0.1); // 10% savings on roofing
      
      const optimizations: OptimizationSuggestion[] = [
        {
          category: "Material Alternatives",
          description: "Replace premium steel with high-strength structural steel",
          savings: steelSavings
        },
        {
          category: "Material Alternatives",
          description: "Use double-glazed instead of triple-glazed glass panels",
          savings: glassSavings
        },
        {
          category: "Design Modifications",
          description: "Optimize column spacing to reduce steel requirements",
          savings: columnSpacingSavings
        },
        {
          category: "Design Modifications",
          description: "Simplify roof design from hip to gable",
          savings: roofDesignSavings
        }
      ];
      
      // Create the project with all calculated data
      const newProject = await storage.createProject({
        ...projectData,
        totalCost,
        materialsCost,
        laborCost,
        equipmentCost,
        overheadCost,
        costBreakdown,
        optimizations
      });
      
      res.status(201).json(newProject);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });
  
  // Get project with calculated fields for the report
  apiRouter.get("/projects/:id/report", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Calculate additional fields for reporting
      const squareFootage = Number(project.length) * Number(project.width);
      const costPerSquareFoot = Number(project.totalCost) / squareFootage;
      
      // Calculate total potential savings
      const optimizations = project.optimizations as OptimizationSuggestion[] || [];
      const potentialSavings = optimizations.reduce((total, item) => total + item.savings, 0);
      const optimizedCost = Number(project.totalCost) - potentialSavings;
      const savingsPercentage = (potentialSavings / Number(project.totalCost)) * 100;
      
      // Return the enhanced project data
      const projectWithCalculations = {
        ...project,
        squareFootage,
        costPerSquareFoot,
        costBreakdownItems: project.costBreakdown as CostBreakdownItem[] || [],
        optimizationSuggestions: optimizations,
        potentialSavings,
        optimizedCost,
        savingsPercentage
      };
      
      res.json(projectWithCalculations);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate report" });
    }
  });
  
  // Mount the API router
  app.use("/api", apiRouter);
  
  const httpServer = createServer(app);
  return httpServer;
}
