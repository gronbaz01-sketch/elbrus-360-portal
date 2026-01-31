import { cn } from "@/lib/utils";

interface FilterChipsProps {
  filters: { value: string; label: string }[];
  selected: string;
  onChange: (value: string) => void;
}

export const FilterChips = ({ filters, selected, onChange }: FilterChipsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onChange(filter.value)}
          className={cn(
            "filter-chip",
            selected === filter.value && "filter-chip-active"
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};
