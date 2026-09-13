import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMedicine extends Document {
  name: string;
  description?: string;
  category: string;
  dosage?: string;
  manufacturer?: string;
  requiresPrescription: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MedicineSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Nome do medicamento é obrigatório'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Categoria é obrigatória'],
      trim: true,
    },
    dosage: {
      type: String,
      trim: true,
    },
    manufacturer: {
      type: String,
      trim: true,
    },
    requiresPrescription: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

MedicineSchema.index({ name: 'text', description: 'text' });

let Medicine: Model<IMedicine>;

try {
  Medicine = mongoose.model<IMedicine>('Medicine');
} catch {
  Medicine = mongoose.model<IMedicine>('Medicine', MedicineSchema);
}

export default Medicine;