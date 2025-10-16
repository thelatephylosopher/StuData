import { useState } from "react";
import { useLocation } from "wouter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export interface Student {
  id: string;
  name: string;
  course: string;
  program: string;
  cohort: string;
  currentGPA: number;
  riskLevel: "high" | "medium" | "low";
}

interface StudentsTableProps {
  students: Student[];
}

export default function StudentsTable({ students }: StudentsTableProps) {
  const [, setLocation] = useLocation();
  const [topN, setTopN] = useState("10");
  const [riskFilter, setRiskFilter] = useState("high");

  const filteredStudents = students
    .filter(s => {
      if (riskFilter === "all") return true;
      return s.riskLevel === riskFilter;
    })
    .slice(0, parseInt(topN));

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "high":
        return <Badge className="bg-chart-3 text-destructive-foreground border-destructive-border" data-testid="badge-risk-high">Critical</Badge>;
      case "medium":
        return <Badge className="bg-chart-2 text-card-foreground border-chart-2" data-testid="badge-risk-medium">Extension Likely</Badge>;
      case "low":
        return <Badge className="bg-chart-1 text-primary-foreground border-primary-border" data-testid="badge-risk-low">On Track</Badge>;
      default:
        return null;
    }
  };

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case "high": return "Critical";
      case "medium": return "Extension Likely";
      case "low": return "On Track";
      default: return "All";
    }
  };

  return (
    <div className="bg-card border border-card-border rounded-md shadow-sm">
      <div className="p-6 border-b border-card-border">
        <div className="flex items-center gap-2 text-sm text-foreground">
          <span>Showing the top</span>
          <Select value={topN} onValueChange={setTopN}>
            <SelectTrigger className="w-20" data-testid="select-topn">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span>students in the</span>
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-40" data-testid="select-risk-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="high">Critical</SelectItem>
              <SelectItem value="medium">Extension Likely</SelectItem>
              <SelectItem value="low">On Track</SelectItem>
            </SelectContent>
          </Select>
          <span>category</span>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student Name</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Program</TableHead>
            <TableHead>Cohort</TableHead>
            <TableHead>Current GPA</TableHead>
            <TableHead>Predicted Risk</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStudents.map((student) => (
            <TableRow
              key={student.id}
              className="cursor-pointer hover-elevate"
              onClick={() => {
                console.log('Navigating to student:', student.id);
                setLocation(`/student/${student.id}`);
              }}
              data-testid={`row-student-${student.id}`}
            >
              <TableCell className="font-medium" data-testid={`text-name-${student.id}`}>{student.name}</TableCell>
              <TableCell>{student.course}</TableCell>
              <TableCell>{student.program}</TableCell>
              <TableCell>{student.cohort}</TableCell>
              <TableCell>{student.currentGPA.toFixed(2)}</TableCell>
              <TableCell>{getRiskBadge(student.riskLevel)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
