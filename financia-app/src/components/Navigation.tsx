// src/components/Navigation.tsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu as MenuIcon,
  X as CloseIcon,
  User as UserIcon,
  Settings as SettingsIcon,
  LogOut as LogOutIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthDialog from "./AuthDialog";
import { useAuth } from "@/context/AuthContext";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const NAV_ITEMS = [
  { name: "Home", path: "/" },
  { name: "Insurance", path: "/insurance" },
  { name: "Loans", path: "/loans" },
  { name: "Credit", path: "/credit" },
  { name: "Compare", path: "/compare" },
  { name: "Offers", path: "/offers" },
  { name: "AI Assistant", path: "/ai-assistant" },
  { name: "Support", path: "/support" },
];

export default function Navigation() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />

      <nav className="bg-background border-b border-border sticky top-0 z-50">
        <div className="swiss-container flex items-center justify-between h-16">
          {/* Logo always visible */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-lg">F</span>
            </div>
            <span className="font-semibold text-xl">Financia</span>
          </Link>

          {/* Desktop Nav Links – only when `user` is truthy */}
          {user && (
            <div className="hidden md:flex items-center space-x-8">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`nav-link ${
                    isActive(item.path) ? "active font-semibold" : ""
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}

          {/* Desktop Auth / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <UserIcon className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <UserIcon className="mr-2 h-4 w-4" /> My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center">
                      <SettingsIcon className="mr-2 h-4 w-4" /> Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={logout}
                    className="flex items-center"
                  >
                    <LogOutIcon className="mr-2 h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setAuthOpen(true)}>
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {isMobileOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Nav – only when user is logged in */}
        {isMobileOpen && user && (
          <div className="md:hidden border-t border-border pb-4">
            <div className="flex flex-col space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-4 py-2 ${
                    isActive(item.path) ? "font-semibold" : ""
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="mt-4 border-t border-border pt-2">
              <Link
                to="/profile"
                className="block px-4 py-2"
                onClick={() => setMobileOpen(false)}
              >
                <UserIcon className="inline mr-2 h-4 w-4" /> My Profile
              </Link>
              <Link
                to="/settings"
                className="block px-4 py-2"
                onClick={() => setMobileOpen(false)}
              >
                <SettingsIcon className="inline mr-2 h-4 w-4" /> Settings
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="block w-full text-left px-4 py-2"
              >
                <LogOutIcon className="inline mr-2 h-4 w-4" /> Sign Out
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
