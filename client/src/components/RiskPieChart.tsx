import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";

const chartData = [
  { risk: "high", students: 12, fill: "hsl(var(--chart-1))" },
  { risk: "medium", students: 23, fill: "hsl(var(--chart-2))" },
  { risk: "low", students: 65, fill: "hsl(var(--chart-3))" },
];

const chartConfig = {
  students: {
    label: "Students",
  },
  high: {
    label: "High Risk",
    color: "hsl(var(--chart-1))",
  },
  medium: {
    label: "Medium Risk",
    color: "hsl(var(--chart-2))",
  },
  low: {
    label: "Low Risk",
    color: "hsl(var(--chart-3))",
  },
};

export function RiskPieChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Risk Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={chartData} dataKey="students" nameKey="risk">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
