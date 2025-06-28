export const feedsOpenApiDef = {
  "/feeds/global": {
    get: {
      summary: "Obtener feeds global",
      security: [{ bearerAuth: [] }],
      tags: ["Feeds"],
      parameters: [
        {
          name: "page",
          in: "query",
          required: false,
          schema: { type: "integer", default: 1 },
          description: "Número de página para la paginación"
        },
        {
          name: "limit",
          in: "query",
          required: false,
          schema: { type: "integer", default: 20 },
          description: "Cantidad de items por página"
        },
        {
          name: "lastTimestamp",
          in: "query",
          required: false,
          schema: { type: "string", format: "date-time" },
          description: "Timestamp del último item recibido para scroll infinito"
        }
      ],
      responses: {
        "200": {
          description: "Feeds global obtenido exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  items: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/FeedsItem"
                    }
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      currentPage: { type: "integer" },
                      totalPages: { type: "integer" },
                      totalItems: { type: "integer" },
                      hasNextPage: { type: "boolean" },
                      nextTimestamp: { 
                        type: "string", 
                        format: "date-time",
                        description: "Timestamp para obtener la siguiente página"
                      }
                    }
                  }
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
    }
  },
  "/feeds/following": {
    get: {
      summary: "Obtener feeds de usuarios seguidos",
      security: [{ bearerAuth: [] }],
      tags: ["Feeds"],
      parameters: [
        {
          name: "page",
          in: "query",
          required: false,
          schema: { type: "integer", default: 1 },
          description: "Número de página para la paginación"
        },
        {
          name: "limit",
          in: "query",
          required: false,
          schema: { type: "integer", default: 20 },
          description: "Cantidad de items por página"
        },
        {
          name: "lastTimestamp",
          in: "query",
          required: false,
          schema: { type: "string", format: "date-time" },
          description: "Timestamp del último item recibido para scroll infinito"
        }
      ],
      responses: {
        "200": {
          description: "Feeds de seguidos obtenido exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  items: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/FeedsItem"
                    }
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      currentPage: { type: "integer" },
                      totalPages: { type: "integer" },
                      totalItems: { type: "integer" },
                      hasNextPage: { type: "boolean" },
                      nextTimestamp: { 
                        type: "string", 
                        format: "date-time",
                        description: "Timestamp para obtener la siguiente página"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "401": {
          description: "No autenticado",
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
    }
  }
}