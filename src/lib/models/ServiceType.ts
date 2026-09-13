import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IServiceType extends Document {
  name: string;
  slug: string;
  description: string;
  icon: string;
  category: 'pharmacy' | 'mobile-money' | 'other';
  isActive: boolean;
  fields: {
    name: string;
    type: 'text' | 'number' | 'boolean' | 'select';
    required: boolean;
    options?: string[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ServiceTypeSchema = new Schema<IServiceType>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['pharmacy', 'mobile-money', 'other'],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    fields: [{
      name: String,
      type: {
        type: String,
        enum: ['text', 'number', 'boolean', 'select'],
      },
      required: Boolean,
      options: [String],
    }],
  },
  {
    timestamps: true,
  }
);

const ServiceType: Model<IServiceType> =
  mongoose.models.ServiceType || mongoose.model<IServiceType>('ServiceType', ServiceTypeSchema);

export default ServiceType;
