"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, ChevronLeft, ChevronRight, X } from "lucide-react";

const jobListings = [
  {
    id: 1,
    title: "Build a responsive e-commerce website",
    timeRemaining: "6 days left",
    skills: ["PHP", "Website Design", "HTML", "CSS"],
    tags: ["FEATURED", "URGENT"],
    budget: "₹12500-37500",
    description: "I need a modern e-commerce website built with responsive design..."
  },
  {
    id: 2,
    title: "Mobile app UI/UX design",
    timeRemaining: "4 days left", 
    skills: ["Mobile App Development", "User Interface / IA", "Graphic Design"],
    tags: ["SEALED", "NDA"],
    budget: "₹7500-25000",
    description: "Looking for an experienced designer to create mobile app interfaces..."
  },
  {
    id: 3,
    title: "Content writing for blog posts",
    timeRemaining: "2 days left",
    skills: ["Article Writing", "Blog", "Content Writing", "Copywriting"],
    tags: ["URGENT"],
    budget: "₹1500-12500",
    description: "Need high-quality blog content for technology website..."
  }
];

const recentSearches = [
  "Web development",
  "Graphic design", 
  "Content writing",
  "Mobile apps"
];

export default function FindJobsPage() {
  const [showBottomBanner, setShowBottomBanner] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Top Jobs</h1>
            <div className="flex gap-3">
              <Button variant="outline">Hire a Freelancer</Button>
              <Button>Earn Money Freelancing</Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex gap-4 max-w-4xl">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search for jobs..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <Select defaultValue="online">
              <SelectTrigger className="w-48 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online Job</SelectItem>
                <SelectItem value="local">Local Job</SelectItem>
              </SelectContent>
            </Select>
            <Button size="lg" className="px-8">Search</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-4 gap-6">
          {/* Left Sidebar - Filters */}
          <div className="col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Recent Searches */}
                  <div>
                    <h3 className="font-semibold mb-3">My recent searches</h3>
                    <div className="space-y-2">
                      {recentSearches.map((search, index) => (
                        <Link key={index} href="#" className="block text-sm text-blue-600 hover:underline">
                          {search}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Filter by Budget */}
                  <div>
                    <h3 className="font-semibold mb-3">Filter by</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Budget</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm text-gray-600 mb-1 block">Fixed Price Projects</label>
                            <div className="flex gap-2">
                              <Input placeholder="Min" className="h-8" />
                              <Input placeholder="Max" className="h-8" />
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 mb-1 block">Hourly Projects</label>
                            <div className="flex gap-2">
                              <Input placeholder="Min" className="h-8" />
                              <Input placeholder="Max" className="h-8" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Select defaultValue="all">
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Durations</SelectItem>
                            <SelectItem value="short">Less than 1 month</SelectItem>
                            <SelectItem value="medium">1-3 months</SelectItem>
                            <SelectItem value="long">More than 3 months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Project Type</h4>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="contests" />
                          <label htmlFor="contests" className="text-sm">Contests</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Job Listings */}
          <div className="col-span-3">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Page 1 of 50</span>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" disabled>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="bg-blue-600 text-white">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Select defaultValue="newest">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="budget-high">Highest budget</SelectItem>
                  <SelectItem value="budget-low">Lowest budget</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {jobListings.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <Link href="#" className="text-lg font-semibold text-blue-600 hover:underline">
                        {job.title}
                      </Link>
                      <span className="text-sm text-gray-500">{job.timeRemaining}</span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.map((skill, index) => (
                        <Link key={index} href="#" className="text-xs text-blue-600 hover:underline">
                          {skill}
                        </Link>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        {job.tags.map((tag, index) => (
                          <Badge key={index} variant={tag === 'FEATURED' ? 'default' : 'secondary'} className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <span className="font-semibold text-green-600">{job.budget}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      {showBottomBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white p-4 shadow-lg z-50">
          <div className="container mx-auto flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Need to hire a freelancer for a job?</h3>
              <p className="text-sm text-blue-100">It's free to sign up, type in what you need & receive free quotes in seconds</p>
            </div>
            <div className="flex items-center gap-4">
              <Input 
                placeholder="What do you need done?" 
                className="w-80 bg-white text-black"
              />
              <Button variant="secondary">Post a Project</Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowBottomBanner(false)}
                className="text-white hover:bg-blue-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}