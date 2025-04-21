"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="p-4">
      <div
        // Handle mouse hover events to toggle dropdown visibility
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            {/* Keep button disabled but allow hover effect to toggle dropdown */}
            <Button
              className="cursor-pointer outline-none focus:outline-none focus:ring-0"
              disabled
            >
              Open
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 text-right">
            <DropdownMenuItem className="text-right cursor-pointer hover:bg-gray-200 hover:scale-105 transition-all">
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-right cursor-pointer hover:bg-gray-200 hover:scale-105 transition-all">
              <Link href="/billing">Billing</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-right cursor-pointer hover:bg-gray-200 hover:scale-105 transition-all">
              <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-right cursor-pointer hover:bg-gray-200 hover:scale-105 transition-all">
              <Link href="/logout">Log out</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
