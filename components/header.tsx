import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Settings } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-background border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold text-foreground">ShopEasy</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-foreground hover:text-primary transition">
            Shop
          </Link>
          <Link href="/about" className="text-foreground hover:text-primary transition">
            About
          </Link>
          <Link href="/contact" className="text-foreground hover:text-primary transition">
            Contact
          </Link>
        </nav>

        <Link href="/admin">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Settings className="w-4 h-4" />
            Admin
          </Button>
        </Link>
      </div>
    </header>
  )
}
