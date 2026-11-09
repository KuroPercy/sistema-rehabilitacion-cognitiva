export type Patient = {
  id: string;
  full_name: string;
  age: number | null;
  city: string | null;
  created_at: string;
};

// La lista inicial está vacía; los registros deben proceder de Supabase.
export const patientsMock: Patient[] = [];
