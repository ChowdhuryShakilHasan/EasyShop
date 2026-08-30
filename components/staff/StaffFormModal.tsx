"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2 } from "lucide-react";
import { staffSchema, StaffFormValues } from "../../lib/validators/staffSchema";
import { useAddStaffMutation, useUpdateStaffMutation, StaffUser } from "../../redux/slices/apiSlice";

export default function StaffFormModal({
  open,
  editingStaff,
  onClose,
}: {
  open: boolean;
  editingStaff: StaffUser | null;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <StaffFormModalInner
      key={editingStaff?.id ?? "new"}
      editingStaff={editingStaff}
      onClose={onClose}
    />
  );
}

function StaffFormModalInner({
  editingStaff,
  onClose,
}: {
  editingStaff: StaffUser | null;
  onClose: () => void;
}) {
  const [addStaff, { isLoading: adding }] = useAddStaffMutation();
  const [updateStaff, { isLoading: updating }] = useUpdateStaffMutation();
  const isEditing = !!editingStaff;
  const isLoading = adding || updating;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: editingStaff
      ? {
          name: editingStaff.name,
          email: editingStaff.email,
          password: editingStaff.password,
          role: editingStaff.role,
        }
      : { role: "staff" },
  });

  const onSubmit = async (values: StaffFormValues) => {
    if (isEditing) {
      await updateStaff({ ...editingStaff, ...values }).unwrap();
    } else {
      await addStaff(values).unwrap();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold app-text-primary tracking-tight">
            {isEditing ? "Edit Staff" : "Add Staff"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:app-text-secondary hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Full name
            </label>
            <input
              {...register("name")}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-shadow"
              placeholder="e.g. Nusrat Jahan"
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-shadow"
              placeholder="staff@easyshop.com"
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <input
              type="text"
              {...register("password")}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-shadow"
              placeholder="At least 6 characters"
            />
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Role
            </label>
            <select
              {...register("role")}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-shadow"
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? "Saving..." : isEditing ? "Save Changes" : "Add Staff"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}