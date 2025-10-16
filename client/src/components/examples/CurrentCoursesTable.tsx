import CurrentCoursesTable from '../CurrentCoursesTable'

export default function CurrentCoursesTableExample() {
  const mockCourses = [
    { code: "CS301", name: "Data Structures", credits: 4, grade: "C+" },
    { code: "CS302", name: "Algorithms", credits: 4, grade: "B-" },
    { code: "MATH201", name: "Calculus II", credits: 3, grade: "C" },
    { code: "ENG101", name: "Technical Writing", credits: 3, grade: "B" },
  ];

  return <CurrentCoursesTable courses={mockCourses} />
}
