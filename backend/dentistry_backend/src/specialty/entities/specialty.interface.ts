export enum SpecialtyType {
  DOCTOR = 'doctor',
  ADMIN = 'admin',
}

export interface ISpecialty {
  id: number;
  name: string;
  description?: string;
  type: SpecialtyType;
  created_at: Date;
  updated_at: Date;
}
