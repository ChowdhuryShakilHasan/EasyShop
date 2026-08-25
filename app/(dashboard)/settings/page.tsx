"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { User, Store, Bell, Save, Check } from "lucide-react";
import PageContainer from "../../../components/layout/PageContainer";
import { RootState } from "../../../redux/store";
import { useUpdateStaffMutation, useGetStaffQuery, StaffUser } from "../../../redux/slices/apiSlice";
import { setCredentials } from "../../../redux/slices/authSlice";

type Tab = "profile" | "store" | "notifications";

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("profile");

  return (
    <PageContainer title="Settings" subtitle="Manage your account and store preferences">
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        <TabButton active={tab === "profile"} onClick={() => setTab("profile")} icon={User}>
          Profile
        </TabButton>
        <TabButton active={tab === "store"} onClick={() => setTab("store")} icon={Store}>
          Store Info
        </TabButton>
        <TabButton active={tab === "notifications"} onClick={() => setTab("notifications")} icon={Bell}>
          Notifications
        </TabButton>
      </div>

      {tab === "profile" && <ProfileTab />}
      {tab === "store" && <StoreInfoTab />}
      {tab === "notifications" && <NotificationsTab />}
    </PageContainer>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof User;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
        active
          ? "bg-blue-600 text-white"
          : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
      }`}
    >
      <Icon size={15} />
      {children}
    </button>
  );
}

function SavedBadge({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
      <Check size={13} />
      Saved
    </span>
  );
}

function ProfileTab() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const { data: staffList } = useGetStaffQuery();
  const [updateStaff, { isLoading }] = useUpdateStaffMutation();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!user) return;
    setSaved(false);
    setError("");

    const currentRecord = staffList?.find((s) => s.id === user.id);
    if (!currentRecord) {
      setError("Could not find your account record.");
      return;
    }

    try {
      const updated = await updateStaff({
        ...currentRecord,
        name,
        email,
      }).unwrap();

      dispatch(
        setCredentials({
          id: updated.id,
          name: updated.name,
          email: updated.email,
          role: updated.role,
        })
      );
      setSaved(true);
    } catch {
      setError("Failed to save changes. Please try again.");
    }
  };






  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 max-w-lg">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Profile Information</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-shadow"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-shadow"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
          <input
            value={user?.role ?? ""}
            disabled
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 text-gray-500 capitalize"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex items-center gap-2 bg-blue-600 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors"
        >
          <Save size={15} />
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
        <SavedBadge show={saved} />
      </div>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}

function StoreInfoTab() {







  const [storeName, setStoreName] = useState("EasyShop");
  const [storeEmail, setStoreEmail] = useState("contact@easyshop.com");
  const [currency, setCurrency] = useState("USD");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 max-w-lg">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Store Information</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Store name</label>
          <input
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-shadow"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact email</label>
          <input
            type="email"
            value={storeEmail}
            onChange={(e) => setStoreEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-shadow"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-shadow"
          >
            <option value="USD">USD ($)</option>
            <option value="BDT">BDT (৳)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-blue-600 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Save size={15} />
          Save Changes
        </button>
        <SavedBadge show={saved} />
      </div>
    </div>
  );
}





function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
          checked ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

function NotificationsTab() {
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
  };

  return (





    <div className="bg-white rounded-2xl border border-gray-200 p-5 max-w-lg">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">Notification Preferences</h3>

      <div>
        <Toggle
          checked={orderUpdates}
          onChange={() => setOrderUpdates(!orderUpdates)}
          label="Order updates"
          description="Get notified when an order status changes"
        />
        <Toggle
          checked={lowStockAlerts}
          onChange={() => setLowStockAlerts(!lowStockAlerts)}
          label="Low stock alerts"
          description="Get notified when a product runs low"
        />
        <Toggle
          checked={weeklySummary}
          onChange={() => setWeeklySummary(!weeklySummary)}
          label="Weekly summary email"
          description="Receive a weekly performance summary"
        />
      </div>

      <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-blue-600 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Save size={15} />
          Save Changes
        </button>
        <SavedBadge show={saved} />
      </div>
    </div>
  );
}