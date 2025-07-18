import { useState, useEffect, useCallback } from 'react'
import { Upload, Camera, Image, X, Check, AlertCircle, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { blink } from '@/blink/client'
import { Event, Ceremony } from '@/types'

interface UploadedPhoto {
  id: string
  file: File
  preview: string
  status: 'uploading' | 'completed' | 'error'
  progress: number
  url?: string
}

export function PhotoUploadPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [ceremonies, setCeremonies] = useState<Ceremony[]>([])
  const [selectedEvent, setSelectedEvent] = useState<string>('')
  const [selectedCeremony, setSelectedCeremony] = useState<string>('')
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadEvents()
  }, [])

  useEffect(() => {
    if (selectedEvent) {
      loadCeremonies(selectedEvent)
    } else {
      setCeremonies([])
      setSelectedCeremony('')
    }
  }, [selectedEvent])

  const loadEvents = async () => {
    try {
      // Mock data - in real app, load user's assigned events
      const mockEvents: Event[] = [
        {
          id: '1',
          studioId: 'studio_1',
          name: 'Sarah & John Wedding',
          date: '2024-01-25',
          time: '14:00',
          venue: 'Grand Ballroom Hotel',
          clientName: 'Sarah Johnson',
          status: 'ongoing',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          studioId: 'studio_1',
          name: 'Corporate Annual Gala',
          date: '2024-01-30',
          time: '18:00',
          venue: 'Convention Center',
          clientName: 'Tech Corp Inc.',
          status: 'upcoming',
          createdAt: '2024-01-10T09:00:00Z',
          updatedAt: '2024-01-10T09:00:00Z'
        }
      ]
      setEvents(mockEvents)
    } catch (error) {
      console.error('Failed to load events:', error)
      toast({
        title: 'Error',
        description: 'Failed to load events',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const loadCeremonies = async (eventId: string) => {
    try {
      // Mock data - in real app, load ceremonies for the event
      const mockCeremonies: Ceremony[] = [
        {
          id: '1',
          eventId,
          name: 'Ceremony',
          startTime: '14:00',
          endTime: '15:00',
          orderIndex: 1,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          eventId,
          name: 'Reception',
          startTime: '18:00',
          endTime: '23:00',
          orderIndex: 2,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '3',
          eventId,
          name: 'Dancing',
          startTime: '20:00',
          endTime: '23:00',
          orderIndex: 3,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        }
      ]
      setCeremonies(mockCeremonies)
    } catch (error) {
      console.error('Failed to load ceremonies:', error)
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    )
    
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }

  const handleFileUpload = async (files: File[]) => {
    if (!selectedEvent) {
      toast({
        title: 'Error',
        description: 'Please select an event first',
        variant: 'destructive'
      })
      return
    }

    const newPhotos: UploadedPhoto[] = files.map(file => ({
      id: `photo_${Date.now()}_${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      status: 'uploading',
      progress: 0
    }))

    setUploadedPhotos(prev => [...prev, ...newPhotos])

    // Simulate upload process
    for (const photo of newPhotos) {
      try {
        // Update progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100))
          setUploadedPhotos(prev => 
            prev.map(p => 
              p.id === photo.id ? { ...p, progress } : p
            )
          )
        }

        // Upload to Blink storage
        const { publicUrl } = await blink.storage.upload(
          photo.file,
          `events/${selectedEvent}/photos/${photo.file.name}`,
          { upsert: true }
        )

        // Mark as completed
        setUploadedPhotos(prev => 
          prev.map(p => 
            p.id === photo.id 
              ? { ...p, status: 'completed', url: publicUrl }
              : p
          )
        )

        toast({
          title: 'Success',
          description: `${photo.file.name} uploaded successfully`
        })

      } catch (error) {
        console.error('Upload failed:', error)
        setUploadedPhotos(prev => 
          prev.map(p => 
            p.id === photo.id ? { ...p, status: 'error' } : p
          )
        )
        toast({
          title: 'Error',
          description: `Failed to upload ${photo.file.name}`,
          variant: 'destructive'
        })
      }
    }
  }

  const removePhoto = (photoId: string) => {
    setUploadedPhotos(prev => {
      const photo = prev.find(p => p.id === photoId)
      if (photo?.preview) {
        URL.revokeObjectURL(photo.preview)
      }
      return prev.filter(p => p.id !== photoId)
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Upload className="h-4 w-4 text-blue-500 animate-pulse" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Camera className="h-8 w-8 text-amber-500 animate-pulse mx-auto mb-2" />
          <p className="text-gray-500">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload Photos</h1>
        <p className="text-gray-600">Upload photos from your assigned events</p>
      </div>

      {/* Event and Ceremony Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Event & Ceremony</CardTitle>
          <CardDescription>
            Choose the event and ceremony session for your photos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Event</label>
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent>
                  {events.map(event => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name} - {new Date(event.date).toLocaleDateString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Ceremony (Optional)</label>
              <Select 
                value={selectedCeremony} 
                onValueChange={setSelectedCeremony}
                disabled={!selectedEvent}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ceremony" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Ceremonies</SelectItem>
                  {ceremonies.map(ceremony => (
                    <SelectItem key={ceremony.id} value={ceremony.id}>
                      {ceremony.name}
                      {ceremony.startTime && ` (${ceremony.startTime})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Photos</CardTitle>
          <CardDescription>
            Drag and drop photos or click to select files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-amber-500 bg-amber-50'
                : 'border-gray-300 hover:border-gray-400'
            } ${!selectedEvent ? 'opacity-50 pointer-events-none' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="photo-upload"
              disabled={!selectedEvent}
            />
            <label htmlFor="photo-upload" className="cursor-pointer">
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Upload className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Drop photos here or click to upload
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports JPG, PNG, HEIC and other image formats
                  </p>
                </div>
              </div>
            </label>
          </div>
          
          {!selectedEvent && (
            <p className="text-sm text-amber-600 mt-2 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              Please select an event before uploading photos
            </p>
          )}
        </CardContent>
      </Card>

      {/* Uploaded Photos */}
      {uploadedPhotos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Photos ({uploadedPhotos.length})</CardTitle>
            <CardDescription>
              Track the progress of your photo uploads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedPhotos.map(photo => (
                <div key={photo.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={photo.preview}
                      alt={photo.file.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removePhoto(photo.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">
                        {photo.file.name}
                      </p>
                      {getStatusIcon(photo.status)}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(photo.status)}>
                        {photo.status}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {(photo.file.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </div>
                    
                    {photo.status === 'uploading' && (
                      <Progress value={photo.progress} className="h-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {events.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events assigned</h3>
          <p className="text-gray-600">
            Contact your studio manager to get assigned to events
          </p>
        </div>
      )}
    </div>
  )
}