import { useState, useEffect } from 'react'
import { Plus, Calendar, MapPin, Users, Camera, Search, Filter, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { Event } from '@/types'

interface EventsPageProps {
  onEventSelect?: (eventId: string) => void
}

export function EventsPage({ onEventSelect }: EventsPageProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { toast } = useToast()

  // Form state for creating new event
  const [newEvent, setNewEvent] = useState({
    name: '',
    date: '',
    time: '',
    venue: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    description: ''
  })

  useEffect(() => {
    loadEvents()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadEvents = async () => {
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
          clientEmail: 'sarah@example.com',
          clientPhone: '+1234567890',
          description: 'Beautiful outdoor wedding ceremony followed by reception',
          status: 'upcoming',
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
          clientEmail: 'events@techcorp.com',
          description: 'Annual company celebration with awards ceremony',
          status: 'upcoming',
          createdAt: '2024-01-10T09:00:00Z',
          updatedAt: '2024-01-10T09:00:00Z'
        },
        {
          id: '3',
          studioId: 'studio_1',
          name: 'Birthday Celebration',
          date: '2024-01-20',
          time: '15:00',
          venue: 'Private Residence',
          clientName: 'Mike Wilson',
          clientEmail: 'mike@example.com',
          description: '50th birthday party with family and friends',
          status: 'completed',
          createdAt: '2024-01-05T14:00:00Z',
          updatedAt: '2024-01-20T20:00:00Z'
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

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const eventData: Event = {
        id: `event_${Date.now()}`,
        studioId: 'studio_1',
        ...newEvent,
        status: 'upcoming',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // In a real app, you'd save to database
      setEvents(prev => [eventData, ...prev])
      
      toast({
        title: 'Success',
        description: 'Event created successfully'
      })
      
      setIsCreateDialogOpen(false)
      setNewEvent({
        name: '',
        date: '',
        time: '',
        venue: '',
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        description: ''
      })
    } catch (error) {
      console.error('Failed to create event:', error)
      toast({
        title: 'Error',
        description: 'Failed to create event',
        variant: 'destructive'
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'ongoing':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.venue.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter
    return matchesSearch && matchesStatus
  })

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600">Manage your photography events</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-500 hover:bg-amber-600">
              <Plus className="mr-2 h-4 w-4" />
              New Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>
                Add a new photography event to your schedule
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventName">Event Name</Label>
                  <Input
                    id="eventName"
                    placeholder="e.g., Sarah & John Wedding"
                    value={newEvent.name}
                    onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    placeholder="e.g., Sarah Johnson"
                    value={newEvent.clientName}
                    onChange={(e) => setNewEvent({ ...newEvent, clientName: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventDate">Date</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventTime">Time</Label>
                  <Input
                    id="eventTime"
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="venue">Venue</Label>
                <Input
                  id="venue"
                  placeholder="e.g., Grand Ballroom Hotel"
                  value={newEvent.venue}
                  onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Client Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    placeholder="client@example.com"
                    value={newEvent.clientEmail}
                    onChange={(e) => setNewEvent({ ...newEvent, clientEmail: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientPhone">Client Phone</Label>
                  <Input
                    id="clientPhone"
                    placeholder="+1234567890"
                    value={newEvent.clientPhone}
                    onChange={(e) => setNewEvent({ ...newEvent, clientPhone: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Event details and special requirements..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
                  Create Event
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{event.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {event.clientName}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEventSelect?.(event.id)}>
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>Edit Event</DropdownMenuItem>
                    <DropdownMenuItem>Manage Team</DropdownMenuItem>
                    <DropdownMenuItem>View Photos</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Badge className={getStatusColor(event.status)}>
                {event.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="mr-2 h-4 w-4" />
                {new Date(event.date).toLocaleDateString()} {event.time && `at ${event.time}`}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="mr-2 h-4 w-4" />
                {event.venue}
              </div>
              {event.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {event.description}
                </p>
              )}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Users className="mr-1 h-3 w-3" />
                    0 assigned
                  </div>
                  <div className="flex items-center">
                    <Camera className="mr-1 h-3 w-3" />
                    0 photos
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEventSelect?.(event.id)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first event'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <Button 
              className="bg-amber-500 hover:bg-amber-600"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Event
            </Button>
          )}
        </div>
      )}
    </div>
  )
}