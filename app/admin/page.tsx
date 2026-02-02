'use client'

import React from "react"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { ArrowLeft, Plus, Trash2, Edit2, CheckCircle, Clock, AlertCircle } from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url: string
  created_at: string
}

interface Inquiry {
  id: string
  product_id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  message: string
  status: 'pending' | 'contacted' | 'resolved'
  created_at: string
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isAddingProduct, setIsAddingProduct] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Shoes',
    image_url: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, inquiriesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/inquiries'),
      ])

      if (productsRes.ok) {
        setProducts(await productsRes.json())
      }
      if (inquiriesRes.ok) {
        setInquiries(await inquiriesRes.json())
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!imageFile) {
      alert('Please select an image')
      return
    }

    setUploading(true)
    try {
      // Upload image to Supabase Storage
      const formDataWithImage = new FormData()
      formDataWithImage.append('file', imageFile)
      formDataWithImage.append('bucket', 'product-images')

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formDataWithImage,
      })

      if (!uploadRes.ok) throw new Error('Upload failed')
      const { imageUrl } = await uploadRes.json()

      // Create product with the uploaded image URL
      const createRes = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          image_url: imageUrl,
          price: parseFloat(formData.price),
        }),
      })

      if (createRes.ok) {
        alert('Product added successfully!')
        fetchData()
        setIsAddingProduct(false)
        resetForm()
        setImageFile(null)
      }
    } catch (error) {
      console.error('Failed to add product:', error)
      alert('Failed to add product')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    // Note: Implement product deletion
    alert('Product deletion requires implementation of a DELETE endpoint')
    fetchData()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Shoes',
      image_url: '',
    })
    setImageFile(null)
    setEditingProduct(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'contacted':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-4 h-4 inline mr-1" />
      case 'contacted':
        return <AlertCircle className="w-4 h-4 inline mr-1" />
      default:
        return <Clock className="w-4 h-4 inline mr-1" />
    }
  }

  const updateInquiryStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        // Update local state
        setInquiries(inquiries.map(inq => 
          inq.id === id ? { ...inq, status: newStatus as any } : inq
        ))
      }
    } catch (error) {
      console.error('Failed to update inquiry status:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Shop
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="inquiries" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="inquiries">
              Inquiries ({inquiries.length})
            </TabsTrigger>
            <TabsTrigger value="products">
              Products ({products.length})
            </TabsTrigger>
          </TabsList>

          {/* Inquiries Tab */}
          <TabsContent value="inquiries" className="space-y-6">
            {loading ? (
              <div className="text-center py-8">Loading inquiries...</div>
            ) : inquiries.length === 0 ? (
              <Card className="p-8 text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No inquiries yet</p>
              </Card>
            ) : (
              <Card className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inquiries.map(inquiry => (
                      <TableRow key={inquiry.id}>
                        <TableCell className="font-medium">{inquiry.customer_name}</TableCell>
                        <TableCell className="text-sm">{inquiry.customer_email}</TableCell>
                        <TableCell className="text-sm">{inquiry.customer_phone || '-'}</TableCell>
                        <TableCell className="text-sm max-w-xs truncate">{inquiry.message}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <select
                              value={inquiry.status}
                              onChange={(e) => updateInquiryStatus(inquiry.id, e.target.value)}
                              className="text-xs px-2 py-1 border border-border rounded bg-background"
                            >
                              <option value="pending">Pending</option>
                              <option value="contacted">Contacted</option>
                              <option value="resolved">Resolved</option>
                            </select>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(inquiry.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Product Inventory</h2>
              <Button
                onClick={() => setIsAddingProduct(!isAddingProduct)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </div>

            {isAddingProduct && (
              <Card className="p-6">
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <h3 className="font-semibold">Add New Product</h3>

                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Premium Leather Shoe"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      placeholder="Product description..."
                      className="min-h-24"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price *</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        placeholder="99.99"
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      >
                        <option>Shoes</option>
                        <option>Clothes</option>
                        <option>Cosmetics</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="image">Product Image *</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                      disabled={uploading}
                    />
                    {imageFile && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Selected: {imageFile.name}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={uploading}>
                      {uploading ? 'Uploading...' : 'Add Product'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddingProduct(false)
                        resetForm()
                      }}
                      disabled={uploading}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {loading ? (
              <div className="text-center py-8">Loading products...</div>
            ) : products.length === 0 ? (
              <Card className="p-8 text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No products yet</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <Card key={product.id} className="p-6">
                    <div className="space-y-4">
                      <div>
                        <Badge variant="secondary" className="mb-2">
                          {product.category}
                        </Badge>
                        <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex items-end justify-between">
                        <div className="text-lg font-bold text-primary">
                          ${product.price.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(product.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-border">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2 bg-transparent"
                          disabled
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="gap-2"
                              disabled
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the product.
                            </AlertDialogDescription>
                            <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>
                              Delete
                            </AlertDialogAction>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
