"use client";

import { DollarSign, ShoppingCart, Users, Receipt } from "lucide-react";
import PageContainer from "../../../components/layout/PageContainer";
import { CardSkeleton, TableSkeleton } from "../../../components/ui/Skeleton";
import KpiCard from "../../../components/dashboard/KpiCard";
import RevenueChart from "../../../components/dashboard/RevenueChart";
import CategoryChart from "../../../components/dashboard/CategoryChart";
import RecentOrders from "../../../components/dashboard/RecentOrders";
import LowStock from "../../../components/dashboard/LowStock";
import {
  useGetOrdersQuery,
  useGetProductsQuery,
  useGetCustomersQuery,
} from "../../../redux/slices/apiSlice";

export default function DashboardPage() {
  const { data: orders, isLoading: ordersLoading } = useGetOrdersQuery();
  const { data: products, isLoading: productsLoading } = useGetProductsQuery();
  const { data: customers, isLoading: customersLoading } = useGetCustomersQuery();

  if (ordersLoading || productsLoading || customersLoading) {
    return (
      <PageContainer title="Dashboard" subtitle="Overview of your store">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TableSkeleton rows={3} />
          <TableSkeleton rows={3} />
        </div>
      </PageContainer>
    );
  }

  const safeOrders = orders ?? [];
  const safeProducts = products ?? [];
  const safeCustomers = customers ?? [];

  const totalRevenue = safeOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = safeOrders.length;
  const totalCustomers = safeCustomers.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <PageContainer title="Dashboard" subtitle="Overview of your store">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <KpiCard
          label="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          trend={12}
          icon={DollarSign}
          color="blue"
        />
        <KpiCard
          label="Total Orders"
          value={totalOrders.toString()}
          trend={8}
          icon={ShoppingCart}
          color="orange"
        />
        <KpiCard
          label="Total Customers"
          value={totalCustomers.toString()}
          trend={5}
          icon={Users}
          color="emerald"
        />
        <KpiCard
          label="Avg. Order Value"
          value={`$${avgOrderValue.toFixed(2)}`}
          trend={-3}
          icon={Receipt}
          color="violet"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <RevenueChart orders={safeOrders} />
        <CategoryChart products={safeProducts} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentOrders orders={safeOrders} />
        <LowStock products={safeProducts} />
      </div>
    </PageContainer>
  );
}