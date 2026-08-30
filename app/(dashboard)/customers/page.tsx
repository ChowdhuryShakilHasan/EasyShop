"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import PageContainer from "../../../components/layout/PageContainer";
import { useGetCustomersQuery, useGetOrdersQuery } from "../../../redux/slices/apiSlice";

export default function CustomersPage() {
  const { data: customers, isLoading } = useGetCustomersQuery();
  const { data: orders } = useGetOrdersQuery();
  const [search, setSearch] = useState("");

  const safeCustomers = useMemo(() => customers ?? [], [customers]);
  const safeOrders = useMemo(() => orders ?? [], [orders]);

  const getOrderStats = (customerId: string) => {
    const customerOrders = safeOrders.filter((o) => o.customerId === customerId);
    const totalSpent = customerOrders.reduce((sum, o) => sum + o.total, 0);
    return { count: customerOrders.length, totalSpent };
  };

  const filtered = useMemo(() => {
    if (!search) return safeCustomers;
    const term = search.toLowerCase();
    return safeCustomers.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term)
    );
  }, [safeCustomers, search]);

  if (isLoading) {
    return (
      <PageContainer title="Customers" subtitle="View and manage customer accounts">
        <p className="text-gray-500 text-sm">Loading...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Customers" subtitle="View and manage customer accounts">
      <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-3 py-2.5 mb-4 max-w-md focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600 transition-shadow">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="outline-none text-sm w-full"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <p className="text-gray-400 text-sm col-span-full text-center py-6">
            No customers match your search.
          </p>
        ) : (
          filtered.map((c) => {
            const stats = getOrderStats(c.id);
            return (
              <Link
                key={c.id}
                href={`/customers/${c.id}`}
                className="app-card p-5 hover:shadow-md hover:border-blue-300 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center font-semibold text-sm">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium app-text-primary">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100">
                  <span className="text-gray-500">
                    {stats.count} order{stats.count !== 1 ? "s" : ""}
                  </span>
                  <span className="font-medium app-text-primary">
                    ${stats.totalSpent.toFixed(2)}
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </PageContainer>
  );
}