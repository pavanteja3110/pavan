import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

export default function FiltersPanel({ filters, onFiltersChange }) {
  const updateFilter = (key, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-gray-600">
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">Filters:</span>
      </div>
      
      <Select value={filters.verdict} onValueChange={(value) => updateFilter('verdict', value)}>
        <SelectTrigger className="w-32 border-gray-200/60">
          <SelectValue placeholder="Verdict" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Verdicts</SelectItem>
          <SelectItem value="high">High Fit</SelectItem>
          <SelectItem value="medium">Medium Fit</SelectItem>
          <SelectItem value="low">Low Fit</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.scoreRange} onValueChange={(value) => updateFilter('scoreRange', value)}>
        <SelectTrigger className="w-32 border-gray-200/60">
          <SelectValue placeholder="Score" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Scores</SelectItem>
          <SelectItem value="high">80-100</SelectItem>
          <SelectItem value="medium">60-79</SelectItem>
          <SelectItem value="low">0-59</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}