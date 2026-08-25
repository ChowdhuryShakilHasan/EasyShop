"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { Plus, Pencil, Trash2, ShieldAlert } from "lucide-react";
import PageContainer from "../../../components/layout/PageContainer";
import StaffFormModal from "../../../components/staff/StaffFormModal";
import {
  useGetStaffQuery,
  useDeleteStaffMutation,
  StaffUser,
} from "../../../redux/slices/apiSlice";
import { RootState } from "../../../redux/store";

export default function StaffPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: staff, isLoading } = useGetStaffQuery();
  const [deleteStaff] = useDeleteStaffMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffUser | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Admin-only guard
  if (user?.role !== "admin") {
    return (
      <PageContainer title="Staff">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
            <ShieldAlert size={22} className="text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Access restricted
          </h2>
          <p className="text-sm text-gray-500">
            Only Admin accounts can view and manage staff members.
          </p>
        </div>
      </PageContainer>
    );
  }

  const safeStaff = staff ?? [];

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteStaff(id).unwrap();
    setDeletingId(null);
  };

  if (isLoading) {
    return (
      <PageContainer title="Staff" subtitle="Manage admin and staff accounts">
        <p className="text-gray-500 text-sm">Loading...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Staff"
      subtitle="Manage admin and staff accounts"
      action={
        <button
          onClick={() => {
            setEditingStaff(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
        >
          <Plus size={16} />
          Add Staff
        </button>
      }
    >
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {safeStaff.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                  No staff members yet.
                </td>
              </tr>
            ) : (
              safeStaff.map((s) => (
                <tr key={s.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {s.name}
                    {s.id === user?.id && (
                      <span className="ml-2 text-xs text-blue-600 font-normal">(You)</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{s.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                        s.role === "admin"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {s.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingStaff(s);
                          setModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        disabled={s.id === user?.id || deletingId === s.id}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title={s.id === user?.id ? "You cannot delete your own account" : "Delete"}
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

      <StaffFormModal
        open={modalOpen}
        editingStaff={editingStaff}
        onClose={() => {
          setModalOpen(false);
          setEditingStaff(null);
        }}
      />
    </PageContainer>
  );
}