"use client";

import { useState } from "react";
import { X, Loader2, Plus, Minus } from "lucide-react";
import { useUpdateStockMutation } from "../../redux/slices/apiSlice";
import { Product } from "../../types";

export default function StockAdjustModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const [updateStock, { isLoading }] = useUpdateStockMutation();

  if (!product) return null;

  return <StockAdjustModalInner product={product} onClose={onClose} updateStock={updateStock} isLoading={isLoading} />;
}

function StockAdjustModalInner({
  product,
  onClose,
  updateStock,
  isLoading,
}: {
  product: Product;
  onClose: () => void;
  updateStock: ReturnType<typeof useUpdateStockMutation>[0];
  isLoading: boolean;
}) {
  const [newStock, setNewStock] = useState(product.stock);









  const handleSave = async () => {
    await updateStock({ id: product.id, stock: newStock }).unwrap();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold app-text-primary tracking-tight">
            Adjust Stock
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:app-text-secondary hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-1">{product.name}</p>
        <p className="text-xs text-gray-400 mb-4">
          Current stock: {product.stock}
        </p>

        <div className="flex items-center justify-center gap-3 mb-6">
          <button
            onClick={() => setNewStock((s) => Math.max(0, s - 1))}
            className="w-10 h-10 rounded-xl border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <Minus size={16} />
          </button>
          <input
            type="number"
            value={newStock}
            onChange={(e) => setNewStock(Math.max(0, Number(e.target.value)))}
            className="w-20 text-center border border-gray-300 rounded-xl py-2 text-lg font-semibold outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          />
          <button
            onClick={() => setNewStock((s) => s + 1)}
            className="w-10 h-10 rounded-xl border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}