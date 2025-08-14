"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/side-sheet"
import { Settings, User, Menu, Plus } from "lucide-react"

export default function SideSheetDemo() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    setFormData({ name: "", email: "", message: "" })
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">SideSheet Component Demo</h1>
        <p className="text-muted-foreground text-lg">
          Showcasing different side sheet configurations using shadcn/ui
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Right Side Sheet - Settings */}
        <div className="space-y-4 p-6 border rounded-lg">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings Panel (Right)
          </h3>
          <p className="text-sm text-muted-foreground">
            A settings panel that slides in from the right
          </p>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button className="w-full">
                <Settings className="mr-2 h-4 w-4" />
                Open Settings
              </Button>
            </SheetTrigger>
            <SheetContent side="right" width="md">
              <SheetHeader>
                <SheetTitle>Settings</SheetTitle>
                <SheetDescription>
                  Manage your account settings and preferences
                </SheetDescription>
              </SheetHeader>
              
              <SheetBody>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile Settings
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="profile-name">Display Name</Label>
                        <Input id="profile-name" placeholder="Enter your name" />
                      </div>
                      <div>
                        <Label htmlFor="profile-email">Email</Label>
                        <Input id="profile-email" type="email" placeholder="Enter your email" />
                      </div>
                      <div>
                        <Label htmlFor="profile-bio">Bio</Label>
                        <Textarea id="profile-bio" placeholder="Tell us about yourself" />
                      </div>
                    </div>
                  </div>
                </div>
              </SheetBody>
              
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline">Cancel</Button>
                </SheetClose>
                <Button>Save Changes</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        {/* Left Side Sheet - Navigation */}
        <div className="space-y-4 p-6 border rounded-lg">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Menu className="h-5 w-5" />
            Navigation Menu (Left)
          </h3>
          <p className="text-sm text-muted-foreground">
            A navigation menu that slides in from the left
          </p>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <Menu className="mr-2 h-4 w-4" />
                Open Menu
              </Button>
            </SheetTrigger>
            <SheetContent side="left" width="sm">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>
                  Quick access to all sections
                </SheetDescription>
              </SheetHeader>
              
              <SheetBody>
                <nav className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New
                  </Button>
                </nav>
              </SheetBody>
            </SheetContent>
          </Sheet>
        </div>

        {/* Contact Form Sheet */}
        <div className="space-y-4 p-6 border rounded-lg">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Contact Form
          </h3>
          <p className="text-sm text-muted-foreground">
            A contact form in a side sheet
          </p>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="default" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Contact Us
              </Button>
            </SheetTrigger>
            <SheetContent side="right" width="md">
              <SheetHeader>
                <SheetTitle>Get in Touch</SheetTitle>
                <SheetDescription>
                  Send us a message and we will get back to you soon
                </SheetDescription>
              </SheetHeader>
              
              <SheetBody>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="contact-name">Name</Label>
                    <Input
                      id="contact-name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contact-message">Message</Label>
                    <Textarea
                      id="contact-message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us how we can help you..."
                      rows={6}
                      required
                    />
                  </div>
                </form>
              </SheetBody>
              
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline">Cancel</Button>
                </SheetClose>
                <Button onClick={handleSubmit}>Send Message</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        {/* Wide Sheet Example */}
        <div className="space-y-4 p-6 border rounded-lg">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Wide Panel
          </h3>
          <p className="text-sm text-muted-foreground">
            A wider side sheet for more content
          </p>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary" className="w-full">
                <Settings className="mr-2 h-4 w-4" />
                Open Wide Panel
              </Button>
            </SheetTrigger>
            <SheetContent side="right" width="xl">
              <SheetHeader>
                <SheetTitle>Wide Side Panel</SheetTitle>
                <SheetDescription>
                  This panel is wider and can hold more content
                </SheetDescription>
              </SheetHeader>
              
              <SheetBody>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" placeholder="John" />
                    </div>
                    <div>
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" placeholder="Doe" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Enter a detailed description..."
                      rows={8}
                    />
                  </div>
                </div>
              </SheetBody>
              
              <SheetFooter>
                <Button variant="outline" className="flex-1">Reset</Button>
                <Button className="flex-1">Save</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="mt-12 p-6 bg-muted/50 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Usage Instructions</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold">Basic Usage:</h3>
            <pre className="mt-2 p-3 bg-background rounded border text-xs overflow-x-auto">
{`import { Sheet, SheetContent, SheetHeader, SheetBody, SheetFooter, 
         SheetTitle, SheetDescription, SheetTrigger, SheetClose } from "@/components/ui/side-sheet"

<Sheet>
  <SheetTrigger asChild>
    <Button>Open Sheet</Button>
  </SheetTrigger>
  <SheetContent side="right" width="md">
    <SheetHeader>
      <SheetTitle>Title</SheetTitle>
      <SheetDescription>Description</SheetDescription>
    </SheetHeader>
    <SheetBody>
      Content goes here
    </SheetBody>
    <SheetFooter>
      <Button>Action</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>`}
            </pre>
          </div>
          
          <div>
            <h3 className="font-semibold">Available Props:</h3>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li><code>side</code>: left | right | top | bottom</li>
              <li><code>width</code>: sm | md | lg | xl | full</li>
              <li>Supports all standard shadcn/ui Sheet props</li>
              <li>Automatic keyboard navigation (Escape to close)</li>
              <li>Click outside to close</li>
              <li>Mobile responsive design</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}