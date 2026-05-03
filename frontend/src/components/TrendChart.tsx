import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";
import type { Trend } from "../types";

interface Props {
  data: Trend[];
}

export default function TrendChart({ data }: Props) {
  return (
    <LineChart width={500} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis
        dataKey="timestamp"
        tickFormatter={(value) =>
          new Date(value).toLocaleTimeString()
        }
      />

      <YAxis
        domain={[0, 1]}
        tickFormatter={(v) => (v === 1 ? "Open" : "Closed")}
      />

      <Tooltip
        formatter={(value, name) => [
          Number(value) === 1 ? "Open" : "Closed",
          name === "actual_open" ? "Actual" : "Expected"
        ]}
      />

      <Legend />

      <Line
        type="monotone"
        dataKey="actual_open"
        name="Actual"
      />

      <Line
        type="monotone"
        dataKey="expected_open"
        name="Expected"
      />
    </LineChart>
  );
}