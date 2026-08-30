"use client";

import { Search, Bell, ChevronDown, Menu, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "../../redux/slices/authSlice";
import { RootState } from "../../redux/store";
import { useTheme } from "../../redux/useTheme";

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const { isDark, toggleTheme, mounted } = useTheme();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const initial = user?.name?.charAt(0).toUpperCase() ?? "?";

  return (
        <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">


      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu size={20} />
        </button>



        <div className="hidden sm:flex items-center gap-2 bg-gray-100 dark:bg-slate-800 rounded-xl px-3 py-2 w-64 focus-within:ring-2 focus-within:ring-blue-600 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm w-full placeholder:text-gray-400 app-text-primary dark:text-gray-100"
          />
        </div>



      </div>


      <div className="flex items-center gap-3">
        {mounted && (
                    <button
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? (
              <Sun size={20} className="text-gray-300" />
            ) : (
              <Moon size={20} className="app-text-secondary" />
            )}
          </button>
        )}

        <button aria-label="Notifications" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors relative">
          <Bell size={20} className="text-gray-600 dark:text-gray-300" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
        </button>





        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center text-sm font-semibold shadow-sm">
              {initial}
            </div>
            <ChevronDown size={16} className="text-gray-500" />
          </button>






          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl py-1 z-30">
              <div className="px-4 py-2.5 border-b border-gray-100 dark:border-slate-700">
                <p className="text-sm font-medium app-text-primary dark:text-gray-100">{user?.name}</p>
                <p className="text-xs text-orange-600 capitalize font-medium">{user?.role}</p>
              </div>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                Profile
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              >
                Logout
              </button>
            </div>
          )}






        </div>
      </div>
    </header>
  );
}