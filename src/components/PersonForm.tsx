
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const FormSchema = z.object({
  Name: z.string().min(1, "Name is required"),
  Company: z.string().max(50, "Max 50 chars").optional().or(z.literal("")),
  Phone: z.string().optional().or(z.literal("")),
  Title: z.string().max(50, "Max 50 chars").optional().or(z.literal("")),
  DOB: z.date().optional().nullable(),
});

// Export type with DOB as Date for form handling
export type PersonFormValues = z.infer<typeof FormSchema>;

// Define a separate type for API submission with string DOB
export type PersonSubmitValues = Omit<PersonFormValues, "DOB"> & {
  DOB?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PersonSubmitValues) => void;
  defaultValues?: Partial<PersonFormValues>;
  isLoading?: boolean;
};

export default function PersonForm({ open, onClose, onSubmit, defaultValues, isLoading }: Props) {
  const form = useForm<PersonFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      Name: "",
      Company: "",
      DOB: null,
      Phone: "",
      Title: "",
      ...(defaultValues || {}),
    },
  });

  React.useEffect(() => {
    if (open) {
      // Convert string DOB to Date if present
      const processedValues = { ...defaultValues };
      if (defaultValues?.DOB && typeof defaultValues.DOB === 'string') {
        processedValues.DOB = new Date(defaultValues.DOB);
      }
      form.reset(processedValues);
    }
  }, [open, defaultValues, form]);

  function handleFormSubmit(values: PersonFormValues) {
    onSubmit({
      ...values,
      // Format Date to ISO string if exists
      DOB: values.DOB ? format(values.DOB, "yyyy-MM-dd") : undefined,
    });
  }

  return (
    <Popover open={open} onOpenChange={(open) => !open && onClose()}>
      <PopoverContent
        className="w-[360px] p-6 flex flex-col gap-4"
        align="center"
        onInteractOutside={onClose}
      >
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-4"
          autoComplete="off"
        >
          <div>
            <label className="block mb-1 font-medium">Name *</label>
            <Input {...form.register("Name")} disabled={isLoading} />
            <span className="text-xs text-destructive">{form.formState.errors.Name?.message}</span>
          </div>
          <div>
            <label className="block mb-1">Company</label>
            <Input {...form.register("Company")} maxLength={50} disabled={isLoading} />
            <span className="text-xs text-destructive">{form.formState.errors.Company?.message}</span>
          </div>
          <div>
            <label className="block mb-1">Title</label>
            <Input {...form.register("Title")} maxLength={50} disabled={isLoading} />
            <span className="text-xs text-destructive">{form.formState.errors.Title?.message}</span>
          </div>
          <div>
            <label className="block mb-1">Phone</label>
            <Input {...form.register("Phone")} disabled={isLoading} />
            <span className="text-xs text-destructive">{form.formState.errors.Phone?.message}</span>
          </div>
          <div>
            <label className="block mb-1">Date of Birth</label>
            <Controller
              control={form.control}
              name="DOB"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value
                        ? format(field.value, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            <span className="text-xs text-destructive">{form.formState.errors.DOB?.message}</span>
          </div>
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-primary text-white font-semibold">
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
