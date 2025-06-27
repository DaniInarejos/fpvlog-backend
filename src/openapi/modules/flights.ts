export const flightsOpenApiDef = {
  "/flights": {
    get: {
      summary: "Obtener todos los vuelos",
      security: [{ bearerAuth: [] }],
      tags: ["Vuelos"],
      responses: {
        "200": {
          description: "Lista de vuelos obtenida exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Flight"
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
      summary: "Crear un nuevo vuelo",
      security: [{ bearerAuth: [] }],
      tags: ["Vuelos"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["title", "date", "location", "duration", "batteryUsed", "weather", "droneId"],
              properties: {
                title: { type: "string" },
                date: { type: "string", format: "date-time" },
                location: { type: "string" },
                duration: { type: "number", minimum: 0 },
                batteryUsed: { type: "number", minimum: 0 },
                weather: { type: "string" },
                notes: { type: "string" },
                droneId: { type: "string" },
                visibility: {
                  type: "object",
                  properties: {
                    isVisibleToFollowers: { type: "boolean" },
                    isPublic: { type: "boolean" }
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        "201": {
          description: "Vuelo creado exitosamente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Flight"
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
  "/flights/{id}": {
    get: {
      summary: "Obtener un vuelo por ID",
      security: [{ bearerAuth: [] }],
      tags: ["Vuelos"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" }
        }
      ],
      responses: {
        "200": {
          description: "Vuelo encontrado",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Flight"
              }
            }
          }
        },
        "404": {
          description: "Vuelo no encontrado",
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
        },
        "403": {
          description: "No autorizado para ver este vuelo",
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
    patch: {
      summary: "Actualizar un vuelo",
      security: [{ bearerAuth: [] }],
      tags: ["Vuelos"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" }
        }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                title: { type: "string" },
                date: { type: "string", format: "date-time" },
                location: { type: "string" },
                duration: { type: "number", minimum: 0 },
                batteryUsed: { type: "number", minimum: 0 },
                weather: { type: "string" },
                notes: { type: "string" },
                visibility: {
                  type: "object",
                  properties: {
                    isVisibleToFollowers: { type: "boolean" },
                    isPublic: { type: "boolean" }
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Vuelo actualizado exitosamente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Flight"
              }
            }
          }
        },
        "404": {
          description: "Vuelo no encontrado",
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
        },
        "403": {
          description: "No autorizado para actualizar este vuelo",
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
    delete: {
      summary: "Eliminar un vuelo",
      security: [{ bearerAuth: [] }],
      tags: ["Vuelos"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" }
        }
      ],
      responses: {
        "200": {
          description: "Vuelo eliminado exitosamente",
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
          description: "Vuelo no encontrado",
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
        },
        "403": {
          description: "No autorizado para eliminar este vuelo",
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
  "/flights/{id}/image": {
    post: {
      summary: "Subir una imagen para un vuelo",
      security: [{ bearerAuth: [] }],
      tags: ["Vuelos"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" }
        }
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["image"],
              properties: {
                image: {
                  type: "string",
                  format: "binary",
                  description: "Archivo de imagen a subir"
                }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Imagen subida exitosamente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Flight"
              }
            }
          }
        },
        "400": {
          description: "Imagen inválida",
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
        },
        "404": {
          description: "Vuelo no encontrado",
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
        },
        "403": {
          description: "No autorizado para actualizar este vuelo",
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
  }
}