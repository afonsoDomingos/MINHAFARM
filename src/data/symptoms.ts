export interface Symptom {
  id: string;
  name: string;
  description: string;
  suggestedMedicines: string[];
}

export const symptoms: Symptom[] = [
  {
    id: 'headache',
    name: 'Dor de Cabeça',
    description: 'Dor na região da cabeça, enxaqueca',
    suggestedMedicines: ['Paracetamol', 'Ibuprofeno', 'Dipirona', 'Aspirina'],
  },
  {
    id: 'body-pain',
    name: 'Dor no Corpo',
    description: 'Dores musculares, dores articulares',
    suggestedMedicines: ['Ibuprofeno', 'Dipirona', 'Paracetamol'],
  },
  {
    id: 'fever',
    name: 'Febre',
    description: 'Temperatura corporal elevada',
    suggestedMedicines: ['Paracetamol', 'Ibuprofeno', 'Dipirona'],
  },
  {
    id: 'flu',
    name: 'Gripe / Resfriado',
    description: 'Coriza, tosse, dor de garganta',
    suggestedMedicines: ['Paracetamol', 'Antigripal', 'Vitamina C', 'Xarope para tosse'],
  },
  {
    id: 'stomach-pain',
    name: 'Dor de Estômago',
    description: 'Azia, queimação, gastrite',
    suggestedMedicines: ['Omeprazol', 'Antiácido', 'Ranitidina'],
  },
  {
    id: 'allergy',
    name: 'Alergia',
    description: 'Coceira, espirros, coriza alérgica',
    suggestedMedicines: ['Loratadina', 'Cetirizina', 'Dexclorfeniramina'],
  },
  {
    id: 'cough',
    name: 'Tosse',
    description: 'Tosse seca ou com catarro',
    suggestedMedicines: ['Xarope para tosse', 'Dextrometorfano', 'Guaifenesina'],
  },
  {
    id: 'inflammation',
    name: 'Inflamação',
    description: 'Inchaço, vermelhidão, dor localizada',
    suggestedMedicines: ['Ibuprofeno', 'Diclofenaco', 'Naproxeno'],
  },
  {
    id: 'diarrhea',
    name: 'Diarreia',
    description: 'Fezes líquidas frequentes',
    suggestedMedicines: ['Loperamida', 'Soro de reidratação', 'Probióticos'],
  },
  {
    id: 'sore-throat',
    name: 'Dor de Garganta',
    description: 'Dor ao engolir, irritação na garganta',
    suggestedMedicines: ['Anti-inflamatório', 'Anestésico local', 'Pastilhas para garganta'],
  },
];

export function getSymptomById(id: string): Symptom | undefined {
  return symptoms.find((s) => s.id === id);
}

export function searchSymptomsByMedicine(medicineName: string): Symptom[] {
  const searchLower = medicineName.toLowerCase();
  return symptoms.filter((s) =>
    s.suggestedMedicines.some((m) => m.toLowerCase().includes(searchLower))
  );
}
