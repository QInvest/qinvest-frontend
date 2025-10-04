import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  loading?: boolean;
}

export function SearchBar({ placeholder, value, onChange, loading = false }: SearchBarProps) {
  if (loading) {
    return <Skeleton className="h-10 w-full" />;
  }

  return (
    <div className="relative" role="search">
      <Search 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" 
        aria-hidden="true"
      />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
        aria-label="Buscar oportunidades"
      />
    </div>
  );
}
