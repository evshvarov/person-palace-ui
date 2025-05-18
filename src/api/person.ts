import { Person, PersonCreate, PersonUpdate } from "./types";

const API_ROOT = "https://lovable-backend.demo.community.intersystems.com/crud2";

export async function getPersons(): Promise<Person[]> {
  const res = await fetch(`${API_ROOT}/persons`);
  if (!res.ok) throw new Error("Failed to fetch persons");
  return res.json();
}

export async function createPerson(input: PersonCreate): Promise<Person> {
  const res = await fetch(`${API_ROOT}/persons`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to create person");
  return res.json();
}

export async function updatePerson(id: string, input: PersonUpdate): Promise<Person> {
  const res = await fetch(`${API_ROOT}/persons/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to update person");
  return res.json();
}

export async function deletePerson(id: string): Promise<void> {
  const res = await fetch(`${API_ROOT}/persons/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete person");
}
