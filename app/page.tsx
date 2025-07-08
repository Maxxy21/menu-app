"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Clock, MapPin, Phone, Search, Wifi, X, MenuIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

import { menuData } from "@/data/menu-data"

const getDietaryBadgeColor = (dietary: string) => {
  switch (dietary) {
    case "vegetarian":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800"
    case "vegan":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800"
    case "gluten-free":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800"
    case "spicy":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
  }
}

export default function RestaurantMenu() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [dietaryFilters, setDietaryFilters] = useState<string[]>([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const { theme, setTheme } = useTheme()

  // Get all unique dietary options
  const allDietaryOptions = Array.from(
    new Set(menuData.categories.flatMap((category) => category.items).flatMap((item) => item.dietary)),
  ).filter(Boolean) as string[]

  // Filter menu items based on search and dietary filters
  const getFilteredItems = (categoryId: string) => {
    let items =
      categoryId === "all"
        ? menuData.categories.flatMap((category) => category.items)
        : menuData.categories.find((c) => c.id === categoryId)?.items || []

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      items = items.filter(
        (item) => item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query),
      )
    }

    // Apply dietary filters
    if (dietaryFilters.length > 0) {
      items = items.filter((item) => dietaryFilters.every((filter) => item.dietary.includes(filter)))
    }

    return items
  }

  // Handle theme toggle
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Toggle dietary filter
  const toggleDietaryFilter = (filter: string) => {
    setDietaryFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
    setDietaryFilters([])
  }

  // Get all categories plus an "all" option
  const allCategories = [{ id: "all", name: "All Items" }, ...menuData.categories]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-950 dark:to-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800 backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{menuData.restaurant.name}</h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative"
                aria-label="Toggle filters"
              >
                <Search size={20} />
                {(searchQuery || dietaryFilters.length > 0) && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-amber-500 rounded-full"></span>
                )}
              </button>

              <div className="flex items-center">
                <Switch
                  id="theme-toggle"
                  checked={theme === "dark"}
                  onCheckedChange={toggleTheme}
                  className="data-[state=checked]:bg-amber-600"
                />
              </div>
            </div>
          </div>

          {/* Restaurant Info - Collapsible on mobile */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden md:hidden"
              >
                <div className="pt-4 pb-2 space-y-3">
                  <p className="text-lg text-amber-600 dark:text-amber-500 font-medium">
                    {menuData.restaurant.tagline}
                  </p>

                  <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400">
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
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Open Daily: 11:30 AM - 10:00 PM</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Restaurant Info - Always visible on desktop */}
          <div className="hidden md:block mt-2">
            <p className="text-lg text-amber-600 dark:text-amber-500 font-medium">{menuData.restaurant.tagline}</p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
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
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Open Daily: 11:30 AM - 10:00 PM</span>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mt-4"
              >
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search menu..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white dark:bg-gray-800"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Dietary Preferences</p>
                    <div className="flex flex-wrap gap-2">
                      {allDietaryOptions.map((option) => (
                        <Badge
                          key={option}
                          variant="outline"
                          className={cn(
                            "cursor-pointer capitalize",
                            dietaryFilters.includes(option) ? getDietaryBadgeColor(option) : "bg-transparent",
                          )}
                          onClick={() => toggleDietaryFilter(option)}
                        >
                          {option}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {(searchQuery || dietaryFilters.length > 0) && (
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetFilters}
                        className="text-gray-600 dark:text-gray-400"
                      >
                        Reset Filters
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Menu Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <ScrollArea className="w-full">
            <TabsList className="w-full mb-6 bg-white/80 dark:bg-gray-800/80 p-1 rounded-lg">
              {allCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="text-sm data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900 dark:data-[state=active]:bg-amber-900/30 dark:data-[state=active]:text-amber-100"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>

          {allCategories.map((category) => {
            const items = getFilteredItems(category.id)

            return (
              <TabsContent key={category.id} value={category.id}>
                <div className="space-y-4">
                  {category.id !== "all" && (
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{category.name}</h2>
                  )}

                  {items.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500 dark:text-gray-400">No items match your search</p>
                      <Button variant="link" onClick={resetFilters} className="mt-2 text-amber-600 dark:text-amber-500">
                        Clear filters
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {items.map((item, index) => (
                        <motion.div
                          key={`${category.id}-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <Dialog>
                            <DialogTrigger asChild>
                              <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                                <div className="flex">
                                  {item.image && (
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                                      <img
                                        src={item.image || "/placeholder.svg"}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  )}
                                  <div className="flex-1 p-4">
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                                          {item.name}
                                        </h3>
                                        <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                                          {item.description}
                                        </p>
                                      </div>
                                      <div className="ml-4 text-right">
                                        <span className="text-xl font-bold text-amber-600 dark:text-amber-500">
                                          {item.price}
                                        </span>
                                      </div>
                                    </div>

                                    {item.dietary.length > 0 && (
                                      <div className="mt-2 flex flex-wrap gap-1">
                                        {item.dietary.map((diet) => (
                                          <Badge
                                            key={diet}
                                            variant="secondary"
                                            className={cn("text-xs", getDietaryBadgeColor(diet))}
                                          >
                                            {diet}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </Card>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-md">
                              {item.image && (
                                <div className="w-full h-48 -mt-6 -mx-6 mb-4">
                                  <img
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    className="w-full h-full object-cover rounded-t-lg"
                                  />
                                </div>
                              )}
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.name}</h3>
                              <p className="text-gray-600 dark:text-gray-400">{item.description}</p>

                              {item.ingredients && (
                                <div className="mt-2">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Ingredients:</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.ingredients}</p>
                                </div>
                              )}

                              {item.dietary.length > 0 && (
                                <div className="mt-2">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Dietary:</h4>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {item.dietary.map((diet) => (
                                      <Badge key={diet} className={getDietaryBadgeColor(diet)}>
                                        {diet}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="mt-4 text-right">
                                <span className="text-2xl font-bold text-amber-600 dark:text-amber-500">
                                  {item.price}
                                </span>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            )
          })}
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-800 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center gap-4">
            <img src="/logo.png" alt={menuData.restaurant.name} className="h-12 w-auto" />

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-md">
              Please inform your server of any allergies or dietary restrictions. Prices are subject to change. All
              prices include applicable taxes.
            </p>

            <div className="flex items-center gap-4 mt-2">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span className="sr-only">Instagram</span>
              </a>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              © {new Date().getFullYear()} {menuData.restaurant.name}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
