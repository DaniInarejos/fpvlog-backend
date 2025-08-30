import { Schema, model, Document, Types } from 'mongoose'

// Interface para el documento de comentario de topic
export interface ITopicComment extends Document {
  _id: Types.ObjectId
  topicId: Types.ObjectId
  authorId: Types.ObjectId
  content: string
  parentId?: Types.ObjectId | null
  likesCount: number
  repliesCount: number
  createdAt: Date
  updatedAt: Date
}

// Schema de Mongoose
const topicCommentSchema = new Schema<ITopicComment>({
  topicId: {
    type: Schema.Types.ObjectId,
    ref: 'GroupTopic',
    required: true,
    index: true
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 100000,
    trim: true
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'TopicComment',
    default: null,
    index: true
  },
  likesCount: {
    type: Number,
    default: 0,
    min: 0
  },
  repliesCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true,
  collection: 'topiccomments'
})

// Índices compuestos para optimizar consultas
topicCommentSchema.index({ topicId: 1, parentId: 1 })
topicCommentSchema.index({ topicId: 1, createdAt: -1 })
topicCommentSchema.index({ parentId: 1, createdAt: 1 })
topicCommentSchema.index({ authorId: 1, createdAt: -1 })

// Middleware pre-save para validaciones
topicCommentSchema.pre('save', function(next) {
  // Si es una respuesta, no puede tener respuestas propias (máximo 2 niveles)
  if (this.parentId && this.repliesCount > 0) {
    return next(new Error('Las respuestas no pueden tener sub-respuestas'))
  }
  next()
})

// Métodos virtuales
topicCommentSchema.virtual('isReply').get(function() {
  return this.parentId !== null
})

topicCommentSchema.virtual('hasReplies').get(function() {
  return this.repliesCount > 0
})

// Método para incrementar likes
topicCommentSchema.methods.incrementLikes = function() {
  this.likesCount += 1
  return this.save()
}

// Método para decrementar likes
topicCommentSchema.methods.decrementLikes = function() {
  if (this.likesCount > 0) {
    this.likesCount -= 1
  }
  return this.save()
}

// Método para incrementar respuestas
topicCommentSchema.methods.incrementReplies = function() {
  this.repliesCount += 1
  return this.save()
}

// Método para decrementar respuestas
topicCommentSchema.methods.decrementReplies = function() {
  if (this.repliesCount > 0) {
    this.repliesCount -= 1
  }
  return this.save()
}

// Configurar toJSON para limpiar la salida
topicCommentSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    return ret
  }
})

// Crear y exportar el modelo
const TopicComment = model<ITopicComment>('TopicComment', topicCommentSchema)

export default TopicComment
export { ITopicComment as IGroupComment } // Alias para compatibilidad