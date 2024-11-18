'use client'

import Image from 'next/image'
import { Check} from 'lucide-react'
import solar from "../components/assets/solarpackages.jpeg"
import { useState } from 'react'


import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from '@/hooks/use-toast'

 

const packages = [
  {
    name: "Basic Package",
    description: "Perfect for small households",
    price: "$1,699",
    components: [
      "4x Solar Panels (400W each)",
      "1x 3kW Inverter",
      "Basic Mounting System",
      "2.4kWh Battery Unit"
    ],
    powers: [
      "Small Fridge",
      "Lighting Systems",
      "Essential Electronics"
    ],
    warranty: [
      "2 Years System Warranty",
      "25 Years Panel Performance",
      "2 Years Battery Warranty",
      "Basic Support"
    ]
  },
  {
    name: "Premium Package",
    description: "Ideal for medium to large homes",
    price: "$2,999",
    components: [
      "8x Solar Panels (400W each)",
      "1x 5kW Inverter",
      "Premium Mounting System",
      "Premium Protection",
      "5.4kWh Battery Unit"
    ],
    powers: [
      "All Non-heating Home Appliances",
      "1Hp Borehole Pump",
      "Fridge and Freezer"
    ],
    warranty: [
      "5 Years System Warranty",
      "25 Years Panel Performance",
      "3 Years Battery Warranty",
      "Prompt Support"
    ]
  },
  {
    name: "Elite Package",
    description: "Complete energy independence",
    price: "$7,599",
    components: [
      "12x Solar Panels (400W each)",
      "1x 10kW Inverter",
      "Premium Mounting System",
      "Elite Protection",
      "Dual 5.4kWh Battery Storage",
      "Smart Energy Management"
    ],
    powers: [
      "Complete Home Power",
      "Microwave",
      "Pool & Borehole Pump",
      "Home Business Setup"
    ],
    warranty: [
      "10 Years System Warranty",
      "25 Years Panel Performance",
      "5 Years Battery Warranty",
      "24/7 Premium Support"
    ]
  }
]

export default function Component() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false);
  const [success, setSuccess]= useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast()
  const handleGetStarted = (packageName: string) => {
    setSelectedPackage(packageName)
    setIsDialogOpen(true)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget)
    const name = formData.get('name')
    const email = formData.get('email')
    const phone = formData.get('phone')
    const address = formData.get('address')
    const orderDate = new Date().toISOString()
    const orderData = {
      name,
      email,
      phone,
      address,
      selectedPackage,
      orderDate: orderDate
    }

    try {
      const response = await fetch('api/get-solar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })

      if (response.ok) {
        setSuccess(true);
        setError(null);
        toast({
          title: "Order Placed",
          description: `Thank you for your order of the ${selectedPackage}. We'll be in touch soon!`,
        })
      
      } else {
        const errorMessage = await response.text();
        setError(errorMessage);
        toast({
          title: "Error Occurred",
          description: `There was an issue with your order of the ${selectedPackage}. Please try again.`,
        })
        
      }
    } catch (error: unknown) {
    
       if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
      })
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Pre-Designed Solar Packages</h2>
        <p className="text-foreground max-w-2xl mx-auto">
          Choose the perfect solar solution for your needs. Our packages are designed to provide optimal performance and
          reliability for different energy requirements.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
          <Image
            src={solar}
            alt="Solar Panel Installation"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="text-2xl font-bold mb-4">Harness the Power of the Sun</h3>
          <p className="text-foreground mb-6">
            Our solar packages are designed to maximize energy production and minimize your carbon footprint. With
            state-of-the-art panels and advanced inverter technology, you&apos;ll be generating clean, renewable energy in no
            time.
          </p>
          
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {packages.map((pkg, index) => (
          <Card key={index} className={`flex flex-col border-2 ${index === 1 ? 'border-green-900' : ''}`}>
            <CardHeader>
              {index === 1 && (
                <div className="text-center mb-2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 text-sm rounded-full">Most Popular</span>
                </div>
              )}
              <CardTitle className="text-2xl">{pkg.name}</CardTitle>
              <CardDescription>{pkg.description}</CardDescription>
              <p className="text-3xl font-bold mt-2">{pkg.price}</p>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Components</h3>
                  <ul className="space-y-2">
                    {pkg.components.map((component, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        {component}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Powers</h3>
                  <ul className="space-y-2">
                    {pkg.powers.map((power, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        {power}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Warranty</h3>
                  <ul className="space-y-2">
                    {pkg.warranty.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleGetStarted(pkg.name)}>Order Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order {selectedPackage}</DialogTitle>
            <DialogDescription>
              Fill out the form below to place your order for the {selectedPackage}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" name="name" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input id="email" name="email" type="email" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input id="phone" name="phone" type="tel" className="col-span-3" required />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Input id="address" name="address" type="tel" className="col-span-3" required />
              </div>
            </div>
            <DialogFooter>
              <Button className="bg-white hover:bg-gray-400 text-black"
              disabled={loading}
              type="submit">
                {loading ? 'Placing Order...' : 'Place Order'}
              </Button>

              
            </DialogFooter>
            {success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mt-6">
              Order Placed Successfully!
            </div>
          )}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-6">
              An error occured please try again later
            </div>
          )}
          </form>
          
        </DialogContent>
      </Dialog>
    </div>
  )
}