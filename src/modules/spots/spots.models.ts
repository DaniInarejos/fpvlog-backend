import { Schema, model, Document, Types } from 'mongoose'

export interface ISpot extends Document {
  name: string;
  location: {
    type: string;
    coordinates: [number, number];
    address?: string;
    city?: string;
    country?: string;
    placeId?: string;
  };
  description: string;
  submittedBy: Types.ObjectId;
  visibility: {
    public: boolean;
    visibleToFollowersOnly: boolean;
  };
  legalStatus: 'NORESTRICTIONS' | 'RESTRICTEDZONE' | 'PROHIBITEDZONE' | 'WITHOUT_ANALIZED';
  createdAt: Date;
}

const spotSchema = new Schema<ISpot>({
  name: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: String,
    city: String,
    country: String,
    placeId: String
  },
  description: { type: String, required: true },
  submittedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  visibility: {
    public: { type: Boolean, default: true },
    visibleToFollowersOnly: { type: Boolean, default: false }
  },
  legalStatus: {
    type: String,
    enum: ['NORESTRICTIONS', 'RESTRICTEDZONE', 'PROHIBITEDZONE', 'WITHOUT_ANALIZED'],
    default: 'WITHOUT_ANALIZED'
  },
  createdAt: { type: Date, default: Date.now }
});

// Índice geoespacial para búsquedas por ubicación
spotSchema.index({ 'location.coordinates': '2dsphere' })

export default model<ISpot>('Spot', spotSchema)