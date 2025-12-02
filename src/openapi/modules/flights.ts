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
              required: ["title", "videoUrl"],
              properties: {
                title: { 
                  type: "string",
                  maxLength: 160,
                  description: "Título del vuelo"
                },
                description: { 
                  type: "string",
                  description: "Descripción opcional del vuelo"
                },
                videoUrl: { 
                  type: "string",
                  format: "uri",
                  description: "URL del vídeo (YouTube, Vimeo, etc.)"
                },
                posterUrl: { 
                  type: "string",
                  format: "uri",
                  description: "URL del poster/thumbnail opcional"
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
                  description: "Fecha real de grabación"
                },
                visibility: {
                  type: "string",
                  enum: ["private", "followers", "public"],
                  default: "public",
                  description: "Visibilidad del vuelo"
                },
                spotId: { 
                  type: "string",
                  description: "ID del spot donde se grabó"
                },
                equipmentItems: {
                  type: "array",
                  items: { type: "string" },
                  description: "IDs de los equipos utilizados"
                },
                featured: {
                  type: "boolean",
                  default: false,
                  description: "Marcar como destacado para portfolio"
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
          schema: { type: "string" },
          description: "ID del vuelo"
        }
      ],
      responses: {
        "200": {
          description: "Vuelo obtenido exitosamente",
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
        }
      }
    },
    put: {
      summary: "Actualizar un vuelo",
      security: [{ bearerAuth: [] }],
      tags: ["Vuelos"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID del vuelo"
        }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                title: { 
                  type: "string",
                  maxLength: 160,
                  description: "Título del vuelo"
                },
                description: { 
                  type: "string",
                  description: "Descripción opcional del vuelo"
                },
                videoUrl: { 
                  type: "string",
                  format: "uri",
                  description: "URL del vídeo (YouTube, Vimeo, etc.)"
                },
                posterUrl: { 
                  type: "string",
                  format: "uri",
                  description: "URL del poster/thumbnail opcional"
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
                  description: "Fecha real de grabación"
                },
                visibility: {
                  type: "string",
                  enum: ["private", "followers", "public"],
                  description: "Visibilidad del vuelo"
                },
                spotId: { 
                  type: "string",
                  description: "ID del spot donde se grabó"
                },
                equipmentItems: {
                  type: "array",
                  items: { type: "string" },
                  description: "IDs de los equipos utilizados"
                },
                featured: {
                  type: "boolean",
                  description: "Marcar como destacado para portfolio"
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
  "/flights/{id}/poster": {
    post: {
      summary: "Subir poster para un vuelo",
      security: [{ bearerAuth: [] }],
      tags: ["Vuelos"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID del vuelo"
        }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["poster"],
              properties: {
                poster: { 
                  type: "string",
                  format: "uri",
                  description: "URL del poster/thumbnail"
                }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Poster subido exitosamente",
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
        }
      }
    }
  }
}
