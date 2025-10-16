import { Award, TrendingUp, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export interface MetricData {
  creditsCompleted: number;
  creditsRequired: number;
  currentGPA: number;
  lastSemesterGPA: number;
}

interface MetricTilesProps {
  metrics: MetricData;
}

export default function MetricTiles({ metrics }: MetricTilesProps) {
  const completionPercentage = (metrics.creditsCompleted / metrics.creditsRequired) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-card border border-card-border rounded-md p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground">Credits Completed</h3>
          <Award className="w-5 h-5 text-primary" />
        </div>
        <p className="text-3xl font-bold text-foreground mb-2" data-testid="text-credits">
          {metrics.creditsCompleted}/{metrics.creditsRequired}
        </p>
        <Progress value={completionPercentage} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">{completionPercentage.toFixed(1)}% Complete</p>
      </div>

      <div className="bg-card border border-card-border rounded-md p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground">Current GPA</h3>
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        <p className="text-3xl font-bold text-foreground" data-testid="text-current-gpa">
          {metrics.currentGPA.toFixed(2)}
        </p>
        <p className="text-xs text-muted-foreground mt-2">Out of 4.0</p>
      </div>

      <div className="bg-card border border-card-border rounded-md p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground">Last Semester GPA</h3>
          <Calendar className="w-5 h-5 text-primary" />
        </div>
        <p className="text-3xl font-bold text-foreground" data-testid="text-last-semester-gpa">
          {metrics.lastSemesterGPA.toFixed(2)}
        </p>
        <p className="text-xs text-muted-foreground mt-2">Previous Term</p>
      </div>
    </div>
  );
}
