export const followersOpenApiDef = {
  "/followers/{userId}/follow": {
    post: {
      summary: "Seguir a un usuario",
      security: [{ bearerAuth: [] }],
      tags: ["Seguidores"],
      parameters: [
        {
          name: "userId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID del usuario a seguir"
        }
      ],
      responses: {
        "200": {
          description: "Usuario seguido exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  follower: { type: "string" },
                  following: { type: "string" },
                  createdAt: { type: "string", format: "date-time" }
                }
              }
            }
          }
        },
        "400": {
          description: "Error en la solicitud",
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
        }
      }
    },
    delete: {
      summary: "Dejar de seguir a un usuario",
      security: [{ bearerAuth: [] }],
      tags: ["Seguidores"],
      parameters: [
        {
          name: "userId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID del usuario a dejar de seguir"
        }
      ],
      responses: {
        "200": {
          description: "Usuario dejado de seguir exitosamente",
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
        "400": {
          description: "Error en la solicitud",
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
        }
      }
    }
  },
  "/followers/{userId}/followers": {
    get: {
      summary: "Obtener seguidores de un usuario",
      tags: ["Seguidores"],
      parameters: [
        {
          name: "userId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID del usuario"
        },
        {
          name: "page",
          in: "query",
          required: false,
          schema: { type: "integer", default: 1 },
          description: "Número de página"
        },
        {
          name: "limit",
          in: "query",
          required: false,
          schema: { type: "integer", default: 20 },
          description: "Cantidad de resultados por página"
        }
      ],
      responses: {
        "200": {
          description: "Lista de seguidores obtenida exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  followers: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        _id: { type: "string" },
                        username: { type: "string" },
                        name: { type: "string" },
                        lastName: { type: "string" },
                        profilePicture: { type: "string", nullable: true },
                        createdAt: { type: "string", format: "date-time" }
                      }
                    }
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      page: { type: "integer" },
                      limit: { type: "integer" },
                      total: { type: "integer" },
                      pages: { type: "integer" }
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
  "/followers/{userId}/following": {
    get: {
      summary: "Obtener usuarios seguidos por un usuario",
      tags: ["Seguidores"],
      parameters: [
        {
          name: "userId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID del usuario"
        },
        {
          name: "page",
          in: "query",
          required: false,
          schema: { type: "integer", default: 1 },
          description: "Número de página"
        },
        {
          name: "limit",
          in: "query",
          required: false,
          schema: { type: "integer", default: 20 },
          description: "Cantidad de resultados por página"
        }
      ],
      responses: {
        "200": {
          description: "Lista de usuarios seguidos obtenida exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  following: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        _id: { type: "string" },
                        username: { type: "string" },
                        name: { type: "string" },
                        lastName: { type: "string" },
                        profilePicture: { type: "string", nullable: true },
                        createdAt: { type: "string", format: "date-time" }
                      }
                    }
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      page: { type: "integer" },
                      limit: { type: "integer" },
                      total: { type: "integer" },
                      pages: { type: "integer" }
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
  "/followers/{userId}/is-following": {
    get: {
      summary: "Verificar si el usuario autenticado sigue a otro usuario",
      security: [{ bearerAuth: [] }],
      tags: ["Seguidores"],
      parameters: [
        {
          name: "userId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID del usuario a verificar"
        }
      ],
      responses: {
        "200": {
          description: "Estado de seguimiento obtenido exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  isFollowing: { type: "boolean" }
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