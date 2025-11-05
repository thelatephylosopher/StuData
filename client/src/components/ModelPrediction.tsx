import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export type RiskLevel = "critical" | "medium" | "on-track";

export interface PredictionFactor {
  name: string;
  value: number; // Changed from 'importance' to 'value' (raw SHAP value)
}

interface ModelPredictionProps {
  riskLevel: RiskLevel;
  factors: PredictionFactor[];
  prediction: string; // The predicted class name (e.g., "Dropout")
}

export default function ModelPrediction({ riskLevel, factors, prediction }: ModelPredictionProps) {
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
      case "on-track":
        return {
          label: "Graduate - On Track",
          color: "text-chart-1",
          bgColor: "bg-chart-1/10",
          text: "low risk"
        };
    }
  };

  const config = getRiskConfig();

  // --- Calculate max absolute value for scaling progress bars ---
  const maxAbsValue = Math.max(...factors.map(f => Math.abs(f.value)), 0.0001); // Avoid div by zero

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

      {/* --- This section is now active --- */}
      <Button
        variant="ghost"
        className="w-full justify-between hover-elevate"
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
        data-testid="button-learn-more"
      >
        <span className="text-sm font-medium">Learn More</span>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </Button>

      {isExpanded && (
        <div className="mt-4 p-4 bg-muted rounded-md" data-testid="section-factors">
          <h4 className="text-sm font-semibold text-foreground mb-3">Top 5 Factors Influencing Prediction: {prediction}</h4>
          <div className="space-y-3">
            {factors.slice(0, 5).map((factor, idx) => {
              const barValue = (Math.abs(factor.value) / maxAbsValue) * 100;
              const isPositive = factor.value > 0;
              const influenceText = isPositive ? "Supports" : "Against";
              const textColor = isPositive ? "text-chart-1" : "text-chart-3"; // Green for support, Red for against
              const bgColor = isPositive ? "bg-chart-1" : "bg-chart-3";

              return (
                <div key={idx}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-foreground">{factor.name}</span>
                    <span className={`${textColor} font-medium`}>
                      {influenceText} ({factor.value.toFixed(3)})
                    </span>
                  </div>
                  {/* --- Use the new indicatorClassName prop --- */}
                  <Progress value={barValue} className="h-2" indicatorClassName={bgColor} />
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-3 bg-background rounded-md border border-border">
            <p className="text-xs text-foreground leading-relaxed">
              This prediction is based on SHAP values. Features shown with "Supports" (positive values) pushed the model
              towards this outcome. Features with "Against" (negative values) pushed it away.
              The model uses both individual and demographic details. User discretion is recommended.
            </p>
          </div>
        </div>
      )}
      {/* --- End of active section --- */}

    </div>
  );
}