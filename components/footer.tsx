import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <ShoppingBag className="w-6 h-6 text-primary" />
              <span className="text-lg font-bold">ShopEasy</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your destination for premium shoes, clothes, and cosmetics.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <a href="/?category=Shoes" className="text-sm text-muted-foreground hover:text-primary transition">
                  Shoes
                </a>
              </li>
              <li>
                <a href="/?category=Clothes" className="text-sm text-muted-foreground hover:text-primary transition">
                  Clothes
                </a>
              </li>
              <li>
                <a href="/?category=Cosmetics" className="text-sm text-muted-foreground hover:text-primary transition">
                  Cosmetics
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>support@shopeasy.com</li>
              <li>+1 (555) 000-0000</li>
              <li>123 Shop Street, City</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; 2024 ShopEasy. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
