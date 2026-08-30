"use client";

import { useState, useMemo } from "react";
import { Download, TrendingUp, ShoppingCart, DollarSign } from "lucide-react";
import PageContainer from "../../../components/layout/PageContainer";
import { useGetOrdersQuery, useGetCustomersQuery } from "../../../redux/slices/apiSlice";

export default function ReportsPage() {
  const { data: orders, isLoading } = useGetOrdersQuery();
  const { data: customers } = useGetCustomersQuery();

  const [startDate, setStartDate] = useState("2026-08-01");
  const [endDate, setEndDate] = useState("2026-08-31");

  const safeOrders = useMemo(() => orders ?? [], [orders]);
  const safeCustomers = useMemo(() => customers ?? [], [customers]);

  const filteredOrders = useMemo(() => {
    return safeOrders.filter((o) => o.date >= startDate && o.date <= endDate);
  }, [safeOrders, startDate, endDate]);

  const getCustomerName = (customerId: string) =>
    safeCustomers.find((c) => c.id === customerId)?.name ?? "Unknown";

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = filteredOrders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const handleExportCSV = () => {
    const headers = ["Order ID", "Customer", "Date", "Total", "Payment Status", "Order Status"];
    const rows = filteredOrders.map((o) => [
      o.id,
      getCustomerName(o.customerId),
      o.date,
      o.total.toFixed(2),
      o.paymentStatus,
      o.orderStatus,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `orders-report-${startDate}-to-${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <PageContainer title="Reports" subtitle="Sales performance over a date range">
        <p className="text-gray-500 text-sm">Loading...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Reports"
      subtitle="Sales performance over a date range"
      action={
        <button
          onClick={handleExportCSV}
          disabled={filteredOrders.length === 0}
          className="flex items-center gap-2 bg-blue-600 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-600/25"
        >
          <Download size={16} />
          Export CSV
        </button>
      }
    >
      {/* Date range filter */}
      <div className="app-card p-4 mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm app-text-secondary font-medium">From</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-shadow"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm app-text-secondary font-medium">To</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-shadow"
          />
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="app-card p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-blue-800" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 font-medium">Total Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold app-text-primary">${totalRevenue.toFixed(2)}</p>
        </div>

        <div className="app-card p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 font-medium">Orders in Range</span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <ShoppingCart size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold app-text-primary">{totalOrders}</p>
        </div>

        <div className="app-card p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 font-medium">Avg. Order Value</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold app-text-primary">${avgOrderValue.toFixed(2)}</p>
        </div>
      </div>

      
      <div className="app-card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold app-text-primary">
            Orders in Selected Range ({filteredOrders.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-2.5 font-medium app-text-secondary">Order ID</th>
              <th className="text-left px-4 py-2.5 font-medium app-text-secondary">Customer</th>
              <th className="text-left px-4 py-2.5 font-medium app-text-secondary">Date</th>
              <th className="text-left px-4 py-2.5 font-medium app-text-secondary">Total</th>
              <th className="text-left px-4 py-2.5 font-medium app-text-secondary">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                  No orders in this date range.
                </td>
              </tr>
            ) : (
              filteredOrders.map((o) => (
                <tr key={o.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium app-text-primary">#{o.id}</td>
                  <td className="px-4 py-3 app-text-secondary">{getCustomerName(o.customerId)}</td>
                  <td className="px-4 py-3 app-text-secondary">{o.date}</td>
                  <td className="px-4 py-3 font-medium app-text-primary">${o.total.toFixed(2)}</td>
                  <td className="px-4 py-3 app-text-secondary capitalize">{o.orderStatus}</td>
                </tr>
              ))




            )}
          </tbody>
        </table>
        </div>
      </div>
    </PageContainer>
  );
}