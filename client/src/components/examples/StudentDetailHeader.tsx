import StudentDetailHeader from '../StudentDetailHeader'

export default function StudentDetailHeaderExample() {
  return (
    <StudentDetailHeader 
      student={{
        name: "Emma Martinez",
        course: "Computer Science",
        age: 20,
      }}
    />
  )
}
