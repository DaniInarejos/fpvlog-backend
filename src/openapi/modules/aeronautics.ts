export const aeronauticsOpenApiDef = {
  '/aeronautics': {
    get: {
      summary: 'Obtener datos de zonas aeronáuticas de España',
      description: 'Obtiene información sobre zonas restringidas y reguladas para vuelos de drones desde la API de ENAIRE. Los datos se cachean durante 1 semana para optimizar el rendimiento.',
      tags: ['Aeronautics'],
      responses: {
        200: {
          description: 'Datos de zonas aeronáuticas obtenidos exitosamente',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: {
                    type: 'object',
                    properties: {
                      type: { 
                        type: 'string', 
                        enum: ['FeatureCollection'],
                        example: 'FeatureCollection'
                      },
                      features: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            type: { 
                              type: 'string', 
                              enum: ['Feature'],
                              example: 'Feature'
                            },
                            id: { 
                              type: 'number',
                              example: 1
                            },
                            geometry: {
                              type: 'object',
                              properties: {
                                type: { 
                                  type: 'string', 
                                  enum: ['Polygon'],
                                  example: 'Polygon'
                                },
                                coordinates: {
                                  type: 'array',
                                  items: {
                                    type: 'array',
                                    items: {
                                      type: 'array',
                                      items: { type: 'number' }
                                    }
                                  },
                                  example: [[[-8.1875, 43.5], [-8.1875, 43.5208], [-8.3542, 43.5208], [-8.3542, 43.5], [-8.1875, 43.5]]]
                                }
                              },
                              required: ['type', 'coordinates']
                            },
                            properties: {
                              type: 'object',
                              properties: {
                                Name: { 
                                  type: 'string', 
                                  nullable: true,
                                  description: 'Nombre de la zona aeronáutica',
                                  example: 'San Salvador de Serantes'
                                },
                                Type: { 
                                  type: 'string',
                                  description: 'Tipo de restricción',
                                  example: 'REQ_AUTHORIZATION'
                                },
                                Reasons: { 
                                  type: 'string',
                                  description: 'Razones de la restricción',
                                  example: 'PRIVACY'
                                },
                                Message: { 
                                  type: 'string',
                                  description: 'Mensaje informativo sobre la restricción',
                                  example: 'Se encuentra en una zona geográficas de UAS restringida al vuelo fotográfico.'
                                },
                                Lower: { 
                                  type: 'number', 
                                  nullable: true,
                                  description: 'Límite inferior de altitud',
                                  example: null
                                },
                                LowerReference: { 
                                  type: 'string',
                                  description: 'Referencia del límite inferior',
                                  example: 'AGL'
                                },
                                Upper: { 
                                  type: 'number', 
                                  nullable: true,
                                  description: 'Límite superior de altitud',
                                  example: null
                                },
                                UpperReference: { 
                                  type: 'string',
                                  description: 'Referencia del límite superior',
                                  example: 'AGL'
                                },
                                Email: { 
                                  type: 'string',
                                  description: 'Email de contacto para autorizaciones',
                                  example: 'cecaf@ea.mde.es'
                                },
                                Phone: { 
                                  type: 'string',
                                  description: 'Teléfono de contacto',
                                  example: ''
                                },
                                UpdateDateTime: { 
                                  type: 'string',
                                  format: 'date-time',
                                  description: 'Fecha y hora de última actualización',
                                  example: '2025-07-08T07:37:53'
                                },
                                Identifier: { 
                                  type: 'string',
                                  description: 'Identificador único de la zona',
                                  example: '0006-4'
                                },
                                Country: { 
                                  type: 'string',
                                  description: 'Código del país',
                                  example: 'ESP'
                                },
                                UOM: { 
                                  type: 'string', 
                                  nullable: true,
                                  description: 'Unidad de medida para altitudes',
                                  example: null
                                },
                                Day: { 
                                  type: 'string',
                                  description: 'Días aplicables de la restricción',
                                  example: 'ANY'
                                }
                              },
                              required: ['Type', 'Reasons', 'Message', 'LowerReference', 'UpperReference', 'Email', 'Phone', 'UpdateDateTime', 'Identifier', 'Country', 'Day']
                            }
                          },
                          required: ['type', 'id', 'geometry', 'properties']
                        }
                      }
                    },
                    required: ['type', 'features']
                  },
                  cachedAt: { 
                    type: 'string', 
                    format: 'date-time',
                    description: 'Fecha y hora cuando se cachearon los datos',
                    example: '2024-01-15T10:30:00.000Z'
                  },
                  source: { 
                    type: 'string', 
                    enum: ['cache', 'api'],
                    description: 'Origen de los datos (cache o API directa)',
                    example: 'cache'
                  }
                },
                required: ['success', 'data', 'cachedAt', 'source']
              }
            }
          }
        },
        500: {
          description: 'Error interno del servidor',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  error: { 
                    type: 'string',
                    example: 'Failed to retrieve aeronautics data'
                  }
                },
                required: ['success', 'error']
              }
            }
          }
        }
      }
    }
  },
  '/aeronautics/refresh': {
    post: {
      summary: 'Refrescar datos de zonas aeronáuticas manualmente',
      description: 'Fuerza la actualización de los datos desde la API de ENAIRE, limpiando el cache existente y obteniendo información actualizada.',
      tags: ['Aeronautics'],
      responses: {
        200: {
          description: 'Datos actualizados correctamente',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { 
                    type: 'string',
                    example: 'Datos actualizados correctamente'
                  },
                  data: {
                    type: 'object',
                    properties: {
                      type: { 
                        type: 'string', 
                        enum: ['FeatureCollection'],
                        example: 'FeatureCollection'
                      },
                      features: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/AeronauticsFeature'
                        }
                      }
                    },
                    required: ['type', 'features']
                  },
                  cachedAt: { 
                    type: 'string', 
                    format: 'date-time',
                    description: 'Fecha y hora de la nueva cache',
                    example: '2024-01-15T10:35:00.000Z'
                  },
                  source: { 
                    type: 'string', 
                    enum: ['api'],
                    description: 'Siempre será "api" ya que se fuerza la actualización',
                    example: 'api'
                  }
                },
                required: ['success', 'message', 'data', 'cachedAt', 'source']
              }
            }
          }
        },
        500: {
          description: 'Error al refrescar datos',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  error: { 
                    type: 'string',
                    example: 'Failed to retrieve aeronautics data'
                  }
                },
                required: ['success', 'error']
              }
            }
          }
        }
      }
    }
  }
};

// Esquemas reutilizables para componentes
export const aeronauticsComponents = {
  schemas: {
    AeronauticsFeature: {
      type: 'object',
      properties: {
        type: { 
          type: 'string', 
          enum: ['Feature'],
          example: 'Feature'
        },
        id: { 
          type: 'number',
          example: 1
        },
        geometry: {
          type: 'object',
          properties: {
            type: { 
              type: 'string', 
              enum: ['Polygon'],
              example: 'Polygon'
            },
            coordinates: {
              type: 'array',
              items: {
                type: 'array',
                items: {
                  type: 'array',
                  items: { type: 'number' }
                }
              }
            }
          },
          required: ['type', 'coordinates']
        },
        properties: {
          $ref: '#/components/schemas/AeronauticsFeatureProperties'
        }
      },
      required: ['type', 'id', 'geometry', 'properties']
    },
    AeronauticsFeatureProperties: {
      type: 'object',
      properties: {
        Name: { 
          type: 'string', 
          nullable: true,
          description: 'Nombre de la zona aeronáutica'
        },
        Type: { 
          type: 'string',
          description: 'Tipo de restricción (REQ_AUTHORIZATION, PROHIBITED, etc.)'
        },
        Reasons: { 
          type: 'string',
          description: 'Razones de la restricción (PRIVACY, SECURITY, etc.)'
        },
        Message: { 
          type: 'string',
          description: 'Mensaje informativo detallado sobre la restricción'
        },
        Lower: { 
          type: 'number', 
          nullable: true,
          description: 'Límite inferior de altitud en metros'
        },
        LowerReference: { 
          type: 'string',
          description: 'Referencia del límite inferior (AGL, MSL, etc.)'
        },
        Upper: { 
          type: 'number', 
          nullable: true,
          description: 'Límite superior de altitud en metros'
        },
        UpperReference: { 
          type: 'string',
          description: 'Referencia del límite superior (AGL, MSL, etc.)'
        },
        Email: { 
          type: 'string',
          format: 'email',
          description: 'Email de contacto para solicitar autorizaciones'
        },
        Phone: { 
          type: 'string',
          description: 'Teléfono de contacto'
        },
        UpdateDateTime: { 
          type: 'string',
          format: 'date-time',
          description: 'Fecha y hora de última actualización de la zona'
        },
        Identifier: { 
          type: 'string',
          description: 'Identificador único de la zona (formato: XXXX-X)'
        },
        Country: { 
          type: 'string',
          description: 'Código ISO del país (ESP para España)'
        },
        UOM: { 
          type: 'string', 
          nullable: true,
          description: 'Unidad de medida para las altitudes'
        },
        Day: { 
          type: 'string',
          description: 'Días aplicables de la restricción (ANY, MON-FRI, etc.)'
        }
      },
      required: ['Type', 'Reasons', 'Message', 'LowerReference', 'UpperReference', 'Email', 'Phone', 'UpdateDateTime', 'Identifier', 'Country', 'Day']
    }
  }
};