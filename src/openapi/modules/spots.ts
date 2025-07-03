export const spotsOpenApiDef = {
  "/spots": {
    get: {
      summary: "Obtener todos los spots",
      security: [{ bearerAuth: [] }],
      tags: ["Spots"],
      responses: {
        "200": {
          description: "Lista de spots obtenida exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Spot"
                }
              }
            }
          }
        },
        "401": {
          description: "No autorizado"
        }
      }
    },
    post: {
      summary: "Crear un nuevo spot",
      security: [{ bearerAuth: [] }],
      tags: ["Spots"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "location"],
              properties: {
                name: { type: "string" },
                location: {
                  type: "object",
                  required: ["coordinates", "address", "city", "country", "placeId"],
                  properties: {
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
                visibility: {
                  type: "object",
                  properties: {
                    public: { type: "boolean", default: true },
                    visibleToFollowersOnly: { type: "boolean", default: false }
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        "201": {
          description: "Spot creado exitosamente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Spot"
              }
            }
          }
        },
        "400": {
          description: "Datos inválidos"
        },
        "401": {
          description: "No autorizado"
        }
      }
    }
  },
  "/spots/{id}": {
    get: {
      summary: "Obtener un spot por ID",
      security: [{ bearerAuth: [] }],
      tags: ["Spots"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID del spot"
        }
      ],
      responses: {
        "200": {
          description: "Spot encontrado exitosamente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Spot"
              }
            }
          }
        },
        "404": {
          description: "Spot no encontrado"
        }
      }
    },
    put: {
      summary: "Actualizar un spot",
      security: [{ bearerAuth: [] }],
      tags: ["Spots"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID del spot"
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
                location: {
                  type: "object",
                  properties: {
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
                visibility: {
                  type: "object",
                  properties: {
                    public: { type: "boolean" },
                    visibleToFollowersOnly: { type: "boolean" }
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Spot actualizado exitosamente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Spot"
              }
            }
          }
        },
        "400": {
          description: "Datos inválidos"
        },
        "404": {
          description: "Spot no encontrado"
        }
      }
    },
    delete: {
      summary: "Eliminar un spot",
      security: [{ bearerAuth: [] }],
      tags: ["Spots"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID del spot"
        }
      ],
      responses: {
        "200": {
          description: "Spot eliminado exitosamente"
        },
        "404": {
          description: "Spot no encontrado"
        }
      }
    }
  },
  "/users/{userId}/spots": {
    get: {
      summary: "Obtener spots de un usuario",
      security: [{ bearerAuth: [] }],
      tags: ["Spots"],
      parameters: [
        {
          name: "userId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID del usuario"
        }
      ],
      responses: {
        "200": {
          description: "Lista de spots del usuario obtenida exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Spot"
                }
              }
            }
          }
        },
        "404": {
          description: "Usuario no encontrado"
        }
      }
    }
  }
}