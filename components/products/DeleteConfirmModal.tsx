"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { useDeleteProductMutation } from "../../redux/slices/apiSlice";
import { Product } from "../../types";

export default function DeleteConfirmModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const [deleteProduct, { isLoading }] = useDeleteProductMutation();

  if (!product) return null;

  const handleDelete = async () => {
    await deleteProduct(product.id).unwrap();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <AlertTriangle size={22} className="text-red-600" />
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Delete product?
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-medium text-gray-700">{product.name}</span>?
          This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-gray-300 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="flex-1 bg-red-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-red-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}