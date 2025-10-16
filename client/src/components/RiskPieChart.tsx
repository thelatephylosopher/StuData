import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export interface RiskData {
  lowRisk: number;
  mediumRisk: number;
  highRisk: number;
}

interface RiskPieChartProps {
  data: RiskData;
}

export default function RiskPieChart({ data }: RiskPieChartProps) {
  const chartData = [
    { name: "Low Risk (Graduate)", value: data.lowRisk, color: "hsl(var(--chart-1))" },
    { name: "Medium Risk (Enrolled)", value: data.mediumRisk, color: "hsl(var(--chart-2))" },
    { name: "High Risk (Dropout)", value: data.highRisk, color: "hsl(var(--chart-3))" },
  ];

  const total = data.lowRisk + data.mediumRisk + data.highRisk;

  return (
    <div className="bg-card border border-card-border rounded-md p-6 shadow-sm">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-foreground">Risk Distribution</h3>
        <p className="text-2xl font-bold text-primary mt-2" data-testid="text-total-students">
          {total} <span className="text-sm font-normal text-muted-foreground">Total Students</span>
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry: any) => (
              <span className="text-sm">
                {value}: <strong>{entry.payload.value}</strong>
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
