import NavBar from "@/components/NavBar";
import DisclaimerBar from "@/components/DisclaimerBar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <NavBar />
      
      <main className="pt-24 px-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="hover-elevate" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="bg-card border border-card-border rounded-md p-8 shadow-sm space-y-6">
          <h1 className="text-3xl font-semibold text-foreground">About Studata</h1>
          
          <div className="space-y-4 text-foreground">
            <h2 className="text-xl font-semibold">Mission</h2>
            <p className="leading-relaxed">
              Studata is an AI-powered student dropout prediction system designed to help college administrators identify students at risk of dropping out or extending their program duration. Our mission is to enable timely intervention and support for students who need it most.
            </p>

            <h2 className="text-xl font-semibold mt-6">How It Works</h2>
            <p className="leading-relaxed">
              The system uses a machine learning model (Decision Tree Classifier) trained on historical student data to predict academic outcomes. The model analyzes multiple factors including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Academic performance (grades, GPA, course completion)</li>
              <li>Demographic information (age, nationality, gender)</li>
              <li>Admission details (previous qualifications, admission grades)</li>
              <li>Economic indicators (scholarship status, tuition payment history)</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6">Risk Categories</h2>
            <div className="space-y-3">
              <div className="p-4 bg-chart-3/10 rounded-md border border-chart-3/20">
                <h3 className="font-semibold text-chart-3 mb-1">Critical (High Risk)</h3>
                <p className="text-sm">Students predicted to drop out. Immediate investigation and intervention essential.</p>
              </div>
              <div className="p-4 bg-chart-2/10 rounded-md border border-chart-2/20">
                <h3 className="font-semibold text-chart-2 mb-1">Extension Likely (Medium Risk)</h3>
                <p className="text-sm">Students predicted to extend their program duration. May require academic support.</p>
              </div>
              <div className="p-4 bg-chart-1/10 rounded-md border border-chart-1/20">
                <h3 className="font-semibold text-chart-1 mb-1">On Track (Low Risk)</h3>
                <p className="text-sm">Students predicted to graduate on time with minimal intervention needed.</p>
              </div>
            </div>

            <h2 className="text-xl font-semibold mt-6">Important Disclaimer</h2>
            <p className="leading-relaxed text-muted-foreground">
              This tool provides predictions based on historical patterns and should be used as one of many indicators. Always consult with students, advisors, and other stakeholders before making any decisions. The model's predictions are not deterministic and should inform, not dictate, interventions.
            </p>
            <img
            src="/about_us.png" // Make sure this path matches the image in your client/public folder
            alt="Educational environment"
            className="mt-8 rounded-lg shadow-xl w-full h-auto object-cover"
          />
          </div>
        </div>

      </main>

      <DisclaimerBar />
    </div>
  );
}
