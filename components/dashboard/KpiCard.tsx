import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

export default function KpiCard({
  label,
  value,
  trend,
  icon: Icon,
}: {
  label: string;
  value: string;
  trend: number; // positive = up, negative = down
  icon: LucideIcon;
}) {
  const isUp = trend >= 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500">{label}</span>
        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
          <Icon size={18} className="text-blue-600" />
        </div>
      </div>

      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>

      <div
        className={`flex items-center gap-1 text-xs font-medium ${
          isUp ? "text-green-600" : "text-red-600"
        }`}
      >
        {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        <span>{Math.abs(trend)}% vs last period</span>
      </div>
    </div>
  );
}