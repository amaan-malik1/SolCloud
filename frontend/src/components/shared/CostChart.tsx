import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { DailyCostDataPoint } from '../../api/storage.api'
import { formatUsd } from '../../lib/utils'

function CostTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="px-3 py-2.5 rounded-xl text-xs font-body" style={{ background: 'rgba(19,19,31,0.98)', border: '1px solid rgba(20,241,149,0.25)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
      <p className="text-white/50 mb-1.5">{label}</p>
      <p className="text-sol-green font-medium">{formatUsd(payload[0]?.value ?? 0)}</p>
    </div>
  )
}

export function CostChart({ data, height = 160 }: { data: DailyCostDataPoint[]; height?: number }) {
  if (!data || data.length === 0) return <div className="flex items-center justify-center rounded-xl" style={{ height, background: 'rgba(0,0,0,0.1)' }}><p className="text-xs text-white/25 font-body">No billing data yet</p></div>

  const chartData = data.map((d, i) => ({ date: new Date(d.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }), cost: d.amountUsd, isLast: i === data.length - 1 }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barSize={12}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
        <YAxis tickFormatter={(v) => `$${v.toFixed(4)}`} tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} width={52} />
        <Tooltip content={<CostTooltip />} />
        <Bar dataKey="cost" radius={[3, 3, 0, 0]}>
          {chartData.map((entry, i) => <Cell key={i} fill={entry.isLast ? '#14F195' : 'rgba(20,241,149,0.35)'} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
