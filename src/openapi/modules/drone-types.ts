export const droneTypesOpenApiDef = {
  "/drone-types": {
    get: {
      summary: "Obtener todos los tipos de drones",
      security: [{ bearerAuth: [] }],
      tags: ["Tipos de Drones"],
      responses: {
        "200": {
          description: "Lista de tipos de drones obtenida exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/DroneType"
                }
              }
            }
          }
        },
        "500": {
          description: "Error interno del servidor",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string" }
                }
              }
            }
          }
        }
      }
    },
    post: {
      summary: "Crear un nuevo tipo de drone",
      security: [{ bearerAuth: [] }],
      tags: ["Tipos de Drones"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "category"],
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                category: {
                  type: "string",
                  enum: ["racing", "freestyle", "cinematic", "commercial", "other"]
                }
              }
            }
          }
        }
      },
      responses: {
        "201": {
          description: "Tipo de drone creado exitosamente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/DroneType"
              }
            }
          }
        },
        "400": {
          description: "Datos inválidos",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string" }
                }
              }
            }
          }
        }
      }
    }
  },
  "/drone-types/category/{category}": {
    get: {
      summary: "Obtener tipos de drones por categoría",
      security: [{ bearerAuth: [] }],
      tags: ["Tipos de Drones"],
      parameters: [
        {
          name: "category",
          in: "path",
          required: true,
          schema: {
            type: "string",
            enum: ["racing", "freestyle", "cinematic", "commercial", "other"]
          },
          description: "Categoría del tipo de drone"
        }
      ],
      responses: {
        "200": {
          description: "Lista de tipos de drones por categoría obtenida exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/DroneType"
                }
              }
            }
          }
        }
      }
    }
  },
  "/drone-types/{id}": {
    get: {
      summary: "Obtener un tipo de drone por ID",
      security: [{ bearerAuth: [] }],
      tags: ["Tipos de Drones"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID del tipo de drone"
        }
      ],
      responses: {
        "200": {
          description: "Tipo de drone encontrado",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/DroneType"
              }
            }
          }
        },
        "404": {
          description: "Tipo de drone no encontrado"
        }
      }
    },
    patch: {
      summary: "Actualizar un tipo de drone",
      security: [{ bearerAuth: [] }],
      tags: ["Tipos de Drones"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID del tipo de drone"
        }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                category: {
                  type: "string",
                  enum: ["racing", "freestyle", "cinematic", "commercial", "other"]
                }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Tipo de drone actualizado exitosamente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/DroneType"
              }
            }
          }
        },
        "404": {
          description: "Tipo de drone no encontrado"
        }
      }
    },
    delete: {
      summary: "Eliminar un tipo de drone",
      security: [{ bearerAuth: [] }],
      tags: ["Tipos de Drones"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID del tipo de drone"
        }
      ],
      responses: {
        "200": {
          description: "Tipo de drone eliminado exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" }
                }
              }
            }
          }
        },
        "404": {
          description: "Tipo de drone no encontrado"
        }
      }
    }
  }
}