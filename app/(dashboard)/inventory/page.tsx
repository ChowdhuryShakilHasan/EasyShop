"use client";

import { useState, useMemo } from "react";
import { AlertTriangle, Search, Package } from "lucide-react";
import PageContainer from "../../../components/layout/PageContainer";
import StockAdjustModal from "../../../components/inventory/StockAdjustModal";
import { useGetProductsQuery } from "../../../redux/slices/apiSlice";
import { Product } from "../../../types";

const LOW_STOCK_THRESHOLD = 10;

export default function InventoryPage() {
  const { data: products, isLoading } = useGetProductsQuery();
  const [search, setSearch] = useState("");
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);

  const safeProducts = useMemo(() => products ?? [], [products]);

  const filtered = useMemo(() => {
    if (!search) return safeProducts;
    return safeProducts.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [safeProducts, search]);

  const lowStockCount = safeProducts.filter(
    (p) => p.stock <= LOW_STOCK_THRESHOLD
  ).length;

  const getStockBadge = (stock: number) => {
    if (stock === 0) return "bg-red-100 text-red-700";
    if (stock <= LOW_STOCK_THRESHOLD) return "bg-orange-100 text-orange-700";
    return "bg-emerald-100 text-emerald-700";
  };

  if (isLoading) {
    return (
      <PageContainer title="Inventory" subtitle="Track and adjust stock levels">
        <p className="text-gray-500 text-sm">Loading...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Inventory" subtitle="Track and adjust stock levels">
      {lowStockCount > 0 && (
        <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 mb-4">
          <AlertTriangle size={16} className="text-orange-600 shrink-0" />
          <span className="text-sm text-orange-800">
            <strong>{lowStockCount}</strong> product{lowStockCount !== 1 ? "s are" : " is"} low on stock (10 or fewer units).
          </span>
        </div>
      )}

      <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-3 py-2.5 mb-4 max-w-md focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600 transition-shadow">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="outline-none text-sm w-full"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Product</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Current Stock</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                  No products found.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-gray-900 flex items-center gap-2">
                    <Package size={15} className="text-gray-400" />
                    {p.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.category}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStockBadge(p.stock)}`}
                    >
                      {p.stock === 0
                        ? "Out of stock"
                        : p.stock <= LOW_STOCK_THRESHOLD
                        ? "Low stock"
                        : "In stock"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setAdjustingProduct(p)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Adjust
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <StockAdjustModal product={adjustingProduct} onClose={() => setAdjustingProduct(null)} />
    </PageContainer>
  );
}