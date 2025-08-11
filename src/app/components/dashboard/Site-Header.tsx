"use client"

import Link from "next/link"
import { Bell, HelpCircle, Search, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserNav } from "./User-Nav"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <SidebarTrigger />
      <Link href="/" className="hidden items-center gap-2 md:flex">
        <span className="text-xl font-bold">BusinessApp</span>
      </Link>
      <div className="flex flex-1 items-center gap-4 md:gap-6">
        <form className="hidden flex-1 md:flex">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-4 w-4" />
            <span className="sr-only">Help</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Button>
          <UserNav />
        </nav>
      </div>
    </header>
  )
}

