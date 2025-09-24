export const usersOpenApiDef = {
  "/users/dashboard/{username}": {
    get: {
      summary: "Obtener el dashboard de un usuario",
      tags: ["Usuarios"],
      parameters: [
        {
          name: "username",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Nombre de usuario"
        }
      ],
      responses: {
        "200": {
          description: "Dashboard del usuario obtenido exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  user: {
                    type: "object",
                    properties: {
                      _id: { type: "string" },
                      username: { type: "string" },
                      name: { type: "string" },
                      lastName: { type: "string" },
                      profilePicture: { type: "string", nullable: true },
                      points: { type: "number" }
                    }
                  },
                  stats: {
                    type: "object",
                    properties: {
                      dronesCount: { type: "number" },
                      flightsCount: { type: "number" },
                      followersCount: { type: "number" },
                      followingCount: { type: "number" }
                    }
                  },
                  recentFlights: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Flight" }
                  },
                  drones: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Drone" }
                  }
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
        }
      }
    }
  },
  "/users/profile": {
    get: {
      summary: "Obtener el perfil del usuario autenticado",
      security: [{ bearerAuth: [] }],
      tags: ["Usuarios"],
      responses: {
        "200": {
          description: "Perfil del usuario obtenido exitosamente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User"
              }
            }
          }
        }
      }
    }
  },
  "/users": {
    get: {
      summary: "Obtener todos los usuarios",
      security: [{ bearerAuth: [] }],
      tags: ["Usuarios"],
      responses: {
        "200": {
          description: "Lista de usuarios obtenida exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/User"
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
  "/users/{id}": {
    get: {
      summary: "Obtener un usuario por ID",
      security: [{ bearerAuth: [] }],
      tags: ["Usuarios"],
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
          description: "Usuario encontrado",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User"
              }
            }
          }
        },
        "404": {
          description: "Usuario no encontrado",
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
      summary: "Actualizar un usuario",
      security: [{ bearerAuth: [] }],
      tags: ["Usuarios"],
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
                lastName: { type: "string" },
                privacySettings: {
                  type: "object",
                  properties: {
                    allowFollowersToSeeFlights: { type: "boolean" },
                    allowFollowersToSeeDrones: { type: "boolean" },
                    profileVisibility: {
                      type: "string",
                      enum: ["public", "followers", "private"]
                    }
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Usuario actualizado exitosamente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User"
              }
            }
          }
        },
        "403": {
          description: "No autorizado para actualizar este usuario",
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
          description: "Usuario no encontrado"
        }
      }
    },
    delete: {
      summary: "Eliminar un usuario",
      security: [{ bearerAuth: [] }],
      tags: ["Usuarios"],
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
          description: "Usuario eliminado exitosamente",
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
          description: "No autorizado para eliminar este usuario",
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
          description: "Usuario no encontrado"
        }
      }
    }
  },
  "/users/{id}/image-profile": {
    post: {
      summary: "Subir imagen de perfil",
      security: [{ bearerAuth: [] }],
      tags: ["Usuarios"],
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
              properties: {
                image: {
                  type: "string",
                  format: "binary"
                }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Imagen de perfil actualizada exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  profilePicture: { type: "string" }
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
        }
      }
    }
  },
  "/users/{id}/equipment-items/{equipmentItemId}/favorite": {
    patch: {
      summary: "Alternar estado favorito de un elemento de equipamiento",
      security: [{ bearerAuth: [] }],
      tags: ["Usuarios"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID del usuario"
        },
        {
          name: "equipmentItemId",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID del elemento de equipamiento"
        }
      ],
      responses: {
        "200": {
          description: "Estado favorito actualizado exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                  favorite: { type: "boolean" },
                  equipmentItem: {
                    $ref: "#/components/schemas/EquipmentItem"
                  }
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
        "403": {
          description: "No autorizado para modificar este elemento",
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
          description: "Usuario o elemento de equipamiento no encontrado",
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