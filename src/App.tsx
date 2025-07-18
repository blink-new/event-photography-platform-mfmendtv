import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { EventsPage } from '@/pages/EventsPage'
import { EventDetailsPage } from '@/pages/EventDetailsPage'
import { TeamPage } from '@/pages/TeamPage'
import { PhotoUploadPage } from '@/pages/PhotoUploadPage'
import { GalleryPage } from '@/pages/GalleryPage'
import { Toaster } from '@/components/ui/toaster'
import { useAuth } from '@/hooks/useAuth'

function App() {
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  const renderContent = () => {
    // Handle event details navigation
    if (selectedEventId) {
      return (
        <EventDetailsPage 
          eventId={selectedEventId} 
          onBack={() => {
            setSelectedEventId(null)
            setActiveTab('events')
          }} 
        />
      )
    }

    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />
      case 'events':
        return (
          <EventsPage 
            onEventSelect={(eventId) => setSelectedEventId(eventId)}
          />
        )
      case 'team':
        return <TeamPage />
      case 'galleries':
        return <GalleryPage />
      case 'photos':
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Photo Management</h2>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        )
      case 'assignments':
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">My Assignments</h2>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        )
      case 'upload':
        return <PhotoUploadPage />
      case 'settings':
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Settings</h2>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        )
      default:
        return <DashboardPage />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} studioName={user.studioName || 'PhotoStudio Pro'} />
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          userRole={user.role || 'studio'}
        />
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
      <Toaster />
    </div>
  )
}

export default App