"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { Button } from "@/app/components/ui/button"
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
    <nav className="p-4">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 text-[#3E2723] font-medium cursor-pointer outline-none focus:outline-none focus:ring-0 disabled={true}"
          >
            Products
            <ChevronDown className="w-4 h-4 transition-opacity duration-200" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="bottom" align="end" className="w-76 text-right overflow-visible">
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
                    <DropdownMenuItem className="justify-end text-[#3E2723] font-medium hover:bg-gray-200 hover:scale-105 transition-all">
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
    </nav>
  )
}
