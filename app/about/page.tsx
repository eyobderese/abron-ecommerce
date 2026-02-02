import Header from '@/components/header'
import Footer from '@/components/footer'
import { Card } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'

export default function About() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">About ShopEasy</h1>
            <p className="text-lg text-muted-foreground">
              ShopEasy is your go-to destination for premium shoes, stylish clothes, and quality cosmetics.
              We believe in providing excellent customer service and a seamless shopping experience.
            </p>
          </div>

          <Card className="p-8 bg-primary/5 border-primary/20">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-4">
              We are committed to offering a curated selection of high-quality products that meet the needs and preferences of our diverse customer base. Our easy inquiry system allows you to get personalized attention for any product you&apos;re interested in.
            </p>
            <p className="text-muted-foreground">
              Every product in our collection is carefully selected to ensure quality, style, and value. We pride ourselves on our responsive customer service and commitment to customer satisfaction.
            </p>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Premium Quality', description: 'All products are carefully selected for quality and style' },
              { title: 'Easy to Use', description: 'Browse, filter, and send inquiries in just a few clicks' },
              { title: 'Fast Response', description: 'Our team responds to inquiries quickly and professionally' },
            ].map((feature, i) => (
              <Card key={i} className="p-6">
                <CheckCircle className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
