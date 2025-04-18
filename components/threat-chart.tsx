"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent } from "@/components/ui/card"

interface ThreatChartProps {
  data: { time: string; level: number }[]
}

export function ThreatChart({ data }: ThreatChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          domain={[0, 100]}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <Card>
                  <CardContent className="py-2 px-3">
                    <div className="text-sm font-bold">{payload[0].payload.time}</div>
                    <div className="text-sm">Threat Level: {payload[0].value}</div>
                  </CardContent>
                </Card>
              )
            }
            return null
          }}
        />
        <Line
          type="monotone"
          dataKey="level"
          stroke={`hsl(var(--destructive))`}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6, style: { fill: `hsl(var(--destructive))` } }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
