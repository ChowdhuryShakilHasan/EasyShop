"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, ArrowUpDown, Plus, Pencil, Trash2 } from "lucide-react";
import PageContainer from "../../../components/layout/PageContainer";
import AddProductModal from "../../../components/products/AddProductModal";
import EditProductModal from "../../../components/products/EditProductModal";
import DeleteConfirmModal from "../../../components/products/DeleteConfirmModal";
import { useGetProductsQuery, useDeleteProductMutation } from "../../../redux/slices/apiSlice";
import { Product } from "../../../types";

const PAGE_SIZE = 5;

export default function ProductsPage() {
  const { data: products, isLoading } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState<"name" | "price" | "stock">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const safeProducts = useMemo(() => products ?? [], [products]);

  const categories = useMemo(
    () => Array.from(new Set(safeProducts.map((p) => p.category))),
    [safeProducts]
  );

  const filtered = useMemo(() => {
    let result = safeProducts;

    if (debouncedSearch) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }
    if (categoryFilter !== "all") {
      result = result.filter((p) => p.category === categoryFilter);
    }
    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }

    result = [...result].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "name") return a.name.localeCompare(b.name) * dir;
      return (a[sortKey] - b[sortKey]) * dir;
    });

    return result;
  }, [safeProducts, debouncedSearch, categoryFilter, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (key: "name" | "price" | "stock") => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const allOnPageSelected =
    paginated.length > 0 && paginated.every((p) => selectedIds.includes(p.id));

  const toggleSelectAll = () => {
    if (allOnPageSelected) {
      setSelectedIds((prev) => prev.filter((id) => !paginated.some((p) => p.id === id)));
    } else {
      setSelectedIds((prev) => [
        ...prev,
        ...paginated.filter((p) => !prev.includes(p.id)).map((p) => p.id),
      ]);
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    setBulkDeleting(true);
    await Promise.all(selectedIds.map((id) => deleteProduct(id).unwrap()));
    setSelectedIds([]);
    setBulkDeleting(false);
    setBulkDeleteOpen(false);
  };

  if (isLoading) {
    return (
      <PageContainer title="Products" subtitle="Manage your product catalog">
        <p className="text-gray-500 text-sm">Loading...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Products"
      subtitle="Manage your product catalog"
      action={
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
        >
          <Plus size={16} />
          Add Product
        </button>
      }
    >
      {/* Bulk action bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4">
          <span className="text-sm text-blue-900 font-medium">
            {selectedIds.length} selected
          </span>
          <button
            onClick={() => setBulkDeleteOpen(true)}
            className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700"
          >
            <Trash2 size={15} />
            Delete selected
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-3 py-2.5 flex-1 focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600 transition-shadow">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setPage(1);
            }}
            className="outline-none text-sm w-full"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-shadow"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-shadow"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={allOnPageSelected}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                />
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                <button onClick={() => toggleSort("name")} className="flex items-center gap-1">
                  Name <ArrowUpDown size={12} />
                </button>
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                <button onClick={() => toggleSort("price")} className="flex items-center gap-1">
                  Price <ArrowUpDown size={12} />
                </button>
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                <button onClick={() => toggleSort("stock")} className="flex items-center gap-1">
                  Stock <ArrowUpDown size={12} />
                </button>
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                  No products match your filters.
                </td>
              </tr>
            ) : (
              paginated.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(p.id)}
                      onChange={() => toggleSelectOne(p.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-3 text-gray-600">{p.category}</td>
                  <td className="px-4 py-3 text-gray-600">${p.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-600">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                        p.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeletingProduct(p)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
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

      <AddProductModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <EditProductModal product={editingProduct} onClose={() => setEditingProduct(null)} />
      <DeleteConfirmModal product={deletingProduct} onClose={() => setDeletingProduct(null)} />

      {/* Bulk delete confirm (inline, reusing similar pattern) */}
      {bulkDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            onClick={() => setBulkDeleteOpen(false)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <Trash2 size={22} className="text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Delete {selectedIds.length} products?
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              This will permanently delete the selected products. This action
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setBulkDeleteOpen(false)}
                className="flex-1 border border-gray-300 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={bulkDeleting}
                className="flex-1 bg-red-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-red-700 disabled:opacity-60 transition-colors"
              >
                {bulkDeleting ? "Deleting..." : "Delete All"}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}