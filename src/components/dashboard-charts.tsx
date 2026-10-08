import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { Card } from "@/components/ui/card";

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  "var(--color-brand-navy)",
  "var(--color-sbi)",
];

interface DashboardChartsProps {
  monthly: any[];
  smsChart: any[];
  loanDist: any[];
  insDist: any[];
}

export default function DashboardCharts({ monthly, smsChart, loanDist, insDist }: DashboardChartsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold">Monthly Applications</h3>
        <p className="text-xs text-muted-foreground">Trailing 6 months</p>
        <div className="mt-4 h-60 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)" }}
              />
              <Bar dataKey="applications" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold">SMS Delivery — Last 7 days</h3>
        <div className="mt-4 h-60 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={smsChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line
                type="monotone"
                dataKey="sent"
                stroke="var(--color-chart-1)"
                strokeWidth={3}
              />
              <Line
                type="monotone"
                dataKey="failed"
                stroke="var(--color-destructive)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold">Loan Distribution</h3>
        <div className="mt-4 h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={loanDist}
                dataKey="value"
                nameKey="name"
                outerRadius={68}
                cx="50%"
                cy="45%"
              >
                {loanDist.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold">Insurance Distribution</h3>
        <div className="mt-4 h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={insDist}
                dataKey="value"
                nameKey="name"
                outerRadius={68}
                cx="50%"
                cy="45%"
              >
                {insDist.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
