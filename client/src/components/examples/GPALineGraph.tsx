import GPALineGraph from '../GPALineGraph'

export default function GPALineGraphExample() {
  const mockData = [
    { semester: "Fall 2022", gpa: 3.2 },
    { semester: "Spring 2023", gpa: 2.8 },
    { semester: "Fall 2023", gpa: 2.4 },
    { semester: "Spring 2024", gpa: 2.1 },
    { semester: "Fall 2024", gpa: 1.9 },
  ];

  return <GPALineGraph data={mockData} />
}
