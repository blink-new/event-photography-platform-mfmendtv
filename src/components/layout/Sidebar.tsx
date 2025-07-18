import { 
  Calendar, 
  Camera, 
  Image, 
  Users, 
  FolderOpen, 
  Settings,
  BarChart3,
  Upload
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  userRole: 'studio' | 'team_member'
}

export function Sidebar({ activeTab, onTabChange, userRole }: SidebarProps) {
  const studioNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'team', label: 'Team Members', icon: Users },
    { id: 'galleries', label: 'Galleries', icon: FolderOpen },
    { id: 'photos', label: 'All Photos', icon: Image },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const teamNavItems = [
    { id: 'assignments', label: 'My Assignments', icon: Calendar },
    { id: 'upload', label: 'Upload Photos', icon: Upload },
    { id: 'photos', label: 'My Photos', icon: Camera },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const navItems = userRole === 'studio' ? studioNavItems : teamNavItems

  return (
    <div className="w-64 bg-gray-50 border-r h-full">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? 'default' : 'ghost'}
              className={cn(
                'w-full justify-start',
                activeTab === item.id && 'bg-amber-500 hover:bg-amber-600 text-white'
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          )
        })}
      </nav>
    </div>
  )
}