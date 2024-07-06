"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface OverviewProps {
  data: any[];
}

export const Overview = ({ data }: OverviewProps) => {
  return (
    <ResponsiveContainer
      width="100%"
      height={350}
    >
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          fill="#888888"
          tickLine={false}
          axisLine={false}
          fontSize={12}
        />
        <YAxis
          fill="#888888"
          tickLine={false}
          axisLine={false}
          fontSize={12}
          tickFormatter={(value) => `$${value}`}
        />

        <Bar
          dataKey="total"
          fill="#f3b375"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
