import { useState, useEffect } from 'react'
import { Plus, FolderOpen, Image, Eye, Share2, Download, Lock, Unlock, Search, MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { Gallery, Event } from '@/types'

export function GalleryPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { toast } = useToast()

  // Form state for creating new gallery
  const [newGallery, setNewGallery] = useState({
    eventId: '',
    name: '',
    description: '',
    isPublic: false,
    accessCode: ''
  })

  useEffect(() => {
    loadGalleries()
  }, [])

  const loadGalleries = async () => {
    try {
      // Mock data for demonstration
      const mockEvents: Event[] = [
        {
          id: '1',
          studioId: 'studio_1',
          name: 'Sarah & John Wedding',
          date: '2024-01-25',
          time: '14:00',
          venue: 'Grand Ballroom Hotel',
          clientName: 'Sarah Johnson',
          status: 'completed',
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

      const mockGalleries: Gallery[] = [
        {
          id: '1',
          eventId: '1',
          name: 'Wedding Ceremony Highlights',
          description: 'Beautiful moments from the ceremony',
          isPublic: true,
          accessCode: 'WEDDING2024',
          createdAt: '2024-01-26T10:00:00Z',
          updatedAt: '2024-01-26T10:00:00Z'
        },
        {
          id: '2',
          eventId: '1',
          name: 'Reception Photos',
          description: 'Dancing, dinner, and celebration photos',
          isPublic: false,
          accessCode: 'RECEPTION123',
          createdAt: '2024-01-26T11:00:00Z',
          updatedAt: '2024-01-26T11:00:00Z'
        },
        {
          id: '3',
          eventId: '2',
          name: 'Corporate Event Gallery',
          description: 'Professional photos from the annual gala',
          isPublic: true,
          createdAt: '2024-01-31T09:00:00Z',
          updatedAt: '2024-01-31T09:00:00Z'
        }
      ]

      setEvents(mockEvents)
      setGalleries(mockGalleries)
    } catch (error) {
      console.error('Failed to load galleries:', error)
      toast({
        title: 'Error',
        description: 'Failed to load galleries',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGallery = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const galleryData: Gallery = {
        id: `gallery_${Date.now()}`,
        ...newGallery,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // In a real app, you'd save to database
      setGalleries(prev => [galleryData, ...prev])
      
      toast({
        title: 'Success',
        description: 'Gallery created successfully'
      })
      
      setIsCreateDialogOpen(false)
      setNewGallery({
        eventId: '',
        name: '',
        description: '',
        isPublic: false,
        accessCode: ''
      })
    } catch (error) {
      console.error('Failed to create gallery:', error)
      toast({
        title: 'Error',
        description: 'Failed to create gallery',
        variant: 'destructive'
      })
    }
  }

  const handleTogglePublic = (galleryId: string) => {
    setGalleries(prev => 
      prev.map(gallery => 
        gallery.id === galleryId 
          ? { ...gallery, isPublic: !gallery.isPublic }
          : gallery
      )
    )
    toast({
      title: 'Success',
      description: 'Gallery visibility updated'
    })
  }

  const handleDeleteGallery = (galleryId: string) => {
    setGalleries(prev => prev.filter(gallery => gallery.id !== galleryId))
    toast({
      title: 'Success',
      description: 'Gallery deleted'
    })
  }

  const getEventName = (eventId: string) => {
    const event = events.find(e => e.id === eventId)
    return event ? event.name : 'Unknown Event'
  }

  const getEventClient = (eventId: string) => {
    const event = events.find(e => e.id === eventId)
    return event ? event.clientName : 'Unknown Client'
  }

  const generateAccessCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    setNewGallery({ ...newGallery, accessCode: code })
  }

  const filteredGalleries = galleries.filter(gallery =>
    gallery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getEventName(gallery.eventId).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getEventClient(gallery.eventId).toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FolderOpen className="h-8 w-8 text-amber-500 animate-pulse mx-auto mb-2" />
          <p className="text-gray-500">Loading galleries...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Photo Galleries</h1>
          <p className="text-gray-600">Manage and share your event photo galleries</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-500 hover:bg-amber-600">
              <Plus className="mr-2 h-4 w-4" />
              Create Gallery
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Gallery</DialogTitle>
              <DialogDescription>
                Create a photo gallery for client delivery
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateGallery} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="eventSelect">Event</Label>
                <select
                  id="eventSelect"
                  className="w-full p-2 border rounded-md"
                  value={newGallery.eventId}
                  onChange={(e) => setNewGallery({ ...newGallery, eventId: e.target.value })}
                  required
                >
                  <option value="">Select an event</option>
                  {events.map(event => (
                    <option key={event.id} value={event.id}>
                      {event.name} - {event.clientName}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="galleryName">Gallery Name</Label>
                <Input
                  id="galleryName"
                  placeholder="e.g., Wedding Ceremony Highlights"
                  value={newGallery.name}
                  onChange={(e) => setNewGallery({ ...newGallery, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="galleryDescription">Description (Optional)</Label>
                <Textarea
                  id="galleryDescription"
                  placeholder="Brief description of the gallery"
                  value={newGallery.description}
                  onChange={(e) => setNewGallery({ ...newGallery, description: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublic"
                  checked={newGallery.isPublic}
                  onCheckedChange={(checked) => setNewGallery({ ...newGallery, isPublic: checked })}
                />
                <Label htmlFor="isPublic">Make gallery public</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accessCode">Access Code</Label>
                <div className="flex space-x-2">
                  <Input
                    id="accessCode"
                    placeholder="Enter access code"
                    value={newGallery.accessCode}
                    onChange={(e) => setNewGallery({ ...newGallery, accessCode: e.target.value })}
                  />
                  <Button type="button" variant="outline" onClick={generateAccessCode}>
                    Generate
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
                  Create Gallery
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search galleries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Gallery Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FolderOpen className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-sm text-gray-600">Total Galleries</p>
                <p className="text-xl font-bold">{galleries.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Unlock className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Public</p>
                <p className="text-xl font-bold">{galleries.filter(g => g.isPublic).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Private</p>
                <p className="text-xl font-bold">{galleries.filter(g => !g.isPublic).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Image className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Photos</p>
                <p className="text-xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Galleries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGalleries.map((gallery) => (
          <Card key={gallery.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{gallery.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {getEventName(gallery.eventId)} • {getEventClient(gallery.eventId)}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={gallery.isPublic ? 'default' : 'secondary'}>
                    {gallery.isPublic ? (
                      <>
                        <Unlock className="mr-1 h-3 w-3" />
                        Public
                      </>
                    ) : (
                      <>
                        <Lock className="mr-1 h-3 w-3" />
                        Private
                      </>
                    )}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Gallery
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleTogglePublic(gallery.id)}>
                        {gallery.isPublic ? (
                          <>
                            <Lock className="mr-2 h-4 w-4" />
                            Make Private
                          </>
                        ) : (
                          <>
                            <Unlock className="mr-2 h-4 w-4" />
                            Make Public
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Link
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteGallery(gallery.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Gallery
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {gallery.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {gallery.description}
                </p>
              )}
              
              {/* Gallery Preview - Mock empty state */}
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No photos yet</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>0 photos</span>
                  <span>0 views</span>
                </div>
                {gallery.accessCode && (
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                    {gallery.accessCode}
                  </span>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGalleries.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No galleries found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Try adjusting your search criteria'
              : 'Create your first gallery to share photos with clients'
            }
          </p>
          {!searchTerm && (
            <Button 
              className="bg-amber-500 hover:bg-amber-600"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Gallery
            </Button>
          )}
        </div>
      )}
    </div>
  )
}