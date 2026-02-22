"use client"

import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ListingCard } from "@/components/listing-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  SlidersHorizontal,
  X,
  Loader2,
} from "lucide-react"
import {
  PROPERTY_TYPES,
  FURNISHED_OPTIONS,
  GENDER_OPTIONS,
  SORT_OPTIONS,
  ITEMS_PER_PAGE,
  formatPrice,
} from "@/lib/constants"
import type { District, City, Listing } from "@/lib/types"

export function SearchClient() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [districts, setDistricts] = useState<District[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [listings, setListings] = useState<Listing[]>([])
  const [boostedListings, setBoostedListings] = useState<Listing[]>([])

  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)

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
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1)

  useEffect(() => {
    async function loadDistricts() {
      const supabase = createClient()
      const { data } = await supabase
        .from("districts")
        .select("*")
        .order("name")
      if (data) setDistricts(data)
    }
    loadDistricts()
  }, [])

  useEffect(() => {
    if (!district) {
      setCities([])
      return
    }
    async function loadCities() {
      const supabase = createClient()
      const selectedDistrict = districts.find((d) => d.slug === district)
      if (!selectedDistrict) return
      const { data } = await supabase
        .from("cities")
        .select("*")
        .eq("district_id", selectedDistrict.id)
        .order("name")
      if (data) setCities(data)
    }
    loadCities()
  }, [district, districts])

  const fetchListings = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()

    let query = supabase
      .from("listings")
      .select(
        `*, districts(*), cities(*), listing_images(*)`,
        { count: "exact" }
      )
      .eq("status", "approved")

    if (keyword) {
      query = query.textSearch("search_vector", keyword, {
        type: "websearch",
        config: "english",
      })
    }

    if (district) {
      const d = districts.find((x) => x.slug === district)
      if (d) query = query.eq("district_id", d.id)
    }

    if (city) {
      const c = cities.find((x) => x.slug === city)
      if (c) query = query.eq("city_id", c.id)
    }

    if (propertyType) query = query.eq("property_type", propertyType)
    if (furnished) query = query.eq("furnished", furnished)
    if (gender && gender !== "any") query = query.eq("gender_preference", gender)
    if (priceRange[0] > 0) query = query.gte("price", priceRange[0])
    if (priceRange[1] < 200000) query = query.lte("price", priceRange[1])

    switch (sort) {
      case "newest":
        query = query.order("created_at", { ascending: false })
        break
      case "price_asc":
        query = query.order("price", { ascending: true })
        break
      case "price_desc":
        query = query.order("price", { ascending: false })
        break
      case "views":
        query = query.order("views_count", { ascending: false })
        break
      case "featured":
      default:
        query = query
          .order("is_featured", { ascending: false })
          .order("is_boosted", { ascending: false })
          .order("created_at", { ascending: false })
        break
    }

    const from = (page - 1) * ITEMS_PER_PAGE
    const to = from + ITEMS_PER_PAGE - 1
    query = query.range(from, to)

    const { data, count } = await query
    if (data) setListings(data)
    if (count !== null) setTotalCount(count)
    setLoading(false)
  }, [keyword, district, city, propertyType, furnished, gender, priceRange, sort, page, districts, cities])

  useEffect(() => {
    if (districts.length > 0 || !district) {
      fetchListings()
    }


  }, [fetchListings, districts.length, district])



  const updateUrl = () => {
    const params = new URLSearchParams()
    if (keyword) params.set("q", keyword)
    if (district) params.set("district", district)
    if (city) params.set("city", city)
    if (propertyType) params.set("type", propertyType)
    if (furnished) params.set("furnished", furnished)
    if (gender) params.set("gender", gender)
    if (priceRange[0] > 0) params.set("minPrice", String(priceRange[0]))
    if (priceRange[1] < 200000) params.set("maxPrice", String(priceRange[1]))
    if (sort !== "featured") params.set("sort", sort)
    router.replace(`/search?${params.toString()}`, { scroll: false })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    updateUrl()
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
    <div className="flex flex-col gap-5">
      <div>
        <Label className="mb-2 block text-sm font-medium">District</Label>
        <Select value={district} onValueChange={(v) => { setDistrict(v); setCity("") }}>
          <SelectTrigger>
            <SelectValue placeholder="All Districts" />
          </SelectTrigger>
          <SelectContent>
            {districts.map((d) => (
              <SelectItem key={d.id} value={d.slug}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {cities.length > 0 && (
        <div>
          <Label className="mb-2 block text-sm font-medium">City</Label>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger>
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((c) => (
                <SelectItem key={c.id} value={c.slug}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label className="mb-2 block text-sm font-medium">Property Type</Label>
        <Select value={propertyType} onValueChange={setPropertyType}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            {PROPERTY_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">Furnished</Label>
        <Select value={furnished} onValueChange={setFurnished}>
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            {FURNISHED_OPTIONS.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">Gender Preference</Label>
        <Select value={gender} onValueChange={setGender}>
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            {GENDER_OPTIONS.map((g) => (
              <SelectItem key={g.value} value={g.value}>
                {g.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">
          Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
        </Label>
        <Slider
          min={0}
          max={200000}
          step={5000}
          value={priceRange}
          onValueChange={(v) => setPriceRange(v as [number, number])}
          className="mt-3"
        />
      </div>

      <Button onClick={handleSearch} className="w-full text-white">
        Apply Filters
      </Button>

      {hasFilters && (
        <Button variant="ghost" onClick={clearFilters} className="w-full text-muted-foreground">
          <X className="mr-2 h-4 w-4" />
          Clear All Filters
        </Button>
      )}
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 mt-16 animate-fade-in">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-3">
             <Search className="h-3 w-3" />
             Property Search
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">
            Find your <span className="text-primary italic">Perfect Place</span>
          </h1>
          <p className="mt-2 text-muted-foreground font-medium">
             {totalCount} {totalCount === 1 ? "property" : "properties"} available for rent
          </p>
        </div>

        <div className="flex items-center gap-3">
           <Select value={sort} onValueChange={(v) => { setSort(v); setPage(1) }}>
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

      <div className="mb-10 group">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search by keywords, location, or school name..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="h-16 pl-14 pr-6 rounded-[2rem] text-lg font-medium border-border/50 bg-card shadow-lg shadow-black/5 focus-visible:ring-primary/20"
            />
          </div>
          <Button type="submit" size="lg" className="h-16 px-10 rounded-[2rem] font-black text-lg shadow-xl shadow-primary/20 group-hover:scale-[1.02] transition-all">
            Search Now
          </Button>
        </form>
      </div>

      {hasFilters && (
        <div className="mb-8 flex flex-wrap items-center gap-3 animate-fade-in">
          <span className="text-xs font-black text-muted-foreground uppercase tracking-widest mr-1">Active Filters:</span>
          {keyword && (
            <Badge variant="secondary" className="gap-2 px-4 py-1.5 rounded-full border-border bg-card text-sm font-bold soft-shadow">
              {`"${keyword}"`}
              <button onClick={() => setKeyword("")} className="hover:text-primary transition-colors"><X className="h-4 w-4" /></button>
            </Badge>
          )}
          {district && (
            <Badge variant="secondary" className="gap-2 px-4 py-1.5 rounded-full border-border bg-card text-sm font-bold soft-shadow capitalize">
              {district}
              <button onClick={() => { setDistrict(""); setCity("") }} className="hover:text-primary transition-colors"><X className="h-4 w-4" /></button>
            </Badge>
          )}
          {propertyType && (
            <Badge variant="secondary" className="gap-2 px-4 py-1.5 rounded-full border-border bg-card text-sm font-bold soft-shadow capitalize">
              {propertyType}
              <button onClick={() => setPropertyType("")} className="hover:text-primary transition-colors"><X className="h-4 w-4" /></button>
            </Badge>
          )}
          <Button variant="link" onClick={clearFilters} className="text-xs font-black text-primary p-0 h-auto hover:no-underline">Reset All</Button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-10">
        <aside className="hidden w-80 shrink-0 lg:block">
          <div className="sticky top-24 rounded-[2.5rem] border border-border/50 bg-card p-8 soft-shadow">
            <h3 className="mb-8 font-black text-xl tracking-tighter text-foreground flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
              Advanced Filters
            </h3>
            {filterContent}
          </div>
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="flex h-[500px] flex-col items-center justify-center gap-4 bg-muted/20 rounded-[3rem] border border-dashed border-border">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground font-bold tracking-tight">Updating results...</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="flex h-[500px] flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-border bg-muted/10 text-center px-10">
              <div className="p-8 rounded-full bg-muted shadow-inner mb-8">
                <Search className="h-16 w-16 text-muted-foreground/30" />
              </div>
              <h3 className="text-3xl font-black text-foreground tracking-tight">No properties found</h3>
              <p className="mt-2 text-muted-foreground font-medium max-w-sm text-lg">
                We couldn't find any listings matching your search. Try broadening your criteria or resetting filters.
              </p>
              <Button asChild onClick={clearFilters} className="mt-10 rounded-2xl h-14 px-10 font-black shadow-xl">
                 <Link href="/search">Clear All Filters</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-12">
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 py-10">
                  <Button
                    variant="outline"
                    className="h-12 w-12 rounded-2xl border-border hover:bg-primary hover:text-white transition-all shadow-sm"
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    aria-label="Previous Page"
                  >
                    <SlidersHorizontal className="h-5 w-5 rotate-90" />
                  </Button>

                  <div className="flex items-center gap-2 bg-muted/50 px-6 py-2 rounded-2xl border border-border/50">
                    <span className="text-sm font-black text-foreground">Page</span>
                    <span className="h-8 w-8 flex items-center justify-center bg-primary text-white rounded-lg text-sm font-black shadow-lg shadow-primary/20">{page}</span>
                    <span className="text-sm font-black text-muted-foreground">of {totalPages}</span>
                  </div>

                  <Button
                    variant="outline"
                    className="h-12 w-12 rounded-2xl border-border hover:bg-primary hover:text-white transition-all shadow-sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    aria-label="Next Page"
                  >
                    <SlidersHorizontal className="h-5 w-5 -rotate-90" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
