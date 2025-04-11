import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectForm from "@/components/ProjectForm";
import TotalCostDisplay from "@/components/TotalCostDisplay";
import CostBreakdown from "@/components/CostBreakdown";
import CostOptimization from "@/components/CostOptimization";
import { type ProjectWithCalculations, type Project, type Material } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Database, FileText, LayoutDashboard } from "lucide-react";
import { projectService, type FirestoreProject } from "@/lib/firebase";

const Dashboard = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | number | null>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [firebaseProjects, setFirebaseProjects] = useState<FirestoreProject[]>([]);
  const [isLoadingFirebaseProjects, setIsLoadingFirebaseProjects] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectWithCalculations | null>(null);
  
  // Query for selected project from API - use an empty array as default
  const { data: project, isLoading } = useQuery<ProjectWithCalculations, Error, ProjectWithCalculations, any[]>({
    queryKey: selectedProjectId ? [`/api/projects/${selectedProjectId}/report`] : [],
    enabled: !!selectedProjectId && typeof selectedProjectId === 'number'
  });
  
  // Query for all projects from API (for history tab)
  const { data: projects = [], isLoading: isLoadingProjects } = useQuery<Project[], Error, Project[]>({
    queryKey: ["/api/projects"],
    enabled: activeTab === "history"
  });
  
  // Query for materials (for database tab)
  const { data: materials = [], isLoading: isLoadingMaterials } = useQuery<Material[], Error, Material[]>({
    queryKey: ["/api/materials"],
    enabled: activeTab === "database"
  });
  
  // Load Firebase projects when the history tab is activated
  useEffect(() => {
    const loadFirebaseProjects = async () => {
      if (activeTab === "history") {
        setIsLoadingFirebaseProjects(true);
        try {
          const fbProjects = await projectService.getAllProjects();
          setFirebaseProjects(fbProjects);
        } catch (error) {
          console.error("Error loading Firebase projects:", error);
        } finally {
          setIsLoadingFirebaseProjects(false);
        }
      }
    };
    
    loadFirebaseProjects();
  }, [activeTab]);
  
  // Load Firebase project details when selected
  useEffect(() => {
    const loadFirebaseProject = async () => {
      if (selectedProjectId && typeof selectedProjectId === 'string') {
        try {
          const fbProject = await projectService.getProjectById(selectedProjectId);
          if (fbProject) {
            setSelectedProject(fbProject as unknown as ProjectWithCalculations);
          }
        } catch (error) {
          console.error("Error loading Firebase project:", error);
        }
      }
    };
    
    if (selectedProjectId && typeof selectedProjectId === 'string') {
      loadFirebaseProject();
    } else {
      setSelectedProject(null);
    }
  }, [selectedProjectId]);
  
  // Handler when a project is created
  const handleProjectCreated = (projectId: string | number) => {
    setSelectedProjectId(projectId);
    setActiveTab("dashboard");
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    if (value === "history") {
      // No need to navigate, we'll show history in a tab
    } else if (value === "dashboard") {
      // Stay on current page
    } else if (value === "reports" && selectedProjectId) {
      // Open report in new tab
      window.open(`/api/projects/${selectedProjectId}/report`, '_blank');
      setActiveTab("dashboard"); // Return to dashboard after opening report
    }
  };

  // Tab rendering helper
  const renderTabContent = () => {
    switch(activeTab) {
      case "dashboard":
        return (
          <>
            {/* Top section with project form and total cost */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="col-span-2">
                <ProjectForm onProjectCreated={handleProjectCreated} />
              </div>
              
              <div>
                {project || selectedProject ? (
                  <TotalCostDisplay 
                    project={project || selectedProject as ProjectWithCalculations} 
                    chartRef={chartRef} 
                  />
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
            {(project || selectedProject) && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <CostBreakdown 
                    materialsCost={Number((project || selectedProject)?.materialsCost || 0)}
                    laborCost={Number((project || selectedProject)?.laborCost || 0)}
                    equipmentCost={Number((project || selectedProject)?.equipmentCost || 0)}
                    overheadCost={Number((project || selectedProject)?.overheadCost || 0)}
                    costBreakdownItems={(project || selectedProject)?.costBreakdownItems || []}
                    chartRef={chartRef}
                  />
                </div>
                
                <div>
                  <CostOptimization 
                    totalCost={Number((project || selectedProject)?.totalCost || 0)}
                    optimizationSuggestions={(project || selectedProject)?.optimizationSuggestions || []}
                  />
                </div>
              </div>
            )}
          </>
        );
      
      case "history":
        return (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Project History</h2>
              {(isLoadingProjects || isLoadingFirebaseProjects) ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (firebaseProjects.length > 0 || (projects && projects.length > 0)) ? (
                <div className="space-y-6">
                  {firebaseProjects.length > 0 && (
                    <div>
                      <h3 className="text-md font-medium text-gray-700 mb-3">Firebase Projects</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dimensions</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Storage</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {firebaseProjects.map((p) => (
                              <tr 
                                key={p.id} 
                                className="cursor-pointer hover:bg-gray-50"
                                onClick={() => {
                                  setSelectedProjectId(p.id);
                                  setActiveTab("dashboard");
                                }}
                              >
                                <td className="px-6 py-4 whitespace-nowrap">{p.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap capitalize">{p.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{`${p.length} x ${p.width} x ${p.height} ft`}</td>
                                <td className="px-6 py-4 whitespace-nowrap font-medium">${Number(p.totalCost).toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Firebase
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  
                  {projects && projects.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-md font-medium text-gray-700 mb-3">Local Projects</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dimensions</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Storage</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {projects.map((p) => (
                              <tr 
                                key={p.id} 
                                className="cursor-pointer hover:bg-gray-50"
                                onClick={() => {
                                  setSelectedProjectId(p.id);
                                  setActiveTab("dashboard");
                                }}
                              >
                                <td className="px-6 py-4 whitespace-nowrap">{p.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap capitalize">{p.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{`${p.length} x ${p.width} x ${p.height} ft`}</td>
                                <td className="px-6 py-4 whitespace-nowrap font-medium">${Number(p.totalCost).toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Local
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No projects found. Create a new project to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      
      case "database":
        return (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Materials Database</h2>
              {isLoadingMaterials ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : materials && materials.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost Per Unit</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {materials.map((m) => (
                        <tr key={m.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{m.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap capitalize">{m.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{m.unit}</td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium">${Number(m.costPerUnit).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Database className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No materials found in the database.</p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      
      case "reports":
        return (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Project Reports</h2>
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 mb-2">Select a project to generate a report</p>
                <p className="text-sm text-gray-400">
                  Create or select a project in the dashboard, then click on "Generate Report"
                </p>
              </div>
            </CardContent>
          </Card>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Custom tabs navigation */}
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-1 py-4">
              <Button 
                variant={activeTab === "dashboard" ? "default" : "ghost"}
                className="flex items-center"
                onClick={() => setActiveTab("dashboard")}
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button 
                variant={activeTab === "history" ? "default" : "ghost"}
                className="flex items-center"
                onClick={() => setActiveTab("history")}
              >
                <Loader2 className="h-4 w-4 mr-2" />
                History
              </Button>
              <Button 
                variant={activeTab === "database" ? "default" : "ghost"}
                className="flex items-center"
                onClick={() => setActiveTab("database")}
              >
                <Database className="h-4 w-4 mr-2" />
                Database
              </Button>
              <Button 
                variant={activeTab === "reports" ? "default" : "ghost"}
                className="flex items-center"
                onClick={() => handleTabChange("reports")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Reports
              </Button>
            </div>
          </div>
        </div>
        
        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {renderTabContent()}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
