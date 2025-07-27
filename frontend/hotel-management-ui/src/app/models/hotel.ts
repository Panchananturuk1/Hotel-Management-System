export interface Hotel {
  id?: number;
  name: string;
  location: string;
  rating: number;
  amenities?: string[];
  description?: string;
  imageUrl?: string;
  priceRange?: 'budget' | 'mid-range' | 'luxury' | 'boutique';
  contactEmail?: string;
  contactPhone?: string;
  checkInTime?: string;
  checkOutTime?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
