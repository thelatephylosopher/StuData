import { AlertTriangle } from "lucide-react";

export default function DisclaimerBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-accent border-t border-accent-border py-3 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        <AlertTriangle className="w-4 h-4 text-chart-2 flex-shrink-0" />
        <p className="text-xs text-center text-accent-foreground">
          Studata uses available data, past trends, and model-based predictions to generate outcomes. These should only be viewed as indicators. Do not make any decisions based solely on the model's outcomes. Consult all involved parties before deciding on any course of action.
        </p>
      </div>
    </div>
  );
}
