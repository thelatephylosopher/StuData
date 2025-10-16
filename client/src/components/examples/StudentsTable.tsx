import StudentsTable from '../StudentsTable'

export default function StudentsTableExample() {
  const mockStudents = [
    { id: "1", name: "Emma Martinez", course: "Computer Science", program: "Undergraduate", cohort: "2022", currentGPA: 2.1, riskLevel: "high" as const },
    { id: "2", name: "Michael Chen", course: "Engineering", program: "Undergraduate", cohort: "2023", currentGPA: 2.3, riskLevel: "high" as const },
    { id: "3", name: "Sarah Thompson", course: "Business", program: "Graduate", cohort: "2021", currentGPA: 2.0, riskLevel: "high" as const },
    { id: "4", name: "James Wilson", course: "Mathematics", program: "Undergraduate", cohort: "2022", currentGPA: 2.4, riskLevel: "high" as const },
    { id: "5", name: "Olivia Davis", course: "Computer Science", program: "PhD", cohort: "2020", currentGPA: 2.2, riskLevel: "high" as const },
  ];

  return <StudentsTable students={mockStudents} />
}
