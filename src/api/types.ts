
export type Person = {
  id?: string;
  PersonId: string;
  Company?: string;
  DOB?: string; // in ISO format "yyyy-mm-dd"
  Name: string;
  Phone?: string;
  Title?: string;
};

export type PersonCreate = Omit<Person, "id" | "PersonId">;
export type PersonUpdate = Partial<PersonCreate>;
