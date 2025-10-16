import { useState } from "react";
import NavBar from "@/components/NavBar";
import DisclaimerBar from "@/components/DisclaimerBar";
import SearchFilterBar, { type SearchFilters } from "@/components/SearchFilterBar";
import RiskPieChart, { type RiskData } from "@/components/RiskPieChart";
import WelcomeSection from "@/components/WelcomeSection";
import RiskCategoryTiles, { type RiskCounts } from "@/components/RiskCategoryTiles";
import StudentsTable, { type Student } from "@/components/StudentsTable";

export default function HomePage() {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: "",
    course: "all",
    program: "all",
    cohort: "all",
    riskCategory: "all",
  });

  const riskData: RiskData = {
    lowRisk: 850,
    mediumRisk: 320,
    highRisk: 180,
  };

  const riskCounts: RiskCounts = {
    critical: 180,
    medium: 320,
    onTrack: 850,
  };

  const mockStudents: Student[] = [
    { id: "1", name: "Emma Martinez", course: "Computer Science", program: "Undergraduate", cohort: "2022", currentGPA: 2.1, riskLevel: "high" },
    { id: "2", name: "Michael Chen", course: "Engineering", program: "Undergraduate", cohort: "2023", currentGPA: 2.3, riskLevel: "high" },
    { id: "3", name: "Sarah Thompson", course: "Business", program: "Graduate", cohort: "2021", currentGPA: 2.0, riskLevel: "high" },
    { id: "4", name: "James Wilson", course: "Mathematics", program: "Undergraduate", cohort: "2022", currentGPA: 2.4, riskLevel: "high" },
    { id: "5", name: "Olivia Davis", course: "Computer Science", program: "PhD", cohort: "2020", currentGPA: 2.2, riskLevel: "high" },
    { id: "6", name: "Robert Garcia", course: "Engineering", program: "Undergraduate", cohort: "2023", currentGPA: 2.5, riskLevel: "high" },
    { id: "7", name: "Jessica Lee", course: "Business", program: "Graduate", cohort: "2022", currentGPA: 1.9, riskLevel: "high" },
    { id: "8", name: "Daniel Brown", course: "Mathematics", program: "Undergraduate", cohort: "2021", currentGPA: 2.3, riskLevel: "high" },
    { id: "9", name: "Sophie Anderson", course: "Computer Science", program: "Undergraduate", cohort: "2023", currentGPA: 2.1, riskLevel: "high" },
    { id: "10", name: "Matthew Taylor", course: "Engineering", program: "PhD", cohort: "2020", currentGPA: 2.0, riskLevel: "high" },
  ];

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    console.log("Search filters updated:", newFilters);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <NavBar />
      
      <main className="pt-24 px-6 max-w-7xl mx-auto">
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SearchFilterBar onSearch={handleSearch} />
            </div>
            <div>
              <RiskPieChart data={riskData} />
            </div>
          </div>

          <WelcomeSection />

          <RiskCategoryTiles counts={riskCounts} />

          <StudentsTable students={mockStudents} />
        </div>
      </main>

      <DisclaimerBar />
    </div>
  );
}
