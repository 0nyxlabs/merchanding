import type { FC } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'

export const NotFound: FC = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <FileQuestion className="mb-6 h-16 w-16 text-muted-foreground" />
      <h2 className="text-3xl font-bold tracking-tight">Page not found</h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link to="/">Go Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/browse">Browse Campaigns</Link>
        </Button>
      </div>
    </div>
  )
}
