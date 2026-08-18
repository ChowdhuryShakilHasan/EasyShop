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
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 border-r border-gray-200 bg-white h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <span className="text-lg font-bold text-gray-900">EasyShop</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}