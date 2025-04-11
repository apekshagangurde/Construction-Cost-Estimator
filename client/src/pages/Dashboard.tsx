import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectForm from "@/components/ProjectForm";
import TotalCostDisplay from "@/components/TotalCostDisplay";
import CostBreakdown from "@/components/CostBreakdown";
import CostOptimization from "@/components/CostOptimization";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type ProjectWithCalculations } from "@shared/schema";

const Dashboard = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  
  // Query for selected project
  const { data: project, isLoading } = useQuery<ProjectWithCalculations>({
    queryKey: selectedProjectId ? [`/api/projects/${selectedProjectId}/report`] : null,
    enabled: !!selectedProjectId
  });
  
  // Handler when a project is created
  const handleProjectCreated = (projectId: number) => {
    setSelectedProjectId(projectId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Tabs for navigation */}
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="grid grid-cols-4 max-w-md">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="database">Database</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Top section with project form and total cost */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="col-span-2">
              <ProjectForm onProjectCreated={handleProjectCreated} />
            </div>
            
            <div>
              {project ? (
                <TotalCostDisplay project={project} chartRef={chartRef} />
              ) : (
                <div className="bg-white shadow-sm rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Total Estimated Cost</h2>
                  <div className="text-center p-8">
                    <p className="text-gray-500">
                      {isLoading 
                        ? "Loading project data..." 
                        : "Complete the form and calculate costs to see your estimate"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Bottom section with cost breakdown and optimization */}
          {project && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CostBreakdown 
                  materialsCost={Number(project.materialsCost)}
                  laborCost={Number(project.laborCost)}
                  equipmentCost={Number(project.equipmentCost)}
                  overheadCost={Number(project.overheadCost)}
                  costBreakdownItems={project.costBreakdownItems}
                  chartRef={chartRef}
                />
              </div>
              
              <div>
                <CostOptimization 
                  totalCost={Number(project.totalCost)}
                  optimizationSuggestions={project.optimizationSuggestions}
                />
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
