import type { FC } from 'react'
import { Link } from '@tanstack/react-router'
import { ShoppingCart, Menu, X, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { useCartStore } from '@/store/cartStore'
import { useUIStore } from '@/store/uiStore'
import { APP_NAME } from '@/utils/constants'

export const Header: FC = () => {
  const { user, isAuthenticated, isAdmin, signOut } = useAuth()
  const getTotalItems = useCartStore((s) => s.getTotalItems)
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu, openCartDrawer } = useUIStore()
  const cartCount = getTotalItems()

  const initials = user?.user_metadata?.full_name
    ? (user.user_metadata.full_name as string)
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?'

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-tight" onClick={closeMobileMenu}>
          {APP_NAME}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            to="/browse"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Browse
          </Link>
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated && (
            <Button variant="ghost" size="icon" onClick={openCartDrawer} className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>
          )}

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/orders">
                    Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/designs">
                    My Designs
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <nav className="border-t px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link
              to="/browse"
              className="text-sm font-medium"
              onClick={closeMobileMenu}
            >
              Browse
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/orders" className="text-sm font-medium" onClick={closeMobileMenu}>
                  Orders
                </Link>
                <Link to="/designs" className="text-sm font-medium" onClick={closeMobileMenu}>
                  My Designs
                </Link>
                <Link to="/profile" className="text-sm font-medium" onClick={closeMobileMenu}>
                  Profile
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="text-sm font-medium"
                    onClick={closeMobileMenu}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    closeMobileMenu()
                    signOut()
                  }}
                  className="text-left text-sm font-medium text-destructive"
                >
                  Sign out
                </button>
              </>
            )}
            {!isAuthenticated && (
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link to="/login" onClick={closeMobileMenu}>Sign in</Link>
                </Button>
                <Button size="sm" asChild className="flex-1">
                  <Link to="/register" onClick={closeMobileMenu}>Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
