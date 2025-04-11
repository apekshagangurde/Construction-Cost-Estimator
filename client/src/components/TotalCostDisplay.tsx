import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";
import { formatCurrency, formatCurrencyWithDecimals } from "@/utils/calculations";
import { useRef } from "react";
import { generatePDF } from "@/utils/pdfGenerator";
import { useToast } from "@/hooks/use-toast";
import { type ProjectWithCalculations } from "@shared/schema";

interface TotalCostDisplayProps {
  project: ProjectWithCalculations;
  chartRef: React.RefObject<HTMLCanvasElement>;
}

const TotalCostDisplay = ({ project, chartRef }: TotalCostDisplayProps) => {
  const { toast } = useToast();
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);
  
  const handleGenerateReport = async () => {
    try {
      const pdfDataUri = await generatePDF(project, chartRef);
      
      // Create a download link
      if (downloadLinkRef.current) {
        downloadLinkRef.current.href = pdfDataUri;
        downloadLinkRef.current.download = `${project.name.replace(/\s+/g, '_')}_cost_estimation.pdf`;
        downloadLinkRef.current.click();
      }
      
      toast({
        title: "Report Generated",
        description: "The cost estimation report has been successfully generated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate the report. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const squareFootage = Number(project.length) * Number(project.width);
  const costPerSqFt = Number(project.totalCost) / squareFootage;
  
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Total Estimated Cost</h2>
        
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-gray-900">
            {formatCurrency(Number(project.totalCost))}
          </div>
          <div className="text-sm text-gray-500">Based on current inputs</div>
        </div>
        
        <div className="space-y-2 mt-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Materials:</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(Number(project.materialsCost))}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Labor:</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(Number(project.laborCost))}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Equipment:</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(Number(project.equipmentCost))}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Overhead:</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(Number(project.overheadCost))}
            </span>
          </div>
          <div className="h-px bg-gray-200 my-2"></div>
          <div className="flex justify-between text-sm font-medium">
            <span className="text-gray-600">Cost per sq ft:</span>
            <span className="text-gray-900">
              {formatCurrencyWithDecimals(costPerSqFt, 2)}
            </span>
          </div>
        </div>
        
        <div className="mt-6">
          <Button 
            className="w-full bg-green-600 hover:bg-green-700" 
            onClick={handleGenerateReport}
          >
            <Download className="h-5 w-5 mr-2" />
            Generate Report
          </Button>
          <a ref={downloadLinkRef} style={{ display: 'none' }} />
        </div>
      </CardContent>
    </Card>
  );
};

export default TotalCostDisplay;
