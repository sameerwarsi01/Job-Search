import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function ActivityChart({ jobs = [] }) {
  const [timeView, setTimeView] = useState("Monthly");

  // Real data se monthly distribution calculate karna
  const chartData = useMemo(() => {
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Sabhi 12 mahino ke initial counters
    const counts = monthNames.map((m) => ({ month: m, applications: 0 }));

    jobs.forEach((job) => {
      // Priority: createdAt -> appliedDate -> date
      const dateVal = job.createdAt || job.appliedDate || job.date;
      if (dateVal) {
        const parsedDate = new Date(dateVal);
        if (!isNaN(parsedDate.getTime())) {
          const monthIndex = parsedDate.getMonth();
          counts[monthIndex].applications += 1;
        }
      }
    });

    return counts;
  }, [jobs]);

  const totalApplications = jobs.length;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Application Activity
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Your job application trend over time
          </p>
        </div>

        <select
          value={timeView}
          onChange={(e) => setTimeView(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-500"
        >
          <option value="Monthly">Monthly</option>
          <option value="Weekly">Weekly</option>
        </select>
      </div>

      {/* Chart */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />

            <XAxis
              dataKey="month"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              allowDecimals={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
            />

            <Line
              type="monotone"
              dataKey="applications"
              stroke="#7c3aed"
              strokeWidth={4}
              dot={{
                r: 4,
                fill: "#7c3aed",
              }}
              activeDot={{
                r: 7,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Summary */}
      <div className="mt-6 flex items-center justify-between rounded-xl bg-violet-50 p-4">
        <div>
          <p className="text-sm text-slate-500">Total Tracked</p>
          <h3 className="text-2xl font-bold text-slate-800">
            {totalApplications}
          </h3>
        </div>

        <div className="text-right">
          <p className="font-semibold text-violet-600">
            {totalApplications > 0 ? "Active Pipeline" : "No Activity"}
          </p>
          <p className="text-sm text-slate-500">Live Database Stats</p>
        </div>
      </div>
    </div>
  );
}

export default ActivityChart;