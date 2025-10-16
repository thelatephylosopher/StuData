import { useRoute } from "wouter";
import NavBar from "@/components/NavBar";
import DisclaimerBar from "@/components/DisclaimerBar";
import StudentDetailHeader, { type StudentInfo } from "@/components/StudentDetailHeader";
import MetricTiles, { type MetricData } from "@/components/MetricTiles";
import CurrentCoursesTable, { type Course } from "@/components/CurrentCoursesTable";
import GPALineGraph, { type GPADataPoint } from "@/components/GPALineGraph";
import ModelPrediction, { type PredictionFactor } from "@/components/ModelPrediction";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function StudentDetailPage() {
  const [, params] = useRoute("/student/:id");
  const studentId = params?.id;

  const studentInfo: StudentInfo = {
    name: "Emma Martinez",
    course: "Computer Science",
    yearJoined: 2022,
    idealGraduationYear: 2026,
  };

  const metrics: MetricData = {
    creditsCompleted: 85,
    creditsRequired: 120,
    currentGPA: 2.1,
    lastSemesterGPA: 1.9,
  };

  const courses: Course[] = [
    { code: "CS301", name: "Data Structures", credits: 4, grade: "C+" },
    { code: "CS302", name: "Algorithms", credits: 4, grade: "B-" },
    { code: "MATH201", name: "Calculus II", credits: 3, grade: "C" },
    { code: "ENG101", name: "Technical Writing", credits: 3, grade: "B" },
  ];

  const gpaData: GPADataPoint[] = [
    { semester: "Fall 2022", gpa: 3.2 },
    { semester: "Spring 2023", gpa: 2.8 },
    { semester: "Fall 2023", gpa: 2.4 },
    { semester: "Spring 2024", gpa: 2.1 },
    { semester: "Fall 2024", gpa: 1.9 },
  ];

  const predictionFactors: PredictionFactor[] = [
    { name: "Curricular units 2nd sem (grade)", importance: 24 },
    { name: "Curricular units 1st sem (grade)", importance: 18 },
    { name: "Previous qualification (grade)", importance: 15 },
    { name: "Admission grade", importance: 12 },
    { name: "Age at enrollment", importance: 10 },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <NavBar />
      
      <main className="pt-24 px-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="hover-elevate" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          <StudentDetailHeader student={studentInfo} />

          <MetricTiles metrics={metrics} />

          <CurrentCoursesTable courses={courses} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GPALineGraph data={gpaData} />
            </div>
            <div>
              <ModelPrediction riskLevel="critical" factors={predictionFactors} />
            </div>
          </div>
        </div>
      </main>

      <DisclaimerBar />
    </div>
  );
}
