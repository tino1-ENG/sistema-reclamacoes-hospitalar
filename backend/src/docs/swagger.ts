export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'HospitalCare API — Moçambique',
    version: '1.0.0',
    description:
      'API REST para Gestão de Reclamações, Esclarecimentos e Processos Hospitalares (Piloto Hospital Central de Maputo)'
  },
  servers: [
    {
      url: 'http://localhost:5000/api',
      description: 'Servidor Local de Desenvolvimento'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  paths: {
    '/auth/login': {
      post: {
        summary: 'Autenticação de utentes e colaboradores',
        tags: ['Autenticação'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  identifier: { type: 'string', example: '+258 84 912 3456' },
                  password: { type: 'string', example: '123456' },
                  roleHint: { type: 'string', enum: ['PATIENT', 'STAFF', 'SUPERVISOR', 'ADMIN'] }
                },
                required: ['identifier', 'password']
              }
            }
          }
        },
        responses: {
          200: { description: 'Sessão iniciada com sucesso' },
          401: { description: 'Credenciais inválidas' }
        }
      }
    },
    '/auth/register': {
      post: {
        summary: 'Registo de conta de paciente',
        tags: ['Autenticação'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  fullName: { type: 'string', example: 'Maria Tembe' },
                  phone: { type: 'string', example: '+258 84 912 3456' },
                  email: { type: 'string', example: 'maria.tembe@exemplo.co.mz' },
                  password: { type: 'string', example: '123456' }
                },
                required: ['fullName', 'phone', 'password']
              }
            }
          }
        },
        responses: {
          201: { description: 'Paciente registado com sucesso' }
        }
      }
    },
    '/processes/lookup': {
      post: {
        summary: 'Consulta pública de processo por código e PIN',
        tags: ['Processos'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  referenceNumber: { type: 'string', example: '#HC-2026-000101' },
                  pin: { type: 'string', example: '4521' }
                },
                required: ['referenceNumber', 'pin']
              }
            }
          }
        },
        responses: {
          200: { description: 'Dados públicos do processo' }
        }
      }
    },
    '/processes': {
      get: {
        summary: 'Listagem de processos com filtros e RBAC',
        tags: ['Processos'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Lista de processos' }
        }
      },
      post: {
        summary: 'Submissão de novo processo',
        tags: ['Processos'],
        responses: {
          201: { description: 'Processo criado' }
        }
      }
    },
    '/departments': {
      get: {
        summary: 'Listagem de departamentos hospitalares',
        tags: ['Institucional'],
        responses: {
          200: { description: 'Departamentos ativos' }
        }
      }
    },
    '/dashboard/metrics': {
      get: {
        summary: 'Métricas e indicadores hospitalares',
        tags: ['Dashboard'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Métricas de atendimento e SLA' }
        }
      }
    }
  }
};
