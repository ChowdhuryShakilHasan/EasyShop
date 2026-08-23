"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Check, MapPin } from "lucide-react";
import PageContainer from "../../../../components/layout/PageContainer";
import {
  useGetOrderByIdQuery,
  useGetProductsQuery,
  useGetCustomersQuery,
  useUpdateOrderStatusMutation,
} from "../../../../redux/slices/apiSlice";
import { Order } from "../../../../types";

const steps: Order["orderStatus"][] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
];

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data: order, isLoading } = useGetOrderByIdQuery(id);
  const { data: products } = useGetProductsQuery();
  const { data: customers } = useGetCustomersQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  if (isLoading || !order) {
    return (
      <PageContainer title="Order Details">
        <p className="text-gray-500 text-sm">Loading...</p>
      </PageContainer>
    );
  }

  const customer = customers?.find((c) => c.id === order.customerId);
  const getProduct = (productId: string) =>
    products?.find((p) => p.id === productId);

  const isCancelled = order.orderStatus === "cancelled";
  const currentStepIndex = steps.indexOf(order.orderStatus);

  const handleStatusChange = (newStatus: Order["orderStatus"]) => {
    updateStatus({ id: order.id, orderStatus: newStatus });
  };

  return (
    <PageContainer
      title={`Order #${order.id}`}
      subtitle={`Placed on ${order.date}`}
    >
      <Link
        href="/orders"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft size={15} />
        Back to Orders
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: items + stepper */}
        <div className="lg:col-span-2 space-y-4">
          {/* Status stepper */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Order Status
            </h3>

            {isCancelled ? (
              <div className="bg-red-50 text-red-700 text-sm font-medium rounded-xl px-4 py-3">
                This order was cancelled.
              </div>
            ) : (
              <div className="flex items-center">
                {steps.map((step, i) => {
                  const isDone = i <= currentStepIndex;
                  const isLast = i === steps.length - 1;
                  return (
                    <div key={step} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                            isDone
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {isDone ? <Check size={14} /> : i + 1}
                        </div>
                        <span
                          className={`text-xs mt-1.5 capitalize ${
                            isDone ? "text-gray-900 font-medium" : "text-gray-400"
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                      {!isLast && (
                        <div
                          className={`flex-1 h-0.5 mx-2 ${
                            i < currentStepIndex ? "bg-blue-600" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-5 pt-4 border-t border-gray-100">
              <label className="block text-xs font-medium text-gray-500 mb-2">
                Update status
              </label>
              <select
                value={order.orderStatus}
                onChange={(e) =>
                  handleStatusChange(e.target.value as Order["orderStatus"])
                }
                disabled={isUpdating}
                className="border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Items</h3>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-5 py-2.5 font-medium text-gray-600">Product</th>
                  <th className="text-left px-5 py-2.5 font-medium text-gray-600">Qty</th>
                  <th className="text-left px-5 py-2.5 font-medium text-gray-600">Price</th>
                  <th className="text-right px-5 py-2.5 font-medium text-gray-600">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => {
                  const product = getProduct(item.productId);
                  return (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="px-5 py-3 text-gray-900">
                        {product?.name ?? "Unknown product"}
                      </td>
                      <td className="px-5 py-3 text-gray-600">{item.quantity}</td>
                      <td className="px-5 py-3 text-gray-600">${item.price.toFixed(2)}</td>
                      <td className="px-5 py-3 text-right font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-gray-200 bg-gray-50">
                  <td colSpan={3} className="px-5 py-3 text-right font-semibold text-gray-700">
                    Total
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-gray-900">
                    ${order.total.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Right: customer + shipping */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Customer</h3>
            <p className="text-sm font-medium text-gray-900">
              {customer?.name ?? "Unknown"}
            </p>
            <p className="text-sm text-gray-500">{customer?.email}</p>
            <p className="text-sm text-gray-500">{customer?.phone}</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
              <MapPin size={15} className="text-blue-600" />
              Shipping Address
            </h3>
            <p className="text-sm text-gray-600">{order.shippingAddress}</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Payment</h3>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                  order.paymentStatus === "paid"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}