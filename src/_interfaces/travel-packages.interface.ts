export interface TravelPackagesResponse {
    data: TravelPackages[]
    meta: TravelPackagesMeta
  }
  
  export interface TravelPackages {
    id: number
    package_name: string
    description: string
    images?: string[]
    package_price: number
    duration: number
    max_persons: number
    itineraries: string[]
    includes: string[]
    created_at: string
    updated_at: string
    deleted_at: string
  }
  
  export interface TravelPackagesMeta {
    totalItems: number
    currentPage: number
    totalPages: number
    limit: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
  
  export interface TravelPackagesRequest {
    limit: number
    page: number
    search: string
  }

  export interface TravelPackagesDetailResponse {
    data: TravelPackages,
    message: string 
  }

  export interface TravelPackagesDetailRequest {
    id: number
  }