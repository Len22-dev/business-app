"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Tag,  } from "lucide-react"
import { AddLocationModal } from "./modal/addLocation-modal"
import { EditLocationModal } from "./modal/editLocation-modal"

interface Location {
  id: number
  name: string
  description: string
  address: string
  createdDate: string
  lastUpdated: string
}

export function LocationsTab({businessId}:{businessId: string}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)

  const locations = [
    {
      id: 1,
      name: "Electronics",
      description: "Electronic devices and gadgets",
      address: "23, Olaoluwa street, Lagos state",
      createdDate: "2024-01-01",
      lastUpdated: "2024-01-15",
    },
    {
      id: 2,
      name: "Computers",
      description: "Laptops, desktops, and computer accessories",
      address: "25, Olayemi street, Ikeja Lagos state",
      createdDate: "2024-01-01",
      lastUpdated: "2024-01-14",
    },
    {
      id: 3,
      name: "Mobile Phones",
      description: "Smartphones and mobile accessories",
      address: "23, Fiyinfoluwa street, Oshodi Lagos state",
      createdDate: "2024-01-01",
      lastUpdated: "2024-01-15",
    },
    {
      id: 4,
      name: "Accessories",
      description: "Various tech accessories and peripherals",
      address: "23, Oremeji street, Ojodu-berger, Lagos state",
      createdDate: "2024-01-02",
      lastUpdated: "2024-01-13",
    },
    {
      id: 5,
      name: "Gaming",
      description: "Gaming consoles, games, and accessories",
      address: "23, Adetona street, Surulere Lagos state",
      createdDate: "2024-01-05",
      lastUpdated: "2024-01-12",
    },
  ]

  const filteredLocation = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (location: Location) => {
    setSelectedLocation(location)
    setShowEditModal(true)
  }

  

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Location</CardTitle>
            <Tag className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{location.length}</div>
            <p className="text-xs text-muted-foreground">Active product location</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Across all location</p>
          </CardContent>
        </Card> */}
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Tag className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Combined inventory value</p>
          </CardContent>
        </Card> */}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Location
              </CardTitle>
              <CardDescription>Organize your location/warehouse for better management</CardDescription>
            </div>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Location Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Last Updated</TableHead>
                  {/* <TableHead>Actions</TableHead> */}
                  <TableHead className="w-[50px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLocation.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{location.name}</p>
                          <p className="text-sm text-muted-foreground">Created: {location.createdDate}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{location.description}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{location.address} Address</Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{location.lastUpdated}</p>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(location)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Location
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Location
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredLocation.length === 0 && (
            <div className="text-center py-8">
              <Tag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No location found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? "Try adjusting your search" : "Get started by creating your first product category"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AddLocationModal open={showAddModal} onOpenChange={setShowAddModal} businessId={businessId}/>
      {selectedLocation &&(
        <EditLocationModal 
        open={showEditModal} 
        onOpenChange={setShowEditModal} 
        location={selectedLocation} 
        />
        )}
    </div>
  )
}
