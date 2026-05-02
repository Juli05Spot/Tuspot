const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import { Menu, X, Search, Plus, LayoutDashboard, CalendarDays, LogOut, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import BecomeHostModal from "./BecomeHostModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const navigate = useNavigate();

  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => db.auth.me(),
  });

  const initials = user?.full_name
    ? user.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <>
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-border" style={{ backgroundColor: "rgba(26,26,26,0.85)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-extrabold text-sm">T</span>
            </div>
            <span className="text-xl font-extrabold tracking-tight">TuSpot</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/explore">
              <Button variant="ghost" size="sm" className="font-medium">
                <Search className="w-4 h-4 mr-1.5" /> Explorar
              </Button>
            </Link>
            <Link to="/my-bookings">
              <Button variant="ghost" size="sm" className="font-medium">
                <CalendarDays className="w-4 h-4 mr-1.5" /> Mis Reservas
              </Button>
            </Link>
            <Link to="/host">
              <Button variant="ghost" size="sm" className="font-medium">
                <LayoutDashboard className="w-4 h-4 mr-1.5" /> Panel Host
              </Button>
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              className="hidden sm:flex bg-primary hover:bg-primary/90 font-semibold rounded-xl gap-1.5"
              onClick={() => setHostModalOpen(true)}
            >
              <Sparkles className="w-4 h-4" /> Publica y gana
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none">
                  <Avatar className="w-9 h-9 border-2 border-primary/20 hover:border-primary transition-colors">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {user && (
                  <>
                    <div className="px-3 py-2">
                      <p className="font-semibold text-sm">{user.full_name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={() => navigate("/my-bookings")}>
                  <CalendarDays className="w-4 h-4 mr-2" /> Mis Reservas
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/host")}>
                  <LayoutDashboard className="w-4 h-4 mr-2" /> Panel Host
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => db.auth.logout()}>
                  <LogOut className="w-4 h-4 mr-2" /> Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-2">
            <Link to="/explore" onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" className="w-full justify-start font-medium">
                <Search className="w-4 h-4 mr-2" /> Explorar
              </Button>
            </Link>
            <Link to="/my-bookings" onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" className="w-full justify-start font-medium">
                <CalendarDays className="w-4 h-4 mr-2" /> Mis Reservas
              </Button>
            </Link>
            <Link to="/host" onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" className="w-full justify-start font-medium">
                <LayoutDashboard className="w-4 h-4 mr-2" /> Panel Host
              </Button>
            </Link>
            <Button
              className="w-full bg-primary font-semibold mt-2"
              onClick={() => { setMobileOpen(false); setHostModalOpen(true); }}
            >
              <Sparkles className="w-4 h-4 mr-2" /> Publica y gana
            </Button>
          </div>
        )}
      </div>
    </header>

    <BecomeHostModal open={hostModalOpen} onClose={() => setHostModalOpen(false)} />
    </>
  );
}