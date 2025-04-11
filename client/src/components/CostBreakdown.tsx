import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CostChart from "./CostChart";
import { formatCurrency } from "@/utils/calculations";
import { type CostBreakdownItem } from "@shared/schema";

interface CostBreakdownProps {
  materialsCost: number;
  laborCost: number;
  equipmentCost: number;
  overheadCost: number;
  costBreakdownItems: CostBreakdownItem[];
  chartRef?: React.RefObject<HTMLCanvasElement>;
}

const CostBreakdown = ({
  materialsCost,
  laborCost,
  equipmentCost,
  overheadCost,
  costBreakdownItems,
  chartRef
}: CostBreakdownProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Cost Breakdown</h2>
        
        <CostChart 
          materialsCost={materialsCost}
          laborCost={laborCost}
          equipmentCost={equipmentCost}
          overheadCost={overheadCost}
          chartRef={chartRef}
        />
        
        <div className="mt-6">
          <h3 className="text-md font-medium text-gray-700 mb-2">Detailed Costs</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Cost</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {costBreakdownItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.category}</TableCell>
                    <TableCell>{item.item}</TableCell>
                    <TableCell>{item.quantity} {item.unit}</TableCell>
                    <TableCell>{formatCurrency(item.unitCost)}</TableCell>
                    <TableCell>{formatCurrency(item.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostBreakdown;
