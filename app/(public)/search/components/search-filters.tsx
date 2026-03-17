"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import {
  PROPERTY_TYPES,
  FURNISHED_OPTIONS,
  GENDER_OPTIONS,
  formatPrice,
} from "@/lib/constants";
import type { City, District } from "@/lib/types";

interface SearchFiltersProps {
  keyword: string;
  district: string;
  city: string;
  propertyType: string;
  furnished: string;
  gender: string;
  priceRange: [number, number];
  districts: District[];
  cities: City[];
  hasFilters: boolean;
  onKeywordChange: (value: string) => void;
  onDistrictChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onPropertyTypeChange: (value: string) => void;
  onFurnishedChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  onPriceRangeChange: (value: [number, number]) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export function SearchFilters(props: SearchFiltersProps) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <Label className="mb-2 block text-sm font-medium">District</Label>
        <Select value={props.district} onValueChange={props.onDistrictChange}>
          <SelectTrigger>
            <SelectValue placeholder="All Districts" />
          </SelectTrigger>
          <SelectContent>
            {props.districts.map((district) => (
              <SelectItem key={district.id} value={district.slug}>
                {district.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {props.cities.length > 0 && (
        <div>
          <Label className="mb-2 block text-sm font-medium">City</Label>
          <Select value={props.city} onValueChange={props.onCityChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              {props.cities.map((city) => (
                <SelectItem key={city.id} value={city.slug}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label className="mb-2 block text-sm font-medium">Property Type</Label>
        <Select value={props.propertyType} onValueChange={props.onPropertyTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            {PROPERTY_TYPES.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">Furnished</Label>
        <Select value={props.furnished} onValueChange={props.onFurnishedChange}>
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            {FURNISHED_OPTIONS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">Gender Preference</Label>
        <Select value={props.gender} onValueChange={props.onGenderChange}>
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            {GENDER_OPTIONS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">
          Price Range: {formatPrice(props.priceRange[0])} - {formatPrice(props.priceRange[1])}
        </Label>
        <Slider
          min={0}
          max={200000}
          step={5000}
          value={props.priceRange}
          onValueChange={(value) => props.onPriceRangeChange(value as [number, number])}
          className="mt-3"
        />
      </div>

      <Button onClick={props.onApplyFilters} className="w-full text-white">
        Apply Filters
      </Button>

      {props.hasFilters && (
        <Button variant="ghost" onClick={props.onClearFilters} className="w-full text-muted-foreground">
          <X className="mr-2 h-4 w-4" />
          Clear All Filters
        </Button>
      )}
    </div>
  );
}

interface SearchBarProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function SearchBar({ keyword, onKeywordChange, onSubmit }: SearchBarProps) {
  return (
    <div className="mb-10 group">
      <form onSubmit={onSubmit} className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search by keywords, location, or school name..."
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            className="h-16 pl-14 pr-6 rounded-[2rem] text-lg font-medium border-border/50 bg-card shadow-lg shadow-black/5 focus-visible:ring-primary/20"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="h-16 px-10 rounded-[2rem] font-black text-lg shadow-xl shadow-primary/20 group-hover:scale-[1.02] transition-all"
        >
          Search Now
        </Button>
      </form>
    </div>
  );
}

interface ActiveFiltersProps {
  keyword: string;
  district: string;
  propertyType: string;
  onRemoveKeyword: () => void;
  onRemoveDistrict: () => void;
  onRemovePropertyType: () => void;
  onClearFilters: () => void;
}

export function ActiveFilters({
  keyword,
  district,
  propertyType,
  onRemoveKeyword,
  onRemoveDistrict,
  onRemovePropertyType,
  onClearFilters,
}: ActiveFiltersProps) {
  return (
    <div className="mb-8 flex flex-wrap items-center gap-3 animate-fade-in">
      <span className="text-xs font-black text-muted-foreground uppercase tracking-widest mr-1">
        Active Filters:
      </span>
      {keyword && (
        <Badge variant="secondary" className="gap-2 px-4 py-1.5 rounded-full border-border bg-card text-sm font-bold soft-shadow">
          {`\"${keyword}\"`}
          <button onClick={onRemoveKeyword} className="hover:text-primary transition-colors">
            <X className="h-4 w-4" />
          </button>
        </Badge>
      )}
      {district && (
        <Badge variant="secondary" className="gap-2 px-4 py-1.5 rounded-full border-border bg-card text-sm font-bold soft-shadow capitalize">
          {district}
          <button onClick={onRemoveDistrict} className="hover:text-primary transition-colors">
            <X className="h-4 w-4" />
          </button>
        </Badge>
      )}
      {propertyType && (
        <Badge variant="secondary" className="gap-2 px-4 py-1.5 rounded-full border-border bg-card text-sm font-bold soft-shadow capitalize">
          {propertyType}
          <button onClick={onRemovePropertyType} className="hover:text-primary transition-colors">
            <X className="h-4 w-4" />
          </button>
        </Badge>
      )}
      <Button variant="link" onClick={onClearFilters} className="text-xs font-black text-primary p-0 h-auto hover:no-underline">
        Reset All
      </Button>
    </div>
  );
}
