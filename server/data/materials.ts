import { type InsertMaterial } from "@shared/schema";
import { storage } from "../storage";

// Material cost database
export const materialsData: InsertMaterial[] = [
  // Foundation materials
  {
    category: "foundation",
    name: "Concrete",
    unit: "cu yd",
    costPerUnit: 125
  },
  {
    category: "foundation",
    name: "Reinforced Concrete",
    unit: "cu yd",
    costPerUnit: 145
  },
  {
    category: "foundation",
    name: "Pile Foundation",
    unit: "linear ft",
    costPerUnit: 45
  },
  
  // Structure materials
  {
    category: "structure",
    name: "Steel Frame",
    unit: "ton",
    costPerUnit: 2200
  },
  {
    category: "structure",
    name: "Concrete Frame",
    unit: "cu yd",
    costPerUnit: 180
  },
  {
    category: "structure",
    name: "Wood Frame",
    unit: "board ft",
    costPerUnit: 3
  },
  {
    category: "structure",
    name: "High-Strength Structural Steel",
    unit: "ton",
    costPerUnit: 1922 // 12.5% less expensive than premium steel
  },
  
  // Exterior materials
  {
    category: "exterior",
    name: "Brick",
    unit: "sq ft",
    costPerUnit: 28
  },
  {
    category: "exterior",
    name: "Concrete",
    unit: "sq ft",
    costPerUnit: 15
  },
  {
    category: "exterior",
    name: "Metal Panels",
    unit: "sq ft",
    costPerUnit: 22
  },
  {
    category: "exterior",
    name: "Glass Curtain Wall",
    unit: "sq ft",
    costPerUnit: 75
  },
  {
    category: "exterior",
    name: "Triple-Glazed Glass",
    unit: "sq ft",
    costPerUnit: 42
  },
  {
    category: "exterior",
    name: "Double-Glazed Glass",
    unit: "sq ft",
    costPerUnit: 32
  },
  
  // Roofing materials
  {
    category: "roofing",
    name: "Metal",
    unit: "sq ft",
    costPerUnit: 18
  },
  {
    category: "roofing",
    name: "Asphalt Shingles",
    unit: "sq ft",
    costPerUnit: 7
  },
  {
    category: "roofing",
    name: "Membrane",
    unit: "sq ft",
    costPerUnit: 12
  },
  
  // Labor categories (hourly rates used in calculations)
  {
    category: "labor",
    name: "Foundation Work",
    unit: "hour",
    costPerUnit: 45
  },
  {
    category: "labor",
    name: "Structural Work",
    unit: "hour",
    costPerUnit: 55
  },
  {
    category: "labor",
    name: "Finishing Work",
    unit: "hour",
    costPerUnit: 42
  },
  {
    category: "labor",
    name: "Electrical Work",
    unit: "hour",
    costPerUnit: 65
  },
  {
    category: "labor",
    name: "Plumbing Work",
    unit: "hour",
    costPerUnit: 68
  },
  
  // Equipment costs
  {
    category: "equipment",
    name: "Heavy Machinery",
    unit: "day",
    costPerUnit: 1200
  },
  {
    category: "equipment",
    name: "Scaffolding",
    unit: "sq ft",
    costPerUnit: 2.5
  },
  {
    category: "equipment",
    name: "Small Tools",
    unit: "day",
    costPerUnit: 85
  }
];

// Function to initialize the materials database
export const initializeMaterialsDatabase = () => {
  storage.loadMaterials(materialsData);
};
