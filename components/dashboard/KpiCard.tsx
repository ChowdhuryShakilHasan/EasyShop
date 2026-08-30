import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

const colorMap = {
  blue: {
    badge: "bg-blue-50 text-blue-600",
    bar: "from-blue-600 to-blue-800",
  },
  orange: {
    badge: "bg-orange-50 text-orange-600",
    bar: "from-orange-500 to-orange-600",
  },
  emerald: {
    badge: "bg-emerald-50 text-emerald-600",
    bar: "from-emerald-500 to-emerald-600",
  },
  violet: {
    badge: "bg-violet-50 text-violet-600",
    bar: "from-violet-500 to-violet-600",
  },
};

export default function KpiCard({
  label,
  value,
  trend,
  icon: Icon,
  color = "blue",
}: {
  label: string;
  value: string;
  trend: number;
  icon: LucideIcon;
  color?: keyof typeof colorMap;
}) {
  const isUp = trend >= 0;
  const c = colorMap[color];

  return (
    <div className="app-card p-5 relative overflow-hidden hover:shadow-md transition-shadow">
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${c.bar}`} />

      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500 font-medium">{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.badge}`}>
          <Icon size={18} />
        </div>
      </div>

      <p className="text-2xl font-bold app-text-primary mb-1 tracking-tight">{value}</p>

      <div
        className={`flex items-center gap-1 text-xs font-medium ${
          isUp ? "text-emerald-600" : "text-red-600"
        }`}
      >
        {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        <span>{Math.abs(trend)}% vs last period</span>
      </div>
    </div>
  );
}