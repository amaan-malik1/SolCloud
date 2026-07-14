import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { ChartDataPoint } from '../../api/storage.api'
import { formatBytes } from '../../lib/utils'

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="px-3 py-2.5 rounded-xl text-xs font-body" style={{ background: 'rgba(19,19,31,0.98)', border: '1px solid rgba(52,211,153,0.25)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
      <p className="text-white/50 mb-1.5">{label}</p>
      <p className="text-white font-medium">{formatBytes(payload[0]?.value ?? 0)}</p>
    </div>
  )
}

export function UsageChart({ data, height = 200, showGrid = true }: { data: ChartDataPoint[]; height?: number; showGrid?: boolean }) {
  if (!data || data.length === 0) return <div className="flex items-center justify-center rounded-xl" style={{ height, background: 'rgba(0,0,0,0.1)' }}><p className="text-xs text-white/25 font-body">No usage data yet</p></div>

  const chartData = data.map(d => ({ date: new Date(d.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }), bytes: d.storageBytes }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="storageGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#34d399" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
          </linearGradient>
        </defs>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />}
        <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
        <YAxis tickFormatter={(v) => formatBytes(v, true)} tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} width={48} />
        <Tooltip content={<ChartTooltip />} />
        <Area type="monotone" dataKey="bytes" stroke="#34d399" strokeWidth={2} fill="url(#storageGradient)" dot={false} activeDot={{ r: 4, fill: '#34d399', stroke: '#fff', strokeWidth: 1.5 }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
