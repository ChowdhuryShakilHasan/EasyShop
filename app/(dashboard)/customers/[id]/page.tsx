"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Calendar } from "lucide-react";
import PageContainer from "../../../../components/layout/PageContainer";
import { useGetCustomersQuery, useGetOrdersQuery } from "../../../../redux/slices/apiSlice";

const statusStyles: Record<string, string> = {
  pending: "bg-gray-100 text-gray-700",
  processing: "bg-yellow-100 text-yellow-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function CustomerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data: customers, isLoading: customersLoading } = useGetCustomersQuery();
  const { data: orders, isLoading: ordersLoading } = useGetOrdersQuery();

  const customer = customers?.find((c) => c.id === id);
  const customerOrders = useMemo(
    () =>
      (orders ?? [])
        .filter((o) => o.customerId === id)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [orders, id]
  );

  if (customersLoading || ordersLoading) {
    return (
      <PageContainer title="Customer Profile">
        <p className="text-gray-500 text-sm">Loading...</p>
      </PageContainer>
    );
  }

  if (!customer) {
    return (
      <PageContainer title="Customer not found">
        <Link href="/customers" className="text-blue-600 text-sm hover:underline">
          Back to Customers
        </Link>
      </PageContainer>
    );
  }

  const totalSpent = customerOrders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = customerOrders.length > 0 ? totalSpent / customerOrders.length : 0;

  return (
    <PageContainer title={customer.name} subtitle="Customer profile & order history">
      <Link
        href="/customers"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft size={15} />
        Back to Customers
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: profile card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center text-xl font-semibold mb-4">
            {customer.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">{customer.name}</h2>

          <div className="space-y-2.5 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-gray-400" />
              {customer.email}
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-gray-400" />
              {customer.phone}
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-gray-400" />
              Joined {customer.joined}
            </div>
          </div>
        </div>

        {/* Right: stats + orders */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Total Orders</p>
              <p className="text-xl font-bold text-gray-900">{customerOrders.length}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Total Spent</p>
              <p className="text-xl font-bold text-gray-900">${totalSpent.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Avg. Order</p>
              <p className="text-xl font-bold text-gray-900">${avgOrderValue.toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Order History</h3>
            </div>
            {customerOrders.length === 0 ? (
              <p className="px-5 py-6 text-sm text-gray-400 text-center">
                No orders yet.
              </p>
            ) : (
              <table className="w-full text-sm">
                <tbody>
                  {customerOrders.map((o) => (
                    <tr key={o.id} className="border-t border-gray-100 first:border-0">
                      <td className="px-5 py-3">
                        <Link
                          href={`/orders/${o.id}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          #{o.id}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-gray-600">{o.date}</td>
                      <td className="px-5 py-3 font-medium text-gray-900">
                        ${o.total.toFixed(2)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[o.orderStatus]}`}
                        >
                          {o.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}