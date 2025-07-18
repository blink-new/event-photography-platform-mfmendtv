import { Camera, LogOut, Settings, User, Users, Building } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'

interface HeaderProps {
  user: any
  studioName?: string
}

export function Header({ user, studioName }: HeaderProps) {
  const { logout, switchToTeamMember, switchToStudio } = useAuth()
  
  const handleLogout = () => {
    logout()
  }

  const handleSwitchRole = () => {
    if (user?.role === 'studio') {
      switchToTeamMember('studio_demo', studioName || 'PhotoStudio Pro')
    } else {
      switchToStudio()
    }
  }

  return (
    <header className="border-b bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Camera className="h-8 w-8 text-amber-500" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {studioName || 'Photography Studio'}
              </h1>
              <p className="text-sm text-gray-500">Event Management Platform</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Role Badge */}
          <Badge variant={user?.role === 'studio' ? 'default' : 'secondary'}>
            {user?.role === 'studio' ? (
              <>
                <Building className="mr-1 h-3 w-3" />
                Studio Owner
              </>
            ) : (
              <>
                <Users className="mr-1 h-3 w-3" />
                Team Member
              </>
            )}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user?.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {user?.role === 'studio' ? 'Studio Owner' : 'Team Member'}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSwitchRole}>
                {user?.role === 'studio' ? (
                  <>
                    <Users className="mr-2 h-4 w-4" />
                    <span>Switch to Team Member</span>
                  </>
                ) : (
                  <>
                    <Building className="mr-2 h-4 w-4" />
                    <span>Switch to Studio Owner</span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}