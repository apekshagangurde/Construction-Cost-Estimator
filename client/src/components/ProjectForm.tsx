import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { projectFormSchema, type InsertProject, type ProjectWithCalculations } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { projectService } from "@/lib/firebase";
import { 
  generateCostBreakdown, 
  generateOptimizations, 
  calculateSquareFootage, 
  calculateCostPerSquareFoot, 
  calculateTotalSavings 
} from "@/utils/calculations";

interface ProjectFormProps {
  onProjectCreated?: (projectId: string) => void;
}

const ProjectForm = ({ onProjectCreated }: ProjectFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<InsertProject>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      type: "commercial",
      length: "80",
      width: "60", 
      height: "24",
      foundation: "concrete",
      structure: "steel",
      exterior: "glass",
      roofing: "metal",
      laborRate: "45",
      laborHours: "5600",
      additionalRequirements: "",
    },
  });
  
  // Firebase mutation
  const createFirebaseProjectMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      // Calculate costs and create data for Firebase
      const length = parseFloat(data.length);
      const width = parseFloat(data.width);
      const height = parseFloat(data.height);
      const laborRate = parseFloat(data.laborRate);
      const laborHours = parseFloat(data.laborHours);
      
      // Calculate costs
      const materialsCost = length * width * 45; // Simplified calculation
      const laborCost = laborRate * laborHours;
      const equipmentCost = length * width * 8.5;
      const overheadCost = (materialsCost + laborCost + equipmentCost) * 0.12;
      const totalCost = materialsCost + laborCost + equipmentCost + overheadCost;
      
      // Generate detailed breakdown
      const squareFootage = calculateSquareFootage(length, width);
      const costPerSquareFoot = calculateCostPerSquareFoot(totalCost, length, width);
      const costBreakdownItems = generateCostBreakdown(data, materialsCost, laborCost, equipmentCost, overheadCost);
      const optimizationSuggestions = generateOptimizations(data, materialsCost, laborCost, equipmentCost, overheadCost);
      const potentialSavings = calculateTotalSavings(optimizationSuggestions);
      const optimizedCost = totalCost - potentialSavings;
      const savingsPercentage = (potentialSavings / totalCost) * 100;
      
      // Create project data for Firebase
      const projectData = {
        ...data,
        materialsCost: materialsCost.toString(),
        laborCost: laborCost.toString(),
        equipmentCost: equipmentCost.toString(),
        overheadCost: overheadCost.toString(),
        totalCost: totalCost.toString(),
        squareFootage,
        costPerSquareFoot,
        costBreakdownItems,
        optimizationSuggestions,
        potentialSavings,
        optimizedCost,
        savingsPercentage,
        createdAt: new Date().toISOString(),
      };
      
      // Save to Firestore
      return await projectService.createProject(projectData);
    },
    onSuccess: (projectId) => {
      toast({
        title: "Project created in Firebase",
        description: "Your project has been successfully saved to Firebase and cost estimation is complete.",
      });
      
      if (onProjectCreated) {
        onProjectCreated(projectId);
      }
      
      // Reset the form but keep some of the values for convenience
      form.reset({
        ...form.getValues(),
        name: "",
        additionalRequirements: "",
      });
    },
    onError: (error) => {
      toast({
        title: "Firebase Error",
        description: `Failed to create project in Firebase: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      });
    },
  });
  
  // Fallback to API if needed
  const createProjectMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      const response = await apiRequest("POST", "/api/projects", data);
      const result = await response.json();
      return result;
    },
    onSuccess: (project) => {
      toast({
        title: "Project created",
        description: "Your project has been successfully created and cost estimation is complete.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      
      if (onProjectCreated) {
        onProjectCreated(project.id);
      }
      
      // Reset the form but keep some of the values for convenience
      form.reset({
        ...form.getValues(),
        name: "",
        additionalRequirements: "",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create project: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertProject) => {
    // Try Firebase first, fallback to API
    try {
      createFirebaseProjectMutation.mutate(data);
    } catch (error) {
      console.error("Firebase error, falling back to API:", error);
      createProjectMutation.mutate(data);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Project Details</h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Commercial Building" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                        <SelectItem value="infrastructure">Infrastructure</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-2">Dimensions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="length"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Length (ft)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="width"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Width (ft)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (ft)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-2">Materials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="foundation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Foundation</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select foundation type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="concrete">Concrete</SelectItem>
                          <SelectItem value="reinforced">Reinforced Concrete</SelectItem>
                          <SelectItem value="pile">Pile Foundation</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="structure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Structure</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select structure type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="steel">Steel Frame</SelectItem>
                          <SelectItem value="concrete">Concrete Frame</SelectItem>
                          <SelectItem value="wood">Wood Frame</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="exterior"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exterior Walls</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select exterior type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="brick">Brick</SelectItem>
                          <SelectItem value="concrete">Concrete</SelectItem>
                          <SelectItem value="metal">Metal Panels</SelectItem>
                          <SelectItem value="glass">Glass Curtain Wall</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="roofing"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Roofing</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select roofing type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="metal">Metal</SelectItem>
                          <SelectItem value="shingle">Asphalt Shingles</SelectItem>
                          <SelectItem value="membrane">Membrane</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-2">Labor</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="laborRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Labor Rate ($/hour)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="laborHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Labor Hours</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="additionalRequirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Requirements</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Special construction needs, site conditions, etc."
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              
              <Button 
                type="submit"
                disabled={createProjectMutation.isPending}
              >
                {createProjectMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  "Calculate Costs"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProjectForm;
