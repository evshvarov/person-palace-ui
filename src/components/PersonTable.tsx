
import React from "react";
import { Person } from "@/api/types";
import { Pencil, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

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
            <th className="p-3 text-center font-semibold w-20">Actions</th>
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
          {data.map((person) => (
            <tr key={person.id} className="border-t hover:bg-accent transition group">
              <td className="p-3">{person.Name}</td>
              <td className="p-3">{person.Company}</td>
              <td className="p-3">{person.Title}</td>
              <td className="p-3">{person.Phone}</td>
              <td className="p-3">
                {person.DOB
                  ? new Date(person.DOB).toLocaleDateString()
                  : ""}
              </td>
              <td className="p-3 text-center">
                <button
                  onClick={() => onEdit(person)}
                  className={cn(
                    "inline-flex items-center border rounded-md px-2 py-1 mr-2 hover:bg-primary/90 text-primary-foreground transition group-hover:scale-110",
                    loading && "opacity-40 pointer-events-none"
                  )}
                  aria-label="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => onDelete(person)}
                  className={cn(
                    "inline-flex items-center border rounded-md px-2 py-1 hover:bg-destructive text-destructive-foreground transition group-hover:scale-110",
                    loading && "opacity-40 pointer-events-none"
                  )}
                  aria-label="Delete"
                >
                  <Trash size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && (
        <div className="w-full flex py-10 items-center justify-center text-gray-500 animate-pulse">
          Loading...
        </div>
      )}
    </div>
  );
}
