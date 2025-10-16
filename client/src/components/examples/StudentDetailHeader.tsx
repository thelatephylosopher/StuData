import StudentDetailHeader from '../StudentDetailHeader'

export default function StudentDetailHeaderExample() {
  return (
    <StudentDetailHeader 
      student={{
        name: "Emma Martinez",
        course: "Computer Science",
        yearJoined: 2022,
        idealGraduationYear: 2026
      }}
    />
  )
}
