import { AlertTriangle } from "lucide-react";
import { Product } from "../../types";

export default function LowStock({ products }: { products: Product[] }) {
  const lowStock = products
    .filter((p) => p.stock <= 10)
    .sort((a, b) => a.stock - b.stock);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        Low Stock Alerts
      </h3>

      {lowStock.length === 0 ? (
        <p className="text-sm text-gray-500">All products well stocked.</p>
      ) : (
        <div className="space-y-3">
          {lowStock.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-orange-500" />
                <span className="font-medium text-gray-900">{p.name}</span>
              </div>
              <span
                className={`text-xs font-medium ${
                  p.stock === 0 ? "text-red-600" : "text-orange-600"
                }`}
              >
                {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}