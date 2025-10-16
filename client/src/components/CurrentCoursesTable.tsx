import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface Course {
  code: string;
  name: string;
  credits: number;
  grade: string;
}

interface CurrentCoursesTableProps {
  courses: Course[];
}

export default function CurrentCoursesTable({ courses }: CurrentCoursesTableProps) {
  return (
    <div className="bg-card border border-card-border rounded-md shadow-sm">
      <div className="p-6 border-b border-card-border">
        <h3 className="text-lg font-semibold text-foreground">Current Semester Courses</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course Code</TableHead>
            <TableHead>Course Name</TableHead>
            <TableHead>Credits</TableHead>
            <TableHead>Current Grade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course, idx) => (
            <TableRow key={idx} data-testid={`row-course-${idx}`}>
              <TableCell className="font-medium">{course.code}</TableCell>
              <TableCell>{course.name}</TableCell>
              <TableCell>{course.credits}</TableCell>
              <TableCell>{course.grade}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
