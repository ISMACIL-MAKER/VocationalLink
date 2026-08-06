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
            <span className="text-text font-medium">
              {formatLabel ? formatLabel(item[labelKey]) : item[labelKey]}
            </span>
            <span className="text-text-secondary font-semibold">{item[valueKey]}</span>
          </div>
          <div className="h-2 bg-surface-alt rounded-full overflow-hidden">
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
    return <p className="text-sm text-text-secondary">Loading analytics...</p>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-2xl p-6">
          <h3 className="font-bold text-text text-sm mb-4">Active Jobs per Region</h3>
          <BarList
            items={analytics.regionBreakdown}
            labelKey="region"
            valueKey="count"
            color="#00236F"
            formatLabel={(region) => REGION_LABELS[region] || region}
          />
        </div>

        <div className="bg-surface border border-border rounded-2xl p-6">
          <h3 className="font-bold text-text text-sm mb-4">
            Top Requested Vocational Skills
          </h3>
          {analytics.topSkills.length === 0 ? (
            <p className="text-xs text-text-secondary">No skill data yet.</p>
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

      <div className="bg-surface border border-border rounded-2xl p-6">
        <h3 className="font-bold text-text text-sm mb-4">Revenue Collected</h3>
        {analytics.revenue.length === 0 ? (
          <p className="text-xs text-text-secondary">No verified payments yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {analytics.revenue.map((entry) => (
              <div key={entry.currency} className="bg-surface-alt rounded-xl p-4 text-center">
                <p className="text-2xl font-extrabold text-primary">
                  {entry.total.toLocaleString()}
                </p>
                <p className="text-xs text-text-secondary font-semibold mt-1">{entry.currency}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6">
        <h3 className="font-bold text-text text-sm mb-4">Recent Audit Log</h3>
        {analytics.recentAuditLogs.length === 0 ? (
          <p className="text-xs text-text-secondary">No admin actions recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-text-secondary border-b border-border">
                  <th className="pb-2 pr-4 font-semibold">Time</th>
                  <th className="pb-2 pr-4 font-semibold">Admin</th>
                  <th className="pb-2 pr-4 font-semibold">Action</th>
                  <th className="pb-2 font-semibold">Target</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentAuditLogs.map((log) => (
                  <tr key={log._id} className="border-b border-border">
                    <td className="py-2 pr-4 text-text-secondary whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2 pr-4 text-text font-medium whitespace-nowrap">
                      {log.actorId?.username}
                    </td>
                    <td className="py-2 pr-4 capitalize whitespace-nowrap">
                      {log.action.replace(/_/g, " ")}
                    </td>
                    <td className="py-2 text-text-secondary">{log.targetType}</td>
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
