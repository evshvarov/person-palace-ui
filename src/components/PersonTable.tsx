
import React from "react";
import { Person } from "@/api/types";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  data: Person[];
  onEdit: (person: Person) => void;
  onDelete: (person: Person) => void;
  loading?: boolean;
};

export default function PersonTable({ data, onEdit, onDelete, loading }: Props) {
  return (
    <div className="overflow-x-auto shadow-sm rounded-lg">
      <table className="min-w-full text-sm border-collapse bg-white">
        <thead className="bg-primary text-primary-foreground">
          <tr>
            <th className="p-3 text-left font-semibold">Name</th>
            <th className="p-3 text-left font-semibold">Company</th>
            <th className="p-3 text-left font-semibold">Title</th>
            <th className="p-3 text-left font-semibold">Phone</th>
            <th className="p-3 text-left font-semibold">DOB</th>
            <th className="p-3 text-center font-semibold w-24">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && !loading && (
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
          {!loading && data.map((person) => (
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

