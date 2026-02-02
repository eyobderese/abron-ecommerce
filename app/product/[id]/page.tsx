'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url: string
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    message: '',
  })

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      const found = data.find((p: Product) => p.id === productId)
      if (found) {
        setProduct(found)
      } else {
        setError('Product not found')
      }
    } catch (err) {
      setError('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          ...formData,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to submit inquiry')
      }

      setSubmitted(true)
      setFormData({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        message: '',
      })

      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (err) {
      setError('Failed to submit inquiry. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-96 bg-muted rounded-lg" />
            <div className="h-32 bg-muted rounded-lg" />
          </div>
        </div>
      </main>
    )
  }

  if (!product || error) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
            <p className="text-lg text-muted-foreground">{error || 'Product not found'}</p>
            <Link href="/">
              <Button>Back to Shop</Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div>
            <div className="bg-muted rounded-lg h-96 flex items-center justify-center overflow-hidden">
              {product.image_url && product.image_url !== '/images/shoe-1.jpg' ? (
                <Image
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5" />
              )}
            </div>
          </div>

          {/* Product Info & Form */}
          <div className="space-y-6">
            <div>
              <div className="text-sm font-medium text-primary mb-2">{product.category}</div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-lg text-muted-foreground mb-4">{product.description}</p>
              <div className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</div>
            </div>

            {/* Inquiry Form */}
            <Card className="p-6">
              {submitted ? (
                <div className="text-center space-y-4">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Inquiry Sent!</h3>
                    <p className="text-muted-foreground mb-4">
                      We&apos;ve received your inquiry. We&apos;ll contact you soon.
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">Redirecting to shop...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-semibold text-lg">Send an Inquiry</h3>

                  {error && (
                    <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <Label htmlFor="customer_name">Full Name *</Label>
                    <Input
                      id="customer_name"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      required
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <Label htmlFor="customer_email">Email *</Label>
                    <Input
                      id="customer_email"
                      name="customer_email"
                      type="email"
                      value={formData.customer_email}
                      onChange={handleInputChange}
                      required
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="customer_phone">Phone</Label>
                    <Input
                      id="customer_phone"
                      name="customer_phone"
                      value={formData.customer_phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      placeholder="Tell us about your interest in this product..."
                      className="min-h-24"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={submitting}
                  >
                    {submitting ? 'Sending...' : 'Send Inquiry'}
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
