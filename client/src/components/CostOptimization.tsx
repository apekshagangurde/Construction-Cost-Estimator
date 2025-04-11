import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatPercentage } from "@/utils/calculations";
import { CheckCircle } from "lucide-react";
import { type OptimizationSuggestion } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface CostOptimizationProps {
  totalCost: number;
  optimizationSuggestions: OptimizationSuggestion[];
}

const CostOptimization = ({ 
  totalCost, 
  optimizationSuggestions 
}: CostOptimizationProps) => {
  const { toast } = useToast();
  
  // Calculate total potential savings
  const potentialSavings = optimizationSuggestions.reduce(
    (total, suggestion) => total + suggestion.savings, 
    0
  );
  
  // Calculate optimized cost and savings percentage
  const optimizedCost = totalCost - potentialSavings;
  const savingsPercentage = (potentialSavings / totalCost) * 100;
  
  // Group suggestions by category
  const materialAlternatives = optimizationSuggestions.filter(
    item => item.category === "Material Alternatives"
  );
  
  const designModifications = optimizationSuggestions.filter(
    item => item.category === "Design Modifications"
  );
  
  const handleApplyOptimizations = () => {
    toast({
      title: "Optimizations Applied",
      description: `The optimizations have been applied, saving ${formatCurrency(potentialSavings)} (${formatPercentage(savingsPercentage)}).`,
    });
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Cost Optimization</h2>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Potential Savings: {formatCurrency(potentialSavings)}
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    By implementing the suggestions below, you could reduce your overall costs by approximately {formatPercentage(savingsPercentage)}.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-md font-medium text-gray-800 mb-2">Material Alternatives</h3>
            <div className="space-y-3">
              {materialAlternatives.map((suggestion, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-green-500">
                    <CheckCircle />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-700">{suggestion.description}</p>
                    <p className="text-xs text-green-600 font-medium">
                      Savings: {formatCurrency(suggestion.savings)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-md font-medium text-gray-800 mb-2">Design Modifications</h3>
            <div className="space-y-3">
              {designModifications.map((suggestion, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-green-500">
                    <CheckCircle />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-700">{suggestion.description}</p>
                    <p className="text-xs text-green-600 font-medium">
                      Savings: {formatCurrency(suggestion.savings)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium text-gray-800 mb-2">Comparative Analysis</h3>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Original Estimate</span>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(totalCost)}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Optimized Estimate</span>
                <span className="text-sm font-medium text-green-600">{formatCurrency(optimizedCost)}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full mt-2">
                <div 
                  className="h-2 bg-green-500 rounded-full" 
                  style={{ width: `${100 - savingsPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-end mt-1">
                <span className="text-xs text-green-600 font-medium">
                  {formatPercentage(savingsPercentage)} savings
                </span>
              </div>
            </div>
            <div className="mt-4">
              <Button 
                className="w-full" 
                onClick={handleApplyOptimizations}
              >
                Apply Optimizations
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostOptimization;
