import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useAuth } from '@/hooks/useAuth'
import { authService } from '@/services/auth.service'
import { toast } from 'react-hot-toast'

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export const Route = createFileRoute('/_authenticated/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const fullName = (user?.user_metadata?.full_name as string) ?? ''
  const email = user?.email ?? ''
  const initials = fullName
    ? fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName },
  })

  const onSubmit = async (values: ProfileFormValues) => {
    setIsLoading(true)
    try {
      await authService.updateProfile({ fullName: values.fullName })
      toast.success('Profile updated')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
      <p className="mt-2 text-muted-foreground">Manage your account settings.</p>

      <div className="mt-8 space-y-6">
        {/* Avatar section */}
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{fullName || 'User'}</p>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Edit form */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your account details.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>Email</FormLabel>
                  <Input value={email} disabled className="mt-1" />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Email cannot be changed.
                  </p>
                </div>

                <Separator />

                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 animate-spin" />}
                  Save Changes
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
