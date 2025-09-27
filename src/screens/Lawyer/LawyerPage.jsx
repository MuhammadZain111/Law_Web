import {
    Select, SelectContent,SelectItem,SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";






export default function LawyersPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Find a Lawyer</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters */}
          <Card className="lg:col-span-1">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Filters</h2>

              <div className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input id="search" placeholder="Search by name" className="pl-8" />
                  </div>
                </div>

                {/* Specialization */}
                <div className="space-y-2">
                  <Label>Specialization</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All specializations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All specializations</SelectItem>
                      <SelectItem value="family">Family Law</SelectItem>
                      <SelectItem value="criminal">Criminal Defense</SelectItem>
                      <SelectItem value="corporate">Corporate Law</SelectItem>
                      <SelectItem value="realestate">Real Estate Law</SelectItem>
                      <SelectItem value="ip">Intellectual Property</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All locations</SelectItem>
                      <SelectItem value="newyork">New York, NY</SelectItem>
                      <SelectItem value="losangeles">Los Angeles, CA</SelectItem>
                      <SelectItem value="chicago">Chicago, IL</SelectItem>
                      <SelectItem value="houston">Houston, TX</SelectItem>
                      <SelectItem value="miami">Miami, FL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Rating */}
                <div className="space-y-3">
                  <Label>Rating</Label>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <Checkbox id={`rating-${rating}`} />
                        <Label htmlFor={`rating-${rating}`} className="font-normal">
                          {rating}+ stars
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full">Apply Filters</Button>
              </div>
            </CardContent>
          </Card>

          {/* Lawyer Listings */}
          <div className="lg:col-span-3">
            

          </div>
        </div>
      </div>
    </main>
  );
}
