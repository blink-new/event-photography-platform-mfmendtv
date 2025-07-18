import { useState, useEffect } from 'react'
import { Plus, Users, Mail, Phone, Camera, Search, MoreHorizontal, UserPlus, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { TeamMember } from '@/types'

export function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { toast } = useToast()

  // Form state for creating new team member
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    specialization: ''
  })

  useEffect(() => {
    loadTeamMembers()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadTeamMembers = async () => {
    try {
      // Mock data for demonstration
      const mockTeamMembers: TeamMember[] = [
        {
          id: '1',
          studioId: 'studio_1',
          name: 'Alex Rodriguez',
          email: 'alex@photostudio.com',
          phone: '+1234567890',
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
          phone: '+1234567891',
          role: 'Photographer',
          specialization: 'Portrait Photography',
          avatarUrl: '',
          isActive: true,
          createdAt: '2024-01-02T10:00:00Z',
          updatedAt: '2024-01-02T10:00:00Z'
        },
        {
          id: '3',
          studioId: 'studio_1',
          name: 'Mike Johnson',
          email: 'mike@photostudio.com',
          phone: '+1234567892',
          role: 'Assistant Photographer',
          specialization: 'Event Photography',
          avatarUrl: '',
          isActive: true,
          createdAt: '2024-01-03T10:00:00Z',
          updatedAt: '2024-01-03T10:00:00Z'
        },
        {
          id: '4',
          studioId: 'studio_1',
          name: 'Emma Wilson',
          email: 'emma@photostudio.com',
          phone: '+1234567893',
          role: 'Photo Editor',
          specialization: 'Post-Processing',
          avatarUrl: '',
          isActive: false,
          createdAt: '2024-01-04T10:00:00Z',
          updatedAt: '2024-01-04T10:00:00Z'
        }
      ]
      setTeamMembers(mockTeamMembers)
    } catch (error) {
      console.error('Failed to load team members:', error)
      toast({
        title: 'Error',
        description: 'Failed to load team members',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const memberData: TeamMember = {
        id: `member_${Date.now()}`,
        studioId: 'studio_1',
        ...newMember,
        avatarUrl: '',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // In a real app, you'd save to database
      setTeamMembers(prev => [memberData, ...prev])
      
      toast({
        title: 'Success',
        description: 'Team member added successfully'
      })
      
      setIsCreateDialogOpen(false)
      setNewMember({
        name: '',
        email: '',
        phone: '',
        role: '',
        specialization: ''
      })
    } catch (error) {
      console.error('Failed to create team member:', error)
      toast({
        title: 'Error',
        description: 'Failed to add team member',
        variant: 'destructive'
      })
    }
  }

  const handleToggleStatus = (memberId: string) => {
    setTeamMembers(prev => 
      prev.map(member => 
        member.id === memberId 
          ? { ...member, isActive: !member.isActive }
          : member
      )
    )
    toast({
      title: 'Success',
      description: 'Team member status updated'
    })
  }

  const handleDeleteMember = (memberId: string) => {
    setTeamMembers(prev => prev.filter(member => member.id !== memberId))
    toast({
      title: 'Success',
      description: 'Team member removed'
    })
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Users className="h-8 w-8 text-amber-500 animate-pulse mx-auto mb-2" />
          <p className="text-gray-500">Loading team members...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600">Manage your photography team members</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-500 hover:bg-amber-600">
              <Plus className="mr-2 h-4 w-4" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
              <DialogDescription>
                Add a new photographer or team member to your studio
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateMember} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="memberName">Full Name</Label>
                <Input
                  id="memberName"
                  placeholder="e.g., Alex Rodriguez"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="memberEmail">Email</Label>
                <Input
                  id="memberEmail"
                  type="email"
                  placeholder="alex@photostudio.com"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="memberPhone">Phone (Optional)</Label>
                <Input
                  id="memberPhone"
                  placeholder="+1234567890"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="memberRole">Role</Label>
                <Select value={newMember.role} onValueChange={(value) => setNewMember({ ...newMember, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lead Photographer">Lead Photographer</SelectItem>
                    <SelectItem value="Photographer">Photographer</SelectItem>
                    <SelectItem value="Assistant Photographer">Assistant Photographer</SelectItem>
                    <SelectItem value="Photo Editor">Photo Editor</SelectItem>
                    <SelectItem value="Videographer">Videographer</SelectItem>
                    <SelectItem value="Equipment Manager">Equipment Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="memberSpecialization">Specialization (Optional)</Label>
                <Select value={newMember.specialization} onValueChange={(value) => setNewMember({ ...newMember, specialization: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Wedding Photography">Wedding Photography</SelectItem>
                    <SelectItem value="Portrait Photography">Portrait Photography</SelectItem>
                    <SelectItem value="Event Photography">Event Photography</SelectItem>
                    <SelectItem value="Corporate Photography">Corporate Photography</SelectItem>
                    <SelectItem value="Fashion Photography">Fashion Photography</SelectItem>
                    <SelectItem value="Product Photography">Product Photography</SelectItem>
                    <SelectItem value="Post-Processing">Post-Processing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
                  Add Member
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
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-sm text-gray-600">Total Members</p>
                <p className="text-xl font-bold">{teamMembers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-xl font-bold">{teamMembers.filter(m => m.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Camera className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Photographers</p>
                <p className="text-xl font-bold">{teamMembers.filter(m => m.role?.includes('Photographer')).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Edit className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Editors</p>
                <p className="text-xl font-bold">{teamMembers.filter(m => m.role?.includes('Editor')).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatarUrl} />
                    <AvatarFallback className="bg-amber-100 text-amber-700">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={member.isActive ? 'default' : 'secondary'}>
                    {member.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit Details</DropdownMenuItem>
                      <DropdownMenuItem>View Assignments</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleStatus(member.id)}>
                        {member.isActive ? 'Deactivate' : 'Activate'}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteMember(member.id)}
                      >
                        Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {member.specialization && (
                <div className="flex items-center text-sm text-gray-600">
                  <Camera className="mr-2 h-4 w-4" />
                  {member.specialization}
                </div>
              )}
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="mr-2 h-4 w-4" />
                {member.email}
              </div>
              {member.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="mr-2 h-4 w-4" />
                  {member.phone}
                </div>
              )}
              <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
                <span>Joined {new Date(member.createdAt).toLocaleDateString()}</span>
                <span>0 assignments</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Try adjusting your search criteria'
              : 'Get started by adding your first team member'
            }
          </p>
          {!searchTerm && (
            <Button 
              className="bg-amber-500 hover:bg-amber-600"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Team Member
            </Button>
          )}
        </div>
      )}
    </div>
  )
}