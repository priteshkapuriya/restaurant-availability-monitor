import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
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
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="actual_open" />
      <Line type="monotone" dataKey="expected_open" />
    </LineChart>
  );
}