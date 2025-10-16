import { TrendingDown, AlertCircle, CheckCircle } from "lucide-react";

export interface RiskCounts {
  critical: number;
  medium: number;
  onTrack: number;
}

interface RiskCategoryTilesProps {
  counts: RiskCounts;
}

export default function RiskCategoryTiles({ counts }: RiskCategoryTilesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-card border border-card-border rounded-md p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-muted-foreground">Critical (Dropout)</h3>
          <TrendingDown className="w-5 h-5 text-chart-3" />
        </div>
        <p className="text-3xl font-bold text-chart-3" data-testid="text-critical-count">{counts.critical}</p>
        <p className="text-xs text-muted-foreground mt-1">Investigation Essential</p>
      </div>

      <div className="bg-card border border-card-border rounded-md p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-muted-foreground">Extension Likely (Enrolled)</h3>
          <AlertCircle className="w-5 h-5 text-chart-2" />
        </div>
        <p className="text-3xl font-bold text-chart-2" data-testid="text-medium-count">{counts.medium}</p>
        <p className="text-xs text-muted-foreground mt-1">May Require Support</p>
      </div>

      <div className="bg-card border border-card-border rounded-md p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-muted-foreground">On Track (Graduate)</h3>
          <CheckCircle className="w-5 h-5 text-chart-1" />
        </div>
        <p className="text-3xl font-bold text-chart-1" data-testid="text-ontrack-count">{counts.onTrack}</p>
        <p className="text-xs text-muted-foreground mt-1">Low Risk</p>
      </div>
    </div>
  );
}
