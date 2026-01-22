import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, X } from "lucide-react";
import { ExpertFilters as FiltersType } from "@/hooks/useExperts";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

interface ExpertFiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: FiltersType) => void;
  cities: string[];
  categories: string[];
}

const ExpertFilters = ({
  filters,
  onFiltersChange,
  cities,
  categories,
}: ExpertFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = <K extends keyof FiltersType>(
    key: K,
    value: FiltersType[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      category: "All",
      city: "all",
      consultationType: "all",
      gender: "all",
      minRating: undefined,
      maxPrice: undefined,
    });
  };

  const activeFiltersCount = [
    filters.category && filters.category !== "All",
    filters.city && filters.city !== "all",
    filters.consultationType && filters.consultationType !== "all",
    filters.gender && filters.gender !== "all",
    filters.minRating,
    filters.maxPrice,
  ].filter(Boolean).length;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Specjalizacja
        </label>
        <Select
          value={filters.category || "All"}
          onValueChange={(value) => updateFilter("category", value)}
        >
          <SelectTrigger className="w-full bg-background">
            <SelectValue placeholder="Wszystkie specjalizacje" />
          </SelectTrigger>
          <SelectContent className="bg-background border border-border z-50">
            <SelectItem value="All">Wszystkie</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* City */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Miasto</label>
        <Select
          value={filters.city || "all"}
          onValueChange={(value) => updateFilter("city", value)}
        >
          <SelectTrigger className="w-full bg-background">
            <SelectValue placeholder="Wszystkie miasta" />
          </SelectTrigger>
          <SelectContent className="bg-background border border-border z-50">
            <SelectItem value="all">Wszystkie miasta</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Consultation Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Typ wizyty
        </label>
        <Select
          value={filters.consultationType || "all"}
          onValueChange={(value) =>
            updateFilter(
              "consultationType",
              value as "all" | "online" | "in_person"
            )
          }
        >
          <SelectTrigger className="w-full bg-background">
            <SelectValue placeholder="Wszystkie typy" />
          </SelectTrigger>
          <SelectContent className="bg-background border border-border z-50">
            <SelectItem value="all">Wszystkie typy</SelectItem>
            <SelectItem value="online">Online (wideo)</SelectItem>
            <SelectItem value="in_person">Stacjonarnie</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Płeć specjalisty
        </label>
        <Select
          value={filters.gender || "all"}
          onValueChange={(value) =>
            updateFilter("gender", value as "all" | "male" | "female")
          }
        >
          <SelectTrigger className="w-full bg-background">
            <SelectValue placeholder="Wszyscy" />
          </SelectTrigger>
          <SelectContent className="bg-background border border-border z-50">
            <SelectItem value="all">Wszyscy</SelectItem>
            <SelectItem value="female">Kobieta</SelectItem>
            <SelectItem value="male">Mężczyzna</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Min Rating */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          Minimalna ocena: {filters.minRating ? `${filters.minRating}+` : "Brak"}
        </label>
        <Slider
          value={[filters.minRating || 0]}
          onValueChange={([value]) =>
            updateFilter("minRating", value === 0 ? undefined : value)
          }
          min={0}
          max={5}
          step={0.5}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Brak filtra</span>
          <span>5.0</span>
        </div>
      </div>

      {/* Max Price */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          Maksymalna cena:{" "}
          {filters.maxPrice ? `${filters.maxPrice} zł` : "Brak limitu"}
        </label>
        <Slider
          value={[filters.maxPrice || 500]}
          onValueChange={([value]) =>
            updateFilter("maxPrice", value === 500 ? undefined : value)
          }
          min={50}
          max={500}
          step={10}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>50 zł</span>
          <span>500+ zł</span>
        </div>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full"
        >
          <X className="w-4 h-4 mr-2" />
          Wyczyść filtry ({activeFiltersCount})
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Search and Filter Button Row */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Szukaj po nazwisku lub specjalizacji..."
            value={filters.search || ""}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-12 h-12 rounded-xl"
          />
        </div>

        {/* Mobile: Filter Sheet */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full h-12">
                <Filter className="w-5 h-5 mr-2" />
                Filtry
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh]">
              <SheetHeader>
                <SheetTitle>Filtry wyszukiwania</SheetTitle>
              </SheetHeader>
              <div className="mt-6 overflow-y-auto">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop: Inline Quick Filters */}
        <div className="hidden md:flex gap-2 flex-wrap">
          <Select
            value={filters.city || "all"}
            onValueChange={(value) => updateFilter("city", value)}
          >
            <SelectTrigger className="w-[150px] bg-background">
              <SelectValue placeholder="Miasto" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border z-50">
              <SelectItem value="all">Wszystkie miasta</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.consultationType || "all"}
            onValueChange={(value) =>
              updateFilter(
                "consultationType",
                value as "all" | "online" | "in_person"
              )
            }
          >
            <SelectTrigger className="w-[150px] bg-background">
              <SelectValue placeholder="Typ wizyty" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border z-50">
              <SelectItem value="all">Wszystkie typy</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="in_person">Stacjonarnie</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.gender || "all"}
            onValueChange={(value) =>
              updateFilter("gender", value as "all" | "male" | "female")
            }
          >
            <SelectTrigger className="w-[130px] bg-background">
              <SelectValue placeholder="Płeć" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border z-50">
              <SelectItem value="all">Wszyscy</SelectItem>
              <SelectItem value="female">Kobieta</SelectItem>
              <SelectItem value="male">Mężczyzna</SelectItem>
            </SelectContent>
          </Select>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="default">
                <Filter className="w-4 h-4 mr-2" />
                Więcej filtrów
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Wszystkie filtry</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default ExpertFilters;
