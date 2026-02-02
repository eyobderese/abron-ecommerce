'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageCircle } from 'lucide-react'

interface ProductCardProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    category: string
    image_url: string
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader className="p-0 bg-muted/50 relative">
        <div className="relative w-full h-48 bg-muted flex items-center justify-center">
          {product.image_url && product.image_url !== '/images/shoe-1.jpg' ? (
            <Image
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5" />
          )}
        </div>
        <Badge className="absolute top-3 right-3" variant="secondary">
          {product.category}
        </Badge>
      </CardHeader>

      <CardContent className="flex-grow p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {product.description}
        </p>
        <div className="text-2xl font-bold text-primary">
          ${product.price.toFixed(2)}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link href={`/product/${product.id}`} className="w-full">
          <Button className="w-full gap-2">
            <MessageCircle className="w-4 h-4" />
            Send Inquiry
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
