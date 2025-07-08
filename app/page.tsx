"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, MapPin, Phone, Wifi } from "lucide-react"

const menuData = {
  restaurant: {
    name: "Bella Vista",
    tagline: "Authentic Italian Cuisine",
    phone: "(555) 123-4567",
    address: "123 Main Street, Downtown",
    wifi: "BellaVista_Guest",
  },
  categories: [
    {
      id: "appetizers",
      name: "Appetizers",
      items: [
        {
          name: "Bruschetta Classica",
          description: "Toasted bread topped with fresh tomatoes, basil, and garlic",
          price: "$12",
          dietary: ["vegetarian"],
        },
        {
          name: "Calamari Fritti",
          description: "Crispy fried squid rings served with marinara sauce",
          price: "$16",
          dietary: [],
        },
        {
          name: "Antipasto Platter",
          description: "Selection of cured meats, cheeses, olives, and roasted vegetables",
          price: "$22",
          dietary: ["gluten-free"],
        },
      ],
    },
    {
      id: "mains",
      name: "Main Courses",
      items: [
        {
          name: "Spaghetti Carbonara",
          description: "Classic Roman pasta with eggs, pancetta, and Parmesan cheese",
          price: "$24",
          dietary: [],
        },
        {
          name: "Margherita Pizza",
          description: "Fresh mozzarella, tomato sauce, and basil on wood-fired crust",
          price: "$20",
          dietary: ["vegetarian"],
        },
        {
          name: "Osso Buco",
          description: "Braised veal shanks with saffron risotto and gremolata",
          price: "$38",
          dietary: ["gluten-free"],
        },
        {
          name: "Branzino al Sale",
          description: "Mediterranean sea bass baked in sea salt with herbs",
          price: "$32",
          dietary: ["gluten-free"],
        },
      ],
    },
    {
      id: "desserts",
      name: "Desserts",
      items: [
        {
          name: "Tiramisu",
          description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone",
          price: "$12",
          dietary: ["vegetarian"],
        },
        {
          name: "Panna Cotta",
          description: "Vanilla bean custard with berry compote",
          price: "$10",
          dietary: ["vegetarian", "gluten-free"],
        },
        {
          name: "Gelato Selection",
          description: "Three scoops of house-made gelato (ask server for flavors)",
          price: "$8",
          dietary: ["vegetarian"],
        },
      ],
    },
    {
      id: "beverages",
      name: "Beverages",
      items: [
        {
          name: "House Wine",
          description: "Red or white wine by the glass",
          price: "$9",
          dietary: [],
        },
        {
          name: "Espresso",
          description: "Traditional Italian espresso",
          price: "$4",
          dietary: ["vegan"],
        },
        {
          name: "San Pellegrino",
          description: "Sparkling mineral water",
          price: "$5",
          dietary: ["vegan"],
        },
        {
          name: "Fresh Lemonade",
          description: "House-made with organic lemons",
          price: "$6",
          dietary: ["vegan"],
        },
      ],
    },
  ],
}

const getDietaryBadgeColor = (dietary: string) => {
  switch (dietary) {
    case "vegetarian":
      return "bg-green-100 text-green-800 hover:bg-green-200"
    case "vegan":
      return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
    case "gluten-free":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200"
  }
}

export default function RestaurantMenu() {
  const [activeTab, setActiveTab] = useState("appetizers")

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{menuData.restaurant.name}</h1>
            <p className="text-lg text-amber-600 font-medium mb-4">{menuData.restaurant.tagline}</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{menuData.restaurant.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{menuData.restaurant.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4" />
                <span>WiFi: {menuData.restaurant.wifi}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            {menuData.categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs sm:text-sm">
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {menuData.categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.name}</h2>

                <div className="grid gap-4">
                  {category.items.map((item, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-lg font-semibold text-gray-900">{item.name}</CardTitle>
                            <CardDescription className="mt-2 text-gray-600 leading-relaxed">
                              {item.description}
                            </CardDescription>
                          </div>
                          <div className="ml-4 text-right">
                            <span className="text-xl font-bold text-amber-600">{item.price}</span>
                          </div>
                        </div>
                      </CardHeader>

                      {item.dietary.length > 0 && (
                        <CardContent className="pt-0">
                          <div className="flex flex-wrap gap-2">
                            {item.dietary.map((diet) => (
                              <Badge key={diet} variant="secondary" className={getDietaryBadgeColor(diet)}>
                                {diet}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Open Daily: 11:30 AM - 10:00 PM</span>
          </div>
          <p className="text-xs text-gray-500">Please inform your server of any allergies or dietary restrictions</p>
        </div>
      </div>
    </div>
  )
}
