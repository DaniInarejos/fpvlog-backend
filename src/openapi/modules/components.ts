export const componentsOpenApiDef = {
  "/components": {
    get: {
      tags: ["Components"],
      summary: "Get all components",
      security: [{ bearerAuth: [] }],
      responses: {
        "200": {
          description: "List of components",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Component"
                }
              }
            }
          }
        }
      }
    },
    post: {
      tags: ["Components"],
      summary: "Create a new component",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Component"
            }
          }
        }
      },
      responses: {
        "201": {
          description: "Component created successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Component"
              }
            }
          }
        }
      }
    }
  },
  "/components/{id}": {
    get: {
      tags: ["Components"],
      summary: "Get a component by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string"
          }
        }
      ],
      responses: {
        "200": {
          description: "Component found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Component"
              }
            }
          }
        }
      }
    },
    put: {
      tags: ["Components"],
      summary: "Update a component",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string"
          }
        }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Component"
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Component updated successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Component"
              }
            }
          }
        }
      }
    },
    delete: {
      tags: ["Components"],
      summary: "Delete a component",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string"
          }
        }
      ],
      responses: {
        "200": {
          description: "Component deleted successfully"
        }
      }
    }
  }
}