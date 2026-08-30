"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import PageContainer from "../../../components/layout/PageContainer";
import { useGetOrdersQuery, useGetCustomersQuery } from "../../../redux/slices/apiSlice";
import { Order } from "../../../types";

const PAGE_SIZE = 5;

const statusStyles: Record<Order["orderStatus"], string> = {
  pending: "bg-gray-100 text-gray-700",
  processing: "bg-yellow-100 text-yellow-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

const tabs: { label: string; value: Order["orderStatus"] | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

export default function OrdersPage() {
  const { data: orders, isLoading } = useGetOrdersQuery();
  const { data: customers } = useGetCustomersQuery();

  const [activeTab, setActiveTab] = useState<Order["orderStatus"] | "all">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const safeOrders = useMemo(() => orders ?? [], [orders]);
  const safeCustomers = useMemo(() => customers ?? [], [customers]);

  const getCustomerName = (customerId: string) =>
    safeCustomers.find((c) => c.id === customerId)?.name ?? "Unknown";

  const filtered = useMemo(() => {
    let result = safeOrders;

    if (activeTab !== "all") {
      result = result.filter((o) => o.orderStatus === activeTab);
    }
    if (search) {
      const term = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(term) ||
          getCustomerName(o.customerId).toLowerCase().includes(term)
      );
    }

    return [...result].sort((a, b) => b.date.localeCompare(a.date));
  }, [safeOrders, activeTab, search, safeCustomers]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (isLoading) {
    return (
      <PageContainer title="Orders" subtitle="Track and manage customer orders">
        <p className="text-gray-500 text-sm">Loading...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Orders" subtitle="Track and manage customer orders">
      {/* Status tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setActiveTab(tab.value);
              setPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.value
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-3 py-2.5 mb-4 max-w-md focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600 transition-shadow">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search by order ID or customer..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="outline-none text-sm w-full"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Order ID</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Customer</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Total</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Payment</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                  No orders match your filters.
                </td>
              </tr>
            ) : (
              paginated.map((o) => (
                <tr key={o.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-blue-600">
                    <Link href={`/orders/${o.id}`} className="hover:underline">
                      #{o.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-900">{getCustomerName(o.customerId)}</td>
                  <td className="px-4 py-3 text-gray-600">{o.date}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">${o.total.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                        o.paymentStatus === "paid"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[o.orderStatus]}`}
                    >
                      {o.orderStatus}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <span>
          Page {page} of {totalPages} ({filtered.length} results)
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-40"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </PageContainer>
  );
}