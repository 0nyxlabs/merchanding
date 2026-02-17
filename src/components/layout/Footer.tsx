import type { FC } from 'react'
import { Link } from '@tanstack/react-router'
import { APP_NAME } from '@/utils/constants'
import { Separator } from '@/components/ui/separator'

export const Footer: FC = () => {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold">{APP_NAME}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Browse and purchase custom-designed merchandise.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <Link to="/browse" className="text-sm text-muted-foreground hover:text-foreground">
                  Browse
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Account</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <Link to="/orders" className="text-sm text-muted-foreground hover:text-foreground">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/designs" className="text-sm text-muted-foreground hover:text-foreground">
                  My Designs
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <Separator className="my-6" />
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
