import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function ProposalChart({ proposals }) {
  return (
    <BarChart width={800} height={400} data={proposals}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="hour" label={{ value: 'Hora', position: 'insideBottom', offset: -10 }} />
      <YAxis label={{ value: 'Quantidade', angle: -90, position: 'insideLeft' }} />
      <Tooltip />
      <Legend />
      <Bar dataKey="count" fill="#071d41" />
    </BarChart>
  );
}

export default ProposalChart;
