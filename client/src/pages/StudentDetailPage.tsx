import { useState, useEffect } from "react";
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

const courseMap: { [key: number]: string } = {
    171: "Biofuel Production Tech",
    9003: "Agronomy",
    9070: "Communication Design",
    9085: "Equinculture",
    9119: "Informatics Engineering",
    9130: "Equine Sports Management",
    9147: "Management",
    9238: "Social Service",
    9254: "Tourism",
    9500: "Nursing",
    9556: "Oral Hygiene",
    9670: "Advertising Management",
    9773: "Basic Education",
    9853: "Management (Evening)",
    9991: "Journalism and Communication",
    33: "Veterinary Nursing",
    8014: "Social Service (Evening)",
  };

export default function StudentDetailPage() {
  const [, params] = useRoute("/student/:id");
  const studentId = params?.id;

  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [metrics, setMetrics] = useState<MetricData | null>(null);
  const [courses] = useState<Course[]>([ // Courses are static examples for now
    { code: "CS301", name: "Data Structures", credits: 4, grade: "C+" },
    { code: "CS302", name: "Algorithms", credits: 4, grade: "B-" },
    { code: "MATH201", name: "Calculus II", credits: 3, grade: "C" },
    { code: "ENG101", name: "Technical Writing", credits: 3, grade: "B" },
  ]);
  const [gpaData, setGpaData] = useState<GPADataPoint[]>([]);
  const [predictionFactors] = useState<PredictionFactor[]>([ // Factors are static for now
    { name: "Curricular units 2nd sem (grade)", importance: 24 },
    { name: "Curricular units 1st sem (grade)", importance: 18 },
    { name: "Previous qualification (grade)", importance: 15 },
    { name: "Admission grade", importance: 12 },
    { name: "Age at enrollment", importance: 10 },
  ]);
  const [riskLevel, setRiskLevel] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (studentId) {
      fetch(`https://studata.onrender.com/student/${studentId}`)
        .then((res) => res.json())
        .then((data) => {
          const age = data['Age at enrollment'];
          setStudentInfo({
            name: `Student ${data.id}`,
            course: courseMap[data.Course] || "Unknown Course",
            age: age,
          });
          
          const gpa1 = data["Curricular units 1st sem (grade)"] > 0 ? data["Curricular units 1st sem (grade)"] / 5 : 2.5 + Math.random();
          const gpa2 = data["Curricular units 2nd sem (grade)"] > 0 ? data["Curricular units 2nd sem (grade)"] / 5 : gpa1 - (0.2 + Math.random() * 0.5);

          setMetrics({
            creditsCompleted: data["Curricular units 1st sem (approved)"] + data["Curricular units 2nd sem (approved)"],
            creditsRequired: 120, // Placeholder
            currentGPA: parseFloat(gpa2.toFixed(2)),
            lastSemesterGPA: parseFloat(gpa1.toFixed(2)),
          });

          setGpaData([
            { semester: "Fall 2022", gpa: parseFloat((gpa1 + 0.8 + Math.random()).toFixed(2))},
            { semester: "Spring 2023", gpa: parseFloat((gpa1 + 0.4 + Math.random() * 0.5).toFixed(2)) },
            { semester: "Fall 2023", gpa: parseFloat((gpa1 + 0.2 + Math.random() * 0.2).toFixed(2)) },
            { semester: "Spring 2024", gpa: parseFloat(gpa1.toFixed(2)) },
            { semester: "Fall 2024", gpa: parseFloat(gpa2.toFixed(2)) },
          ]);

          setRiskLevel(data.Target);
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Failed to fetch student data:", error);
          setIsLoading(false);
        });
    }
  }, [studentId]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading student details...</div>;
  }
  
  if (!studentInfo || !metrics) {
    return <div className="flex justify-center items-center h-screen">Could not load student data.</div>;
  }

  const getRiskLevelForPrediction = () => {
    switch (riskLevel) {
        case "Dropout": return "critical";
        case "Enrolled": return "medium";
        case "Graduate": return "on-track";
        default: return "medium";
    }
  };


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
              <ModelPrediction riskLevel={getRiskLevelForPrediction()} factors={predictionFactors} />
            </div>
          </div>
        </div>
      </main>

      <DisclaimerBar />
    </div>
  );
}
