import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wekof API',
      version: '1.0.0',
      description: 'API documentation for Quiz System',
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Answer: {
          type: 'object',
          properties: {
            answerText: {
              type: 'string',
              description: 'The text of the answer'
            },
            isCorrect: {
              type: 'boolean',
              description: 'Whether this answer is correct'
            }
          }
        },
        Step: {
          type: 'object',
          properties: {
            questionText: {
              type: 'string',
              description: 'The question text'
            },
            stepOrder: {
              type: 'integer',
              minimum: 1,
              description: 'The order of this step in the quiz'
            },
            answers: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Answer'
              },
              minItems: 2,
              description: 'List of possible answers'
            }
          }
        },
        Quiz: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'The quiz ID'
            },
            title: {
              type: 'string',
              maxLength: 255,
              description: 'The quiz title'
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Optional quiz description'
            },
            steps: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Step'
              },
              description: 'List of quiz steps'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the quiz was created'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  code: {
                    type: 'string',
                    description: 'Error code'
                  },
                  message: {
                    type: 'string',
                    description: 'Detailed error message'
                  },
                  path: {
                    type: 'array',
                    items: {
                      type: 'string'
                    },
                    description: 'Path to the error in the request body'
                  }
                }
              },
              description: 'Validation errors if any'
            }
          }
        }
      }
    },
    paths: {
      '/api/quizzes': {
        get: {
          tags: ['Quizzes'],
          summary: 'Get all quizzes',
          description: 'Retrieve a list of all available quizzes with their steps and answers',
          responses: {
            '200': {
              description: 'List of quizzes',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Quiz'
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Quizzes'],
          summary: 'Create a new quiz',
          description: 'Create a new quiz with steps and answers',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'steps'],
                  properties: {
                    title: {
                      type: 'string',
                      maxLength: 255
                    },
                    description: {
                      type: 'string'
                    },
                    steps: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Step'
                      },
                      minItems: 1
                    }
                  }
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Quiz created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Quiz'
                  }
                }
              }
            },
            '400': {
              description: 'Validation error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      },
      '/api/quizzes/{id}': {
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid'
            },
            description: 'Quiz ID'
          }
        ],
        get: {
          tags: ['Quizzes'],
          summary: 'Get a quiz by ID',
          description: 'Retrieve a specific quiz with all its steps and answers',
          responses: {
            '200': {
              description: 'Quiz found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Quiz'
                  }
                }
              }
            },
            '404': {
              description: 'Quiz not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        },
        put: {
          tags: ['Quizzes'],
          summary: 'Update a quiz',
          description: 'Update a quiz\'s title or description',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: {
                      type: 'string',
                      maxLength: 255
                    },
                    description: {
                      type: 'string'
                    }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Quiz updated successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Quiz'
                  }
                }
              }
            },
            '400': {
              description: 'Validation error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            '404': {
              description: 'Quiz not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        },
        delete: {
          tags: ['Quizzes'],
          summary: 'Delete a quiz',
          description: 'Delete a quiz and all its associated steps and answers',
          responses: {
            '204': {
              description: 'Quiz deleted successfully'
            },
            '404': {
              description: 'Quiz not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  // Look for JSDoc comments in these files
  apis: [
    './src/controllers/*.ts',
    './src/schemas/*.ts',
  ],
};

export const swaggerDocument = swaggerJsdoc(options); 