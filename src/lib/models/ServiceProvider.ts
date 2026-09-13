import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IServiceProvider extends Document {
  serviceTypeId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  logo?: string;
  phone: string;
  address: string;
  neighborhood: string;
  city: string;
  province: string;
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  operatingHours: string;
  userId: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'suspended';
  rating?: number;
  customFields: {
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ServiceProviderSchema = new Schema<IServiceProvider>(
  {
    serviceTypeId: {
      type: Schema.Types.ObjectId,
      ref: 'ServiceType',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    neighborhood: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
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
    operatingHours: {
      type: String,
      required: true,
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
    },
    customFields: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

ServiceProviderSchema.index({ location: '2dsphere' });

const ServiceProvider: Model<IServiceProvider> =
  mongoose.models.ServiceProvider || mongoose.model<IServiceProvider>('ServiceProvider', ServiceProviderSchema);

export default ServiceProvider;
