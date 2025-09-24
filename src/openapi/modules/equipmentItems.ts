export const equipmentItemsOpenApiDef = {
  "/equipment-items": {
    get: {
      summary: "Obtener todos los elementos de equipamiento",
      security: [{ bearerAuth: [] }],
      tags: ["Equipment Items"],
      parameters: [
        {
          name: "category",
          in: "query",
          required: false,
          schema: { type: "string" },
          description: "Filtrar por categoría"
        },
        {
          name: "condition",
          in: "query",
          required: false,
          schema: { 
            type: "string",
            enum: ["NEW", "USED", "REFURBISHED", "DAMAGED"]
          },
          description: "Filtrar por condición"
        },
        {
          name: "availability",
          in: "query",
          required: false,
          schema: { 
            type: "string",
            enum: ["AVAILABLE", "IN_USE", "MAINTENANCE", "RETIRED"]
          },
          description: "Filtrar por disponibilidad"
        }
      ],
      responses: {
        "200": {
          description: "Lista de elementos de equipamiento obtenida exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/EquipmentItem"
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
      summary: "Crear un nuevo elemento de equipamiento",
      security: [{ bearerAuth: [] }],
      tags: ["Equipment Items"],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["name", "category", "condition", "availability"],
              properties: {
                name: { 
                  type: "string",
                  description: "Nombre del elemento"
                },
                description: { 
                  type: "string",
                  description: "Descripción del elemento"
                },
                category: { 
                  type: "string",
                  description: "Categoría del elemento"
                },
                brand: { 
                  type: "string",
                  description: "Marca del elemento"
                },
                model: { 
                  type: "string",
                  description: "Modelo del elemento"
                },
                serialNumber: { 
                  type: "string",
                  description: "Número de serie"
                },
                condition: {
                  type: "string",
                  enum: ["NEW", "USED", "REFURBISHED", "DAMAGED"],
                  description: "Condición del elemento"
                },
                availability: {
                  type: "string",
                  enum: ["AVAILABLE", "IN_USE", "MAINTENANCE", "RETIRED"],
                  description: "Disponibilidad del elemento"
                },
                purchaseDate: {
                  type: "string",
                  format: "date",
                  description: "Fecha de compra"
                },
                purchasePrice: {
                  type: "number",
                  minimum: 0,
                  description: "Precio de compra"
                },
                warrantyExpiration: {
                  type: "string",
                  format: "date",
                  description: "Fecha de expiración de garantía"
                },
                location: {
                  type: "string",
                  description: "Ubicación del elemento"
                },
                notes: {
                  type: "string",
                  description: "Notas adicionales"
                },
                image: {
                  type: "string",
                  format: "binary",
                  description: "Imagen del elemento"
                }
              }
            }
          }
        }
      },
      responses: {
        "201": {
          description: "Elemento de equipamiento creado exitosamente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/EquipmentItem"
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
  "/equipment-items/{id}": {
    get: {
      summary: "Obtener un elemento de equipamiento por ID",
      security: [{ bearerAuth: [] }],
      tags: ["Equipment Items"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID del elemento de equipamiento"
        }
      ],
      responses: {
        "200": {
          description: "Elemento de equipamiento obtenido exitosamente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/EquipmentItem"
              }
            }
          }
        },
        "404": {
          description: "Elemento de equipamiento no encontrado",
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
    put: {
      summary: "Actualizar un elemento de equipamiento",
      security: [{ bearerAuth: [] }],
      tags: ["Equipment Items"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID del elemento de equipamiento"
        }
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                category: { type: "string" },
                brand: { type: "string" },
                model: { type: "string" },
                serialNumber: { type: "string" },
                condition: {
                  type: "string",
                  enum: ["NEW", "USED", "REFURBISHED", "DAMAGED"]
                },
                availability: {
                  type: "string",
                  enum: ["AVAILABLE", "IN_USE", "MAINTENANCE", "RETIRED"]
                },
                purchaseDate: {
                  type: "string",
                  format: "date"
                },
                purchasePrice: {
                  type: "number",
                  minimum: 0
                },
                warrantyExpiration: {
                  type: "string",
                  format: "date"
                },
                location: { type: "string" },
                notes: { type: "string" },
                image: {
                  type: "string",
                  format: "binary"
                }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Elemento de equipamiento actualizado exitosamente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/EquipmentItem"
              }
            }
          }
        },
        "400": {
          description: "Datos inválidos"
        },
        "404": {
          description: "Elemento de equipamiento no encontrado"
        }
      }
    },
    delete: {
      summary: "Eliminar un elemento de equipamiento",
      security: [{ bearerAuth: [] }],
      tags: ["Equipment Items"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID del elemento de equipamiento"
        }
      ],
      responses: {
        "200": {
          description: "Elemento de equipamiento eliminado exitosamente",
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
          description: "Elemento de equipamiento no encontrado"
        }
      }
    }
  },
  "/equipment-items/stats": {
    get: {
      summary: "Obtener estadísticas de elementos de equipamiento",
      security: [{ bearerAuth: [] }],
      tags: ["Equipment Items"],
      responses: {
        "200": {
          description: "Estadísticas obtenidas exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  totalItems: { type: "number" },
                  byCondition: {
                    type: "object",
                    properties: {
                      NEW: { type: "number" },
                      USED: { type: "number" },
                      REFURBISHED: { type: "number" },
                      DAMAGED: { type: "number" }
                    }
                  },
                  byAvailability: {
                    type: "object",
                    properties: {
                      AVAILABLE: { type: "number" },
                      IN_USE: { type: "number" },
                      MAINTENANCE: { type: "number" },
                      RETIRED: { type: "number" }
                    }
                  },
                  byCategory: {
                    type: "object",
                    additionalProperties: { type: "number" }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}