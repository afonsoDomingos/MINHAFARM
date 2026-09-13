import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPharmacy extends Document {
  name: string;
  email: string;
  password: string;
  logo?: string;
  address: string;
  neighborhood: string;
  city: string;
  phone: string;
  openingHours: string;
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  userId: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'suspended';
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

const PharmacySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Nome da farmácia é obrigatório'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email é obrigatório'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password é obrigatória'],
      minlength: 6,
    },
    logo: {
      type: String,
    },
    address: {
      type: String,
      required: [true, 'Endereço é obrigatório'],
      trim: true,
    },
    neighborhood: {
      type: String,
      required: [true, 'Bairro é obrigatório'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Cidade é obrigatória'],
      trim: true,
      default: 'Maputo',
    },
    phone: {
      type: String,
      required: [true, 'Telefone é obrigatório'],
      trim: true,
    },
    openingHours: {
      type: String,
      required: [true, 'Horário de funcionamento é obrigatório'],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
      },
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'suspended'],
      default: 'pending',
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

PharmacySchema.index({ location: '2dsphere' });

const Pharmacy: Model<IPharmacy> = mongoose.models.Pharmacy || mongoose.model<IPharmacy>('Pharmacy', PharmacySchema);

export default Pharmacy;