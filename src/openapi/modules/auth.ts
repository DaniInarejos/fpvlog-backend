export const authOpenApiDef = {
  "/auth/register": {
    post: {
      summary: "Registrar un nuevo usuario",
      tags: ["Autenticación"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["username", "email", "password"],
              properties: {
                username: {
                  type: "string",
                  minLength: 3,
                  description: "Nombre de usuario, mínimo 3 caracteres"
                },
                email: {
                  type: "string",
                  format: "email",
                  description: "Correo electrónico válido"
                },
                password: {
                  type: "string",
                  minLength: 6,
                  description: "Contraseña, mínimo 6 caracteres"
                }
              }
            }
          }
        }
      },
      responses: {
        "201": {
          description: "Usuario registrado exitosamente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AuthResponse"
              }
            }
          }
        },
        "400": {
          description: "Datos inválidos o usuario ya existe",
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
  "/auth/login": {
    post: {
      summary: "Iniciar sesión",
      tags: ["Autenticación"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: {
                  type: "string",
                  format: "email",
                  description: "Correo electrónico válido"
                },
                password: {
                  type: "string",
                  minLength: 6,
                  description: "Contraseña, mínimo 6 caracteres"
                }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Inicio de sesión exitoso",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AuthResponse"
              }
            }
          }
        },
        "401": {
          description: "Credenciales inválidas",
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