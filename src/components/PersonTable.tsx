import React, { useState } from "react";
import { Person } from "@/api/types";
import { Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  data: Person[];
  onEdit: (person: Person) => void;
  onDelete: (person: Person) => void;
  loading?: boolean;
};

type SortConfig = {
  key: keyof Person | null;
  direction: 'asc' | 'desc';
};

export default function PersonTable({ data, onEdit, onDelete, loading }: Props) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

  const handleSort = (key: keyof Person) => {
    setSortConfig(currentSort => ({
      key,
      direction: currentSort.key === key && currentSort.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof Person];
      const bValue = b[sortConfig.key as keyof Person];

      if (!aValue && !bValue) return 0;
      if (!aValue) return 1;
      if (!bValue) return -1;

      const comparison = String(aValue).localeCompare(String(bValue));
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  const SortIcon = ({ columnKey }: { columnKey: keyof Person }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />;
  };

  const renderSortableHeader = (label: string, key: keyof Person) => (
    <th 
      className="p-3 text-left font-semibold cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => handleSort(key)}
    >
      <div className="flex items-center gap-1">
        {label}
        <SortIcon columnKey={key} />
      </div>
    </th>
  );

  return (
    <div className="overflow-x-auto shadow-sm rounded-lg">
      <table className="min-w-full text-sm border-collapse bg-white">
        <thead className="bg-primary text-primary-foreground">
          <tr>
            {renderSortableHeader('Name', 'Name')}
            {renderSortableHeader('Company', 'Company')}
            {renderSortableHeader('Title', 'Title')}
            {renderSortableHeader('Phone', 'Phone')}
            {renderSortableHeader('DOB', 'DOB')}
            <th className="p-3 text-center font-semibold w-24">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 && !loading && (
            <tr>
              <td colSpan={6} className="p-6 text-center text-gray-500">
                No persons found.
              </td>
            </tr>
          )}
          {loading && (
            <tr>
              <td colSpan={6} className="p-6 text-center">
                <div className="w-full flex py-10 items-center justify-center text-gray-500 animate-pulse">
                  Loading...
                </div>
              </td>
            </tr>
          )}
          {!loading && sortedData.map((person) => (
            <tr key={person.PersonId} className="border-t hover:bg-accent transition group">
              <td className="p-3">{person.Name}</td>
              <td className="p-3">{person.Company || ''}</td>
              <td className="p-3">{person.Title || ''}</td>
              <td className="p-3">{person.Phone || ''}</td>
              <td className="p-3">
                {person.DOB
                  ? new Date(person.DOB).toLocaleDateString()
                  : ""}
              </td>
              <td className="p-3 text-center">
                <div className="flex justify-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => onEdit(person)}
                    disabled={loading}
                    className={cn(loading && "opacity-40 pointer-events-none")}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => onDelete(person)}
                    disabled={loading}
                    className={cn(loading && "opacity-40 pointer-events-none")}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
