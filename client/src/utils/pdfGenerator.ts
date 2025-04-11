import type { ProjectWithCalculations } from "@shared/schema";
import { calculateReportData, formatCurrency } from "./calculations";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export const generatePDF = async (
  project: ProjectWithCalculations, 
  chartRef: React.RefObject<HTMLCanvasElement>
): Promise<string> => {
  try {
    // Create a new PDF document
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Get report data
    const reportData = calculateReportData(project);
    
    // Add title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(reportData.title, 15, 15);
    
    // Add document creation date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 15, 22);
    
    // Add horizontal line
    doc.setDrawColor(200, 200, 200);
    doc.line(15, 25, 195, 25);
    
    // Project Details section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Project Details", 15, 35);
    
    doc.setFontSize(10);
    let y = 45;
    reportData.projectDetails.forEach(item => {
      doc.setFont("helvetica", "bold");
      doc.text(item.name + ":", 15, y);
      doc.setFont("helvetica", "normal");
      doc.text(String(item.value), 60, y);
      y += 7;
    });
    
    // Cost Summary section
    y += 5;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Cost Summary", 15, y);
    y += 10;
    
    doc.setFontSize(10);
    reportData.costSummary.forEach(item => {
      doc.setFont("helvetica", "bold");
      doc.text(item.name + ":", 15, y);
      doc.setFont("helvetica", "normal");
      doc.text(item.value, 60, y);
      y += 7;
    });
    
    // If we have a chart reference, add the chart image
    if (chartRef.current) {
      try {
        const canvas = await html2canvas(chartRef.current);
        const chartImgData = canvas.toDataURL("image/png");
        
        y += 10;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Cost Breakdown", 15, y);
        y += 10;
        
        // Add the chart image
        doc.addImage(chartImgData, "PNG", 50, y, 110, 70);
        y += 85;
      } catch (error) {
        console.error("Failed to add chart to PDF:", error);
      }
    }
    
    // If we need to add a new page
    if (y > 250) {
      doc.addPage();
      y = 15;
    }
    
    // Detailed Cost Breakdown
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Detailed Cost Breakdown", 15, y);
    y += 10;
    
    // Add table headers
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Category", 15, y);
    doc.text("Item", 50, y);
    doc.text("Quantity", 100, y);
    doc.text("Unit Cost", 130, y);
    doc.text("Total", 170, y);
    y += 7;
    
    // Add separator line
    doc.setDrawColor(200, 200, 200);
    doc.line(15, y - 3, 195, y - 3);
    
    // Add table data
    doc.setFont("helvetica", "normal");
    const costBreakdownItems = project.costBreakdownItems.slice(0, 8); // Limit to avoid overflow
    
    costBreakdownItems.forEach(item => {
      doc.text(item.category, 15, y);
      doc.text(item.item, 50, y);
      doc.text(`${item.quantity} ${item.unit}`, 100, y);
      doc.text(formatCurrency(item.unitCost), 130, y);
      doc.text(formatCurrency(item.total), 170, y);
      y += 7;
    });
    
    // If we need to add a new page
    if (y > 250) {
      doc.addPage();
      y = 15;
    } else {
      y += 10;
    }
    
    // Optimization Suggestions
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Cost Optimization Suggestions", 15, y);
    y += 10;
    
    // Add optimization summary
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Potential Savings:", 15, y);
    doc.setFont("helvetica", "normal");
    doc.text(reportData.optimizationSummary.savings, 60, y);
    y += 7;
    
    doc.setFont("helvetica", "bold");
    doc.text("Optimized Cost:", 15, y);
    doc.setFont("helvetica", "normal");
    doc.text(reportData.optimizationSummary.optimized, 60, y);
    y += 7;
    
    doc.setFont("helvetica", "bold");
    doc.text("Savings Percentage:", 15, y);
    doc.setFont("helvetica", "normal");
    doc.text(reportData.optimizationSummary.percentage, 60, y);
    y += 12;
    
    // Add optimization items
    reportData.optimizationItems.forEach(item => {
      doc.setFont("helvetica", "bold");
      doc.text(item.category + ":", 15, y);
      doc.setFont("helvetica", "normal");
      doc.text(item.description, 60, y);
      doc.text(item.savings, 170, y);
      y += 7;
    });
    
    // Add footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Page ${i} of ${pageCount}`, 15, 285);
      doc.text("BuildCost Estimator - Construction Cost Estimation Tool", 105, 285, { align: "center" });
    }
    
    // Convert to data URL and return
    return doc.output('datauristring');
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF report");
  }
};
