import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

// Type for the global importance data
export interface GlobalFactor {
  name: string;
  value: number; // This is the importance score
}

export default function GlobalFeatureImportance() {
  const [factors, setFactors] = useState<GlobalFactor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGlobalImportance = async () => {
      try {
        setIsLoading(true);
        // --- Fetch data from the new global endpoint ---
        const res = await fetch(`https://studata.onrender.com/explain/global`);
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data: GlobalFactor[] = await res.json();
        setFactors(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        console.error("Failed to fetch global importance:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGlobalImportance();
  }, []);

  // Find max value for scaling progress bars
  const maxImportance = Math.max(...factors.map(f => Math.abs(f.value)), 0.0001);

  const renderContent = () => {
    if (isLoading) {
      // --- Skeleton loader for a better user experience ---
      return (
        <div className="space-y-3" data-testid="loading-skeleton">
          {[...Array(5)].map((_, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs mb-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/5" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <p className="text-sm text-chart-3" data-testid="error-message">
          Error: Could not load model explanations. {error}
        </p>
      );
    }

    if (factors.length === 0) {
        return (
            <p className="text-sm text-foreground" data-testid="no-data-message">
                No feature importance data available.
            </p>
        );
    }

    // --- Render the list of features and their importance ---
    return (
      <div className="space-y-3" data-testid="factors-list">
        {factors.slice(0, 5).map((factor, idx) => { // Show top 5
          const barValue = (Math.abs(factor.value) / maxImportance) * 100;
          return (
            <div key={idx}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-foreground">{factor.name}</span>
                <span className="text-primary font-medium">
                  {factor.value.toFixed(3)}
                </span>
              </div>
              <Progress value={barValue} className="h-2" />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-card border border-card-border rounded-md p-6 shadow-sm mt-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        An overview of how the model works
      </h3>
      <div className="p-4 bg-muted rounded-md">
        <h4 className="text-sm font-semibold text-foreground mb-3">
          Top 5 Factors in All Predictions
        </h4>
        {renderContent()}
         <div className="mt-4 p-3 bg-background rounded-md border border-border">
            <p className="text-xs text-foreground leading-relaxed">
              These are the top features the model uses to make predictions across all students.
            </p>
          </div>
      </div>
    </div>
  );
}