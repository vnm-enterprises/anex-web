"use client"

import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Search,
  SlidersHorizontal,
} from "lucide-react"
import {
  SORT_OPTIONS,
  ITEMS_PER_PAGE,
} from "@/lib/constants"
import { SearchBar, SearchFilters, ActiveFilters } from "./components/search-filters"
import { SearchResults } from "./components/search-results"
import { useSearchHook } from "@/hooks/use-search-hook"
import { useDebounce } from "@/hooks/use-debounce"

export function SearchClient() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const getSafePage = () => {
    const parsed = Number(searchParams.get("page") || "1")
    return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1
  }

  const [keyword, setKeyword] = useState(searchParams.get("q") || "")
  const [district, setDistrict] = useState(searchParams.get("district") || "")
  const [city, setCity] = useState(searchParams.get("city") || "")
  const [propertyType, setPropertyType] = useState(
    searchParams.get("type") || ""
  )
  const [furnished, setFurnished] = useState(
    searchParams.get("furnished") || ""
  )
  const [gender, setGender] = useState(searchParams.get("gender") || "")
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || 200000,
  ])
  const [sort, setSort] = useState(searchParams.get("sort") || "featured")
  const [page, setPage] = useState(getSafePage())
  const debouncedKeyword = useDebounce(keyword, 450)

  const searchFilters = useMemo(
    () => ({
      keyword: debouncedKeyword,
      district,
      city,
      propertyType,
      furnished,
      gender,
      priceRange,
      sort,
      page,
    }),
    [debouncedKeyword, district, city, propertyType, furnished, gender, priceRange, sort, page],
  )

  const { districts, cities, listings, totalCount, loading, error } = useSearchHook(searchFilters)

  const updateUrl = (targetPage = page) => {
    const params = new URLSearchParams()
    if (keyword.trim()) params.set("q", keyword.trim())
    if (district) params.set("district", district)
    if (city) params.set("city", city)
    if (propertyType) params.set("type", propertyType)
    if (furnished) params.set("furnished", furnished)
    if (gender) params.set("gender", gender)
    if (priceRange[0] > 0) params.set("minPrice", String(priceRange[0]))
    if (priceRange[1] < 200000) params.set("maxPrice", String(priceRange[1]))
    if (sort !== "featured") params.set("sort", sort)
    if (targetPage > 1) params.set("page", String(targetPage))
    router.replace(`/search?${params.toString()}`, { scroll: false })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    updateUrl(1)
  }

  const applyFilters = () => {
    setPage(1)
    updateUrl(1)
  }

  const clearFilters = () => {
    setKeyword("")
    setDistrict("")
    setCity("")
    setPropertyType("")
    setFurnished("")
    setGender("")
    setPriceRange([0, 200000])
    setSort("featured")
    setPage(1)
    router.replace("/search")
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)
  const hasFilters = keyword || district || propertyType || furnished || gender || priceRange[0] > 0 || priceRange[1] < 200000

  const filterContent = (
    <SearchFilters
      keyword={keyword}
      district={district}
      city={city}
      propertyType={propertyType}
      furnished={furnished}
      gender={gender}
      priceRange={priceRange}
      districts={districts}
      cities={cities}
      hasFilters={Boolean(hasFilters)}
      onKeywordChange={setKeyword}
      onDistrictChange={(value) => {
        setDistrict(value)
        setCity("")
        setPage(1)
      }}
      onCityChange={(value) => {
        setCity(value)
        setPage(1)
      }}
      onPropertyTypeChange={(value) => {
        setPropertyType(value)
        setPage(1)
      }}
      onFurnishedChange={(value) => {
        setFurnished(value)
        setPage(1)
      }}
      onGenderChange={(value) => {
        setGender(value)
        setPage(1)
      }}
      onPriceRangeChange={(value) => {
        setPriceRange(value)
        setPage(1)
      }}
      onApplyFilters={applyFilters}
      onClearFilters={clearFilters}
    />
  )

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 mt-16 animate-fade-in">
      <div className="relative overflow-hidden mb-10 rounded-[2.5rem] border border-border/60 bg-gradient-to-br from-card via-muted/25 to-accent/10 p-8 md:p-12 soft-shadow">
        <div className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-accent/15 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-3">
             <Search className="h-3 w-3" />
             Property Search
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">
            Find your <span className="text-primary italic">Perfect Place</span>
          </h1>
          <p className="mt-3 text-muted-foreground font-medium max-w-2xl">
             {totalCount} {totalCount === 1 ? "property" : "properties"} available for rent
          </p>
          </div>

          <div className="flex items-center gap-3">
           <Select value={sort} onValueChange={(v) => { setSort(v); setPage(1); updateUrl(1) }}>
            <SelectTrigger className="w-48 h-12 rounded-2xl border-border bg-card hidden md:flex font-bold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border shadow-2xl">
              {SORT_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value} className="font-medium">
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl shrink-0 lg:hidden shadow-sm">
                <SlidersHorizontal className="h-5 w-5" />
                <span className="sr-only">Filters</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-md border-r-0 rounded-r-[2rem]">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-2xl font-black tracking-tighter">Adjust Filters</SheetTitle>
              </SheetHeader>
              <div className="pb-10 overflow-y-auto h-full">{filterContent}</div>
            </SheetContent>
          </Sheet>
          </div>
        </div>
      </div>

      <SearchBar
        keyword={keyword}
        onKeywordChange={(value) => {
          setKeyword(value)
          setPage(1)
        }}
        onSubmit={handleSearch}
      />

      {hasFilters && (
        <ActiveFilters
          keyword={keyword}
          district={district}
          propertyType={propertyType}
          onRemoveKeyword={() => setKeyword("")}
          onRemoveDistrict={() => {
            setDistrict("")
            setCity("")
          }}
          onRemovePropertyType={() => setPropertyType("")}
          onClearFilters={clearFilters}
        />
      )}

      <div className="flex flex-col lg:flex-row gap-10">
        <aside className="hidden w-80 shrink-0 lg:block">
          <div className="sticky top-24 rounded-[2.5rem] border border-border/50 bg-gradient-to-br from-card to-muted/15 p-8 soft-shadow">
            <h3 className="mb-8 font-black text-xl tracking-tighter text-foreground flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
              Advanced Filters
            </h3>
            {filterContent}
          </div>
        </aside>

        <div className="">
          <SearchResults
            loading={loading}
            error={error}
            listings={listings}
            page={page}
            totalPages={totalPages}
            onPageChange={(nextPage) => {
              setPage(nextPage)
              updateUrl(nextPage)
            }}
            onClearFilters={clearFilters}
          />
        </div>
      </div>
    </div>
  )
}
