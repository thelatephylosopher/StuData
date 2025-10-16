import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export type RiskLevel = "critical" | "medium" | "low";

export interface PredictionFactor {
  name: string;
  importance: number;
}

interface ModelPredictionProps {
  riskLevel: RiskLevel;
  factors: PredictionFactor[];
}

export default function ModelPrediction({ riskLevel, factors }: ModelPredictionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRiskConfig = () => {
    switch (riskLevel) {
      case "critical":
        return {
          label: "Critical (investigation essential)",
          color: "text-chart-3",
          bgColor: "bg-chart-3/10",
          text: "high risk"
        };
      case "medium":
        return {
          label: "Enrolled - Extension Likely (may require support)",
          color: "text-chart-2",
          bgColor: "bg-chart-2/10",
          text: "medium risk"
        };
      case "low":
        return {
          label: "Graduate - On Track",
          color: "text-chart-1",
          bgColor: "bg-chart-1/10",
          text: "low risk"
        };
    }
  };

  const config = getRiskConfig();

  return (
    <div className="bg-card border border-card-border rounded-md p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-4">Model Prediction</h3>
      
      <div className={`${config.bgColor} rounded-md p-4 mb-4`}>
        <p className={`text-xl font-bold ${config.color} mb-2`} data-testid="text-prediction-result">
          {config.label}
        </p>
        <p className="text-sm text-foreground">
          Based on the current academic performance and past trends in similar individuals, student is at <strong>{config.text}</strong>.
        </p>
      </div>

      <Button
        variant="ghost"
        className="w-full justify-between hover-elevate"
        onClick={() => {
          console.log('Learn more toggled:', !isExpanded);
          setIsExpanded(!isExpanded);
        }}
        data-testid="button-learn-more"
      >
        <span className="text-sm font-medium">Learn More</span>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </Button>

      {isExpanded && (
        <div className="mt-4 p-4 bg-muted rounded-md" data-testid="section-factors">
          <h4 className="text-sm font-semibold text-foreground mb-3">Top 5 Factors Influencing Model Prediction</h4>
          <div className="space-y-3">
            {factors.slice(0, 5).map((factor, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-foreground">{factor.name}</span>
                  <span className="text-muted-foreground font-medium">{factor.importance}%</span>
                </div>
                <Progress value={factor.importance} className="h-2" />
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-background rounded-md border border-border">
            <p className="text-xs text-foreground leading-relaxed">
              The prediction is heavily influenced by the factors mentioned above. Take into consideration when making a decision. The model uses both individual and demographic details of the student to make a prediction. Outcomes may sometimes inadvertently be predicted based on historic trends which are inaccurate. User discretion is recommended.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
