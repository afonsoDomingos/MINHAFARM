import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPharmacyMedicine extends Document {
  pharmacyId: mongoose.Types.ObjectId;
  medicineId: mongoose.Types.ObjectId;
  price: number;
  available: boolean;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const PharmacyMedicineSchema: Schema = new Schema(
  {
    pharmacyId: {
      type: Schema.Types.ObjectId,
      ref: 'Pharmacy',
      required: true,
    },
    medicineId: {
      type: Schema.Types.ObjectId,
      ref: 'Medicine',
      required: true,
    },
    price: {
      type: Number,
      required: [true, 'Preço é obrigatório'],
      min: 0,
    },
    available: {
      type: Boolean,
      default: true,
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

PharmacyMedicineSchema.index({ pharmacyId: 1, medicineId: 1 }, { unique: true });

let PharmacyMedicine: Model<IPharmacyMedicine>;

try {
  PharmacyMedicine = mongoose.model<IPharmacyMedicine>('PharmacyMedicine');
} catch {
  PharmacyMedicine = mongoose.model<IPharmacyMedicine>('PharmacyMedicine', PharmacyMedicineSchema);
}

export default PharmacyMedicine;