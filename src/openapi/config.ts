export const openApiConfig = {
  openapi: "3.0.0",
  info: {
    title: "SkySphere API",
    version: "1.0.0",
    description: "API documentation for SkySphere service",
  },
  servers: [
    {
      url: process.env.API_URL || "http://localhost:3000",
      description: "API Server"
    }
  ]
}

export const components = {
  schemas: {
    Component: {
      type: "object",
      properties: {
        _id: { type: "string" },
        name: { type: "string" },
        brand: { type: "string" },
        type: {
          type: "string",
          enum: ["MOTOR", "FRAME", "FC", "ESC", "VTX", "CAMERA", "ANTENNA", "RECEIVER", "BATTERY", "PROPS", "MOUNT", "OTHER"]
        },
        description: { type: "string" },
        image: { type: "string" },
        sourceUrl: { type: "string", nullable: true },
        weightGrams: { type: "number", nullable: true },
        createdBy: { type: "string" },
        createdAt: { type: "string", format: "date-time" }
      },
      required: ["name", "brand", "type", "description", "image", "createdBy"]
    },
    Drone: {
      type: "object",
      properties: {
        _id: { type: "string" },
        name: { type: "string" },
        typeId: { type: "string" },
        brandId: { type: "string" },
        model: { type: "string" },
        serialNumber: { type: "string" },
        weight: { type: "number", minimum: 0 },
        frameSize: { type: "number" },
        notes: { type: "string", nullable: true },
        description: { type: "string", nullable: true },
        userId: { type: "string" },
        originType: {
          type: "string",
          enum: ["CUSTOM", "BRANDED"]
        },
        visibility: {
          type: "object",
          properties: {
            isVisibleToFollowers: { type: "boolean" },
            isPublic: { type: "boolean" }
          }
        },
        image: { type: "string", nullable: true },
        components: {
          type: "object",
          properties: {
            frameId: { type: "string", nullable: true },
            motors: {
              type: "array",
              items: { type: "string" },
              nullable: true
            },
            flightControllerId: { type: "string", nullable: true },
            escId: { type: "string", nullable: true },
            vtxId: { type: "string", nullable: true },
            cameraId: { type: "string", nullable: true },
            antennaId: { type: "string", nullable: true },
            receiverId: { type: "string", nullable: true },
            batteryId: { type: "string", nullable: true },
            propsId: { type: "string", nullable: true },
            mountId: { type: "string", nullable: true },
            others: {
              type: "array",
              items: { type: "string" },
              nullable: true
            }
          },
          nullable: true
        },
        betaflightId: { type: "string", nullable: true },
        createdAt: { type: "string", format: "date-time" }
      },
      required: ["name", "userId", "originType"]
    },
    AuthResponse: {
      type: "object",
      properties: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            username: { type: "string" },
            email: { type: "string", format: "email" },
            name: { type: "string" },
            lastName: { type: "string" },
            points: { type: "number" },
            profilePicture: { type: "string", nullable: true },
            followers: {
              type: "array",
              items: { type: "string" }
            },
            following: {
              type: "array",
              items: { type: "string" }
            },
            privacySettings: {
              type: "object",
              properties: {
                allowFollowersToSeeFlights: { type: "boolean" },
                allowFollowersToSeeDrones: { type: "boolean" },
                profileVisibility: {
                  type: "string",
                  enum: ["public", "followers", "private"]
                }
              }
            },
            socialMedia: {
              type: "object",
              properties: {
                facebook: { type: "string", nullable: true },
                youtube: { type: "string", nullable: true },
                instagram: { type: "string", nullable: true },
                tiktok: { type: "string", nullable: true },
                linkedin: { type: "string", nullable: true },
                x: { type: "string", nullable: true }
              },
              nullable: true
            },
            createdAt: { type: "string", format: "date-time" }
          }
        },
        token: { type: "string" }
      }
    },
    Flight: {
      type: "object",
      properties: {
        _id: { type: "string" },
        userId: { type: "string" },
        spotId: { type: "string", nullable: true },
        equipmentItems: {
          type: "array",
          items: { type: "string" },
          description: "IDs de los equipos utilizados"
        },
        title: { 
          type: "string",
          maxLength: 160,
          description: "Título del vuelo"
        },
        description: { 
          type: "string",
          description: "Descripción opcional del vuelo",
          nullable: true
        },
        videoUrl: { 
          type: "string",
          format: "uri",
          description: "URL del vídeo (YouTube, Vimeo, etc.)"
        },
        posterUrl: { 
          type: "string",
          format: "uri",
          description: "URL del poster/thumbnail opcional",
          nullable: true
        },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "Etiquetas del vuelo"
        },
        disciplines: {
          type: "array",
          items: {
            type: "string",
            enum: ["freestyle", "racing", "cinewhoop", "long-range", "other"]
          },
          description: "Disciplinas del vuelo"
        },
        recordedAt: { 
          type: "string", 
          format: "date-time",
          description: "Fecha real de grabación",
          nullable: true
        },
        visibility: {
          type: "string",
          enum: ["private", "followers", "public"],
          default: "public",
          description: "Visibilidad del vuelo"
        },
        slug: { 
          type: "string",
          description: "Slug único del vuelo"
        },
        featured: {
          type: "boolean",
          default: false,
          description: "Marcar como destacado para portfolio"
        },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      },
      required: ["_id", "userId", "title", "videoUrl", "visibility", "slug"]
    },
    Follower: {
      type: "object",
      properties: {
        _id: { type: "string" },
        follower: { type: "string" },
        following: { type: "string" },
        createdAt: { type: "string", format: "date-time" }
      },
      required: ["follower", "following"]
    },
    User: {
      type: "object",
      properties: {
        _id: { type: "string" },
        username: { type: "string" },
        email: { type: "string", format: "email" },
        name: { type: "string" },
        lastName: { type: "string" },
        points: { type: "number" },
        profilePicture: { type: "string", nullable: true },
        followers: {
          type: "array",
          items: { type: "string" }
        },
        following: {
          type: "array",
          items: { type: "string" }
        },
        privacySettings: {
          type: "object",
          properties: {
            allowFollowersToSeeFlights: { type: "boolean" },
            allowFollowersToSeeDrones: { type: "boolean" },
            profileVisibility: {
              type: "string",
              enum: ["public", "followers", "private"]
            }
          }
        },
        socialMedia: {
          type: "object",
          properties: {
            facebook: { type: "string", nullable: true },
            youtube: { type: "string", nullable: true },
            instagram: { type: "string", nullable: true },
            tiktok: { type: "string", nullable: true },
            linkedin: { type: "string", nullable: true },
            x: { type: "string", nullable: true }
          },
          nullable: true
        },
        createdAt: { type: "string", format: "date-time" }
      }
    },
    DroneType: {
      type: "object",
      properties: {
        _id: { type: "string" },
        name: { type: "string" },
        description: { type: "string", nullable: true },
        category: {
          type: "string",
          enum: ["racing", "freestyle", "cinematic", "commercial", "other"]
        },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      }
    },
    DroneBrand: {
      type: "object",
      properties: {
        _id: { type: "string" },
        name: { type: "string" },
        description: { type: "string", nullable: true },
        website: { type: "string", nullable: true },
        country: { type: "string", nullable: true },
        founded: { type: "number", nullable: true },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      }
    },
    FeedItem: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["flight", "drone", "user", "spot"]
        },
        data: {
          oneOf: [
            { $ref: "#/components/schemas/Flight" },
            { $ref: "#/components/schemas/Drone" },
            { $ref: "#/components/schemas/User" },
            { $ref: "#/components/schemas/Spot" }
          ]
        },
        createdAt: { type: "string", format: "date-time" },
        likes: {
          type: "array",
          items: {
            type: "object",
            properties: {
              userId: { type: "string" }
            },
            required: ["userId"]
          },
          description: "Array de usuarios que han dado like al item"
        }
      }
    },
    Spot: {
      type: "object",
      properties: {
        _id: { type: "string" },
        name: { type: "string" },
        location: {
          type: "object",
          properties: {
            type: { type: "string", default: "Point" },
            coordinates: {
              type: "array",
              items: { type: "number" },
              minItems: 2,
              maxItems: 2
            },
            address: { type: "string" },
            city: { type: "string" },
            country: { type: "string" },
            placeId: { type: "string" }
          }
        },
        description: { type: "string" },
        submittedBy: { type: "string" },
        visibility: {
          type: "object",
          properties: {
            public: { type: "boolean" },
            visibleToFollowersOnly: { type: "boolean" }
          }
        },
        legalStatus: {
          type: "string",
          enum: ["NORESTRICTIONS", "RESTRICTEDZONE", "PROHIBITEDZONE", "WITHOUT_ANALIZED"],
          default: "WITHOUT_ANALIZED"
        },
        createdAt: { type: "string", format: "date-time" }
      }
    },
 GroupTopic: {
      type: 'object',
      properties: {
        _id: {
          type: 'string',
          description: 'ID único del tema'
        },
        groupId: {
          type: 'string',
          description: 'ID del grupo'
        },
        title: {
          type: 'string',
          maxLength: 100,
          description: 'Título del tema'
        },
        description: {
          type: 'string',
          maxLength: 500,
          description: 'Descripción del tema'
        },
        createdBy: {
          type: 'object',
          description: 'Usuario que creó el tema',
          properties: {
            _id: { type: 'string' },
            username: { type: 'string' },
            name: { type: 'string' },
            lastName: { type: 'string' },
            profilePicture: { type: 'string' }
          }
        },
        isPinned: {
          type: 'boolean',
          description: 'Si el tema está fijado'
        },
        chatCount: {
                  type: 'integer',
                  description: 'Número de comentarios en el tema'
                },
        lastActivity: {
          type: 'string',
          format: 'date-time',
          description: 'Fecha de última actividad'
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          description: 'Fecha de creación'
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          description: 'Fecha de última actualización'
        }
      },
      required: ['_id', 'groupId', 'title', 'createdBy', 'isPinned', 'chatCount', 'lastActivity', 'createdAt']
    },
  GroupComment: {
      type: 'object',
      properties: {
        _id: {
          type: 'string',
          description: 'ID único del comentario'
        },
        postId: {
          type: 'string',
          description: 'ID del post'
        },
        authorId: {
          type: 'object',
          description: 'Autor del comentario',
          properties: {
            _id: { type: 'string' },
            username: { type: 'string' },
            name: { type: 'string' },
            lastName: { type: 'string' },
            profilePicture: { type: 'string' }
          }
        },
        parentId: {
          type: 'string',
          description: 'ID del comentario padre (para respuestas)',
          nullable: true
        },
        content: {
          type: 'string',
          maxLength: 500,
          description: 'Contenido del comentario'
        },
        likesCount: {
          type: 'integer',
          description: 'Número de likes'
        },
        repliesCount: {
          type: 'integer',
          description: 'Número de respuestas'
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          description: 'Fecha de creación'
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          description: 'Fecha de última actualización'
        }
      },
      required: ['_id', 'postId', 'authorId', 'content', 'likesCount', 'repliesCount', 'createdAt']
    },
    Group: {
      type: 'object',
      properties: {
        _id: {
          type: 'string',
          description: 'ID único del grupo'
        },
        name: {
          type: 'string',
          maxLength: 500,
          description: 'Nombre del grupo'
        },
        description: {
          type: 'string',
          maxLength: 5000,
          description: 'Descripción del grupo',
          nullable: true
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          description: 'Fecha de creación'
        },
        createdBy: {
          type: 'string',
          description: 'ID del usuario que creó el grupo'
        },
        isPrivate: {
          type: 'boolean',
          default: false,
          description: 'Si el grupo es privado'
        },
        avatarUrl: {
          type: 'string',
          nullable: true,
          description: 'URL del avatar del grupo'
        },
        bannerUrl: {
          type: 'string',
          nullable: true,
          description: 'URL del banner del grupo'
        },
        membersCount: {
          type: 'number',
          default: 1,
          description: 'Número de miembros'
        },
        postsCount: {
          type: 'number',
          default: 0,
          description: 'Número de posts'
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Tags del grupo',
          nullable: true
        }
      },
      required: ['_id', 'name', 'createdAt', 'createdBy', 'isPrivate', 'membersCount', 'postsCount']
    },
    GroupMember: {
      type: 'object',
      properties: {
        _id: {
          type: 'string',
          description: 'ID único de la membresía'
        },
        groupId: {
          type: 'string',
          description: 'ID del grupo'
        },
        userId: {
          type: 'string',
          description: 'ID del usuario'
        },
        role: {
          type: 'string',
          enum: ['OWNER', 'ADMIN', 'MOD', 'MEMBER', 'PENDING', 'BANNED'],
          default: 'MEMBER',
          description: 'Rol del usuario en el grupo'
        },
        joinedAt: {
          type: 'string',
          format: 'date-time',
          description: 'Fecha de unión al grupo'
        }
      },
      required: ['_id', 'groupId', 'userId', 'role', 'joinedAt']
    },
    EquipmentItem: {
      type: 'object',
      properties: {
        _id: {
          type: 'string',
          description: 'ID único del elemento de equipamiento'
        },
        userId: {
          type: 'string',
          description: 'ID del usuario propietario'
        },
        name: {
          type: 'string',
          description: 'Nombre del equipamiento',
          maxLength: 100
        },
        brand: {
          type: 'string',
          description: 'Marca del equipamiento',
          maxLength: 50,
          nullable: true
        },
        type: {
          type: 'string',
          enum: ['DRONE', 'CONTROLLER', 'BATTERY', 'CHARGER', 'CAMERA', 'GIMBAL', 'PROPELLER', 'CASE', 'TOOL', 'ACCESSORY', 'OTHER'],
          description: 'Tipo de equipamiento'
        },
        status: {
          type: 'string',
          enum: ['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'SOLD', 'LOST', 'DAMAGED'],
          description: 'Estado del equipamiento'
        },
        image: {
          type: 'string',
          format: 'uri',
          description: 'URL de la imagen del equipamiento',
          nullable: true
        },
        notes: {
          type: 'string',
          description: 'Notas adicionales sobre el equipamiento',
          nullable: true
        },
        favorite: {
          type: 'boolean',
          description: 'Indica si el elemento está marcado como favorito',
          default: false
        },
        productLink: {
          type: 'string',
          format: 'uri',
          description: 'URL del producto',
          nullable: true
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          description: 'Fecha de creación'
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          description: 'Fecha de última actualización'
        }
      },
      required: ['_id', 'userId', 'name', 'type', 'status', 'favorite', 'createdAt', 'updatedAt']
    }
  }
}

