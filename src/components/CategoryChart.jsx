import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CATEGORIES, CATEGORY_COLORS, formatINR } from '../utils/helpers';

export default function CategoryChart({ expenses }) {
  const data = useMemo(
    () =>
      CATEGORIES.map((category) => ({
        name: category,
        value: expenses
          .filter((e) => e.category === category)
          .reduce((sum, e) => sum + Number(e.amount), 0),
      })).filter((item) => item.value > 0),
    [expenses]
  );

  return (
    <div className="card">
      <h2 className="card-title">Spending by category</h2>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={2}>
              {data.map((item) => (
                <Cell key={item.name} fill={CATEGORY_COLORS[item.name]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatINR(value)} />
            <Legend verticalAlign="bottom" iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
