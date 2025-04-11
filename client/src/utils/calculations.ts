import type { InsertProject, CostBreakdownItem, OptimizationSuggestion, ProjectWithCalculations } from "@shared/schema";

// Calculate square footage of a project
export const calculateSquareFootage = (length: number, width: number): number => {
  return length * width;
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format currency with decimal places
export const formatCurrencyWithDecimals = (amount: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
};

// Format percentage
export const formatPercentage = (percentage: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(percentage / 100);
};

// Calculate cost per square foot
export const calculateCostPerSquareFoot = (totalCost: number, length: number, width: number): number => {
  const squareFootage = calculateSquareFootage(length, width);
  return totalCost / squareFootage;
};

// Generate cost breakdown items based on project data
export const generateCostBreakdown = (
  project: InsertProject & { totalCost?: number }
): CostBreakdownItem[] => {
  const { length, width, height, laborRate, laborHours } = project;
  const squareFootage = Number(length) * Number(width);
  const volume = squareFootage * Number(height);
  
  return [
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
};

// Generate optimization suggestions based on project data
export const generateOptimizations = (
  project: InsertProject & { totalCost?: number }
): OptimizationSuggestion[] => {
  const { length, width, height } = project;
  const squareFootage = Number(length) * Number(width);
  const volume = squareFootage * Number(height);
  const totalCost = project.totalCost || 1000000; // Default if not provided
  
  const steelSavings = Math.round(volume * 0.0005 * 2200 * 0.125); // 12.5% savings on steel
  const glassSavings = Math.round(squareFootage * 0.4 * (42 - 32)); // savings from using double instead of triple glazed
  const columnSpacingSavings = Math.round(totalCost * 0.012); // 1.2% savings on total
  const roofDesignSavings = Math.round(squareFootage * 1.1 * 18 * 0.1); // 10% savings on roofing
  
  return [
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
};

// Calculate total savings from optimization suggestions
export const calculateTotalSavings = (optimizations: OptimizationSuggestion[]): number => {
  return optimizations.reduce((total, item) => total + item.savings, 0);
};

// Group cost breakdown items by category
export const groupBreakdownByCategory = (
  items: CostBreakdownItem[]
): { category: string; total: number }[] => {
  const groupedData = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.total;
    return acc;
  }, {});

  return Object.entries(groupedData).map(([category, total]) => ({
    category,
    total,
  }));
};

// Calculate total costs from breakdown items
export const calculateTotalCosts = (items: CostBreakdownItem[]): {
  materialsCost: number;
  laborCost: number;
  equipmentCost: number;
  overheadCost: number;
  totalCost: number;
} => {
  const groupedData = groupBreakdownByCategory(items);
  
  const materialsCost = groupedData.find(g => g.category === "Materials")?.total || 0;
  const laborCost = groupedData.find(g => g.category === "Labor")?.total || 0;
  const equipmentCost = groupedData.find(g => g.category === "Equipment")?.total || 0;
  
  // Calculate overhead as 12% of the subtotal
  const subtotal = materialsCost + laborCost + equipmentCost;
  const overheadCost = Math.round(subtotal * 0.12);
  
  const totalCost = subtotal + overheadCost;
  
  return {
    materialsCost,
    laborCost,
    equipmentCost,
    overheadCost,
    totalCost
  };
};

// Calculate report data for a project
export const calculateReportData = (project: ProjectWithCalculations): {
  title: string;
  projectDetails: { name: string; value: string | number }[];
  costSummary: { name: string; value: string }[];
  costBreakdown: { category: string; value: number }[];
  optimizationSummary: { savings: string; percentage: string; optimized: string };
  optimizationItems: { category: string; description: string; savings: string }[];
} => {
  return {
    title: `${project.name} - Cost Estimation Report`,
    projectDetails: [
      { name: "Project Type", value: project.type },
      { name: "Dimensions", value: `${project.length} x ${project.width} x ${project.height} ft` },
      { name: "Square Footage", value: `${project.squareFootage.toLocaleString()} sq ft` },
      { name: "Foundation", value: project.foundation },
      { name: "Structure", value: project.structure },
      { name: "Exterior", value: project.exterior },
      { name: "Roofing", value: project.roofing },
      { name: "Labor Rate", value: formatCurrency(Number(project.laborRate)) + "/hr" },
      { name: "Labor Hours", value: Number(project.laborHours).toLocaleString() }
    ],
    costSummary: [
      { name: "Total Cost", value: formatCurrency(Number(project.totalCost)) },
      { name: "Materials", value: formatCurrency(Number(project.materialsCost)) },
      { name: "Labor", value: formatCurrency(Number(project.laborCost)) },
      { name: "Equipment", value: formatCurrency(Number(project.equipmentCost)) },
      { name: "Overhead", value: formatCurrency(Number(project.overheadCost)) },
      { name: "Cost per sq ft", value: formatCurrencyWithDecimals(project.costPerSquareFoot) }
    ],
    costBreakdown: [
      { category: "Materials", value: Number(project.materialsCost) },
      { category: "Labor", value: Number(project.laborCost) },
      { category: "Equipment", value: Number(project.equipmentCost) },
      { category: "Overhead", value: Number(project.overheadCost) }
    ],
    optimizationSummary: {
      savings: formatCurrency(project.potentialSavings),
      percentage: formatPercentage(project.savingsPercentage),
      optimized: formatCurrency(project.optimizedCost)
    },
    optimizationItems: project.optimizationSuggestions.map(item => ({
      category: item.category,
      description: item.description,
      savings: formatCurrency(item.savings)
    }))
  };
};
