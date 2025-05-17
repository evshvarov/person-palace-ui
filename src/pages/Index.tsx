
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPersons, createPerson, updatePerson, deletePerson } from "@/api/person";
import { Person, PersonCreate, PersonUpdate } from "@/api/types";
import PersonTable from "@/components/PersonTable";
import PersonForm, { PersonFormValues, PersonSubmitValues } from "@/components/PersonForm";
import DeleteConfirm from "@/components/DeleteConfirm";
import { Button } from "@/components/ui/button";
import { Plus, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setFormOpen] = React.useState(false);
  const [isDeleteOpen, setDeleteOpen] = React.useState(false);
  const [editingPerson, setEditingPerson] = React.useState<Person | null>(null);
  const [deletingPerson, setDeletingPerson] = React.useState<Person | null>(null);

  // Fetch persons
  const { data: persons = [], isLoading } = useQuery({
    queryKey: ["persons"],
    queryFn: getPersons,
  });

  // Create or update person
  const { mutate: savePerson, isPending: isSaving } = useMutation({
    mutationFn: async (values: PersonSubmitValues) => {
      if (editingPerson) {
        const personId = editingPerson.PersonId;
        console.log("Updating person with ID:", personId);
        return updatePerson(personId, values as PersonUpdate);
      } else {
        return createPerson(values as PersonCreate);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["persons"] });
      setFormOpen(false);
      setEditingPerson(null);
      toast({
        title: "Saved!",
        description: "Person was successfully saved.",
      });
    },
    onError: (err: any) => {
      console.error("Save error:", err);
      toast({ 
        title: "Error", 
        description: err.message || "Failed to save person.", 
        variant: "destructive" 
      });
    },
  });

  // Delete person
  const { mutate: removePerson, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      console.log("Deleting person with ID:", id);
      return deletePerson(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["persons"] });
      setDeleteOpen(false);
      setDeletingPerson(null);
      toast({
        title: "Deleted!",
        description: "Person was removed.",
      });
    },
    onError: (err: any) => {
      console.error("Delete error:", err);
      toast({ 
        title: "Error", 
        description: err.message || "Failed to delete person.", 
        variant: "destructive" 
      });
    },
  });

  const handleEdit = (person: Person) => {
    setEditingPerson(person);
    setFormOpen(true);
  };

  const handleDelete = (person: Person) => {
    setDeletingPerson(person);
    setDeleteOpen(true);
  };

  const handleFormSubmit = async (values: PersonSubmitValues) => {
    savePerson(values);
  };

  const handleCreateNew = () => {
    setEditingPerson(null);
    setFormOpen(true);
  };

  React.useEffect(() => {
    if (!isFormOpen) setEditingPerson(null);
    if (!isDeleteOpen) setDeletingPerson(null);
  }, [isFormOpen, isDeleteOpen]);

  // Convert Person to PersonFormValues for editing
  const getFormDefaultValues = (): Partial<PersonFormValues> | undefined => {
    if (!editingPerson) return undefined;
    
    return {
      ...editingPerson,
      // Convert string date to Date object when editing
      DOB: editingPerson.DOB ? new Date(editingPerson.DOB) : null
    };
  };

  const handleDeleteConfirm = () => {
    if (deletingPerson && deletingPerson.PersonId) {
      removePerson(deletingPerson.PersonId);
    } else {
      console.error("Cannot delete: no valid PersonId for the deleting person", deletingPerson);
      toast({
        title: "Error",
        description: "Cannot delete: person ID is missing.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen px-2 py-8 md:p-12 bg-gray-50">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <h1 className="text-3xl font-bold text-primary tracking-tight mb-2">
              Person Palace
            </h1>
            <div className="flex flex-col md:flex-row gap-2">
              <Button 
                onClick={() => window.open('https://openexchange.intersystems.com/package/lovable-backend', '_blank')}
                className="gap-2 flex items-center px-5 shadow hover:shadow-md"
                variant="secondary"
              >
                <ExternalLink size={18} />
                Backend Project Profile
              </Button>
              <Button onClick={handleCreateNew} className="gap-2 flex items-center px-5 text-lg shadow hover:shadow-md">
                <Plus size={18} />
                Add Person
              </Button>
            </div>
          </div>
        </div>
        <PersonTable
          data={persons}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={isLoading}
        />
      </div>

      <PersonForm
        open={isFormOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        defaultValues={getFormDefaultValues()}
        isLoading={isSaving}
      />

      <DeleteConfirm
        open={isDeleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={isDeleting}
      />
    </div>
  );
};

export default Index;
