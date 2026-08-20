"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import {
  LayoutDashboard,
  Package,
  Warehouse,
  ShoppingCart,
  Users,
  UserCog,
  FileBarChart,
  Settings,
  ShoppingBag,
} from "lucide-react";
import { RootState } from "../../redux/store";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, adminOnly: false },
  { label: "Products", href: "/products", icon: Package, adminOnly: false },
  { label: "Inventory", href: "/inventory", icon: Warehouse, adminOnly: false },
  { label: "Orders", href: "/orders", icon: ShoppingCart, adminOnly: false },
  { label: "Customers", href: "/customers", icon: Users, adminOnly: false },
  { label: "Staff", href: "/staff", icon: UserCog, adminOnly: true },
  { label: "Reports", href: "/reports", icon: FileBarChart, adminOnly: false },
  { label: "Settings", href: "/settings", icon: Settings, adminOnly: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useSelector((state: RootState) => state.auth);

  const visibleItems = navItems.filter(
    (item) => !item.adminOnly || user?.role === "admin"
  );

  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 bg-gradient-to-b from-blue-700 via-blue-800 to-blue-950 h-screen sticky top-0">
      <div className="h-16 flex items-center gap-2 px-6 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-md">
          <ShoppingBag size={18} className="text-orange-500" />
        </div>
        <span className="text-lg font-bold text-white tracking-tight">
          Easy<span className="text-orange-400">Shop</span>
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                  : "text-blue-100 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <div className="rounded-xl bg-white/10 px-3 py-2.5 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-400" />
          <p className="text-xs text-blue-100">
            {user?.role === "admin" ? "Admin access" : "Staff access"}
          </p>
        </div>
      </div>
    </aside>
  );
}