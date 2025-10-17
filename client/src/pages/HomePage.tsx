import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import DisclaimerBar from "@/components/DisclaimerBar";
import SearchFilterBar, { type SearchFilters } from "@/components/SearchFilterBar";
import RiskPieChart, { type RiskData } from "@/components/RiskPieChart";
import WelcomeSection from "@/components/WelcomeSection";
import RiskCategoryTiles, { type RiskCounts } from "@/components/RiskCategoryTiles";
import StudentsTable, { type Student } from "@/components/StudentsTable";

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

export default function HomePage() {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: "",
    course: "all",
    program: "all",
    cohort: "all",
    riskCategory: "all",
  });

  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [riskData, setRiskData] = useState<RiskData>({ lowRisk: 0, mediumRisk: 0, highRisk: 0 });
  const [riskCounts, setRiskCounts] = useState<RiskCounts>({ critical: 0, medium: 0, onTrack: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8080/data")
      .then((res) => res.json())
      .then((data) => {
        const formattedStudents = data.map((student: any) => ({
          id: student.id.toString(),
          name: `Student ${student.id}`,
          course: courseMap[student.Course] || "Unknown Course",
          program: "Undergraduate",
          cohort: String(student['Age at enrollment'] > 23 ? 2020 : 2022),
          // FIX: Keep currentGPA as a number, not a string.
          currentGPA: student["Curricular units 2nd sem (grade)"] > 0 ? student["Curricular units 2nd sem (grade)"] / 5 : 0,
          riskLevel: student.Target === "Dropout" ? "high" : student.Target === "Enrolled" ? "medium" : "low",
        }));
        setAllStudents(formattedStudents);
        setFilteredStudents(formattedStudents);

        const lowRisk = data.filter((s: any) => s.Target === "Graduate").length;
        const mediumRisk = data.filter((s: any) => s.Target === "Enrolled").length;
        const highRisk = data.filter((s: any) => s.Target === "Dropout").length;

        setRiskData({ lowRisk, mediumRisk, highRisk });
        setRiskCounts({ onTrack: lowRisk, medium: mediumRisk, critical: highRisk });
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch student data:", error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let studentsToFilter = [...allStudents];

    if (filters.searchTerm) {
        studentsToFilter = studentsToFilter.filter(student =>
            student.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
            student.id.toLowerCase().includes(filters.searchTerm.toLowerCase())
        );
    }
    
    if (filters.riskCategory !== "all") {
        studentsToFilter = studentsToFilter.filter(student => student.riskLevel === filters.riskCategory);
    }

    setFilteredStudents(studentsToFilter);
  }, [filters, allStudents]);


  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading student data...</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <NavBar />

      <main className="pt-24 px-6 max-w-7xl mx-auto">
        <div className="space-y-8">
          <div className="rightBox flex flex-col">
            <SearchFilterBar onSearch={handleSearch} />
            <div className="RiskBox grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <WelcomeSection />
              <RiskPieChart data={riskData} />
            </div>
          </div>

          <RiskCategoryTiles counts={riskCounts} />

          <StudentsTable students={filteredStudents} />
        </div>
      </main>

      <DisclaimerBar />
    </div>
  );
}

