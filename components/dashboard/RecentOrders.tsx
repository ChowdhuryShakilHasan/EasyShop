import { Order } from "../../types";

const statusStyles: Record<string, string> = {
  pending: "bg-gray-100 text-gray-700",
  processing: "bg-yellow-100 text-yellow-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function RecentOrders({ orders }: { orders: Order[] }) {
  const recent = [...orders]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        Recent Orders
      </h3>
      <div className="space-y-3">
        {recent.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between text-sm"
          >
            <div>
              <p className="font-medium text-gray-900">#{order.id}</p>
              <p className="text-gray-500 text-xs">{order.date}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-900">
                ${order.total.toFixed(2)}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                  statusStyles[order.orderStatus]
                }`}
              >
                {order.orderStatus}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}