import { Schema, model, Document, Types } from 'mongoose'

export type Visibility = 'private' | 'followers' | 'public'
export type Discipline = 'freestyle' | 'racing' | 'cinewhoop' | 'long-range' | 'other'

export interface IFlight extends Document {
  // Identidad y relaciones
  userId: Types.ObjectId
  spotId?: Types.ObjectId
  equipmentItems: Types.ObjectId[]   // drones, gafas, emisora, etc.

  // Contenido principal
  title: string
  description?: string
  videoUrl: string                   // link al vídeo (YT, Vimeo, archivo propio/CDN)
  posterUrl?: string                 // portada/thumbnail opcional
  tags: string[]                     // palabras clave

  // Contexto mínimo útil para CV
  disciplines: Discipline[]          // freestyle/racing/cinewhoop/long-range/other
  recordedAt?: Date                  // fecha real de grabación
  visibility: Visibility             // control básico de visibilidad

  // Sistema
  slug: string
  featured?: boolean                 // marcar como destacado para el CV/portfolio
  createdAt: Date
  updatedAt: Date
}

const flightSchema = new Schema<IFlight>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    spotId: { type: Schema.Types.ObjectId, ref: 'Spot', default: null },
    equipmentItems: [{ type: Schema.Types.ObjectId, ref: 'EquipmentItem', default: [] }],

    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, trim: true, default: '' },

    videoUrl: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (v: string) => /^https?:\/\//i.test(v),
        message: 'videoUrl debe ser una URL válida (http/https)'
      }
    },
    posterUrl: { type: String, default: null },

    tags: { type: [String], default: [] },
    disciplines: {
      type: [String],
      enum: ['freestyle', 'racing', 'cinewhoop', 'long-range', 'other'],
      default: []
    },

    recordedAt: { type: Date, default: null, index: true },
    visibility: {
      type: String,
      enum: ['private', 'followers', 'public'],
      default: 'public',
      index: true
    },

    slug: { type: String, required: true, trim: true },
    featured: { type: Boolean, default: false, index: true },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// Índices útiles (búsquedas y CV)
flightSchema.index({ userId: 1, slug: 1 }, { unique: true })            // slug único por usuario
flightSchema.index({ title: 'text', description: 'text' })               // búsqueda de texto
flightSchema.index({ featured: 1, recordedAt: -1 })                       // primero destacados y recientes
flightSchema.index({ visibility: 1, createdAt: -1 })                      // filtros de visibilidad

// Slug automático si no viene
flightSchema.pre('validate', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
      .slice(0, 80)
  }
  next()
})

export default model<IFlight>('Flight', flightSchema) // colección: flights