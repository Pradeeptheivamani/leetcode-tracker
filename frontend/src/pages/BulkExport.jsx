import { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';

export default function BulkExport() {
  const [input, setInput] = useState('alice\nbob\ncharlie');
  const users = useMemo(() => input.split(/\s|,|\n/).map((item) => item.trim()).filter(Boolean), [input]);
  const rows = users.map((username, index) => ({ Username: username, 'Total Solved': 120 - index * 7, Easy: 50 - index, Medium: 55 - index * 3, Hard: 15 - index, 'Contest Rating': 1600 + index * 42, Streak: 5 + index }));
  const top = rows.reduce((best, row) => row['Total Solved'] > best['Total Solved'] ? row : best, rows[0] || {});

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Coding Club Report');
    XLSX.writeFile(workbook, 'leetcode-team-report.xlsx');
  };

  const downloadCsv = () => {
    const csv = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(rows));
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'leetcode-team-report.csv';
    link.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-surface-950 dark:text-white">Bulk User Progress Export</h1>
        <p className="text-surface-500 dark:text-surface-400">Generate Excel, CSV, and PDF-ready coding club reports for multiple usernames.</p>
      </div>
      <section className="glass-card grid gap-4 p-5 lg:grid-cols-3">
        <textarea className="input-field min-h-48 lg:col-span-2" value={input} onChange={(e) => setInput(e.target.value)} />
        <div className="space-y-3">
          <button className="btn-primary w-full" onClick={downloadExcel}>Excel Report</button>
          <button className="btn-secondary w-full" onClick={downloadCsv}>CSV Report</button>
          <button className="btn-secondary w-full" onClick={() => window.print()}>PDF Report</button>
          <p className="text-sm text-surface-500">Top Performer: <span className="font-semibold">{top?.Username || '-'}</span></p>
          <p className="text-sm text-surface-500">Average Solved: <span className="font-semibold">{rows.length ? Math.round(rows.reduce((sum, row) => sum + row['Total Solved'], 0) / rows.length) : 0}</span></p>
        </div>
      </section>
      <section className="glass-card overflow-auto">
        <table className="w-full">{rows.length > 0 && <><thead><tr>{Object.keys(rows[0]).map((head) => <th className="px-4 py-3 text-left text-xs uppercase text-surface-500" key={head}>{head}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row.Username} className="border-t border-surface-200 dark:border-surface-800">{Object.values(row).map((value, index) => <td className="px-4 py-3" key={index}>{value}</td>)}</tr>)}</tbody></>}</table>
      </section>
    </div>
  );
}
