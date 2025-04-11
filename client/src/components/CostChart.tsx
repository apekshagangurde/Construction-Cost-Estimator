import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef } from "react";
import { Chart, ArcElement, Tooltip, Legend, ChartData, DoughnutController } from "chart.js";
import { formatCurrency } from "@/utils/calculations";

// Register Chart.js components
Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

interface CostChartProps {
  materialsCost: number;
  laborCost: number;
  equipmentCost: number;
  overheadCost: number;
  chartRef?: React.RefObject<HTMLCanvasElement>;
}

const CostChart = ({ 
  materialsCost, 
  laborCost, 
  equipmentCost, 
  overheadCost,
  chartRef
}: CostChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  // Create the chart data
  const chartData: ChartData<"doughnut"> = {
    labels: ["Materials", "Labor", "Equipment", "Overhead"],
    datasets: [{
      label: "Cost Breakdown",
      data: [materialsCost, laborCost, equipmentCost, overheadCost],
      backgroundColor: [
        "#2563eb", // primary blue
        "#f59e0b", // amber
        "#10b981", // emerald
        "#6366f1"  // indigo
      ],
      borderWidth: 1
    }]
  };
  
  useEffect(() => {
    // If the canvas element exists
    if (canvasRef.current) {
      // Destroy existing chart instance
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      
      // Create a new chart
      chartInstance.current = new Chart(canvasRef.current, {
        type: "doughnut",
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                padding: 20,
                boxWidth: 12
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || "";
                  const value = context.raw as number || 0;
                  const total = (context.dataset.data as number[]).reduce((acc, val) => acc + val, 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    }
    
    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [materialsCost, laborCost, equipmentCost, overheadCost]);

  return (
    <div className="h-72">
      <canvas 
        ref={(node) => {
          if (node) {
            // Use a non-null assertion since we've checked node is not null
            (canvasRef as React.MutableRefObject<HTMLCanvasElement | null>).current = node;
            
            // If chartRef is provided, also set it
            if (chartRef) {
              (chartRef as React.MutableRefObject<HTMLCanvasElement | null>).current = node;
            }
          }
        }} 
      />
    </div>
  );
};

export default CostChart;
