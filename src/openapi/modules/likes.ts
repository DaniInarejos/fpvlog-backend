export const likesRoutes = {
  '/likes/{targetType}/{targetId}': {
    post: {
      tags: ['Likes'],
      summary: 'Alternar like en un objetivo',
      parameters: [
        {
          name: 'targetType',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            enum: ['user', 'drone', 'flight']
          },
          description: 'Tipo de objetivo (user, drone, flight)'
        },
        {
          name: 'targetId',
          in: 'path',
          required: true,
          schema: {
            type: 'string'
          },
          description: 'ID del objetivo'
        }
      ],
      responses: {
        '200': {
          description: 'Like alternado exitosamente',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  liked: {
                    type: 'boolean',
                    description: 'Estado final del like'
                  },
                  count: {
                    type: 'number',
                    description: 'Número total de likes'
                  }
                }
              }
            }
          }
        },
        '500': {
          description: 'Error del servidor',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  '/likes/{targetType}/{targetId}/count': {
    get: {
      tags: ['Likes'],
      summary: 'Obtener número de likes de un objetivo',
      parameters: [
        {
          name: 'targetType',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            enum: ['user', 'drone', 'flight']
          },
          description: 'Tipo de objetivo (user, drone, flight)'
        },
        {
          name: 'targetId',
          in: 'path',
          required: true,
          schema: {
            type: 'string'
          },
          description: 'ID del objetivo'
        }
      ],
      responses: {
        '200': {
          description: 'Número de likes obtenido exitosamente',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  count: {
                    type: 'number',
                    description: 'Número total de likes'
                  }
                }
              }
            }
          }
        },
        '500': {
          description: 'Error del servidor',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  '/likes/{targetType}/{targetId}/check': {
    get: {
      tags: ['Likes'],
      summary: 'Verificar si el usuario ha dado like',
      parameters: [
        {
          name: 'targetType',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            enum: ['user', 'drone', 'flight']
          },
          description: 'Tipo de objetivo (user, drone, flight)'
        },
        {
          name: 'targetId',
          in: 'path',
          required: true,
          schema: {
            type: 'string'
          },
          description: 'ID del objetivo'
        }
      ],
      responses: {
        '200': {
          description: 'Estado del like verificado exitosamente',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  hasLike: {
                    type: 'boolean',
                    description: 'Indica si el usuario ha dado like'
                  }
                }
              }
            }
          }
        },
        '500': {
          description: 'Error del servidor',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  '/likes/user/{userId}': {
    get: {
      tags: ['Likes'],
      summary: 'Obtener likes de un usuario',
      parameters: [
        {
          name: 'userId',
          in: 'path',
          required: false,
          schema: {
            type: 'string'
          },
          description: 'ID del usuario (opcional, si no se proporciona se usa el usuario autenticado)'
        },
        {
          name: 'page',
          in: 'query',
          required: false,
          schema: {
            type: 'integer',
            default: 1
          },
          description: 'Número de página'
        },
        {
          name: 'limit',
          in: 'query',
          required: false,
          schema: {
            type: 'integer',
            default: 20
          },
          description: 'Número de elementos por página'
        }
      ],
      responses: {
        '200': {
          description: 'Lista de likes obtenida exitosamente',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  likes: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        userId: {
                          type: 'string'
                        },
                        targetId: {
                          type: 'string'
                        },
                        targetType: {
                          type: 'string',
                          enum: ['user', 'drone', 'flight']
                        },
                        createdAt: {
                          type: 'string',
                          format: 'date-time'
                        }
                      }
                    }
                  },
                  pagination: {
                    type: 'object',
                    properties: {
                      page: {
                        type: 'number'
                      },
                      limit: {
                        type: 'number'
                      },
                      total: {
                        type: 'number'
                      },
                      pages: {
                        type: 'number'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        '500': {
          description: 'Error del servidor',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string'
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