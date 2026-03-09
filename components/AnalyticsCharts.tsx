"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { ChartCard } from "@/components/ChartCard";
import type { AnalyticsPoint } from "@/types";

interface AnalyticsChartsProps {
  data: AnalyticsPoint[];
}

function MetricChart({
  title,
  subtitle,
  data,
  dataKey,
  color,
  domain
}: {
  title: string;
  subtitle: string;
  data: AnalyticsPoint[];
  dataKey: keyof AnalyticsPoint;
  color: string;
  domain?: [number, number] | ["auto", "auto"];
}) {
  return (
    <ChartCard title={title} subtitle={subtitle}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2ddd2" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#4b5952" }} />
          <YAxis domain={domain ?? ["auto", "auto"]} tick={{ fontSize: 12, fill: "#4b5952" }} />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e2ddd2",
              background: "#ffffff"
            }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2.5}
            dot={{ r: 3, fill: color }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  const hasWeightSeries = data.filter((item) => typeof item.physicalVitalityWeight === "number").length >= 3;

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <MetricChart
        title="Inner Wolves Progress"
        subtitle="Progress score trend over weeks"
        data={data}
        dataKey="innerWolvesProgressScore"
        color="#3f5a4d"
        domain={[1, 5]}
      />
      <MetricChart
        title="Writing Sessions"
        subtitle="How often you returned to the manuscript"
        data={data}
        dataKey="sapphireDragonWritingSessions"
        color="#2f6f7e"
      />
      <MetricChart
        title="Chapters Drafted"
        subtitle="Weekly chapter drafting output"
        data={data}
        dataKey="sapphireDragonChaptersDrafted"
        color="#6f7d52"
      />
      <MetricChart
        title="Chapters Revised"
        subtitle="Weekly chapter revision output"
        data={data}
        dataKey="sapphireDragonChaptersRevised"
        color="#6a5b3e"
      />
      <MetricChart
        title="Training Sessions"
        subtitle="Physical Vitality training consistency"
        data={data}
        dataKey="physicalVitalityTrainingSessions"
        color="#5b6d85"
      />
      <MetricChart
        title="Average Energy"
        subtitle="Sustainable energy pattern"
        data={data}
        dataKey="physicalVitalityAvgEnergy"
        color="#587467"
        domain={[1, 5]}
      />
      {hasWeightSeries ? (
        <MetricChart
          title="Weight Trend"
          subtitle="Shown when enough weekly weight entries exist"
          data={data}
          dataKey="physicalVitalityWeight"
          color="#7a5d62"
        />
      ) : null}
    </div>
  );
}
