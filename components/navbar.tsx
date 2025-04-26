"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Menu, X, Bell, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const linkClass = (href: string) =>
    `text-sm font-medium hover:text-purple-300 ${
      pathname === href ? "text-purple-400" : "text-white"
    }`

  return (
    <header
      className={`fixed top-4 left-1/2 z-50 w-[95%] -translate-x-1/2 rounded-3xl border border-white/10 backdrop-blur-md transition-all duration-300 ${
        scrolled
          ? "bg-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] h-14 animate-float"
          : "bg-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] h-20 animate-float"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6 h-full">
        <Link href="/" className="flex items-center gap-2">
          <img src="/favicon.png" alt="ThreatShield Logo" className="h-8 w-8" />
          <span className="text-xl font-bold text-white">ThreatShield</span>
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-6">
          <Link href="/" className={linkClass("/")}>
            Home
          </Link>
          <Link href="/dashboard" className={linkClass("/dashboard")}>
            Dashboard
          </Link>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>New threat detected</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/dashboard">
            <Button className="bg-purple-600 hover:bg-purple-700">Dashboard</Button>
          </Link>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white hover:bg-white/10"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {isMenuOpen && (
        <div className="container mx-auto px-4 pb-4 md:hidden">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              className={linkClass("/")}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className={linkClass("/dashboard")}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/developers"
              className={linkClass("/developers")}
              onClick={() => setIsMenuOpen(false)}
            >
              Developers
            </Link>
            <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">Dashboard</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
