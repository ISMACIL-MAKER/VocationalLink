import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminAnalytics } from "../../features/adminSlice";
import { REGION_LABELS } from "../../constants/enums";

function BarList({ items, labelKey, valueKey, color, formatLabel }) {
  const max = Math.max(...items.map((item) => item[valueKey]), 1);
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item[labelKey]}>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#191C1E] font-medium">
              {formatLabel ? formatLabel(item[labelKey]) : item[labelKey]}
            </span>
            <span className="text-[#64748B] font-semibold">{item[valueKey]}</span>
          </div>
          <div className="h-2 bg-[#F2F4F6] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${(item[valueKey] / max) * 100}%`, backgroundColor: color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MarketAnalyticsTab() {
  const dispatch = useDispatch();
  const { analytics, analyticsLoading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminAnalytics());
  }, [dispatch]);

  if (analyticsLoading) {
    return <p className="text-sm text-[#64748B]">Loading analytics...</p>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#F2F4F6] rounded-2xl p-6">
          <h3 className="font-bold text-[#191C1E] text-sm mb-4">Active Jobs per Region</h3>
          <BarList
            items={analytics.regionBreakdown}
            labelKey="region"
            valueKey="count"
            color="#00236F"
            formatLabel={(region) => REGION_LABELS[region] || region}
          />
        </div>

        <div className="bg-white border border-[#F2F4F6] rounded-2xl p-6">
          <h3 className="font-bold text-[#191C1E] text-sm mb-4">
            Top Requested Vocational Skills
          </h3>
          {analytics.topSkills.length === 0 ? (
            <p className="text-xs text-[#94A3B8]">No skill data yet.</p>
          ) : (
            <BarList
              items={analytics.topSkills}
              labelKey="skill"
              valueKey="count"
              color="#10B981"
            />
          )}
        </div>
      </div>

      <div className="bg-white border border-[#F2F4F6] rounded-2xl p-6">
        <h3 className="font-bold text-[#191C1E] text-sm mb-4">Revenue Collected</h3>
        {analytics.revenue.length === 0 ? (
          <p className="text-xs text-[#94A3B8]">No verified payments yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {analytics.revenue.map((entry) => (
              <div key={entry.currency} className="bg-[#F8FAFC] rounded-xl p-4 text-center">
                <p className="text-2xl font-extrabold text-[#00236F]">
                  {entry.total.toLocaleString()}
                </p>
                <p className="text-xs text-[#64748B] font-semibold mt-1">{entry.currency}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-[#F2F4F6] rounded-2xl p-6">
        <h3 className="font-bold text-[#191C1E] text-sm mb-4">Recent Audit Log</h3>
        {analytics.recentAuditLogs.length === 0 ? (
          <p className="text-xs text-[#94A3B8]">No admin actions recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-[#64748B] border-b border-[#F2F4F6]">
                  <th className="pb-2 pr-4 font-semibold">Time</th>
                  <th className="pb-2 pr-4 font-semibold">Admin</th>
                  <th className="pb-2 pr-4 font-semibold">Action</th>
                  <th className="pb-2 font-semibold">Target</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentAuditLogs.map((log) => (
                  <tr key={log._id} className="border-b border-[#F8FAFC]">
                    <td className="py-2 pr-4 text-[#94A3B8] whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2 pr-4 text-[#191C1E] font-medium whitespace-nowrap">
                      {log.actorId?.username}
                    </td>
                    <td className="py-2 pr-4 capitalize whitespace-nowrap">
                      {log.action.replace(/_/g, " ")}
                    </td>
                    <td className="py-2 text-[#64748B]">{log.targetType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
