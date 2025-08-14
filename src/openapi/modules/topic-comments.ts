export const topicCommentsOpenApi = {
  // POST /topics/{topicId}/comments
  '/topics/{topicId}/comments': {
    post: {
      summary: 'Crear comentario en topic',
      tags: ['Topics', 'Comments'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'topicId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID del topic'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['content'],
              properties: {
                content: {
                  type: 'string',
                  maxLength: 500,
                  description: 'Contenido del comentario'
                },
                parentId: {
                  type: 'string',
                  description: 'ID del comentario padre (para respuestas)'
                }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Comentario creado exitosamente',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: { $ref: '#/components/schemas/GroupComment' }
                }
              }
            }
          }
        },
        400: { description: 'Error en la solicitud' },
        401: { description: 'No autorizado' },
        403: { description: 'Sin permisos' }
      }
    },
    get: {
      summary: 'Obtener comentarios de un topic',
      tags: ['Topics', 'Comments'],
      parameters: [
        {
          name: 'topicId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID del topic'
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
          schema: { type: 'integer', minimum: 1, maximum: 50, default: 10 },
          description: 'Elementos por página'
        }
      ],
      responses: {
        200: {
          description: 'Lista de comentarios',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      comments: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/GroupComment' }
                      },
                      pagination: {
                        type: 'object',
                        properties: {
                          currentPage: { type: 'integer' },
                          totalPages: { type: 'integer' },
                          totalComments: { type: 'integer' },
                          hasNextPage: { type: 'boolean' },
                          hasPrevPage: { type: 'boolean' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        400: { description: 'Error en la solicitud' }
      }
    }
  },
  
  // PATCH/DELETE /topics/comments/{commentId}
  '/topics/comments/{commentId}': {
    patch: {
      summary: 'Actualizar comentario de topic',
      tags: ['Topics', 'Comments'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'commentId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID del comentario'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['content'],
              properties: {
                content: {
                  type: 'string',
                  maxLength: 500,
                  description: 'Nuevo contenido del comentario'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Comentario actualizado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: { $ref: '#/components/schemas/GroupComment' }
                }
              }
            }
          }
        },
        400: { description: 'Error en la solicitud' },
        401: { description: 'No autorizado' },
        403: { description: 'Sin permisos' }
      }
    },
    delete: {
      summary: 'Eliminar comentario de topic',
      tags: ['Topics', 'Comments'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'commentId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID del comentario'
        }
      ],
      responses: {
        200: {
          description: 'Comentario eliminado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  message: { type: 'string' }
                }
              }
            }
          }
        },
        401: { description: 'No autorizado' },
        403: { description: 'Sin permisos' },
        404: { description: 'Comentario no encontrado' }
      }
    }
  },
  
  // GET /topics/comments/{commentId}/replies
  '/topics/comments/{commentId}/replies': {
    get: {
      summary: 'Obtener respuestas de un comentario de topic',
      tags: ['Topics', 'Comments'],
      parameters: [
        {
          name: 'commentId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID del comentario'
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
          schema: { type: 'integer', minimum: 1, maximum: 20, default: 10 },
          description: 'Elementos por página'
        }
      ],
      responses: {
        200: {
          description: 'Lista de respuestas',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      replies: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/GroupComment' }
                      },
                      pagination: {
                        type: 'object',
                        properties: {
                          currentPage: { type: 'integer' },
                          totalPages: { type: 'integer' },
                          totalReplies: { type: 'integer' },
                          hasNextPage: { type: 'boolean' },
                          hasPrevPage: { type: 'boolean' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        400: { description: 'Error en la solicitud' }
      }
    }
  },
  
  // POST /topics/comments/{commentId}/like
  '/topics/comments/{commentId}/like': {
    post: {
      summary: 'Dar/quitar like a comentario de topic',
      tags: ['Topics', 'Comments'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'commentId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID del comentario'
        }
      ],
      responses: {
        200: {
          description: 'Like procesado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'object',
                    properties: {
                      liked: { type: 'boolean' },
                      likesCount: { type: 'integer' }
                    }
                  }
                }
              }
            }
          }
        },
        401: { description: 'No autorizado' },
        403: { description: 'Sin permisos' },
        404: { description: 'Comentario no encontrado' }
      }
    }
  }
}