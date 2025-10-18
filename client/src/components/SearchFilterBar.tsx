import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchFilterBarProps {
  onSearch?: (filters: SearchFilters) => void;
  courses: string[];
}

export interface SearchFilters {
  searchTerm: string;
  course: string;
  program: string;
  cohort: string;
  riskCategory: string;
}

export default function SearchFilterBar({ onSearch, courses = [] }: SearchFilterBarProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: "",
    course: "all",
    program: "all",
    cohort: "all",
    riskCategory: "all",
  });

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    // Propagate changes to parent immediately
    onSearch?.(newFilters);
  };

  return (
    <div className="bg-card border border-card-border rounded-md p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-grow min-w-[200px] sm:min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name..."
            className="pl-10"
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
            data-testid="input-search"
          />
        </div>
        
        <div className="flex flex-wrap sm:flex-nowrap gap-4">
          <Select
            value={filters.course}
            onValueChange={(value) => handleFilterChange("course", value)}
          >
            <SelectTrigger className="w-full sm:w-[200px]" data-testid="select-course">
              <SelectValue placeholder="Select Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map(course => (
                <SelectItem key={course} value={course}>
                  {course}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

