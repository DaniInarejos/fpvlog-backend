export const groupCommentsOpenApi = {
  // POST /groups/{groupId}/posts/{postId}/comments
  '/groups/{groupId}/posts/{postId}/comments': {
    post: {
      summary: 'Crear comentario en post',
      tags: ['Groups', 'Comments'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'groupId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID del grupo'
        },
        {
          name: 'postId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID del post'
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
              schema: { $ref: '#/components/schemas/GroupComment' }
            }
          }
        },
        400: { description: 'Error de validación' },
        401: { description: 'No autorizado' },
        403: { description: 'Sin permisos' }
      }
    },
    get: {
      summary: 'Obtener comentarios del post',
      tags: ['Groups', 'Comments'],
      parameters: [
        {
          name: 'groupId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID del grupo'
        },
        {
          name: 'postId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID del post'
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
          description: 'Lista de comentarios',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  comments: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/GroupComment' }
                  },
                  total: { type: 'integer' },
                  page: { type: 'integer' },
                  totalPages: { type: 'integer' }
                }
              }
            }
          }
        },
        400: { description: 'Error en la solicitud' }
      }
    }
  },
  
  // PATCH/DELETE /groups/{groupId}/posts/{postId}/comments/{commentId}
  '/groups/{groupId}/posts/{postId}/comments/{commentId}': {
    patch: {
      summary: 'Actualizar comentario',
      tags: ['Groups', 'Comments'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'groupId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID del grupo'
        },
        {
          name: 'postId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID del post'
        },
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
              schema: { $ref: '#/components/schemas/GroupComment' }
            }
          }
        },
        400: { description: 'Error de validación' },
        401: { description: 'No autorizado' },
        403: { description: 'Sin permisos' },
        404: { description: 'Comentario no encontrado' }
      }
    },
    delete: {
      summary: 'Eliminar comentario',
      tags: ['Groups', 'Comments'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'groupId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID del grupo'
        },
        {
          name: 'postId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID del post'
        },
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
  
  // GET /groups/{groupId}/comments/{commentId}/replies
  '/groups/{groupId}/comments/{commentId}/replies': {
    get: {
      summary: 'Obtener respuestas de un comentario',
      tags: ['Groups', 'Comments'],
      parameters: [
        {
          name: 'groupId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID del grupo'
        },
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
                  replies: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/GroupComment' }
                  },
                  total: { type: 'integer' },
                  page: { type: 'integer' },
                  totalPages: { type: 'integer' }
                }
              }
            }
          }
        },
        400: { description: 'Error en la solicitud' }
      }
    }
  },
  
  // POST /groups/{groupId}/comments/{commentId}/like
  '/groups/{groupId}/comments/{commentId}/like': {
    post: {
      summary: 'Dar/quitar like a comentario',
      tags: ['Groups', 'Comments', 'Likes'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'groupId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'ID del grupo'
        },
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
          description: 'Like actualizado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  liked: { type: 'boolean' },
                  count: { type: 'integer' }
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