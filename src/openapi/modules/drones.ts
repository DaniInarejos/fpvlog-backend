export const dronesOpenApiDef = {
  "/drones": {
    get: {
      summary: "Obtener todos los drones",
      security: [{ bearerAuth: [] }],
      tags: ["Drones"],
      responses: {
        "200": {
          description: "Lista de drones obtenida exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    name: { type: "string" },
                    typeId: { type: "string" },
                    brandId: { type: "string" },
                    model: { type: "string" },
                    serialNumber: { type: "string" },
                    weight: { type: "number", minimum: 0 },
                    frameSize: { type: "number" },
                    notes: { type: "string", nullable: true },
                    description: { type: "string", nullable: true },
                    userId: { type: "string" },
                    createdAt: { type: "string", format: "date-time" },
                    visibility: {
                      type: "object",
                      properties: {
                        isVisibleToFollowers: { type: "boolean" },
                        isPublic: { type: "boolean" }
                      }
                    },
                    image: { type: "string", nullable: true }
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
      summary: "Crear un nuevo drone",
      security: [{ bearerAuth: [] }],
      tags: ["Drones"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "typeId", "brandId", "model", "serialNumber", "weight", "frameSize"],
              properties: {
                name: { type: "string" },
                typeId: { type: "string" },
                brandId: { type: "string" },
                model: { type: "string" },
                serialNumber: { type: "string" },
                weight: { type: "number", minimum: 0 },
                frameSize: { type: "number" },
                notes: { type: "string" },
                description: { type: "string" },
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
          description: "Drone creado exitosamente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Drone"
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
  "/drones/{id}": {
    get: {
      summary: "Obtener un drone por ID",
      security: [{ bearerAuth: [] }],
      tags: ["Drones"],
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
          description: "Drone encontrado",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Drone"
              }
            }
          }
        },
        "404": {
          description: "Drone no encontrado",
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
      summary: "Actualizar un drone",
      security: [{ bearerAuth: [] }],
      tags: ["Drones"],
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
                name: { type: "string" },
                typeId: { type: "string" },
                brandId: { type: "string" },
                model: { type: "string" },
                serialNumber: { type: "string" },
                weight: { type: "number", minimum: 0 },
                frameSize: { type: "number" },
                notes: { type: "string" },
                description: { type: "string" },
                originType: { type: "string", enum: ["CUSTOM", "BRANDED"] },
                components: {
                  type: "object",
                  properties: {
                    frameId: { type: "string", nullable: true },
                    motors: { type: "array", items: { type: "string" }, nullable: true },
                    flightControllerId: { type: "string", nullable: true },
                    escId: { type: "string", nullable: true },
                    vtxId: { type: "string", nullable: true },
                    cameraId: { type: "string", nullable: true },
                    antennaId: { type: "string", nullable: true },
                    receiverId: { type: "string", nullable: true },
                    batteryId: { type: "string", nullable: true },
                    propsId: { type: "string", nullable: true },
                    mountId: { type: "string", nullable: true },
                    others: { type: "array", items: { type: "string" }, nullable: true }
                  },
                  nullable: true
                },
                betaflightId: { type: "string", nullable: true },
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
          description: "Drone actualizado exitosamente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Drone"
              }
            }
          }
        },
        "403": {
          description: "No autorizado para actualizar este drone",
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
          description: "Drone no encontrado"
        }
      }
    },
    delete: {
      summary: "Eliminar un drone",
      security: [{ bearerAuth: [] }],
      tags: ["Drones"],
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
          description: "Drone eliminado exitosamente",
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
        "403": {
          description: "No autorizado para eliminar este drone",
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
          description: "Drone no encontrado"
        }
      }
    }
  },
  "/drones/{id}/image": {
    post: {
      summary: "Subir imagen de un drone",
      security: [{ bearerAuth: [] }],
      tags: ["Drones"],
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
                  description: "Imagen del drone (JPG, PNG, GIF o WEBP, max 5MB)"
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
                $ref: "#/components/schemas/Drone"
              }
            }
          }
        },
        "400": {
          description: "Error en la subida de imagen",
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
          description: "No autorizado para actualizar este drone"
        },
        "404": {
          description: "Drone no encontrado"
        }
      }
    }
  }
}