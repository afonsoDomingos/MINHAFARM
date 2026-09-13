export const productCategories = [
  {
    name: 'Medicamentos',
    subcategories: [
      'Analgésicos',
      'Antibióticos',
      'Anti-inflamatórios',
      'Antialérgicos',
      'Antiácidos',
      'Anti-hipertensivos',
      'Vitaminas e suplementos',
    ],
  },
  {
    name: 'Higiene e cuidados pessoais',
    subcategories: [
      'Sabonetes',
      'Champôs',
      'Cremes',
      'Desodorizantes',
      'Higiene íntima',
    ],
  },
  {
    name: 'Dermocosméticos',
    subcategories: [
      'Protetor solar',
      'Cremes hidratantes',
      'Produtos para acne',
      'Cuidados da pele',
    ],
  },
  {
    name: 'Bebé e maternidade',
    subcategories: [
      'Fraldas',
      'Toalhitas',
      'Produtos para bebé',
      'Produtos para mães',
    ],
  },
  {
    name: 'Dispositivos médicos',
    subcategories: [
      'Termómetros',
      'Medidores de pressão',
      'Glicosímetros',
      'Máscaras',
      'Pensos e ligaduras',
    ],
  },
  {
    name: 'Primeiros socorros',
    subcategories: [
      'Álcool/desinfetantes',
      'Algodão',
      'Gaze',
      'Pensos',
      'Antissépticos',
    ],
  },
  {
    name: 'Nutrição e suplementos',
    subcategories: [
      'Vitamina C',
      'Vitamina D',
      'Multivitamínicos',
      'Ómega 3',
      'Suplementos nutricionais',
    ],
  },
];

// Flatten all categories for dropdown
export const allCategories = productCategories.flatMap(
  (category) => category.subcategories
);

// Category options for select dropdown
export const categoryOptions = productCategories.map((category) => ({
  label: category.name,
  options: category.subcategories.map((sub) => ({
    label: sub,
    value: sub,
  })),
}));
