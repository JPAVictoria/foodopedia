"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"

export default function DropdownProducts() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const menuItems = [
    { label: "Dessert", type: "link", href: "/profile" },
    { label: "Entree", type: "link", href: "/billing" },
    { label: "Appetizer", type: "button", onClick: () => router.push("/settings") },
    { label: "Beverages", type: "link", href: "/logout" },
    { label: "All Types", type: "link", href: "/viewer/home" },
  ]

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="relative inline-block"> 
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 text-[#3E2723] font-medium cursor-pointer outline-none focus:outline-none focus:ring-0 bg-transparent p-4"
          >
            Products
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="bottom"
          align="end"
          className="w-56 text-right overflow-visible border border-[#2d2d2d32] bg-white shadow-sm z-[1000]" 
        >
          <AnimatePresence>
            {open && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={containerVariants}
                className="flex flex-col"
              >
                {menuItems.map((item, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <DropdownMenuItem className="w-full justify-end text-[#3E2723] text-[16px] transition-all hover:bg-gray-50 px-4 py-2">
                      {item.type === "link" ? (
                        <Link href={item.href!} className="w-full text-right">
                          {item.label}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          className="w-full text-right"
                          onClick={item.onClick}
                        >
                          {item.label}
                        </button>
                      )}
                    </DropdownMenuItem>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}