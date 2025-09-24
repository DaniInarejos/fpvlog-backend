import { Schema, model, Document, Types } from 'mongoose'

export enum EquipmentType {
  DRONE = 'DRONE',
  RADIO = 'RADIO',
  GOGGLES = 'GOGGLES',
  BATTERY = 'BATTERY',
  CHARGER = 'CHARGER',
  OTHERS = 'OTHERS'
}

export enum EquipmentStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  SOLD = 'SOLD',
  LOST = 'LOST'
}

export interface IEquipmentItem extends Document {
  userId: Types.ObjectId
  name: string
  brand?: string
  type: EquipmentType
  status: EquipmentStatus
  image?: string
  notes?: string
  favorite: boolean
  productLink?: string
  createdAt: Date
  updatedAt: Date
}

const equipmentItemSchema = new Schema<IEquipmentItem>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El ID del usuario es requerido']
  },
  name: {
    type: String,
    required: [true, 'El nombre del equipamiento es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  brand: {
    type: String,
    trim: true,
    maxlength: [50, 'La marca no puede exceder 50 caracteres'],
    default: null
  },
  type: {
    type: String,
    enum: Object.values(EquipmentType),
    required: [true, 'El tipo de equipamiento es requerido']
  },
  status: {
    type: String,
    enum: Object.values(EquipmentStatus),
    default: EquipmentStatus.ACTIVE,
    required: [true, 'El estado del equipamiento es requerido']
  },
  image: {
    type: String,
    default: null,
    validate: {
      validator: function(v: string) {
        if (!v || v === '') return true; // Allow empty strings and null
        try {
          new URL(v);
          return true;
        } catch {
          return false;
        }
      },
      message: 'image must be a valid URL'
    }
  },
  notes: {
    type: String,
    default: null
  },
  favorite: {
    type: Boolean,
    default: false,
    required: [true, 'La propiedad favorite es requerida']
  },
  productLink: {
    type: String,
    default: null,
    validate: {
      validator: function(v: string) {
        if (!v || v === '') return true; // Allow empty strings and null
        try {
          new URL(v);
          return true;
        } catch {
          return false;
        }
      },
      message: 'productLink must be a valid URL'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Middleware para actualizar updatedAt automáticamente
equipmentItemSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

equipmentItemSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() })
  next()
})

// Índices para optimizar consultas
equipmentItemSchema.index({ userId: 1, status: 1 })
equipmentItemSchema.index({ userId: 1, type: 1 })
equipmentItemSchema.index({ createdAt: -1 })

export default model<IEquipmentItem>('EquipmentItem', equipmentItemSchema)