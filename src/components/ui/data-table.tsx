import * as React from "react";

interface DataTableProps<T> {
  columns: Array<{ key: keyof T; label: string; render?: (row: T) => React.ReactNode }>;
  data: T[];
  actions?: (row: T) => React.ReactNode;
}

export function DataTable<T extends { id: string | number }>({ columns, data, actions }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border text-sm">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className="px-3 py-2 border-b text-left font-semibold bg-muted">
                {col.label}
              </th>
            ))}
            {actions && <th className="px-3 py-2 border-b">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-6 text-muted-foreground">
                No data found.
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id} className="border-b hover:bg-accent/30">
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-3 py-2">
                    {col.render ? col.render(row) : (row[col.key] as React.ReactNode)}
                  </td>
                ))}
                {actions && <td className="px-3 py-2">{actions(row)}</td>}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
