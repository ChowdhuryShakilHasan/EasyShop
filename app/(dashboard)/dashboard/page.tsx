import PageContainer from "../../../components/layout/PageContainer";

export default function DashboardPage() {
  return (
    <PageContainer title="Dashboard" subtitle="Overview of your store">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-gray-600">
          Shell is working. KPI cards and charts go here on Day 4.
        </p>
      </div>
    </PageContainer>
  );
}