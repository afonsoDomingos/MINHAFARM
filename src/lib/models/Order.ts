import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  medicineId: mongoose.Types.ObjectId;
  medicineName: string;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  userId?: mongoose.Types.ObjectId;
  pharmacyId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  status: 'pending' | 'received' | 'analyzing' | 'confirmed' | 'ready' | 'completed' | 'rejected';
  rejectionReason?: string;
  deliveryMethod: 'pickup' | 'delivery';
  deliveryAddress?: string;
  deliveryLocation?: {
    type: 'Point';
    coordinates: [number, number];
  };
  notes?: string;
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
  isGuestOrder: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema: Schema = new Schema({
  medicineId: {
    type: Schema.Types.ObjectId,
    ref: 'Medicine',
    required: true,
  },
  medicineName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
});

const OrderSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    pharmacyId: {
      type: Schema.Types.ObjectId,
      ref: 'Pharmacy',
      required: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'received', 'analyzing', 'confirmed', 'ready', 'completed', 'rejected'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
    },
    deliveryMethod: {
      type: String,
      enum: ['pickup', 'delivery'],
      default: 'pickup',
    },
    deliveryAddress: {
      type: String,
    },
    deliveryLocation: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
      },
    },
    notes: {
      type: String,
    },
    guestName: {
      type: String,
    },
    guestPhone: {
      type: String,
    },
    guestEmail: {
      type: String,
    },
    isGuestOrder: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

let Order: Model<IOrder>;

try {
  Order = mongoose.model<IOrder>('Order');
} catch {
  Order = mongoose.model<IOrder>('Order', OrderSchema);
}

export default Order;