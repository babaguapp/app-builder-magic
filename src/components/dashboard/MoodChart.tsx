import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMoods } from "@/hooks/useMoods";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { format, subDays } from "date-fns";
import { pl } from "date-fns/locale";

const MoodChart = () => {
  const { moods, loading, getMoodEmoji } = useMoods();

  if (loading) {
    return (
      <Card className="gradient-card shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Historia nastroju</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center">
            <p className="text-muted-foreground">Ładowanie...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (moods.length === 0) {
    return (
      <Card className="gradient-card shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Historia nastroju</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              Brak danych. Zacznij od zapisania swojego nastroju powyżej.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for chart (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = date.toDateString();
    const moodForDay = moods.find(
      (m) => new Date(m.created_at).toDateString() === dateStr
    );

    return {
      date: format(date, "EEE", { locale: pl }),
      fullDate: format(date, "d MMM", { locale: pl }),
      value: moodForDay?.mood_value || null,
      emoji: moodForDay ? getMoodEmoji(moodForDay.mood_value) : null,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length && payload[0].payload.value) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{data.fullDate}</p>
          <p className="text-2xl mt-1">{data.emoji}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="gradient-card shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Historia nastroju</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={last7Days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(value) => getMoodEmoji(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={3} stroke="hsl(var(--border))" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 0, r: 5 }}
                activeDot={{ r: 8, fill: "hsl(var(--primary))" }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodChart;
