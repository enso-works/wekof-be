export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Wekof API',
    version: '1.0.0',
    description: 'API documentation for Wekof Backend',
  },
  servers: [
    {
      url: 'http://localhost:8080',
      description: 'Development server',
    },
  ],
  paths: {
    '/': {
      get: {
        tags: ['Health'],
        summary: 'Health check endpoint',
        responses: {
          '200': {
            description: 'Server is running',
            content: {
              'text/plain': {
                schema: {
                  type: 'string',
                  example: 'Server is running.',
                },
              },
            },
          },
        },
      },
    },
    '/api/example': {
      get: {
        tags: ['Example'],
        summary: 'Get all examples',
        responses: {
          '200': {
            description: 'List of examples',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'integer',
                        example: 1,
                      },
                      name: {
                        type: 'string',
                        example: 'John Doe',
                      },
                      email: {
                        type: 'string',
                        example: 'john@example.com',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Example'],
        summary: 'Create a new example',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email'],
                properties: {
                  name: {
                    type: 'string',
                    example: 'John Doe',
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'john@example.com',
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Example created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'integer',
                      example: 1,
                    },
                    name: {
                      type: 'string',
                      example: 'John Doe',
                    },
                    email: {
                      type: 'string',
                      example: 'john@example.com',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    errors: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          msg: {
                            type: 'string',
                          },
                          param: {
                            type: 'string',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
}; 