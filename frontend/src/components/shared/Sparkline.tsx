interface SparklineProps { data: number[]; width?: number; height?: number; color?: string }

export function Sparkline({ data, width = 120, height = 32, color = '#9945FF' }: SparklineProps) {
  if (!data || data.length < 2) return <div style={{ width, height }} className="flex items-center justify-center"><span className="text-xs text-white/20">—</span></div>

  const max = Math.max(...data, 1), min = Math.min(...data), range = max - min || 1
  const points = data.map((val, i) => { const x = (i / (data.length - 1)) * width; const y = height - ((val - min) / range) * (height - 4) - 2; return `${x},${y}` })
  const pathD = `M ${points.join(' L ')}`
  const fillD = `M 0,${height} L ${points.join(' L ')} L ${width},${height} Z`

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <path d={fillD} fill={color} fillOpacity={0.08} />
      <path d={pathD} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      {points.length > 0 && (() => { const last = points[points.length - 1].split(','); return <circle cx={parseFloat(last[0])} cy={parseFloat(last[1])} r={2.5} fill={color} /> })()}
    </svg>
  )
}
