import { useState, useEffect } from 'react'
import { ArrowLeft, Calendar, MapPin, User, Phone, Mail, Plus, Users, Camera, Clock, Edit, Trash2, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { Event, Ceremony, TeamMember, TeamAssignment } from '@/types'

interface EventDetailsPageProps {
  eventId: string
  onBack: () => void
}

export function EventDetailsPage({ eventId, onBack }: EventDetailsPageProps) {
  const [event, setEvent] = useState<Event | null>(null)
  const [ceremonies, setCeremonies] = useState<Ceremony[]>([])
  const [assignments, setAssignments] = useState<TeamAssignment[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddCeremonyOpen, setIsAddCeremonyOpen] = useState(false)
  const [isAssignTeamOpen, setIsAssignTeamOpen] = useState(false)
  const { toast } = useToast()

  const [newCeremony, setNewCeremony] = useState({
    name: '',
    startTime: '',
    endTime: '',
    description: ''
  })

  const [newAssignment, setNewAssignment] = useState({
    teamMemberId: '',
    ceremonyId: '',
    role: ''
  })

  useEffect(() => {
    loadEventDetails()
  }, [eventId])

  const loadEventDetails = async () => {
    try {
      // Mock data - in real app, fetch from database
      const mockEvent: Event = {
        id: eventId,
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
      }

      const mockCeremonies: Ceremony[] = [
        {
          id: '1',
          eventId,
          name: 'Ceremony',
          startTime: '14:00',
          endTime: '15:00',
          description: 'Wedding ceremony at the garden pavilion',
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
          description: 'Dinner and dancing in the main ballroom',
          orderIndex: 2,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        }
      ]

      const mockTeamMembers: TeamMember[] = [
        {
          id: '1',
          studioId: 'studio_1',
          name: 'Alex Rodriguez',
          email: 'alex@photostudio.com',
          role: 'Lead Photographer',
          specialization: 'Wedding Photography',
          avatarUrl: '',
          isActive: true,
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z'
        },
        {
          id: '2',
          studioId: 'studio_1',
          name: 'Sarah Chen',
          email: 'sarah@photostudio.com',
          role: 'Photographer',
          specialization: 'Portrait Photography',
          avatarUrl: '',
          isActive: true,
          createdAt: '2024-01-02T10:00:00Z',
          updatedAt: '2024-01-02T10:00:00Z'
        }
      ]

      const mockAssignments: TeamAssignment[] = [
        {
          id: '1',
          eventId,
          ceremonyId: '1',
          teamMemberId: '1',
          role: 'Lead Photographer',
          createdAt: '2024-01-15T10:00:00Z'
        }
      ]

      setEvent(mockEvent)
      setCeremonies(mockCeremonies)
      setTeamMembers(mockTeamMembers)
      setAssignments(mockAssignments)
    } catch (error) {
      console.error('Failed to load event details:', error)
      toast({
        title: 'Error',
        description: 'Failed to load event details',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddCeremony = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const ceremonyData: Ceremony = {
        id: `ceremony_${Date.now()}`,
        eventId,
        ...newCeremony,
        orderIndex: ceremonies.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      setCeremonies(prev => [...prev, ceremonyData])
      
      toast({
        title: 'Success',
        description: 'Ceremony added successfully'
      })
      
      setIsAddCeremonyOpen(false)
      setNewCeremony({
        name: '',
        startTime: '',
        endTime: '',
        description: ''
      })
    } catch (error) {
      console.error('Failed to add ceremony:', error)
      toast({
        title: 'Error',
        description: 'Failed to add ceremony',
        variant: 'destructive'
      })
    }
  }

  const handleAssignTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const assignmentData: TeamAssignment = {
        id: `assignment_${Date.now()}`,
        eventId,
        ...newAssignment,
        createdAt: new Date().toISOString()
      }

      setAssignments(prev => [...prev, assignmentData])
      
      toast({
        title: 'Success',
        description: 'Team member assigned successfully'
      })
      
      setIsAssignTeamOpen(false)
      setNewAssignment({
        teamMemberId: '',
        ceremonyId: '',
        role: ''
      })
    } catch (error) {
      console.error('Failed to assign team member:', error)
      toast({
        title: 'Error',
        description: 'Failed to assign team member',
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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getAssignedMembers = (ceremonyId?: string) => {
    return assignments
      .filter(a => !ceremonyId || a.ceremonyId === ceremonyId)
      .map(a => teamMembers.find(m => m.id === a.teamMemberId))
      .filter(Boolean) as TeamMember[]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Camera className="h-8 w-8 text-amber-500 animate-pulse mx-auto mb-2" />
          <p className="text-gray-500">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Event not found</h2>
        <Button onClick={onBack}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>
      </div>

      {/* Event Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{event.name}</CardTitle>
              <CardDescription className="text-lg mt-1">
                {event.clientName}
              </CardDescription>
            </div>
            <Badge className={getStatusColor(event.status)}>
              {event.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center text-gray-600">
                <Calendar className="mr-3 h-5 w-5" />
                <div>
                  <p className="font-medium">Date & Time</p>
                  <p>{new Date(event.date).toLocaleDateString()} {event.time && `at ${event.time}`}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="mr-3 h-5 w-5" />
                <div>
                  <p className="font-medium">Venue</p>
                  <p>{event.venue}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center text-gray-600">
                <User className="mr-3 h-5 w-5" />
                <div>
                  <p className="font-medium">Client</p>
                  <p>{event.clientName}</p>
                </div>
              </div>
              {event.clientEmail && (
                <div className="flex items-center text-gray-600">
                  <Mail className="mr-3 h-5 w-5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p>{event.clientEmail}</p>
                  </div>
                </div>
              )}
              {event.clientPhone && (
                <div className="flex items-center text-gray-600">
                  <Phone className="mr-3 h-5 w-5" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p>{event.clientPhone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          {event.description && (
            <div className="mt-6">
              <p className="font-medium text-gray-900 mb-2">Description</p>
              <p className="text-gray-600">{event.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="ceremonies" className="space-y-6">
        <TabsList>
          <TabsTrigger value="ceremonies">Ceremonies</TabsTrigger>
          <TabsTrigger value="team">Team Assignments</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
        </TabsList>

        <TabsContent value="ceremonies" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Ceremonies & Sessions</h2>
            <Dialog open={isAddCeremonyOpen} onOpenChange={setIsAddCeremonyOpen}>
              <DialogTrigger asChild>
                <Button className="bg-amber-500 hover:bg-amber-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Ceremony
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Ceremony</DialogTitle>
                  <DialogDescription>
                    Add a new ceremony or session to this event
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddCeremony} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ceremonyName">Ceremony Name</Label>
                    <Input
                      id="ceremonyName"
                      placeholder="e.g., Wedding Ceremony"
                      value={newCeremony.name}
                      onChange={(e) => setNewCeremony({ ...newCeremony, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={newCeremony.startTime}
                        onChange={(e) => setNewCeremony({ ...newCeremony, startTime: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={newCeremony.endTime}
                        onChange={(e) => setNewCeremony({ ...newCeremony, endTime: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ceremonyDescription">Description (Optional)</Label>
                    <Input
                      id="ceremonyDescription"
                      placeholder="Brief description of the ceremony"
                      value={newCeremony.description}
                      onChange={(e) => setNewCeremony({ ...newCeremony, description: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddCeremonyOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
                      Add Ceremony
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ceremonies.map((ceremony) => (
              <Card key={ceremony.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{ceremony.name}</CardTitle>
                      {ceremony.startTime && (
                        <CardDescription>
                          <Clock className="inline mr-1 h-3 w-3" />
                          {ceremony.startTime}
                          {ceremony.endTime && ` - ${ceremony.endTime}`}
                        </CardDescription>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {ceremony.description && (
                    <p className="text-sm text-gray-600 mb-4">{ceremony.description}</p>
                  )}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Assigned Team:</p>
                    <div className="flex flex-wrap gap-2">
                      {getAssignedMembers(ceremony.id).map((member) => (
                        <div key={member.id} className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={member.avatarUrl} />
                            <AvatarFallback className="text-xs">
                              {getInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{member.name}</span>
                        </div>
                      ))}
                      {getAssignedMembers(ceremony.id).length === 0 && (
                        <span className="text-sm text-gray-500">No team assigned</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {ceremonies.length === 0 && (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No ceremonies added</h3>
              <p className="text-gray-600 mb-4">
                Add ceremonies or sessions to organize your event timeline
              </p>
              <Button 
                className="bg-amber-500 hover:bg-amber-600"
                onClick={() => setIsAddCeremonyOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Ceremony
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Team Assignments</h2>
            <Dialog open={isAssignTeamOpen} onOpenChange={setIsAssignTeamOpen}>
              <DialogTrigger asChild>
                <Button className="bg-amber-500 hover:bg-amber-600">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Assign Team Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign Team Member</DialogTitle>
                  <DialogDescription>
                    Assign a team member to this event or specific ceremony
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAssignTeam} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="teamMember">Team Member</Label>
                    <Select value={newAssignment.teamMemberId} onValueChange={(value) => setNewAssignment({ ...newAssignment, teamMemberId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team member" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamMembers.filter(m => m.isActive).map(member => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name} - {member.role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ceremony">Ceremony (Optional)</Label>
                    <Select value={newAssignment.ceremonyId} onValueChange={(value) => setNewAssignment({ ...newAssignment, ceremonyId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ceremony or leave blank for entire event" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Entire Event</SelectItem>
                        {ceremonies.map(ceremony => (
                          <SelectItem key={ceremony.id} value={ceremony.id}>
                            {ceremony.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignmentRole">Role (Optional)</Label>
                    <Input
                      id="assignmentRole"
                      placeholder="e.g., Lead Photographer"
                      value={newAssignment.role}
                      onChange={(e) => setNewAssignment({ ...newAssignment, role: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAssignTeamOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
                      Assign Member
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {assignments.map((assignment) => {
              const member = teamMembers.find(m => m.id === assignment.teamMemberId)
              const ceremony = ceremonies.find(c => c.id === assignment.ceremonyId)
              
              if (!member) return null

              return (
                <Card key={assignment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatarUrl} />
                          <AvatarFallback className="bg-amber-100 text-amber-700">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-gray-600">
                            {assignment.role || member.role}
                            {ceremony && ` • ${ceremony.name}`}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {assignments.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No team assigned</h3>
              <p className="text-gray-600 mb-4">
                Assign team members to this event to get started
              </p>
              <Button 
                className="bg-amber-500 hover:bg-amber-600"
                onClick={() => setIsAssignTeamOpen(true)}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Assign Your First Team Member
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="photos" className="space-y-6">
          <div className="text-center py-12">
            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No photos uploaded yet</h3>
            <p className="text-gray-600">
              Photos will appear here once team members start uploading
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}