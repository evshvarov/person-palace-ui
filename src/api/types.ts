
export type Person = {
  id: string;
  Company?: string;
  DOB?: string; // in ISO format "yyyy-mm-dd"
  Name: string;
  Phone?: string;
  Title?: string;
};

export type PersonCreate = Omit<Person, "id">;
export type PersonUpdate = Partial<PersonCreate>;
