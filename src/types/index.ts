export interface Studio {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  description?: string
  logoUrl?: string
  createdAt: string
  updatedAt: string
}

export interface TeamMember {
  id: string
  studioId: string
  name: string
  email: string
  phone?: string
  role?: string
  specialization?: string
  avatarUrl?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Event {
  id: string
  studioId: string
  name: string
  date: string
  time: string
  venue: string
  clientName: string
  clientEmail?: string
  clientPhone?: string
  description?: string
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface Ceremony {
  id: string
  eventId: string
  name: string
  startTime?: string
  endTime?: string
  description?: string
  orderIndex: number
  createdAt: string
  updatedAt: string
}

export interface TeamAssignment {
  id: string
  eventId: string
  ceremonyId?: string
  teamMemberId: string
  role?: string
  createdAt: string
}

export interface Photo {
  id: string
  eventId: string
  ceremonyId?: string
  uploadedBy: string
  fileUrl: string
  fileName: string
  fileSize?: number
  mimeType?: string
  tags?: string
  rating: number
  isSelected: boolean
  createdAt: string
}

export interface Gallery {
  id: string
  eventId: string
  name: string
  description?: string
  isPublic: boolean
  accessCode?: string
  createdAt: string
  updatedAt: string
}

export interface GalleryPhoto {
  id: string
  galleryId: string
  photoId: string
  orderIndex: number
  createdAt: string
}

export type UserRole = 'studio' | 'team_member'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  studioId?: string
  teamMemberId?: string
  studioName?: string
}