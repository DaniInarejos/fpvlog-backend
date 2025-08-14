export const groupsOpenApiDef = {
  "/groups": {
    get: {
      summary: "Obtener todos los grupos",
      tags: ["Grupos"],
      parameters: [
        {
          name: "page",
          in: "query",
          required: false,
          schema: { type: "number", default: 1 },
          description: "Número de página"
        },
        {
          name: "limit",
          in: "query",
          required: false,
          schema: { type: "number", default: 10 },
          description: "Límite de resultados por página"
        },
        {
          name: "search",
          in: "query",
          required: false,
          schema: { type: "string" },
          description: "Término de búsqueda"
        },
        {
          name: "tags",
          in: "query",
          required: false,
          schema: { type: "string" },
          description: "Tags separados por comas"
        },
        {
          name: "isPrivate",
          in: "query",
          required: false,
          schema: { type: "boolean" },
          description: "Filtrar por grupos privados/públicos"
        },
        {
          name: "createdBy",
          in: "query",
          required: false,
          schema: { type: "string" },
          description: "Filtrar grupos por ID del creador"
        }
      ],
      responses: {
        "200": {
          description: "Lista de grupos obtenida exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  groups: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Group" }
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      page: { type: "number" },
                      limit: { type: "number" },
                      total: { type: "number" },
                      totalPages: { type: "number" }
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
    },
    post: {
      summary: "Crear un nuevo grupo",
      security: [{ bearerAuth: [] }],
      tags: ["Grupos"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string", minLength: 1, maxLength: 100 },
                description: { type: "string", maxLength: 500 },
                isPrivate: { type: "boolean", default: false },
                tags: {
                  type: "array",
                  items: { type: "string" },
                  maxItems: 10
                }
              },
              required: ["name", "description"]
            }
          }
        }
      },
      responses: {
        "201": {
          description: "Grupo creado exitosamente",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Group" }
            }
          }
        },
        "400": {
          description: "Error de validación",
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
          description: "No autorizado"
        }
      }
    }
  },
  "/groups/search": {
    get: {
      summary: "Buscar grupos",
      tags: ["Grupos"],
      parameters: [
        {
          name: "q",
          in: "query",
          required: true,
          schema: { type: "string" },
          description: "Término de búsqueda"
        },
        {
          name: "page",
          in: "query",
          required: false,
          schema: { type: "number", default: 1 }
        },
        {
          name: "limit",
          in: "query",
          required: false,
          schema: { type: "number", default: 10 }
        }
      ],
      responses: {
        "200": {
          description: "Resultados de búsqueda",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  groups: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Group" }
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      page: { type: "number" },
                      limit: { type: "number" },
                      total: { type: "number" },
                      totalPages: { type: "number" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },

  "/groups/{id}": {
    get: {
      summary: "Obtener un grupo por ID",
      tags: ["Grupos"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID del grupo"
        }
      ],
      responses: {
        "200": {
          description: "Grupo encontrado",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Group" }
            }
          }
        },
        "404": {
          description: "Grupo no encontrado",
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
      summary: "Actualizar un grupo (solo administradores)",
      security: [{ bearerAuth: [] }],
      tags: ["Grupos"],
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
                name: { type: "string", minLength: 1, maxLength: 100 },
                description: { type: "string", maxLength: 500 },
                isPrivate: { type: "boolean" },
                tags: {
                  type: "array",
                  items: { type: "string" },
                  maxItems: 10
                }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Grupo actualizado exitosamente",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Group" }
            }
          }
        },
        "400": {
          description: "Error de validación"
        },
        "401": {
          description: "No autorizado"
        },
        "403": {
          description: "Sin permisos de administrador"
        },
        "404": {
          description: "Grupo no encontrado"
        }
      }
    },
    delete: {
      summary: "Eliminar un grupo (solo propietario)",
      security: [{ bearerAuth: [] }],
      tags: ["Grupos"],
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
          description: "Grupo eliminado exitosamente",
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
        "401": {
          description: "No autorizado"
        },
        "403": {
          description: "Sin permisos de propietario"
        },
        "404": {
          description: "Grupo no encontrado"
        }
      }
    }
  },

  "/groups/{id}/join": {
    post: {
      summary: "Unirse a un grupo",
      security: [{ bearerAuth: [] }],
      tags: ["Grupos"],
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
          description: "Unido al grupo exitosamente o solicitud enviada",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                  status: { 
                    type: "string", 
                    enum: ["joined", "pending"] 
                  }
                }
              }
            }
          }
        },
        "400": {
          description: "Ya eres miembro del grupo o estás baneado"
        },
        "401": {
          description: "No autorizado"
        },
        "404": {
          description: "Grupo no encontrado"
        }
      }
    }
  },

  "/groups/{id}/leave": {
    post: {
      summary: "Abandonar un grupo",
      security: [{ bearerAuth: [] }],
      tags: ["Grupos"],
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
          description: "Has abandonado el grupo exitosamente",
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
          description: "No eres miembro del grupo o eres el propietario"
        },
        "401": {
          description: "No autorizado"
        },
        "404": {
          description: "Grupo no encontrado"
        }
      }
    }
  },

  "/groups/{id}/members": {
    get: {
      summary: "Obtener miembros del grupo",
      security: [{ bearerAuth: [] }],
      tags: ["Grupos"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" }
        },
        {
          name: "role",
          in: "query",
          required: false,
          schema: { 
            type: "string",
            enum: ["owner", "admin", "member", "pending", "banned"]
          },
          description: "Filtrar por rol"
        },
        {
          name: "page",
          in: "query",
          required: false,
          schema: { type: "number", default: 1 }
        },
        {
          name: "limit",
          in: "query",
          required: false,
          schema: { type: "number", default: 20 }
        }
      ],
      responses: {
        "200": {
          description: "Lista de miembros",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  members: {
                    type: "array",
                    items: { $ref: "#/components/schemas/GroupMember" }
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      page: { type: "number" },
                      limit: { type: "number" },
                      total: { type: "number" },
                      totalPages: { type: "number" }
                    }
                  }
                }
              }
            }
          }
        },
        "401": {
          description: "No autorizado"
        },
        "403": {
          description: "Sin permisos para ver miembros"
        },
        "404": {
          description: "Grupo no encontrado"
        }
      }
    }
  },

  "/groups/{id}/members/pending": {
    get: {
      summary: "Obtener solicitudes pendientes (solo administradores)",
      security: [{ bearerAuth: [] }],
      tags: ["Grupos"],
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
          description: "Lista de solicitudes pendientes",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/GroupMember" }
              }
            }
          }
        },
        "401": {
          description: "No autorizado"
        },
        "403": {
          description: "Sin permisos de administrador"
        },
        "404": {
          description: "Grupo no encontrado"
        }
      }
    }
  },

  "/groups/{id}/members/{userId}": {
    patch: {
      summary: "Gestionar miembro (aprobar, rechazar, banear, promover, etc.)",
      security: [{ bearerAuth: [] }],
      tags: ["Grupos"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" }
        },
        {
          name: "userId",
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
                action: {
                  type: "string",
                  enum: ["approve", "reject", "ban", "unban", "promote", "demote"]
                },
                newRole: {
                  type: "string",
                  enum: ["admin", "member"],
                  description: "Requerido para promote/demote"
                }
              },
              required: ["action"]
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Acción ejecutada exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                  member: { $ref: "#/components/schemas/GroupMember" }
                }
              }
            }
          }
        },
        "400": {
          description: "Acción inválida o datos incorrectos"
        },
        "401": {
          description: "No autorizado"
        },
        "403": {
          description: "Sin permisos suficientes"
        },
        "404": {
          description: "Grupo o usuario no encontrado"
        }
      }
    }
  },

  "/groups/{id}/transfer-ownership": {
    post: {
      summary: "Transferir propiedad del grupo (solo propietario)",
      security: [{ bearerAuth: [] }],
      tags: ["Grupos"],
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
                newOwnerId: { type: "string" }
              },
              required: ["newOwnerId"]
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Propiedad transferida exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                  group: { $ref: "#/components/schemas/Group" }
                }
              }
            }
          }
        },
        "400": {
          description: "El nuevo propietario debe ser miembro del grupo"
        },
        "401": {
          description: "No autorizado"
        },
        "403": {
          description: "Solo el propietario puede transferir la propiedad"
        },
        "404": {
          description: "Grupo no encontrado"
        }
      }
    }
  }
}

// Topics endpoints
export const groupTopicsOpenApi = {
  // POST /groups/{id}/topics
  '/groups/{id}/topics': {
    post: {
      summary: 'Crear tema en grupo',
      tags: ['Groups'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID del grupo'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['title'],
              properties: {
                title: {
                  type: 'string',
                  maxLength: 100,
                  description: 'Título del tema'
                },
                description: {
                  type: 'string',
                  maxLength: 500,
                  description: 'Descripción del tema'
                }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Tema creado exitosamente',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/GroupTopic' }
            }
          }
        },
        400: {
          description: 'Error de validación',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        401: {
          description: 'No autorizado'
        },
        403: {
          description: 'Sin permisos'
        }
      }
    },
    get: {
      summary: 'Listar temas del grupo',
      tags: ['Groups'],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID del grupo'
        },
        {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', minimum: 1, default: 1 },
          description: 'Número de página'
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', minimum: 1, maximum: 50, default: 20 },
          description: 'Elementos por página'
        }
      ],
      responses: {
        200: {
          description: 'Lista de temas',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  topics: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/GroupTopic' }
                  },
                  total: { type: 'integer' },
                  page: { type: 'integer' },
                  totalPages: { type: 'integer' }
                }
              }
            }
          }
        },
        400: {
          description: 'Error en la solicitud'
        }
      }
    }
  },
  
  // PATCH/DELETE /groups/{id}/topics/{topicId}
  '/groups/{id}/topics/{topicId}': {
    patch: {
      summary: 'Actualizar tema',
      tags: ['Groups'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID del grupo'
        },
        {
          name: 'topicId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID del tema'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                  maxLength: 100
                },
                description: {
                  type: 'string',
                  maxLength: 500
                },
                isPinned: {
                  type: 'boolean',
                  description: 'Solo admins/owners pueden modificar'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Tema actualizado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/GroupTopic' }
            }
          }
        },
        400: { description: 'Error de validación' },
        401: { description: 'No autorizado' },
        403: { description: 'Sin permisos' },
        404: { description: 'Tema no encontrado' }
      }
    },
    delete: {
      summary: 'Eliminar tema',
      tags: ['Groups'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID del grupo'
        },
        {
          name: 'topicId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID del tema'
        }
      ],
      responses: {
        200: {
          description: 'Tema eliminado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' }
                }
              }
            }
          }
        },
        401: { description: 'No autorizado' },
        403: { description: 'Sin permisos' },
        404: { description: 'Tema no encontrado' }
      }
    }
  }
}