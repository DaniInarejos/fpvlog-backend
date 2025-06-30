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
        createdAt: { type: "string", format: "date-time" },
        visibility: {
          type: "object",
          properties: {
            isVisibleToFollowers: { type: "boolean" },
            isPublic: { type: "boolean" }
          }
        },
        image: { type: "string", nullable: true }
      }
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
        title: { type: "string" },
        description: { type: "string" },
        date: { type: "string", format: "date-time" },
        location: { type: "string" },
        duration: { type: "number", minimum: 0 },
        batteryUsed: { type: "number", minimum: 0 },
        weather: { type: "string" },
        notes: { type: "string", nullable: true },
        userId: { type: "string" },
        droneId: { type: "string" },
        createdAt: { type: "string", format: "date-time" },
        visibility: {
          type: "object",
          properties: {
            isVisibleToFollowers: { type: "boolean" },
            isPublic: { type: "boolean" }
          }
        },
        image: { type: "string", nullable: true }
      }
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
          enum: ["flight", "drone", "user"]
        },
        data: {
          oneOf: [
            { $ref: "#/components/schemas/Flight" },
            { $ref: "#/components/schemas/Drone" },
            { $ref: "#/components/schemas/User" }
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
    }
  }
}