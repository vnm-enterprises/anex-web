export const PROPERTY_TYPES = [
  { value: 'annex', label: 'Annex' },
  { value: 'boarding', label: 'Boarding Place' },
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
] as const

export const FURNISHED_OPTIONS = [
  { value: 'furnished', label: 'Furnished' },
  { value: 'semi-furnished', label: 'Semi-Furnished' },
  { value: 'unfurnished', label: 'Unfurnished' },
] as const

export const GENDER_OPTIONS = [
  { value: 'any', label: 'Any' },
  { value: 'male', label: 'Male Only' },
  { value: 'female', label: 'Female Only' },
] as const

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured First' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'views', label: 'Most Viewed' },
] as const

export const BOOST_DURATIONS = [
  { days: 7, label: '7 Days' },
  { days: 14, label: '14 Days' },
  { days: 30, label: '30 Days' },
] as const

export const ITEMS_PER_PAGE = 12

export function formatPrice(price: number): string {
  return `Rs. ${price.toLocaleString()}`
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-LK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getPropertyTypeIcon(type: string) {
  switch (type) {
    case 'annex':
      return 'home'
    case 'boarding':
      return 'bed-double'
    case 'house':
      return 'warehouse'
    case 'apartment':
      return 'building-2'
    default:
      return 'home'
  }
}
