import { useState } from 'react'
import { Camera, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks/useAuth'

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login, registerStudio } = useAuth()

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  })

  // Studio registration form state
  const [studioForm, setStudioForm] = useState({
    studioName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    description: ''
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // For now, we'll use Blink's built-in auth
      // In a real app, you'd validate credentials against your database
      login()
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStudioRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // For now, we'll use Blink's built-in auth
      // In a real app, you'd create the studio record first
      registerStudio(studioForm)
    } catch (error) {
      console.error('Registration failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Camera className="h-10 w-10 text-amber-500" />
            <h1 className="text-2xl font-bold text-gray-900">PhotoStudio Pro</h1>
          </div>
          <p className="text-gray-600">Event Photography Management Platform</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
              Sign in to your account or register your studio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Register Studio</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleStudioRegistration} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="studioName">Studio Name</Label>
                    <Input
                      id="studioName"
                      placeholder="Enter your studio name"
                      value={studioForm.studioName}
                      onChange={(e) => setStudioForm({ ...studioForm, studioName: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="registerEmail">Email</Label>
                    <Input
                      id="registerEmail"
                      type="email"
                      placeholder="Enter your email"
                      value={studioForm.email}
                      onChange={(e) => setStudioForm({ ...studioForm, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="registerPassword">Password</Label>
                    <div className="relative">
                      <Input
                        id="registerPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        value={studioForm.password}
                        onChange={(e) => setStudioForm({ ...studioForm, password: e.target.value })}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      placeholder="Enter phone number"
                      value={studioForm.phone}
                      onChange={(e) => setStudioForm({ ...studioForm, phone: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address (Optional)</Label>
                    <Input
                      id="address"
                      placeholder="Enter studio address"
                      value={studioForm.address}
                      onChange={(e) => setStudioForm({ ...studioForm, address: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Tell us about your studio"
                      value={studioForm.description}
                      onChange={(e) => setStudioForm({ ...studioForm, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600" disabled={isLoading}>
                    {isLoading ? 'Creating Studio...' : 'Register Studio'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Team members should contact their studio for login credentials</p>
        </div>
      </div>
    </div>
  )
}