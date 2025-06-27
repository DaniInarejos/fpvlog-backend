export const droneBrandsOpenApiDef = {
  "/drone-brands": {
    get: {
      summary: "Obtener todas las marcas de drones",
      security: [{ bearerAuth: [] }],
      tags: ["Marcas de Drones"],
      responses: {
        "200": {
          description: "Lista de marcas de drones obtenida exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/DroneBrand"
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
      summary: "Crear una nueva marca de drone",
      security: [{ bearerAuth: [] }],
      tags: ["Marcas de Drones"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name"],
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                website: { type: "string" },
                country: { type: "string" },
                founded: { type: "number" }
              }
            }
          }
        }
      },
      responses: {
        "201": {
          description: "Marca de drone creada exitosamente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/DroneBrand"
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
  "/drone-brands/country/{country}": {
    get: {
      summary: "Obtener marcas de drones por país",
      security: [{ bearerAuth: [] }],
      tags: ["Marcas de Drones"],
      parameters: [
        {
          name: "country",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "País de origen de la marca"
        }
      ],
      responses: {
        "200": {
          description: "Lista de marcas de drones por país obtenida exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/DroneBrand"
                }
              }
            }
          }
        }
      }
    }
  },
  "/drone-brands/{id}": {
    get: {
      summary: "Obtener una marca de drone por ID",
      security: [{ bearerAuth: [] }],
      tags: ["Marcas de Drones"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID de la marca de drone"
        }
      ],
      responses: {
        "200": {
          description: "Marca de drone encontrada",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/DroneBrand"
              }
            }
          }
        },
        "404": {
          description: "Marca de drone no encontrada"
        }
      }
    },
    patch: {
      summary: "Actualizar una marca de drone",
      security: [{ bearerAuth: [] }],
      tags: ["Marcas de Drones"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID de la marca de drone"
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
                website: { type: "string" },
                country: { type: "string" },
                founded: { type: "number" }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Marca de drone actualizada exitosamente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/DroneBrand"
              }
            }
          }
        },
        "404": {
          description: "Marca de drone no encontrada"
        }
      }
    },
    delete: {
      summary: "Eliminar una marca de drone",
      security: [{ bearerAuth: [] }],
      tags: ["Marcas de Drones"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID de la marca de drone"
        }
      ],
      responses: {
        "200": {
          description: "Marca de drone eliminada exitosamente",
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
          description: "Marca de drone no encontrada"
        }
      }
    }
  }
}