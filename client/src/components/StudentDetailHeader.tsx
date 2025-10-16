import { User, Calendar, GraduationCap } from "lucide-react";

export interface StudentInfo {
  name: string;
  course: string;
  yearJoined: number;
  idealGraduationYear: number;
}

interface StudentDetailHeaderProps {
  student: StudentInfo;
}

export default function StudentDetailHeader({ student }: StudentDetailHeaderProps) {
  return (
    <div className="bg-card border border-card-border rounded-md p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <User className="w-8 h-8 text-primary" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-foreground mb-2" data-testid="text-student-name">
            {student.name}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground" data-testid="text-course">{student.course}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Joined:</span>
              <span className="text-foreground" data-testid="text-year-joined">{student.yearJoined}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Expected Graduation:</span>
              <span className="text-foreground" data-testid="text-graduation-year">{student.idealGraduationYear}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
