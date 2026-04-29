const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Free Shop API',
    version: '1.0.0',
    description: 'Multi-vendor Organic Grocery eCommerce Platform API',
    contact: {
      name: 'Free Shop Support',
      email: 'support@freeshop.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000/api/v1',
      description: 'Development server',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Authentication & token management' },
    { name: 'RBAC', description: 'Role-based access control (admin only)' },
    { name: 'Users', description: 'User profile & account management' },
    { name: 'Products', description: 'Product catalog endpoints' },
    { name: 'Categories', description: 'Product category management' },
    { name: 'Orders', description: 'Order lifecycle management' },
    { name: 'Cart', description: 'Shopping cart management' },
    { name: 'Payments', description: 'Payment processing & webhooks' },
    { name: 'Vendors', description: 'Vendor / vendor management' },
    { name: 'Inventory', description: 'Stock & inventory management' },
    { name: 'Notifications', description: 'Notification management (admin)' },
    { name: 'Analytics', description: 'Analytics & reporting (admin/manager)' },
    { name: 'Health', description: 'Service health checks' },
    { name: 'Settings', description: 'Platform settings (delivery charges etc.)' },
  ],
  paths: {
    // ─── AUTH ────────────────────────────────────────────────────────────────
    '/auth/firebase': {
      post: {
        tags: ['Auth'],
        summary: 'Sign in or sign up via Firebase',
        description: `Exchange a Firebase ID token for the application's own Access + Refresh JWT pair.

The client signs in using the Firebase client SDK — the backend never handles passwords or OAuth flows directly.

**Supported sign-in methods**

| Method | Firebase API | Name needed? |
|---|---|---|
| Email + Password | \`signInWithEmailAndPassword\` | ✅ send \`firstName\` + \`lastName\` |
| Phone + OTP (SMS) | \`signInWithPhoneNumber\` | ✅ send \`firstName\` + \`lastName\` |
| Google | \`GoogleAuthProvider\` | ❌ taken from Google profile |
| Facebook | \`FacebookAuthProvider\` | ❌ taken from Facebook profile |
| Apple | \`OAuthProvider('apple.com')\` | ❌ taken from Apple profile |
| Magic Link | \`sendSignInLinkToEmail\` | ✅ send \`firstName\` + \`lastName\` |
| Anonymous | \`signInAnonymously\` | ❌ optional |

**User lifecycle**
- First-time users are created automatically in the database.
- Returning users are matched by their Firebase UID.
- Accounts with the same email from different providers are linked automatically.

**Name resolution**
- Firebase display name always wins (Google / Facebook / Apple).
- \`firstName\` / \`lastName\` in the request body are used as fallback for providers that supply no display name.
- Falls back to generic defaults (\`"User"\`) if neither is available.

**Password management**
Password reset and password change are handled entirely by Firebase on the client (\`sendPasswordResetEmail\`, \`updatePassword\`). No backend endpoint is needed.`,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/FirebaseLoginRequest' },
              examples: {
                social: {
                  summary: 'Google / Facebook / Apple (name from Firebase)',
                  value: { idToken: '<firebase-id-token>' },
                },
                emailPassword: {
                  summary: 'Email + Password (send name)',
                  value: { idToken: '<firebase-id-token>', firstName: 'John', lastName: 'Doe' },
                },
                phone: {
                  summary: 'Phone / OTP (send name)',
                  value: { idToken: '<firebase-id-token>', firstName: 'John', lastName: 'Doe' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login successful — returns user profile + JWT pair',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/auth/verify': {
      get: {
        tags: ['Auth'],
        summary: 'Verify current access token',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Token is valid — returns decoded payload',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        userId: { type: 'string', format: 'uuid' },
                        email: { type: 'string' },
                        role: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current authenticated user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Current user profile',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UserResponse' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Log out (invalidate current refresh token)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Logged out successfully' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/auth/logout-all': {
      post: {
        tags: ['Auth'],
        summary: 'Log out from all devices (invalidate all refresh tokens)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Logged out from all devices' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh access token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['refreshToken'],
                properties: { refreshToken: { type: 'string' } },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'New access token issued',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        accessToken: { type: 'string' },
                        expiresIn: { type: 'integer' },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/auth/guest': {
      post: {
        tags: ['Auth'],
        summary: 'Get a guest session token',
        responses: {
          200: {
            description: 'Guest token generated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        guestId: { type: 'string', format: 'uuid' },
                        accessToken: { type: 'string' },
                        expiresIn: { type: 'integer' },
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
    '/auth/admin/login': {
      post: {
        tags: ['Auth'],
        summary: 'Admin / Manager login (email + password)',
        description: `Authenticate an **ADMIN** or **MANAGER** account using email and password.

This endpoint is intentionally separate from \`/auth/firebase\` so that:
- Privileged accounts can **never** be accessed via the Firebase / social-login flow.
- The API gateway can restrict this path to internal / admin-panel traffic only.
- Tighter rate-limiting and brute-force protection can be applied independently.

**Brute-force protection** — after 5 consecutive failed attempts the account is locked for 15 minutes.

Only accounts with role \`ADMIN\` or \`MANAGER\` and a stored password hash are accepted; all other attempts return \`401 Invalid credentials\` (no role enumeration).`,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AdminLoginRequest' },
              examples: {
                admin: {
                  summary: 'Admin login',
                  value: { email: 'admin@example.com', password: 'your_password_here' },
                },
                manager: {
                  summary: 'Manager login',
                  value: { email: 'manager@example.com', password: 'your_password_here' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login successful — returns user profile + JWT pair',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: {
            description: 'Forbidden — account role is not ADMIN or MANAGER',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: { success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } },
              },
            },
          },
          429: {
            description: 'Too Many Requests — account locked after 5 failed attempts',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: { success: false, error: { code: 'UNAUTHORIZED', message: 'Account is temporarily locked. Please try again later.' } },
              },
            },
          },
        },
      },
    },

    '/auth/admin/create': {
      post: {
        tags: ['Auth'],
        summary: 'Create an ADMIN or MANAGER account',
        description: `Create a new **ADMIN** or **MANAGER** account.

        The request must include the \`ADMIN_SECRET_KEY\` value in the \`secretKey\` field. The value must match the \`ADMIN_SECRET_KEY\` environment variable configured on the auth-service. The \`role\` field defaults to \`ADMIN\` if omitted. Only \`ADMIN\` and \`MANAGER\` are accepted values.`,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AdminCreateRequest' },
              examples: {
                createAdmin: {
                  summary: 'Create an admin account',
                  value: {
                    secretKey: 'your-admin-secret-key',
                    email: 'admin@example.com',
                    password: 'your_password_here',
                    firstName: 'Super',
                    lastName: 'Admin',
                    role: 'ADMIN',
                  },
                },
                createManager: {
                  summary: 'Create a manager account',
                  value: {
                    secretKey: 'your-admin-secret-key',
                    email: 'manager@example.com',
                    password: 'your_password_here',
                    firstName: 'Store',
                    lastName: 'Manager',
                    role: 'MANAGER',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Account created — returns user profile + JWT pair',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          403: {
            description: 'Forbidden — wrong secret key, email already registered, or creation disabled',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: { success: false, error: { code: 'FORBIDDEN', message: 'Invalid ADMIN_SECRET_KEY' } },
              },
            },
          },
        },
      },
    },

    '/auth/dev/change-password': {
      post: {
        tags: ['Auth - Development'],
        summary: 'Change any user\'s password (DEV ONLY)',
        description: `**Development/Emergency endpoint** — Allows a developer to reset any user's password by providing the \`ADMIN_SECRET_KEY\`.

        This endpoint:
        - Requires the correct \`ADMIN_SECRET_KEY\`
        - Changes the specified user's password
        - Invalidates all active refresh tokens for that user (forces re-login on all devices)
        - Is intended for emergency scenarios only

        **⚠️ WARNING:** This endpoint is powerful and should be protected/restricted at the API Gateway level to internal/admin traffic only.`,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ChangePasswordRequest' },
              example: {
                secretKey: 'your-admin-secret-key',
                userId: '550e8400-e29b-41d4-a716-446655440000',
                newPassword: 'your_password_here',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Password changed successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid', description: 'User ID' },
                    email: { type: 'string', format: 'email', description: 'User email' },
                    message: { type: 'string', description: 'Confirmation message' },
                  },
                },
                example: {
                  success: true,
                  data: {
                    id: '550e8400-e29b-41d4-a716-446655440000',
                    email: 'user@example.com',
                    message: 'Password changed successfully. User must log in again on all devices.',
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          403: {
            description: 'Forbidden — wrong secret key',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: { success: false, error: { code: 'FORBIDDEN', message: 'Invalid ADMIN_SECRET_KEY' } },
              },
            },
          },
          404: {
            description: 'Not Found — user does not exist',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: { success: false, error: { code: 'NOT_FOUND', message: 'User not found' } },
              },
            },
          },
        },
      },
    },

    '/auth/users': {
      get: {
        tags: ['Auth'],
        summary: 'List all users (admin / manager only)',
        description: 'Returns paginated users from the auth service. Each user object contains an `id` field — this is the **canonical user ID** to use across all other services (user-service, order-service, etc.). Supports filtering by role, status, and full-text search.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: '#/components/parameters/page' },
          { $ref: '#/components/parameters/limit' },
          { name: 'role', in: 'query', schema: { type: 'string', enum: ['CUSTOMER', 'Vendor', 'MANAGER', 'ADMIN'] }, description: 'Filter by role' },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'] }, description: 'Filter by account status' },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search by firstName, lastName, email, or phone' },
        ],
        responses: {
          200: {
            description: 'Paginated list of users',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedUsers' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },

    '/auth/users/{userId}': {
      patch: {
        tags: ['Auth'],
        summary: 'Update user profile (requires USER_MANAGEMENT_UPDATE permission)',
        description: 'Update user profile fields including firstName, lastName, phone, avatar, and status. Only users with USER_MANAGEMENT_UPDATE permission can update other users. This is a granular permission specifically for user management.',

        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'userId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' }, description: 'User ID to update' },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  firstName: { type: 'string', description: 'First name (optional)', example: 'John' },
                  lastName: { type: 'string', description: 'Last name (optional)', example: 'Doe' },
                  phone: { type: 'string', description: 'Phone number (optional)', example: '+1234567890' },
                  avatar: { type: 'string', format: 'uri', description: 'Avatar URL (optional)', example: 'https://example.com/avatar.jpg' },
                  status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'], description: 'Account status (optional)' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'User updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        phone: { type: 'string', nullable: true },
                        avatar: { type: 'string', nullable: true },
                        status: { type: 'string' },
                        updatedAt: { type: 'string', format: 'date-time' },
                      },
                    },
                    message: { type: 'string', example: 'User updated successfully' },
                    requestId: { type: 'string' },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { description: 'Forbidden - requires USER_MANAGEMENT_UPDATE permission' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Auth'],
        summary: 'Delete user account (requires USER_MANAGEMENT_DELETE permission)',
        description: 'Permanently delete a user account and all associated data (hard delete with cascading deletes to refresh tokens, sessions, roles, etc.). This action cannot be undone. Only users with USER_MANAGEMENT_DELETE permission can delete users. This is a granular permission specifically for user management.',

        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'userId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' }, description: 'User ID to delete' },
        ],
        responses: {
          200: {
            description: 'User account deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'null' },
                    message: { type: 'string', example: 'User account deleted successfully' },
                    requestId: { type: 'string' },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { description: 'Forbidden - requires USER_MANAGEMENT_DELETE permission' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },

    // Password reset, change and email verification are handled by Firebase
    // on the client — no backend endpoints are needed for these operations.

    // ─── RBAC (ROLE-BASED ACCESS CONTROL) ────────────────────────────────────
    '/auth/rbac/init': {
      post: {
        tags: ['RBAC'],
        summary: 'Initialize default roles and permissions',
        description: 'Manually initialize or check the status of the RBAC system. Creates default roles (SUPERADMIN, ADMIN, MANAGER, VENDOR, SELLER, CUSTOMER, DELIVERY_MAN) and their corresponding permissions. Requires: SUPERADMIN role, ROLE_CREATE permission, or valid Admin Secret Key. Or set `RBAC_INIT_OPEN=true` environment variable for dev/testing mode.',
        security: [{ bearerAuth: [] }, { AdminSecret: [] }],
        responses: {
          200: {
            description: 'RBAC initialization status (successful or already initialized)',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'RBAC system initialized successfully' },
                    status: { type: 'string', enum: ['initialized', 'already_initialized'], example: 'initialized' },
                    data: {
                      type: 'object',
                      properties: {
                        rolesCount: { type: 'number', example: 7 },
                        permissionsCount: { type: 'number', example: 50 },
                        durationMs: { type: 'number', example: 125 },
                        timestamp: { type: 'string', format: 'date-time', example: '2026-04-20T12:00:00.000Z' },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden', description: 'Only superadmin can initialize (unless RBAC_INIT_OPEN=true)' },
          500: { $ref: '#/components/responses/InternalServerError' },
        },
      },
    },
    '/auth/rbac/permission-codes': {
      get: {
        tags: ['RBAC'],
        summary: 'Get permission codes reference (public)',
        description: 'Returns a reference of all available permission codes that can be used in the system. Helpful for frontend UI and documentation.',
        responses: {
          200: {
            description: 'Permission codes reference',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        permissionCodes: {
                          type: 'object',
                          additionalProperties: { type: 'number' },
                        },
                      },
                    },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/auth/rbac/roles': {
      get: {
        tags: ['RBAC'],
        summary: 'Get all roles (ROLE_READ permission required)',
        security: [{ bearerAuth: [] }, { AdminSecret: [] }],
        parameters: [
          { $ref: '#/components/parameters/page' },
          { $ref: '#/components/parameters/limit' },
        ],
        responses: {
          200: {
            description: 'List of all roles',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        roles: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              id: { type: 'string', format: 'uuid' },
                              name: { type: 'string', example: 'ADMIN' },
                              description: { type: 'string' },
                              permissions: { type: 'array', items: { type: 'string' } },
                              createdAt: { type: 'string', format: 'date-time' },
                            },
                          },
                        },
                        pagination: {
                          type: 'object',
                          properties: {
                            page: { type: 'integer' },
                            limit: { type: 'integer' },
                            total: { type: 'integer' },
                            pages: { type: 'integer' },
                          },
                        },
                      },
                    },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
      post: {
        tags: ['RBAC'],
        summary: 'Create a new role (ROLE_CREATE permission required)',
        security: [{ bearerAuth: [] }, { AdminSecret: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'permissionIds'],
                properties: {
                  name: { type: 'string', example: 'CONTENT_MANAGER' },
                  description: { type: 'string' },
                  permissionIds: { type: 'array', items: { type: 'string', format: 'uuid' } },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Role created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        permissions: { type: 'array', items: { type: 'string' } },
                        createdAt: { type: 'string', format: 'date-time' },
                      },
                    },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/auth/rbac/roles/{roleId}': {
      get: {
        tags: ['RBAC'],
        summary: 'Get role by ID',
        security: [{ bearerAuth: [] }, { AdminSecret: [] }],
        parameters: [
          { name: 'roleId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: {
            description: 'Role details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        permissions: { type: 'array', items: { type: 'string' } },
                        createdAt: { type: 'string', format: 'date-time' },
                      },
                    },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/auth/rbac/roles/{roleId}/permissions': {
      post: {
        tags: ['RBAC'],
        summary: 'Add permission to role (PERMISSION_CREATE required)',
        security: [{ bearerAuth: [] }, { AdminSecret: [] }],
        parameters: [
          { name: 'roleId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['permissionId'],
                properties: {
                  permissionId: { type: 'string', format: 'uuid' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Permission added to role',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: { type: 'object', properties: { /* role object */ } },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/auth/rbac/roles/{roleId}/permissions/{permissionId}': {
      delete: {
        tags: ['RBAC'],
        summary: 'Remove permission from role (PERMISSION_DELETE required)',
        security: [{ bearerAuth: [] }, { AdminSecret: [] }],
        parameters: [
          { name: 'roleId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'permissionId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: {
            description: 'Permission removed from role',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: { type: 'object', properties: { /* role object */ } },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/auth/rbac/permissions': {
      get: {
        tags: ['RBAC'],
        summary: 'Get all permissions (PERMISSION_READ required)',
        security: [{ bearerAuth: [] }, { AdminSecret: [] }],
        parameters: [
          { $ref: '#/components/parameters/page' },
          { $ref: '#/components/parameters/limit' },
        ],
        responses: {
          200: {
            description: 'List of all permissions',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        permissions: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              id: { type: 'string', format: 'uuid' },
                              code: { type: 'string', example: 'USER_READ' },
                              description: { type: 'string' },
                              createdAt: { type: 'string', format: 'date-time' },
                            },
                          },
                        },
                        pagination: {
                          type: 'object',
                          properties: {
                            page: { type: 'integer' },
                            limit: { type: 'integer' },
                            total: { type: 'integer' },
                            pages: { type: 'integer' },
                          },
                        },
                      },
                    },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/auth/rbac/permissions/{code}': {
      get: {
        tags: ['RBAC'],
        summary: 'Get permission by code',
        security: [{ bearerAuth: [] }, { AdminSecret: [] }],
        parameters: [
          { name: 'code', in: 'path', required: true, schema: { type: 'string', example: 'USER_READ' } },
        ],
        responses: {
          200: {
            description: 'Permission details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', format: 'uuid' },
                        code: { type: 'string' },
                        description: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                      },
                    },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/auth/rbac/users/{userId}/roles': {
      get: {
        tags: ['RBAC'],
        summary: "Get user's roles and permissions",
        security: [{ bearerAuth: [] }, { AdminSecret: [] }],
        parameters: [
          { name: 'userId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: {
            description: "User's roles and permissions",
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        userId: { type: 'string', format: 'uuid' },
                        roles: { type: 'array', items: { type: 'string' } },
                        roleNames: { type: 'array', items: { type: 'string' } },
                        permissionCodes: { type: 'array', items: { type: 'number' } },
                      },
                    },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      post: {
        tags: ['RBAC'],
        summary: 'Assign role to user (ROLE_CREATE required)',
        security: [{ bearerAuth: [] }, { AdminSecret: [] }],
        parameters: [
          { name: 'userId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['roleId'],
                properties: {
                  roleId: { type: 'string', format: 'uuid' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Role assigned to user',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        roles: { type: 'array', items: { type: 'string' } },
                        roleNames: { type: 'array', items: { type: 'string' } },
                        permissionCodes: { type: 'array', items: { type: 'number' } },
                      },
                    },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/auth/rbac/users/{userId}/roles/{roleId}': {
      delete: {
        tags: ['RBAC'],
        summary: 'Remove role from user (ROLE_DELETE required)',
        security: [{ bearerAuth: [] }, { AdminSecret: [] }],
        parameters: [
          { name: 'userId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'roleId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: {
            description: 'Role removed from user',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        roles: { type: 'array', items: { type: 'string' } },
                        roleNames: { type: 'array', items: { type: 'string' } },
                        permissionCodes: { type: 'array', items: { type: 'number' } },
                      },
                    },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/auth/rbac/users/{userId}/permissions/{code}/check': {
      get: {
        tags: ['RBAC'],
        summary: 'Check if user has permission',
        security: [{ bearerAuth: [] }, { AdminSecret: [] }],
        parameters: [
          { name: 'userId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'code', in: 'path', required: true, schema: { type: 'string', example: 'USER_READ' } },
        ],
        responses: {
          200: {
            description: 'Permission check result',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        userId: { type: 'string', format: 'uuid' },
                        permissionCode: { type: 'number' },
                        hasPermission: { type: 'boolean' },
                      },
                    },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/auth/rbac/users/{userId}/roles/{roleName}/check': {
      get: {
        tags: ['RBAC'],
        summary: 'Check if user has role',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'userId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'roleName', in: 'path', required: true, schema: { type: 'string', example: 'ADMIN' } },
        ],
        responses: {
          200: {
            description: 'Role check result',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        userId: { type: 'string', format: 'uuid' },
                        roleName: { type: 'string' },
                        hasRole: { type: 'boolean' },
                      },
                    },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/auth/rbac/audit-logs': {
      get: {
        tags: ['RBAC'],
        summary: 'Get permission audit logs (REPORT_READ required)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: '#/components/parameters/page' },
          { $ref: '#/components/parameters/limit' },
          { name: 'userId', in: 'query', schema: { type: 'string', format: 'uuid' }, description: 'Filter by user ID' },
          { name: 'action', in: 'query', schema: { type: 'string' }, description: 'Filter by action type' },
          { name: 'roleId', in: 'query', schema: { type: 'string', format: 'uuid' }, description: 'Filter by role ID' },
          { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
          { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
        ],
        responses: {
          200: {
            description: 'Audit logs for RBAC operations',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        logs: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              id: { type: 'string', format: 'uuid' },
                              userId: { type: 'string', format: 'uuid' },
                              action: { type: 'string' },
                              roleId: { type: 'string', format: 'uuid' },
                              permissionId: { type: 'string', format: 'uuid' },
                              timestamp: { type: 'string', format: 'date-time' },
                              details: { type: 'string' },
                            },
                          },
                        },
                        pagination: {
                          type: 'object',
                          properties: {
                            page: { type: 'integer' },
                            limit: { type: 'integer' },
                            total: { type: 'integer' },
                            pages: { type: 'integer' },
                          },
                        },
                      },
                    },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },

    // ─── USERS ───────────────────────────────────────────────────────────────
    '/users/{userId}': {
      get: {
        tags: ['Users'],
        summary: 'Get user profile by ID',
        description: 'Retrieve a user profile by their ID. Requires authentication.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'User ID (UUID)',
          },
        ],
        responses: {
          200: {
            description: 'User profile retrieved successfully',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UserResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },

    '/users/{userId}/public-profile': {
      get: {
        tags: ['Users'],
        summary: 'Get user public profile by ID',
        description: 'Retrieve a user\'s public profile information (name, avatar only). No authentication required.',
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'User ID (UUID)',
          },
        ],
        responses: {
          200: {
            description: 'Public profile retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    firstName: { type: 'string', nullable: true },
                    lastName: { type: 'string', nullable: true },
                    email: { type: 'string', format: 'email', nullable: true },
                    avatar: { type: 'string', nullable: true },
                  },
                },
              },
            },
          },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },

    '/users/profile': {
      get: {
        tags: ['Users'],
        summary: 'Get current user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'User profile',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UserResponse' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
      patch: {
        tags: ['Users'],
        summary: 'Update current user profile',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateUserRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Profile updated',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UserResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/users/addresses': {
      get: {
        tags: ['Users'],
        summary: 'List saved addresses for current user',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Address list',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Address' } },
                  },
                },
                example: {
                  success: true,
                  data: [
                    {
                      fullName: 'string',
                      phone: 'string',
                      addressLine: 'string',
                      district: 'string',
                      upazila: 'string',
                      zoneId: 'string',
                      postalCode: 'string',
                      country: 'BD',
                    },
                  ],
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Users'],
        summary: 'Add a new address',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/Address' } },
          },
        },
        responses: {
          201: { description: 'Address added' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/users/addresses/{addressId}': {
      get: {
        tags: ['Users'],
        summary: 'Get a single saved address by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'addressId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: {
            description: 'Address details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Address' },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      patch: {
        tags: ['Users'],
        summary: 'Update a saved address',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'addressId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/Address' } },
          },
        },
        responses: {
          200: { description: 'Address updated' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Users'],
        summary: 'Delete a saved address',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'addressId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Address deleted' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/users/addresses/{addressId}/default': {
      post: {
        tags: ['Users'],
        summary: 'Set an address as the default',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'addressId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Default address updated' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/users/wishlist': {
      get: {
        tags: ['Users'],
        summary: 'Get wishlist',
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: '#/components/parameters/page' },
          { $ref: '#/components/parameters/limit' },
        ],
        responses: {
          200: {
            description: 'Wishlist items',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedProducts' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Users'],
        summary: 'Add product to wishlist',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['productId'],
                properties: { productId: { type: 'string', format: 'uuid' } },
              },
            },
          },
        },
        responses: {
          200: { description: 'Product added to wishlist' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
      delete: {
        tags: ['Users'],
        summary: 'Clear all wishlist items',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Wishlist cleared' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/users/wishlist/{productId}': {
      delete: {
        tags: ['Users'],
        summary: 'Remove a product from wishlist',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'productId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Product removed from wishlist' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/users/wishlist/check/{productId}': {
      get: {
        tags: ['Users'],
        summary: 'Check if a product is in the wishlist',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'productId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: {
            description: 'Wishlist membership check result',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'object', properties: { inWishlist: { type: 'boolean' } } },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/users/wishlist/recently-viewed': {
      get: {
        tags: ['Users'],
        summary: 'Get recently viewed products',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: {
          200: {
            description: 'Recently viewed products',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedProducts' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Users'],
        summary: 'Record a recently viewed product',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['productId'],
                properties: { productId: { type: 'string', format: 'uuid' } },
              },
            },
          },
        },
        responses: {
          200: { description: 'Recorded' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
      delete: {
        tags: ['Users'],
        summary: 'Clear recently viewed history',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'History cleared' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },

    // ─── SELLERS ──────────────────────────────────────────────────────────────
    '/users/sellers': {
      get: {
        tags: ['Users'],
        summary: 'List all sellers (public)',
        parameters: [
          { $ref: '#/components/parameters/page' },
          { $ref: '#/components/parameters/limit' },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['PENDING', 'ACTIVE', 'SUSPENDED', 'BANNED'] }, description: 'Filter by seller status' },
          { name: 'verified', in: 'query', schema: { type: 'boolean' }, description: 'Filter by verification status' },
        ],
        responses: {
          200: {
            description: 'Paginated list of sellers',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          userId: { type: 'string', format: 'uuid' },
                          shopName: { type: 'string' },
                          shopSlug: { type: 'string' },
                          shopDescription: { type: 'string' },
                          status: { type: 'string', enum: ['PENDING', 'ACTIVE', 'SUSPENDED', 'BANNED'] },
                          verified: { type: 'boolean' },
                          rating: { type: 'number' },
                          totalOrders: { type: 'integer' },
                        },
                      },
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        page: { type: 'integer' },
                        limit: { type: 'integer' },
                        total: { type: 'integer' },
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
        tags: ['Users'],
        summary: 'Create seller profile (authenticated)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['shopName', 'shopSlug'],
                properties: {
                  shopName: { type: 'string', example: 'Organic Farm Direct' },
                  shopSlug: { type: 'string', example: 'organic-farm-direct' },
                  shopDescription: { type: 'string' },
                  phone: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  address: { type: 'string' },
                  city: { type: 'string' },
                  postalCode: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Seller profile created' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          409: { $ref: '#/components/responses/Conflict' },
        },
      },
    },
    '/users/sellers/me': {
      get: {
        tags: ['Users'],
        summary: "Get current user's seller profile",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Current seller profile',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        userId: { type: 'string', format: 'uuid' },
                        shopName: { type: 'string' },
                        shopSlug: { type: 'string' },
                        shopDescription: { type: 'string' },
                        phone: { type: 'string' },
                        email: { type: 'string' },
                        status: { type: 'string' },
                        verified: { type: 'boolean' },
                        rating: { type: 'number' },
                        totalOrders: { type: 'integer' },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/users/sellers/shop/{shopSlug}': {
      get: {
        tags: ['Users'],
        summary: 'Get seller profile by shop slug (public)',
        parameters: [
          { name: 'shopSlug', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Seller profile' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/users/sellers/{userId}': {
      get: {
        tags: ['Users'],
        summary: 'Get seller profile by user ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'userId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Seller profile' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Users'],
        summary: 'Update seller profile',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'userId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  shopName: { type: 'string' },
                  shopSlug: { type: 'string' },
                  shopDescription: { type: 'string' },
                  phone: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  address: { type: 'string' },
                  city: { type: 'string' },
                  postalCode: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Seller profile updated' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/users/sellers/{userId}/verify': {
      put: {
        tags: ['Users'],
        summary: 'Verify seller (admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'userId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['verified'],
                properties: {
                  verified: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Seller verification status updated' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/users/sellers/{userId}/suspend': {
      put: {
        tags: ['Users'],
        summary: 'Suspend seller (admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'userId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Seller suspended' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/users/sellers/{userId}/activate': {
      put: {
        tags: ['Users'],
        summary: 'Activate seller (admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'userId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Seller activated' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },

    '/settings/delivery': {
      post: {
        tags: ['Settings'],
        summary: 'Create delivery zone',
        description: 'Create a new delivery zone. Only users with admin or manager permissions can create delivery zones.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', description: 'Zone name' },
                  price: { type: 'number', description: 'Delivery price for this zone' },
                },
                required: ['name', 'price'],
              },
              example: { name: 'In Feni', price: 60 },
            },
          },
        },
        responses: {
          201: {
            description: 'Delivery zone created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        zone: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', format: 'uuid' },
                            name: { type: 'string' },
                            price: { type: 'number' },
                          },
                        },
                      },
                    },
                    message: { type: 'string', example: 'Delivery zone created successfully' },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/settings/delivery/{id}': {
      patch: {
        tags: ['Settings'],
        summary: 'Update a single delivery zone',
        description: 'Update name and/or price of a specific delivery zone',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Zone ID' },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', description: 'Zone name (optional)' },
                  price: { type: 'number', description: 'Delivery price (optional)' },
                },
              },
              example: { name: 'In Feni', price: 65 },
            },
          },
        },
        responses: {
          200: {
            description: 'Delivery zone updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        zone: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', format: 'uuid' },
                            name: { type: 'string' },
                            price: { type: 'number' },
                          },
                        },
                      },
                    },
                    message: { type: 'string', example: 'Delivery zone updated' },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Settings'],
        summary: 'Delete a delivery zone',
        description: 'Remove a delivery zone by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Zone ID' },
        ],
        responses: {
          200: {
            description: 'Delivery zone deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'null' },
                    message: { type: 'string', example: 'Delivery zone deleted' },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/settings/delivery/zones': {
      get: {
        tags: ['Settings'],
        summary: 'List available delivery zones (public)',
        description: 'Get all delivery zones without authentication. Useful for displaying zone options to customers.',
        responses: {
          200: {
            description: 'All available delivery zones',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        zones: {
                          type: 'array',
                          description: 'List of all delivery zones',
                          items: {
                            type: 'object',
                            properties: {
                              id: { type: 'string', format: 'uuid' },
                              name: { type: 'string' },
                              price: { type: 'number' },
                            },
                          },
                          example: [
                            { id: 'zone-uuid-1', name: 'In Feni', price: 60 },
                            { id: 'zone-uuid-2', name: 'In Dhaka', price: 50 },
                            { id: 'zone-uuid-3', name: 'Outside Dhaka', price: 120 },
                          ],
                        },
                      },
                    },
                    message: { type: 'string', example: 'Delivery zones retrieved' },
                  },
                },
              },
            },
          },
        },
      },
    },
    // ─── PRODUCTS ────────────────────────────────────────────────────────────
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'List products',
        description: 'Returns all products regardless of status by default. Use the `status` query parameter to filter by a specific status.',
        parameters: [
          { $ref: '#/components/parameters/page' },
          { $ref: '#/components/parameters/limit' },
          { name: 'categoryId', in: 'query', schema: { type: 'string' }, description: 'Filter by category ID' },
          { name: 'vendorId', in: 'query', schema: { type: 'string' }, description: 'Filter by Vendor ID' },
          { name: 'minPrice', in: 'query', schema: { type: 'number' } },
          { name: 'maxPrice', in: 'query', schema: { type: 'number' } },
          { name: 'isOrganic', in: 'query', schema: { type: 'boolean' } },
          { name: 'isFeatured', in: 'query', schema: { type: 'boolean' } },
          { name: 'isFlashSale', in: 'query', schema: { type: 'boolean' } },
          { name: 'status', in: 'query', description: 'Filter by status. If omitted, all statuses are returned.', schema: { type: 'string', enum: ['PENDING_APPROVAL', 'ACTIVE', 'INACTIVE', 'OUT_OF_STOCK', 'REJECTED'] } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'sortBy', in: 'query', schema: { type: 'string', enum: ['price', 'createdAt', 'averageRating', 'totalSold'] } },
          { name: 'sortOrder', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'] } },
        ],
        responses: {
          200: {
            description: 'Paginated product list',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedProducts' } } },
          },
        },
      },
      post: {
        tags: ['Products'],
        summary: 'Create a new product (Vendor / admin)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateProductRequest' } },
          },
        },
        responses: {
          201: {
            description: 'Product created',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/products/featured': {
      get: {
        tags: ['Products'],
        summary: 'Get featured products',
        responses: {
          200: {
            description: 'Featured products',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedProducts' } } },
          },
        },
      },
    },
    '/products/flash-sale': {
      get: {
        tags: ['Products'],
        summary: 'Get active flash-sale products',
        responses: {
          200: {
            description: 'Flash-sale products',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedProducts' } } },
          },
        },
      },
    },
    '/products/slug/{slug}': {
      get: {
        tags: ['Products'],
        summary: 'Get product by slug',
        parameters: [
          { name: 'slug', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'Product details',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductResponse' } } },
          },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/products/vendor/{vendorId}': {
      get: {
        tags: ['Products'],
        summary: "List a Vendor's own products (Vendor / admin / manager)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'vendorId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Omit to default to the authenticated Vendor' },
          { $ref: '#/components/parameters/page' },
          { $ref: '#/components/parameters/limit' },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED', 'INACTIVE'] } },
        ],
        responses: {
          200: {
            description: 'Vendor product list',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedProducts' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Get product by ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: {
            description: 'Product details',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductResponse' } } },
          },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      patch: {
        tags: ['Products'],
        summary: 'Update a product (owner or permission)',
        description: 'A product can be updated by its owner, or by a user with PRODUCT_UPDATE permission. Retail price updates still require PRODUCT_UPDATE_PRICE or an admin/manager role.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/UpdateProductRequest' } },
          },
        },
        responses: {
          200: {
            description: 'Product updated',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Products'],
        summary: 'Delete a product (owner or permission)',
        description: 'A product can be deleted by its owner, or by a user with PRODUCT_DELETE permission.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Product deleted' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/products/{id}/status': {
      patch: {
        tags: ['Products'],
        summary: 'Update product status',
        description: 'Single endpoint for all product status changes. Vendors can set INACTIVE or resubmit (PENDING_APPROVAL). Admins/Managers can set ACTIVE or REJECTED.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'string', enum: ['PENDING_APPROVAL', 'ACTIVE', 'INACTIVE', 'REJECTED'] },
                  reason: { type: 'string', description: 'Required when status is REJECTED' },
                  price: { type: 'number', format: 'double', description: 'Retail price. Required when approving if product has no existing price. Requires PRODUCT_UPDATE_PRICE permission to set.' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Product status updated' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    // ─── REVIEWS ─────────────────────────────────────────────────────────────
    '/free-items': {
      get: {
        tags: ['Products'],
        summary: 'List free items',
        description: 'Returns free items created by the current user, unless the caller has FREE_ITEM_READ permission, in which case all free items are returned.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: '#/components/parameters/page' },
          { $ref: '#/components/parameters/limit' },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search by name, description, or SKU' },
        ],
        responses: {
          200: { description: 'Free items retrieved successfully' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Products'],
        summary: 'Create a free item',
        description: 'Creates a reusable free item catalog entry. Requires FREE_ITEM_CREATE permission.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  sku: { type: 'string' },
                  image: { type: 'string', format: 'uri' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Free item created successfully' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/free-items/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Get a free item by ID',
        description: 'Returns the free item if the caller created it, or if the caller has FREE_ITEM_READ permission.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Free item retrieved successfully' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      patch: {
        tags: ['Products'],
        summary: 'Update a free item',
        description: 'Updates a free item if the caller created it, or if the caller has FREE_ITEM_UPDATE permission.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  sku: { type: 'string' },
                  image: { type: 'string', format: 'uri' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Free item updated successfully' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Products'],
        summary: 'Delete a free item',
        description: 'Deletes a free item if the caller created it, or if the caller has FREE_ITEM_DELETE permission.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Free item deleted successfully' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/reviews': {
      get: {
        tags: ['Products'],
        summary: 'List all reviews',
        parameters: [
          { $ref: '#/components/parameters/page' },
          { $ref: '#/components/parameters/limit' },
          { name: 'productId', in: 'query', schema: { type: 'string', format: 'uuid' }, description: 'Filter by product' },
          { name: 'userId', in: 'query', schema: { type: 'string', format: 'uuid' }, description: 'Filter by user' },
          { name: 'rating', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 5 }, description: 'Filter by star rating' },
          { name: 'verified', in: 'query', schema: { type: 'string', enum: ['true', 'false'] }, description: 'Filter by verified purchase' },
        ],
        responses: {
          200: { description: 'Paginated reviews' },
        },
      },
      post: {
        tags: ['Products'],
        summary: 'Create a review (authenticated)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['productId', 'rating'],
                properties: {
                  productId: { type: 'string', format: 'uuid' },
                  rating: { type: 'integer', minimum: 1, maximum: 5 },
                  title: { type: 'string', maxLength: 100 },
                  comment: { type: 'string', maxLength: 2000 },
                  images: { type: 'array', items: { type: 'string', format: 'uri' } },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Review created' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/reviews/product/{productId}': {
      get: {
        tags: ['Products'],
        summary: 'Get reviews for a product',
        parameters: [
          { name: 'productId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { $ref: '#/components/parameters/page' },
          { $ref: '#/components/parameters/limit' },
        ],
        responses: {
          200: { description: 'Product reviews' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/reviews/product/{productId}/stats': {
      get: {
        tags: ['Products'],
        summary: 'Get rating stats for a product',
        parameters: [
          { name: 'productId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Rating statistics' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/reviews/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Get a review by ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Review details' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      patch: {
        tags: ['Products'],
        summary: 'Update a review (owner only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  rating: { type: 'integer', minimum: 1, maximum: 5 },
                  title: { type: 'string' },
                  comment: { type: 'string' },
                  images: { type: 'array', items: { type: 'string', format: 'uri' } },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Review updated' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Products'],
        summary: 'Delete a review (owner / admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Review deleted' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/reviews/{id}/helpful': {
      post: {
        tags: ['Products'],
        summary: 'Mark a review as helpful (authenticated)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Vote recorded' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/reviews/{id}/report': {
      post: {
        tags: ['Products'],
        summary: 'Report a review (authenticated)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['reason'],
                properties: { reason: { type: 'string' } },
              },
            },
          },
        },
        responses: {
          200: { description: 'Review reported' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },

    // ─── CATEGORIES ──────────────────────────────────────────────────────────
    '/categories': {
      get: {
        tags: ['Categories'],
        summary: 'List all categories',
        parameters: [
          { name: 'parentId', in: 'query', schema: { type: 'string' }, description: 'Filter by parent category (omit for root)' },
          { name: 'isActive', in: 'query', schema: { type: 'boolean' } },
        ],
        responses: {
          200: {
            description: 'Category list',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CategoriesResponse' } } },
          },
        },
      },
      post: {
        tags: ['Categories'],
        summary: 'Create a category (admin / manager)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateCategoryRequest' } },
          },
        },
        responses: {
          201: {
            description: 'Category created',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CategoryResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/categories/tree': {
      get: {
        tags: ['Categories'],
        summary: 'Get full category tree (nested)',
        responses: {
          200: {
            description: 'Nested category tree',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CategoriesResponse' } } },
          },
        },
      },
    },
    '/categories/slug/{slug}': {
      get: {
        tags: ['Categories'],
        summary: 'Get category by slug',
        parameters: [
          { name: 'slug', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'Category details',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CategoryResponse' } } },
          },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/categories/{id}': {
      get: {
        tags: ['Categories'],
        summary: 'Get category by ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: {
            description: 'Category details',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CategoryResponse' } } },
          },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      patch: {
        tags: ['Categories'],
        summary: 'Update a category (admin / manager)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateCategoryRequest' } },
          },
        },
        responses: {
          200: {
            description: 'Category updated',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CategoryResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Categories'],
        summary: 'Delete a category (admin / manager)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Category deleted' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/categories/{id}/status': {
      patch: {
        tags: ['Categories'],
        summary: 'Toggle category active status (admin / manager)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['isActive'],
                properties: { isActive: { type: 'boolean' } },
              },
            },
          },
        },
        responses: {
          200: { description: 'Status updated' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },

    // ─── ORDERS ──────────────────────────────────────────────────────────────
    '/orders': {
      get: {
        tags: ['Orders'],
        summary: 'List all orders (admin / manager)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: '#/components/parameters/page' },
          { $ref: '#/components/parameters/limit' },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['PENDING','CONFIRMED','PROCESSING','SHIPPED','OUT_FOR_DELIVERY','DELIVERED','CANCELLED','RETURNED','REFUNDED'] } },
          { name: 'paymentStatus', in: 'query', schema: { type: 'string', enum: ['PENDING','PAID','FAILED','REFUNDED','PARTIALLY_REFUNDED'] } },
          { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
          { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
        ],
        responses: {
          200: {
            description: 'Paginated orders (admin view)',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedOrders' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
      post: {
        tags: ['Orders'],
        summary: 'Create a new order',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateOrderRequest' } },
          },
        },
        responses: {
          201: {
            description: 'Order created',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/OrderResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/orders/my-orders': {
      get: {
        tags: ['Orders'],
        summary: "List the authenticated user's own orders",
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: '#/components/parameters/page' },
          { $ref: '#/components/parameters/limit' },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['PENDING','CONFIRMED','PROCESSING','SHIPPED','OUT_FOR_DELIVERY','DELIVERED','CANCELLED','REFUNDED','FAILED'] } },
        ],
        responses: {
          200: {
            description: 'User order history',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedOrders' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/orders/coupon/validate': {
      post: {
        tags: ['Orders'],
        summary: 'Validate a coupon code',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['code', 'subtotal'],
                properties: {
                  code: { type: 'string' },
                  subtotal: { type: 'number', minimum: 0 },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Coupon validation result',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        valid: { type: 'boolean' },
                        discountAmount: { type: 'number' },
                        finalAmount: { type: 'number' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
        },
      },
    },
    '/orders/vendor/{vendorId}': {
      get: {
        tags: ['Orders'],
        summary: "List a Vendor's orders (Vendor / admin / manager)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'vendorId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Defaults to authenticated Vendor if omitted' },
          { $ref: '#/components/parameters/page' },
          { $ref: '#/components/parameters/limit' },
        ],
        responses: {
          200: {
            description: 'Vendor order list',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedOrders' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/orders/track/{orderNumber}': {
      get: {
        tags: ['Orders'],
        summary: 'Track an order by order number (public)',
        parameters: [
          { name: 'orderNumber', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'Order tracking details',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/OrderResponse' } } },
          },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/orders/{id}': {
      get: {
        tags: ['Orders'],
        summary: 'Get order by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: {
            description: 'Order details',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/OrderResponse' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Orders'],
        summary: 'Delete an order (requires ORDER_DELETE permission)',
        description: 'Permanently delete an order. Only orders in PENDING, CONFIRMED, CANCELLED, or RETURNED status can be deleted. Requires ORDER_DELETE permission (admin/manager only).',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Order ID' },
        ],
        responses: {
          200: {
            description: 'Order deleted successfully',
            content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/orders/{id}/cancel': {
      post: {
        tags: ['Orders'],
        summary: 'Cancel an order',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['reason'],
                properties: { reason: { type: 'string' } },
              },
            },
          },
        },
        responses: {
          200: { description: 'Order cancelled' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/orders/{id}/status': {
      patch: {
        tags: ['Orders'],
        summary: 'Update order status (admin / manager / Vendor)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'string', enum: ['PENDING','CONFIRMED','PROCESSING','SHIPPED','OUT_FOR_DELIVERY','DELIVERED','CANCELLED','RETURNED','REFUNDED'] },
                  note: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Order status updated',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/OrderResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/orders/{id}/payment': {
      patch: {
        tags: ['Orders'],
        summary: 'Update order payment status (admin / manager)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['paymentStatus'],
                properties: {
                  paymentStatus: { type: 'string', enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED'] },
                  transactionId: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Payment status updated' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/orders/{id}/tracking': {
      patch: {
        tags: ['Orders'],
        summary: 'Add tracking info to an order (admin / manager / Vendor)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['trackingNumber'],
                properties: {
                  trackingNumber: { type: 'string' },
                  carrier: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Tracking info added' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },

    // ─── DELIVERIES ──────────────────────────────────────────────────────────
    '/orders/{orderId}/delivery': {
      post: {
        tags: ['Orders'],
        summary: 'Create delivery for an order (Unified endpoint)',
        description: 'Create delivery with automatic routing - supports both INHOUSE and THIRD_PARTY delivery types',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'orderId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                oneOf: [
                  {
                    type: 'object',
                    description: 'INHOUSE delivery with delivery man assignment',
                    required: ['type', 'deliveryManId'],
                    properties: {
                      type: { type: 'string', enum: ['INHOUSE'], description: 'Delivery type' },
                      deliveryManId: { type: 'string', format: 'uuid', description: 'ID of delivery man to assign' },
                      weight: { type: 'number', minimum: 0, description: 'Package weight in kg' },
                      fragile: { type: 'boolean', description: 'Whether package is fragile' },
                      estimatedDeliveryDate: { type: 'string', format: 'date-time', description: 'Estimated delivery date' },
                    },
                  },
                  {
                    type: 'object',
                    description: 'THIRD_PARTY delivery with provider assignment',
                    required: ['type', 'provider'],
                    properties: {
                      type: { type: 'string', enum: ['THIRD_PARTY'], description: 'Delivery type' },
                      provider: { type: 'string', enum: ['STEADFAST', 'PATHAO', 'REDX', 'SUNDARBAN', 'OTHER'], description: 'Third-party delivery provider' },
                      trackingId: { type: 'string', description: 'Provider tracking ID' },
                      apiRef: { type: 'string', description: 'Provider API reference' },
                      weight: { type: 'number', minimum: 0, description: 'Package weight in kg' },
                      fragile: { type: 'boolean', description: 'Whether package is fragile' },
                      estimatedDeliveryDate: { type: 'string', format: 'date-time', description: 'Estimated delivery date' },
                    },
                  },
                ],
              },
              examples: {
                inhouse: {
                  summary: 'INHOUSE delivery example',
                  value: {
                    type: 'INHOUSE',
                    deliveryManId: '550e8400-e29b-41d4-a716-446655440000',
                    weight: 2.5,
                    fragile: false,
                  },
                },
                thirdParty: {
                  summary: 'THIRD_PARTY delivery example',
                  value: {
                    type: 'THIRD_PARTY',
                    provider: 'STEADFAST',
                    trackingId: 'ST123456',
                    apiRef: 'ref-123',
                    weight: 1.8,
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Delivery created and configured successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', format: 'uuid', description: 'Delivery ID' },
                        orderId: { type: 'string', format: 'uuid' },
                        provider: { type: 'string', enum: ['INHOUSE', 'STEADFAST', 'PATHAO', 'REDX', 'SUNDARBAN', 'OTHER'] },
                        status: { type: 'string', enum: ['PENDING', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED', 'RETURNED'] },
                        deliveryManId: { type: 'string', format: 'uuid', nullable: true },
                        externalProvider: { type: 'string', nullable: true },
                        externalTrackingId: { type: 'string', nullable: true },
                        estimatedDeliveryDate: { type: 'string', format: 'date-time' },
                        createdAt: { type: 'string', format: 'date-time' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      get: {
        tags: ['Orders'],
        summary: 'Get delivery by order',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'orderId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: {
            description: 'Delivery details for the order',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        deliveryId: { type: 'string', format: 'uuid' },
                        orderId: { type: 'string', format: 'uuid' },
                        provider: { type: 'string' },
                        status: { type: 'string' },
                        trackingNumber: { type: 'string' },
                        estimatedDeliveryDate: { type: 'string', format: 'date-time' },
                        actualDeliveryDate: { type: 'string', format: 'date-time' },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },


    '/deliveries/{deliveryId}': {
      get: {
        tags: ['Orders'],
        summary: 'Get delivery details by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'deliveryId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Delivery details' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/deliveries/{deliveryId}/status': {
      put: {
        tags: ['Orders'],
        summary: 'Update delivery status',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'deliveryId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'string', enum: ['PENDING', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED', 'RETURNED'] },
                  notes: { type: 'string', description: 'Optional notes about the status update' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Delivery status updated' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/deliveries/{deliveryId}/failed-attempt': {
      post: {
        tags: ['Orders'],
        summary: 'Record a failed delivery attempt',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'deliveryId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['reason'],
                properties: {
                  reason: { type: 'string', description: 'Reason for delivery failure (e.g., customer not home, invalid address)' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Failed attempt recorded' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/deliveries/delivery-man/{deliveryManId}': {
      get: {
        tags: ['Orders'],
        summary: 'Get deliveries assigned to a delivery man',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'deliveryManId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { $ref: '#/components/parameters/page' },
          { $ref: '#/components/parameters/limit' },
          { name: 'status', in: 'query', schema: { type: 'string' }, description: 'Filter by delivery status' },
        ],
        responses: {
          200: {
            description: 'Paginated list of deliveries for the delivery man',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          deliveryId: { type: 'string', format: 'uuid' },
                          orderId: { type: 'string', format: 'uuid' },
                          status: { type: 'string' },
                          customerName: { type: 'string' },
                          address: { type: 'string' },
                          estimatedDeliveryDate: { type: 'string', format: 'date-time' },
                        },
                      },
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        page: { type: 'integer' },
                        limit: { type: 'integer' },
                        total: { type: 'integer' },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/deliveries/provider/{provider}': {
      get: {
        tags: ['Orders'],
        summary: 'Get deliveries by provider',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'provider', in: 'path', required: true, schema: { type: 'string', enum: ['INHOUSE', 'STEADFAST', 'PATHAO', 'REDX', 'SUNDARBAN', 'OTHER'] } },
          { $ref: '#/components/parameters/page' },
          { $ref: '#/components/parameters/limit' },
          { name: 'status', in: 'query', schema: { type: 'string' }, description: 'Filter by delivery status' },
        ],
        responses: {
          200: {
            description: 'Paginated list of deliveries from the provider',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { type: 'object' } },
                    pagination: {
                      type: 'object',
                      properties: {
                        page: { type: 'integer' },
                        limit: { type: 'integer' },
                        total: { type: 'integer' },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/deliveries/stats': {
      get: {
        tags: ['Orders'],
        summary: 'Get delivery statistics (admin only)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Delivery statistics',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        totalDeliveries: { type: 'integer' },
                        successfulDeliveries: { type: 'integer' },
                        failedDeliveries: { type: 'integer' },
                        averageDeliveryTime: { type: 'number', description: 'In hours' },
                        deliveriesByProvider: { type: 'object', additionalProperties: { type: 'integer' } },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },

    // ─── CART ────────────────────────────────────────────────────────────────
    '/cart': {
      get: {
        tags: ['Cart'],
        summary: 'Get current cart with product name/image and free items',
        parameters: [
          {
            name: 'x-guest-id',
            in: 'header',
            required: false,
            schema: { type: 'string' },
            description: 'Guest cart identifier when user is not authenticated',
          },
        ],
        responses: {
          200: {
            description: 'Cart contents with flattened product fields and associated free items',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CartResponse' } } },
          },
        },
      },
      post: {
        tags: ['Cart'],
        summary: 'Add item to cart and return updated cart with free items',
        parameters: [
          {
            name: 'x-guest-id',
            in: 'header',
            required: false,
            schema: { type: 'string' },
            description: 'Guest cart identifier when user is not authenticated',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
                schema: {
                type: 'object',
                required: ['productId', 'quantity'],
                properties: {
                  productId: { type: 'string', format: 'uuid' },
                  quantity: { type: 'integer', minimum: 1 },
                  freeItemIds: {
                    type: 'array',
                    items: { type: 'string', format: 'uuid' },
                    description: 'Optional array of selected free item IDs. Server currently uses only the first entry (max 1).',
                  },
                },
                description: 'Price is resolved server-side from the product-service; do not supply a price field.',
                examples: {
                  basic: {
                    summary: 'Add item without free item',
                    value: { productId: '550e8400-e29b-41d4-a716-446655440001', quantity: 1 },
                  },
                  withFreeItem: {
                    summary: 'Add item with selected free item',
                    value: { productId: '550e8400-e29b-41d4-a716-446655440001', quantity: 1, freeItemIds: ['550e8400-e29b-41d4-a716-446655440002'] },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Item added / quantity updated, returns cart with free items',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CartResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Cart'],
        summary: 'Clear entire cart',
        parameters: [
          {
            name: 'x-guest-id',
            in: 'header',
            required: false,
            schema: { type: 'string' },
            description: 'Guest cart identifier when user is not authenticated',
          },
        ],
        responses: {
          200: { description: 'Cart cleared' },
        },
      },
    },
    '/cart/summary': {
      get: {
        tags: ['Cart'],
        summary: 'Get cart summary (totals, counts)',
        parameters: [
          {
            name: 'x-guest-id',
            in: 'header',
            required: false,
            schema: { type: 'string' },
            description: 'Guest cart identifier when user is not authenticated',
          },
        ],
        responses: {
          200: {
            description: 'Cart summary',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        itemCount: { type: 'integer' },
                        subtotal: { type: 'number' },
                        shippingFee: { type: 'number' },
                        total: { type: 'number' },
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
    '/cart/merge': {
      post: {
        tags: ['Cart'],
        summary: 'Merge guest cart into authenticated user cart',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['guestId'],
                properties: { guestId: { type: 'string' } },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Cart merged',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CartResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/cart/{productId}': {
      patch: {
        tags: ['Cart'],
        summary: 'Update cart item quantity',
        parameters: [
          {
            name: 'x-guest-id',
            in: 'header',
            required: false,
            schema: { type: 'string' },
            description: 'Guest cart identifier when user is not authenticated',
          },
          { name: 'productId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['quantity'],
                properties: { quantity: { type: 'integer', minimum: 0, description: 'Set to 0 to remove the item' } },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Cart item updated',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CartResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Cart'],
        summary: 'Remove a specific item from cart',
        parameters: [
          {
            name: 'x-guest-id',
            in: 'header',
            required: false,
            schema: { type: 'string' },
            description: 'Guest cart identifier when user is not authenticated',
          },
          { name: 'productId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: {
            description: 'Item removed, returns updated cart and summary',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CartResponse' } } },
          },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },

    // ─── PAYMENTS ────────────────────────────────────────────────────────────
    '/payments': {
      get: {
        tags: ['Payments'],
        summary: 'List all payments (admin / manager)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: '#/components/parameters/page' },
          { $ref: '#/components/parameters/limit' },
          { name: 'userId', in: 'query', schema: { type: 'string', format: 'uuid' }, description: 'Filter by user' },
          { name: 'orderId', in: 'query', schema: { type: 'string', format: 'uuid' }, description: 'Filter by order' },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['PENDING','INITIATED','PROCESSING','COMPLETED','FAILED','REFUNDED','PARTIALLY_REFUNDED','CANCELLED'] } },
          { name: 'method', in: 'query', schema: { type: 'string', enum: ['COD','BKASH','NAGAD','ROCKET','EPS','CARD','BANK_TRANSFER'] } },
          { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
          { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
        ],
        responses: {
          200: {
            description: 'Payments list',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedPayments' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/payments/initiate': {
      post: {
        tags: ['Payments'],
        summary: 'Initiate a payment (bKash / COD / EPS / CARD)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['orderId', 'amount', 'method'],
                properties: {
                  orderId: { type: 'string', format: 'uuid' },
                  method: { type: 'string', enum: ['COD', 'BKASH', 'NAGAD', 'ROCKET', 'EPS', 'CARD', 'BANK_TRANSFER'] },
                  amount: { type: 'number', minimum: 0.01 },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Payment initiated — returns gateway redirect URL for non-COD methods',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        paymentId: { type: 'string', format: 'uuid' },
                        paymentUrl: { type: 'string', format: 'uri', description: 'Redirect URL for online payment methods' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          402: { $ref: '#/components/responses/PaymentRequired' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/payments/bkash/callback': {
      get: {
        tags: ['Payments'],
        summary: 'bKash payment callback (called by bKash gateway)',
        description: 'This endpoint is called by bKash after the user completes/cancels payment. Not for direct use.',
        parameters: [
          { name: 'paymentID', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          302: { description: 'Redirect to frontend with payment result' },
        },
      },
    },
    '/payments/eps/callback': {
      get: {
        tags: ['Payments'],
        summary: 'EPS payment callback (called by EPS gateway)',
        description: 'This endpoint is called by EPS after the user completes/cancels payment. Not for direct use.',
        parameters: [
          { name: 'payment_id', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'transaction_id', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          302: { description: 'Redirect to frontend with payment result' },
        },
      },
    },
    '/payments/order/{orderId}': {
      get: {
        tags: ['Payments'],
        summary: 'Get payment by order ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'orderId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: {
            description: 'Payment for the order',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/PaymentResponse' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/payments/{id}': {
      get: {
        tags: ['Payments'],
        summary: 'Get payment by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: {
            description: 'Payment details',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/PaymentResponse' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/payments/{id}/verify': {
      get: {
        tags: ['Payments'],
        summary: 'Verify / confirm payment status with gateway',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: {
            description: 'Payment verification result',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/PaymentResponse' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/payments/{id}/refund': {
      post: {
        tags: ['Payments'],
        summary: 'Initiate a refund (admin / manager)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['amount', 'reason'],
                properties: {
                  amount: { type: 'number', minimum: 0.01 },
                  reason: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Refund initiated' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          402: { $ref: '#/components/responses/PaymentRequired' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/payments/{id}/confirm-cod': {
      post: {
        tags: ['Payments'],
        summary: 'Confirm Cash-on-Delivery collection (admin / manager / Vendor)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['collectedAmount'],
                properties: {
                  collectedAmount: { type: 'number', minimum: 0 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'COD payment confirmed' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    // ─── VendorS ─────────────────────────────────────────────────────────────
    '/vendors': {
      get: {
        tags: ['Vendors'],
        summary: 'List Vendors',
        parameters: [
          { $ref: '#/components/parameters/page' },
          { $ref: '#/components/parameters/limit' },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['PENDING', 'ACTIVE', 'SUSPENDED', 'BANNED', 'CLOSED'] } },
          { name: 'verificationStatus', in: 'query', schema: { type: 'string', enum: ['UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED'] } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'sortBy', in: 'query', schema: { type: 'string', enum: ['createdAt', 'rating', 'totalOrders', 'storeName'] } },
        ],
        responses: {
          200: {
            description: 'Vendors list',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedVendors' } } },
          },
        },
      },
      post: {
        tags: ['Vendors'],
        summary: 'Register as a Vendor',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/createVendorRequest' } },
          },
        },
        responses: {
          201: {
            description: 'Vendor application submitted',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/VendorResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          409: { $ref: '#/components/responses/Conflict' },
        },
      },
    },
    '/vendors/me': {
      get: {
        tags: ['Vendors'],
        summary: 'Get current Vendor profile',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Vendor profile',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/VendorResponse' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
      patch: {
        tags: ['Vendors'],
        summary: 'Update current Vendor profile',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/updateVendorRequest' } },
          },
        },
        responses: {
          200: {
            description: 'Vendor profile updated',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/VendorResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/vendors/me/stats': {
      get: {
        tags: ['Vendors'],
        summary: 'Get current Vendor stats (orders, revenue, ratings)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Vendor statistics' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/vendors/me/documents': {
      post: {
        tags: ['Vendors'],
        summary: 'Upload a verification document',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['type', 'documentUrl'],
                properties: {
                  type: { type: 'string', enum: ['NID', 'TRADE_LICENSE', 'TIN_CERTIFICATE', 'BANK_STATEMENT', 'UTILITY_BILL', 'OTHER'] },
                  documentUrl: { type: 'string', format: 'uri' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Document uploaded' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/vendors/store/{slug}': {
      get: {
        tags: ['Vendors'],
        summary: 'Get Vendor store page by slug',
        parameters: [
          { name: 'slug', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'Vendor store details',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/VendorResponse' } } },
          },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },

    '/vendors/documents/{documentId}/verify': {
      patch: {
        tags: ['Vendors'],
        summary: 'Verify a Vendor document (admin / manager)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'documentId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['approved'],
                properties: {
                  approved: { type: 'boolean' },
                  reason: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Document verified/rejected' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/vendors/{vendorId}/reviews': {
      get: {
        tags: ['Vendors'],
        summary: 'Get reviews for a Vendor',
        parameters: [
          { name: 'vendorId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'rating', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 5 } },
          { $ref: '#/components/parameters/page' },
          { $ref: '#/components/parameters/limit' },
        ],
        responses: {
          200: { description: 'Vendor reviews' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      post: {
        tags: ['Vendors'],
        summary: 'Write a review for a Vendor',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'vendorId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['orderId', 'rating'],
                properties: {
                  orderId: { type: 'string', format: 'uuid' },
                  rating: { type: 'integer', minimum: 1, maximum: 5 },
                  title: { type: 'string', maxLength: 100 },
                  comment: { type: 'string', maxLength: 1000 },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Review submitted' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          409: { $ref: '#/components/responses/Conflict' },
        },
      },
    },
    '/vendors/reviews/{reviewId}': {
      patch: {
        tags: ['Vendors'],
        summary: 'Update a Vendor review (owner)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'reviewId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  rating: { type: 'integer', minimum: 1, maximum: 5 },
                  title: { type: 'string' },
                  comment: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Review updated' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Vendors'],
        summary: 'Delete a Vendor review (owner / admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'reviewId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Review deleted' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/vendors/reviews/{reviewId}/respond': {
      post: {
        tags: ['Vendors'],
        summary: 'Respond to a review (Vendor owner)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'reviewId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['response'],
                properties: { response: { type: 'string', maxLength: 1000 } },
              },
            },
          },
        },
        responses: {
          200: { description: 'Response added' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/vendors/{id}': {
      get: {
        tags: ['Vendors'],
        summary: 'Get Vendor by ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: {
            description: 'Vendor details',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/VendorResponse' } } },
          },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      patch: {
        tags: ['Vendors'],
        summary: 'Update Vendor by ID (admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/updateVendorRequest' } },
          },
        },
        responses: {
          200: {
            description: 'Vendor updated',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/VendorResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/vendors/{id}/status': {
      patch: {
        tags: ['Vendors'],
        summary: 'Update Vendor status (admin / manager)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'string', enum: ['PENDING', 'ACTIVE', 'SUSPENDED', 'BANNED', 'CLOSED'] },
                  reason: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Vendor status updated' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/vendors/{id}/verify': {
      patch: {
        tags: ['Vendors'],
        summary: 'Approve or reject Vendor verification (admin / manager)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['approved'],
                properties: {
                  approved: { type: 'boolean' },
                  reason: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Vendor verification updated' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },

    // ─── INVENTORY ───────────────────────────────────────────────────────────
    '/inventory/initialize': {
      post: {
        tags: ['Inventory'],
        summary: 'Initialize inventory for a product (admin / Vendor)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['productId', 'vendorId'],
                properties: {
                  productId: { type: 'string', format: 'uuid' },
                  vendorId: { type: 'string', format: 'uuid' },
                  initialStock: { type: 'integer', minimum: 0, default: 0 },
                  lowStockThreshold: { type: 'integer', minimum: 0, default: 10 },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Inventory initialized',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/InventoryResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/inventory/check-availability': {
      post: {
        tags: ['Inventory'],
        summary: 'Check availability of multiple items (for checkout)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['items'],
                properties: {
                  items: {
                    type: 'array',
                    minItems: 1,
                    items: {
                      type: 'object',
                      required: ['productId', 'quantity'],
                      properties: {
                        productId: { type: 'string', format: 'uuid' },
                        quantity: { type: 'integer', minimum: 1 },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Availability result per item',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          productId: { type: 'string' },
                          available: { type: 'boolean' },
                          availableStock: { type: 'integer' },
                          requestedQuantity: { type: 'integer' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
        },
      },
    },
    '/inventory/product/{productId}': {
      get: {
        tags: ['Inventory'],
        summary: 'Get inventory for a product',
        parameters: [
          { name: 'productId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: {
            description: 'Product inventory',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/InventoryResponse' } } },
          },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/inventory/vendor/{vendorId}': {
      get: {
        tags: ['Inventory'],
        summary: "Get a Vendor's full inventory (Vendor / admin / manager)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'vendorId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Defaults to authenticated Vendor if omitted' },
          { $ref: '#/components/parameters/page' },
          { $ref: '#/components/parameters/limit' },
          { name: 'lowStockOnly', in: 'query', schema: { type: 'string', enum: ['true', 'false'] }, description: 'Return only low-stock or out-of-stock items' },
        ],
        responses: {
          200: {
            description: 'Vendor inventory list',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedInventory' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/inventory/{productId}/add': {
      post: {
        tags: ['Inventory'],
        summary: 'Add stock to a product (Vendor / admin / manager)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'productId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['quantity'],
                properties: {
                  quantity: { type: 'integer', minimum: 1 },
                  reason: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Stock added',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/InventoryResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/inventory/{productId}/reduce': {
      post: {
        tags: ['Inventory'],
        summary: 'Reduce stock for a product (Vendor / admin / manager)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'productId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['quantity'],
                properties: {
                  quantity: { type: 'integer', minimum: 1 },
                  reason: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Stock reduced',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/InventoryResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/inventory/{productId}/movements': {
      get: {
        tags: ['Inventory'],
        summary: 'Get stock movement history (Vendor / admin / manager)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'productId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { $ref: '#/components/parameters/page' },
          { $ref: '#/components/parameters/limit' },
        ],
        responses: {
          200: { description: 'Stock movement history' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/inventory/{productId}/threshold': {
      patch: {
        tags: ['Inventory'],
        summary: 'Set low-stock threshold (Vendor / admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'productId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['threshold'],
                properties: { threshold: { type: 'integer', minimum: 0 } },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Threshold updated',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/InventoryResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/inventory/{productId}/return': {
      post: {
        tags: ['Inventory'],
        summary: 'Process a stock return (admin / manager)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'productId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['orderId', 'quantity'],
                properties: {
                  orderId: { type: 'string', format: 'uuid' },
                  quantity: { type: 'integer', minimum: 1 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Return processed' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },

    // ─── NOTIFICATIONS ───────────────────────────────────────────────────────
    '/notifications': {
      get: {
        tags: ['Notifications'],
        summary: 'List notifications (admin / manager)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: '#/components/parameters/page' },
          { $ref: '#/components/parameters/limit' },
          { name: 'userId', in: 'query', schema: { type: 'string', format: 'uuid' } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['PENDING', 'QUEUED', 'SENT', 'DELIVERED', 'FAILED', 'CANCELLED'] } },
          { name: 'type', in: 'query', schema: { type: 'string' } },
          { name: 'channel', in: 'query', schema: { type: 'string', enum: ['EMAIL', 'SMS', 'PUSH', 'IN_APP'] } },
        ],
        responses: {
          200: {
            description: 'Notifications list',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedNotifications' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
      post: {
        tags: ['Notifications'],
        summary: 'Send a notification (admin / manager)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateNotificationRequest' } },
          },
        },
        responses: {
          201: { description: 'Notification queued' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/notifications/bulk': {
      post: {
        tags: ['Notifications'],
        summary: 'Send bulk notifications (admin / manager)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['userIds', 'type', 'channel', 'templateId'],
                properties: {
                  userIds: { type: 'array', items: { type: 'string', format: 'uuid' }, minItems: 1 },
                  type: { type: 'string' },
                  channel: { type: 'string', enum: ['EMAIL', 'SMS', 'PUSH', 'IN_APP'] },
                  templateId: { type: 'string' },
                  templateData: { type: 'object', additionalProperties: true },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Bulk notifications queued' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/notifications/me': {
      get: {
        tags: ['Notifications'],
        summary: 'Get notifications for the current user',
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: '#/components/parameters/page' },
          { $ref: '#/components/parameters/limit' },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['PENDING', 'QUEUED', 'SENT', 'DELIVERED', 'FAILED', 'CANCELLED'] } },
          { name: 'channel', in: 'query', schema: { type: 'string', enum: ['EMAIL', 'SMS', 'PUSH', 'IN_APP'] } },
        ],
        responses: {
          200: {
            description: 'User notifications',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedNotifications' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/notifications/preferences': {
      get: {
        tags: ['Notifications'],
        summary: 'Get notification preferences for the current user',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'User notification preferences' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
      patch: {
        tags: ['Notifications'],
        summary: 'Update notification preferences',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  emailEnabled: { type: 'boolean' },
                  smsEnabled: { type: 'boolean' },
                  pushEnabled: { type: 'boolean' },
                  orderUpdates: { type: 'boolean' },
                  promotions: { type: 'boolean' },
                  VendorUpdates: { type: 'boolean' },
                  accountUpdates: { type: 'boolean' },
                  priceAlerts: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Preferences updated' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/notifications/devices': {
      post: {
        tags: ['Notifications'],
        summary: 'Register a device for push notifications',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['token', 'platform'],
                properties: {
                  token: { type: 'string' },
                  platform: { type: 'string', enum: ['IOS', 'ANDROID', 'WEB'] },
                  deviceInfo: { type: 'object', additionalProperties: true },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Device registered' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/notifications/devices/{token}': {
      delete: {
        tags: ['Notifications'],
        summary: 'Unregister a push notification device',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'token', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Device unregistered' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/notifications/templates': {
      get: {
        tags: ['Notifications'],
        summary: 'List notification templates (admin / manager)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'type', in: 'query', schema: { type: 'string' } },
          { name: 'channel', in: 'query', schema: { type: 'string', enum: ['EMAIL', 'SMS', 'PUSH', 'IN_APP'] } },
          { name: 'isActive', in: 'query', schema: { type: 'boolean' } },
        ],
        responses: {
          200: { description: 'Notification templates' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
      post: {
        tags: ['Notifications'],
        summary: 'Create a notification template (admin)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'type', 'channel', 'body'],
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  type: { type: 'string' },
                  channel: { type: 'string', enum: ['EMAIL', 'SMS', 'PUSH', 'IN_APP'] },
                  subject: { type: 'string' },
                  body: { type: 'string' },
                  variables: { type: 'array', items: { type: 'string' } },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Template created' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/notifications/templates/{id}': {
      get: {
        tags: ['Notifications'],
        summary: 'Get a notification template by ID (admin / manager)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Template details' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      patch: {
        tags: ['Notifications'],
        summary: 'Update a notification template (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  subject: { type: 'string' },
                  body: { type: 'string' },
                  variables: { type: 'array', items: { type: 'string' } },
                  isActive: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Template updated' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/notifications/{id}': {
      get: {
        tags: ['Notifications'],
        summary: 'Get notification by ID (admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: {
            description: 'Notification details',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/NotificationResponse' } } },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/notifications/{id}/cancel': {
      patch: {
        tags: ['Notifications'],
        summary: 'Cancel a pending notification (admin / manager)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Notification cancelled' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },

    // ─── ANALYTICS ───────────────────────────────────────────────────────────
    '/analytics/dashboard': {
      get: {
        tags: ['Analytics'],
        summary: 'Platform dashboard metrics (admin / manager)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
          { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
        ],
        responses: {
          200: { description: 'Dashboard metrics' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/analytics/sales': {
      get: {
        tags: ['Analytics'],
        summary: 'Sales analytics (admin / manager)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
          { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
        ],
        responses: {
          200: { description: 'Sales data' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/analytics/top-products': {
      get: {
        tags: ['Analytics'],
        summary: 'Top performing products (admin / manager)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
          { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100 } },
        ],
        responses: {
          200: { description: 'Top products' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/analytics/top-Vendors': {
      get: {
        tags: ['Analytics'],
        summary: 'Top performing Vendors (admin / manager)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
          { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100 } },
        ],
        responses: {
          200: { description: 'Top Vendors' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/analytics/users': {
      get: {
        tags: ['Analytics'],
        summary: 'User analytics (admin / manager)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
          { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
        ],
        responses: {
          200: { description: 'User analytics' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },
    '/analytics/Vendors/{vendorId}': {
      get: {
        tags: ['Analytics'],
        summary: 'Get analytics report for a specific Vendor',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'vendorId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
          { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
        ],
        responses: {
          200: { description: 'Vendor analytics report' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/analytics/products/{productId}': {
      get: {
        tags: ['Analytics'],
        summary: 'Get analytics for a specific product',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'productId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
          { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date-time' } },
        ],
        responses: {
          200: { description: 'Product analytics' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/analytics/events': {
      post: {
        tags: ['Analytics'],
        summary: 'Track a custom analytics event',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['eventType', 'eventName'],
                properties: {
                  eventType: { type: 'string' },
                  eventName: { type: 'string' },
                  sessionId: { type: 'string' },
                  entityType: { type: 'string' },
                  entityId: { type: 'string' },
                  metadata: { type: 'object', additionalProperties: true },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Event tracked' },
          400: { $ref: '#/components/responses/BadRequest' },
        },
      },
    },
    '/analytics/search': {
      post: {
        tags: ['Analytics'],
        summary: 'Track a search query',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['query', 'resultsCount'],
                properties: {
                  query: { type: 'string' },
                  resultsCount: { type: 'integer', minimum: 0 },
                  clickedProductId: { type: 'string', format: 'uuid' },
                  sessionId: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Search tracked' },
          400: { $ref: '#/components/responses/BadRequest' },
        },
      },
    },
    '/analytics/search/popular': {
      get: {
        tags: ['Analytics'],
        summary: 'Get popular search queries',
        parameters: [
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100 } },
        ],
        responses: {
          200: { description: 'Popular searches list' },
        },
      },
    },

    // ─── HEALTH ──────────────────────────────────────────────────────────────
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'API Gateway health check',
        responses: {
          200: { description: 'Service is healthy' },
        },
      },
    },
  },

  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT access token obtained from /auth/firebase (customers/Vendors) or /auth/admin/login (ADMIN/MANAGER).',
      },
        AdminSecret: {
          type: 'apiKey',
          in: 'header',
          name: 'x-admin-secret',
          description: 'Server-side ADMIN_SECRET_KEY. Provide via header (x-admin-secret or admin-secret), request body (adminSecretKey), or query param (adminSecretKey) to bypass permission checks on RBAC endpoints.',
        },
    },
    schemas: {
      // ── Request schemas ────────────────────────────────────────────────────
      FirebaseLoginRequest: {
        type: 'object',
        required: ['idToken'],
        properties: {
          idToken: {
            type: 'string',
            description: 'Short-lived Firebase ID token obtained from the Firebase client SDK after signing in with any supported provider.',
            example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ii4uLiJ9...',
          },
          firstName: {
            type: 'string',
            maxLength: 100,
            description: 'Required for email+password and phone/OTP sign-ins — Firebase does not supply a display name for these providers. Ignored when the Firebase token already contains a display name (Google, Facebook, Apple).',
            example: 'John',
          },
          lastName: {
            type: 'string',
            maxLength: 100,
            description: 'Required for email+password and phone/OTP sign-ins. Ignored when the Firebase token already contains a display name.',
            example: 'Doe',
          },
        },
      },
      AdminLoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'Email address of the ADMIN or MANAGER account.',
            example: 'admin@example.com',
          },
          password: {
            type: 'string',
            format: 'password',
            description: 'Account password. Must satisfy the platform password policy (min 8 chars, upper, lower, digit, special char).',
            example: 'your_password_here',
          },
        },
      },
      AdminCreateRequest: {
        type: 'object',
        required: ['secretKey', 'email', 'password', 'firstName', 'lastName'],
        properties: {
          secretKey: {
            type: 'string',
            description: 'Server-side ADMIN_SECRET_KEY. Must match the ADMIN_SECRET_KEY environment variable on the auth-service.',
            example: 'super-secret-key',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'Email address for the new admin/manager account. Must be unique.',
            example: 'admin@example.com',
          },
          password: {
            type: 'string',
            format: 'password',
            description: 'Password for the new account (minimum 8 characters).',
            example: 'your_password_here',
          },
          firstName: {
            type: 'string',
            description: 'First name of the account holder.',
            example: 'Super',
          },
          lastName: {
            type: 'string',
            description: 'Last name of the account holder.',
            example: 'Admin',
          },
          role: {
            type: 'string',
            enum: ['ADMIN', 'MANAGER'],
            description: 'Role to assign. Defaults to ADMIN if omitted.',
            example: 'ADMIN',
          },
        },
      },
      ChangePasswordRequest: {
        type: 'object',
        required: ['secretKey', 'userId', 'newPassword'],
        properties: {
          secretKey: {
            type: 'string',
            description: 'Server-side ADMIN_SECRET_KEY. Must match the ADMIN_SECRET_KEY environment variable on the auth-service.',
            example: 'your-admin-secret-key',
          },
          userId: {
            type: 'string',
            format: 'uuid',
            description: 'UUID of the user whose password to change.',
            example: '550e8400-e29b-41d4-a716-446655440000',
          },
          newPassword: {
            type: 'string',
            format: 'password',
            description: 'New password for the user (minimum 8 characters).',
            example: 'your_password_here',
          },
        },
      },
      UpdateUserRequest: {
        type: 'object',
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          phone: { type: 'string' },
          avatar: { type: 'string', format: 'uri' },
        },
      },
      CreateProductRequest: {
        type: 'object',
        required: ['name', 'description', 'categoryId', 'price', 'stock'],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          shortDescription: { type: 'string' },
          sku: { type: 'string' },
          categoryId: { type: 'string', format: 'uuid' },
          price: { type: 'number', minimum: 0 },
          discountPrice: { type: 'number' },
          discountType: { type: 'string', enum: ['PERCENTAGE', 'FIXED'] },
          discountValue: { type: 'number' },
          stock: { type: 'integer', minimum: 0 },
          lowStockThreshold: { type: 'integer', minimum: 0 },
          weight: { type: 'number' },
          unit: { type: 'string', example: 'kg' },
          isOrganic: { type: 'boolean' },
          organicCertification: { type: 'string' },
          images: { type: 'array', items: { type: 'string', format: 'uri' } },
          tags: { type: 'array', items: { type: 'string' } },
          isFeatured: { type: 'boolean' },
          metadata: { type: 'object', additionalProperties: true },
          freeItems: { type: 'array', items: { $ref: '#/components/schemas/FreeItemCreate' } },
          freeItemIds: { type: 'array', items: { type: 'string', format: 'uuid' }, description: 'Attach existing reusable free items to this product' },
        },
      },
      UpdateProductRequest: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          shortDescription: { type: 'string' },
          categoryId: { type: 'string', format: 'uuid' },
          price: { type: 'number', minimum: 0 },
          discountPrice: { type: 'number' },
          discountType: { type: 'string', enum: ['PERCENTAGE', 'FIXED'] },
          discountValue: { type: 'number' },
          stock: { type: 'integer', minimum: 0 },
          lowStockThreshold: { type: 'integer', minimum: 0 },
          weight: { type: 'number' },
          unit: { type: 'string' },
          isOrganic: { type: 'boolean' },
          images: { type: 'array', items: { type: 'string', format: 'uri' } },
          tags: { type: 'array', items: { type: 'string' } },
          isFeatured: { type: 'boolean' },
          freeItems: { type: 'array', items: { $ref: '#/components/schemas/FreeItemCreate' } },
          freeItemIds: { type: 'array', items: { type: 'string', format: 'uuid' }, description: 'Replace the product free-item links with these reusable free item IDs' },
        },
      },

      FreeItemCreate: {
        type: 'object',
        description: 'Reusable free-item catalog entry. Create one here, then link it to one or more products with freeItemIds.',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          sku: { type: 'string' },
          image: { type: 'string', format: 'uri' },
        },
      },
      FreeItem: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          description: { type: 'string' },
          sku: { type: 'string' },
          image: { type: 'string', format: 'uri' },
          createdBy: { type: 'string', format: 'uuid', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateCategoryRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          image: { type: 'string', format: 'uri' },
          parentId: { type: 'string', format: 'uuid' },
          sortOrder: { type: 'integer' },
          isActive: { type: 'boolean' },
        },
      },
      CreateOrderRequest: {
        type: 'object',
        required: ['items', 'paymentMethod'],
        description: 'Provide either `shippingAddressId` (UUID of a saved address) or a full `shippingAddress` inline object. One of the two is required.',
        properties: {
          customerEmail: { type: 'string', format: 'email' },
          customerName: { type: 'string' },
          customerPhone: { type: 'string' },
          items: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              required: ['productId', 'quantity'],
              properties: {
                productId: { type: 'string', format: 'uuid' },
                quantity: { type: 'integer', minimum: 1 },
                freeItemId: {
                  type: 'string',
                  format: 'uuid',
                  description: 'Optional legacy single free item ID (deprecated; prefer `freeItemIds`).',
                },
                freeItemIds: {
                  type: 'array',
                  items: { type: 'string', format: 'uuid' },
                  description: 'Optional array of selected free item IDs. Currently only the first item is used (max 1).',
                },
              },
            },
          },
          shippingAddressId: {
            type: 'string',
            format: 'uuid',
            description: 'ID of a saved address from the user profile. The server will fetch and inherit all address fields.',
          },
          shippingAddress: {
            allOf: [{ $ref: '#/components/schemas/Address' }],
            description: 'Full shipping address object. Required when shippingAddressId is not provided. When providing an inline shippingAddress, include the `zoneId` property so the server can calculate delivery charges.',
          },
          // billingAddress is disabled — not currently used
          paymentMethod: { type: 'string', enum: ['COD', 'BKASH', 'EPS', 'CARD'] },
          discountCode: { type: 'string' },
          notes: { type: 'string' },
        },
        examples: {
          basic: {
            summary: 'Basic order without free items',
            value: {
              shippingAddress: {
                zoneId: 'in_dhaka',
                name: 'John Doe',
                phone: '+8801234567890',
                address: '123 Main Street, Dhaka',
                city: 'Dhaka',
                postalCode: '1200'
              },
              paymentMethod: 'COD',
              items: [
                {
                  productId: '550e8400-e29b-41d4-a716-446655440001',
                  quantity: 2
                }
              ],
              notes: 'Please deliver between 2-4 PM'
            }
          },
          withFreeItem: {
            summary: 'Order with free item selected',
            value: {
              shippingAddress: {
                zoneId: 'in_dhaka',
                name: 'John Doe',
                phone: '+8801234567890',
                address: '123 Main Street, Dhaka',
                city: 'Dhaka',
                postalCode: '1200'
              },
              paymentMethod: 'COD',
                items: [
                {
                  productId: '550e8400-e29b-41d4-a716-446655440001',
                  quantity: 1,
                  freeItemIds: ['550e8400-e29b-41d4-a716-446655440002']
                }
              ],
              notes: 'Handle with care'
            }
          },
          savedAddress: {
            summary: 'Order using saved shipping address',
            value: {
              shippingAddressId: '550e8400-e29b-41d4-a716-446655440003',
              paymentMethod: 'ONLINE',
                items: [
                {
                  productId: '550e8400-e29b-41d4-a716-446655440001',
                  quantity: 1,
                  freeItemIds: ['550e8400-e29b-41d4-a716-446655440002']
                },
                {
                  productId: '550e8400-e29b-41d4-a716-446655440004',
                  quantity: 3
                }
              ],
              discountCode: 'SAVE10'
            }
          }
        },
      },
      createVendorRequest: {
        type: 'object',
        required: ['storeName', 'contactEmail'],
        properties: {
          storeName: { type: 'string', example: 'My Awesome Shop' },
          description: { type: 'string' },
          logo: { type: 'string', format: 'uri' },
          banner: { type: 'string', format: 'uri' },
          contactEmail: { type: 'string', format: 'email', example: 'Vendor@example.com' },
          contactPhone: { type: 'string', example: '+8801700000000' },
          businessAddress: { $ref: '#/components/schemas/VendorAddress' },
          bankDetails: { $ref: '#/components/schemas/BankDetails' },
        },
      },
      updateVendorRequest: {
        type: 'object',
        properties: {
          storeName: { type: 'string' },
          description: { type: 'string' },
          logo: { type: 'string', format: 'uri' },
          banner: { type: 'string', format: 'uri' },
          contactEmail: { type: 'string', format: 'email' },
          contactPhone: { type: 'string' },
          businessAddress: { $ref: '#/components/schemas/VendorAddress' },
          shippingZones: { type: 'array', items: { type: 'string' } },
          returnPolicy: { type: 'string' },
          shippingPolicy: { type: 'string' },
          bankDetails: { $ref: '#/components/schemas/BankDetails' },
          mobileWallet: { type: 'object', additionalProperties: true },
        },
      },
      CreateNotificationRequest: {
        type: 'object',
        required: ['type', 'channel', 'template'],
        properties: {
          userId: { type: 'string', format: 'uuid' },
          guestEmail: { type: 'string', format: 'email' },
          guestPhone: { type: 'string' },
          type: { type: 'string', enum: ['EMAIL', 'SMS', 'PUSH', 'IN_APP'] },
          channel: { type: 'string', enum: ['EMAIL', 'SMS', 'PUSH', 'IN_APP'] },
          template: { type: 'string' },
          data: { type: 'object', additionalProperties: true },
        },
      },

      // ── Response / model schemas ───────────────────────────────────────────
      AuthResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            properties: {
              user: { $ref: '#/components/schemas/User' },
              tokens: {
                type: 'object',
                properties: {
                  accessToken: { type: 'string' },
                  refreshToken: { type: 'string' },
                  expiresIn: { type: 'integer', description: 'Seconds until access token expiry' },
                },
              },
                // RBAC snapshot: optional
                roles: { type: 'array', items: { type: 'object', additionalProperties: true } },
                roleNames: { type: 'array', items: { type: 'string' } },
                permissionCodes: { type: 'array', items: { type: 'integer' } },
            },
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          phone: { type: 'string' },
          avatar: { type: 'string', format: 'uri' },
          roles: { type: 'array', items: { type: 'string', enum: ['SUPERADMIN', 'ADMIN', 'MANAGER', 'SELLER', 'VENDOR', 'DELIVERY_MAN', 'CUSTOMER'] } },
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'] },
          isEmailVerified: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      UserResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Current user' },
          data: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', example: '1edbf100-95b6-45ac-9250-a8b1a67a8fe5' },
              email: { type: 'string', format: 'email', example: 'user@example.com' },
              phone: { type: 'string', nullable: true, example: '+8801700000000' },
              firstName: { type: 'string', example: 'John' },
              lastName: { type: 'string', example: 'Doe' },
              avatar: { type: 'string', format: 'uri', nullable: true },
              role: { type: 'string', enum: ['CUSTOMER', 'Vendor', 'MANAGER', 'ADMIN'], example: 'CUSTOMER' },
              // For `/auth/me` the server may also include an RBAC snapshot
              roles: { type: 'array', items: { $ref: '#/components/schemas/Role' } },
              roleNames: { type: 'array', items: { type: 'string' } },
              permissionCodes: { type: 'array', items: { type: 'integer' } },
              status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'], example: 'ACTIVE' },
              oauthProvider: { type: 'string', example: 'LOCAL' },
              emailVerified: { type: 'boolean', example: false },
              phoneVerified: { type: 'boolean', example: false },
              lastLoginAt: { type: 'string', format: 'date-time', nullable: true },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
          timestamp: { type: 'string', format: 'date-time', example: '2026-03-05T17:59:30.728Z' },
          requestId: { type: 'string', format: 'uuid', example: 'd4be4193-dff7-4855-ad49-23b534de6fcd' },
        },
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          vendorId: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          slug: { type: 'string' },
          description: { type: 'string' },
          shortDescription: { type: 'string' },
          sku: { type: 'string' },
          supplierPrice: { type: 'number', description: 'Vendor/supplier price (may be hidden from some roles)' },
          categoryId: { type: 'string', format: 'uuid' },
          category: { type: 'object', properties: { id: { type: 'string', format: 'uuid' }, name: { type: 'string' }, slug: { type: 'string' } } },
          price: { type: 'number' },
          discountPrice: { type: 'number' },
          discountType: { type: 'string', enum: ['PERCENTAGE', 'FIXED'] },
          discountValue: { type: 'number' },
          stock: { type: 'integer' },
          reservedStock: { type: 'integer' },
          lowStockThreshold: { type: 'integer' },
          weight: { type: 'number' },
          unit: { type: 'string' },
          isOrganic: { type: 'boolean' },
          organicCertification: { type: 'string' },
          images: { type: 'array', items: { type: 'string', format: 'uri' } },
          metadata: { type: 'object', additionalProperties: true },
          thumbnail: { type: 'string', format: 'uri' },
          tags: { type: 'array', items: { type: 'string' } },
          freeItems: { type: 'array', items: { $ref: '#/components/schemas/FreeItem' } },
          viewCount: { type: 'integer' },
          reviews: { type: 'array', items: { $ref: '#/components/schemas/Review' } },
          status: { type: 'string', enum: ['PENDING_APPROVAL', 'ACTIVE', 'INACTIVE', 'OUT_OF_STOCK', 'REJECTED'] },
          isFeatured: { type: 'boolean' },
          isFlashSale: { type: 'boolean' },
          flashSalePrice: { type: 'number' },
          flashSaleStartDate: { type: 'string', format: 'date-time' },
          flashSaleEndDate: { type: 'string', format: 'date-time' },
          averageRating: { type: 'number', format: 'float' },
          totalReviews: { type: 'integer' },
          totalSold: { type: 'integer' },
          lastUpdatedBy: { type: 'string', format: 'uuid', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      ProductResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: { $ref: '#/components/schemas/Product' },
        },
      },
      Permission: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          permissionCode: { type: 'integer' },
          action: { type: 'string' },
          resource: { type: 'string' },
          description: { type: 'string' },
        },
      },
      Role: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          permissionCount: { type: 'integer' },
          permissions: { type: 'array', items: { $ref: '#/components/schemas/Permission' } },
        },
      },
      PaginatedProducts: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              items: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
              total: { type: 'integer' },
              page: { type: 'integer' },
              limit: { type: 'integer' },
              totalPages: { type: 'integer' },
            },
          },
        },
      },
      Category: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          slug: { type: 'string' },
          description: { type: 'string' },
          image: { type: 'string', format: 'uri' },
          parentId: { type: 'string', format: 'uuid', nullable: true },
          level: { type: 'integer' },
          sortOrder: { type: 'integer' },
          isActive: { type: 'boolean' },
          productCount: { type: 'integer' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CategoryResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: { $ref: '#/components/schemas/Category' },
        },
      },
      CategoriesResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: { type: 'array', items: { $ref: '#/components/schemas/Category' } },
        },
      },
      Order: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          orderNumber: { type: 'string' },
          customerId: { type: 'string', format: 'uuid', nullable: true },
          guestId: { type: 'string', nullable: true },
          customerEmail: { type: 'string', format: 'email' },
          customerPhone: { type: 'string' },
          customerName: { type: 'string' },
          items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
          subtotal: { type: 'number' },
          discountAmount: { type: 'number' },
          shippingAmount: { type: 'number' },
          taxAmount: { type: 'number' },
          totalAmount: { type: 'number' },
          currency: { type: 'string', example: 'BDT' },
          status: { type: 'string', enum: ['PENDING','CONFIRMED','PROCESSING','SHIPPED','OUT_FOR_DELIVERY','DELIVERED','CANCELLED','REFUNDED','FAILED'] },
          paymentMethod: { type: 'string', enum: ['COD', 'BKASH', 'EPS', 'CARD'] },
          paymentId: { type: 'string', format: 'uuid', nullable: true },
          shippingAddress: { $ref: '#/components/schemas/Address' },
          // billingAddress disabled — not currently used
          notes: { type: 'string' },
          trackingNumber: { type: 'string' },
          estimatedDeliveryDate: { type: 'string', format: 'date-time' },
          actualDeliveryDate: { type: 'string', format: 'date-time' },
          cancelReason: { type: 'string' },
          cancelledAt: { type: 'string', format: 'date-time' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      OrderItem: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          orderId: { type: 'string', format: 'uuid' },
          productId: { type: 'string', format: 'uuid' },
          VendorId: { type: 'string', format: 'uuid' },
          productName: { type: 'string' },
          productImage: { type: 'string', format: 'uri' },
          sku: { type: 'string' },
          quantity: { type: 'integer' },
          freeItems: {
            type: 'array',
            items: { $ref: '#/components/schemas/FreeItem' },
            description: 'Resolved free-item snapshots attached to this order item',
          },
          unitPrice: { type: 'number' },
          discountAmount: { type: 'number' },
          totalPrice: { type: 'number' },
          status: { type: 'string', enum: ['PENDING','CONFIRMED','PROCESSING','SHIPPED','OUT_FOR_DELIVERY','DELIVERED','CANCELLED','REFUNDED','FAILED'] },
        },
      },
      OrderResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: { $ref: '#/components/schemas/Order' },
        },
      },
      PaginatedOrders: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              items: { type: 'array', items: { $ref: '#/components/schemas/Order' } },
              total: { type: 'integer' },
              page: { type: 'integer' },
              limit: { type: 'integer' },
              totalPages: { type: 'integer' },
            },
          },
        },
      },
      CartItem: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          cartId: { type: 'string', format: 'uuid' },
          productId: { type: 'string', format: 'uuid' },
          quantity: { type: 'integer' },
          price: { type: 'number' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          productName: { type: 'string' },
          productImage: { type: 'string', format: 'uri' },
          freeItems: {
            type: 'array',
            items: { $ref: '#/components/schemas/FreeItem' },
            description: 'Resolved free-item snapshots attached to this cart item',
          },
        },
      },
      CartResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              cart: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  userId: { type: 'string', format: 'uuid', nullable: true },
                  guestId: { type: 'string', nullable: true },
                  items: { type: 'array', items: { $ref: '#/components/schemas/CartItem' } },
                  subtotal: { type: 'number' },
                  totalItems: { type: 'integer' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                  expiresAt: { type: 'string', format: 'date-time', nullable: true },
                },
              },
              summary: {
                type: 'object',
                properties: {
                  itemCount: { type: 'integer' },
                  subtotal: { type: 'number' },
                  shippingFee: { type: 'number' },
                  total: { type: 'number' },
                },
              },
            },
          },
        },
      },
      Payment: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          orderId: { type: 'string', format: 'uuid' },
          transactionId: { type: 'string' },
          gatewayReference: { type: 'string' },
          method: { type: 'string', enum: ['COD', 'BKASH', 'EPS', 'CARD'] },
          amount: { type: 'number' },
          currency: { type: 'string', example: 'BDT' },
          status: { type: 'string', enum: ['PENDING','PROCESSING','COMPLETED','FAILED','REFUNDED','CANCELLED'] },
          paidAt: { type: 'string', format: 'date-time' },
          refundedAt: { type: 'string', format: 'date-time' },
          refundAmount: { type: 'number' },
          refundReason: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      PaymentResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: { $ref: '#/components/schemas/Payment' },
        },
      },
      PaginatedPayments: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              items: { type: 'array', items: { $ref: '#/components/schemas/Payment' } },
              total: { type: 'integer' },
              page: { type: 'integer' },
              limit: { type: 'integer' },
              totalPages: { type: 'integer' },
            },
          },
        },
      },
      Vendor: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          businessName: { type: 'string' },
          slug: { type: 'string' },
          description: { type: 'string' },
          logo: { type: 'string', format: 'uri' },
          banner: { type: 'string', format: 'uri' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          address: { $ref: '#/components/schemas/VendorAddress' },
          status: { type: 'string', enum: ['PENDING', 'APPROVED', 'SUSPENDED', 'REJECTED'] },
          isVerified: { type: 'boolean' },
          totalProducts: { type: 'integer' },
          totalOrders: { type: 'integer' },
          totalRevenue: { type: 'number' },
          averageRating: { type: 'number' },
          totalReviews: { type: 'integer' },
          joinedAt: { type: 'string', format: 'date-time' },
          approvedAt: { type: 'string', format: 'date-time' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      VendorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: { $ref: '#/components/schemas/Vendor' },
        },
      },
      PaginatedVendors: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              items: { type: 'array', items: { $ref: '#/components/schemas/Vendor' } },
              total: { type: 'integer' },
              page: { type: 'integer' },
              limit: { type: 'integer' },
              totalPages: { type: 'integer' },
            },
          },
        },
      },
      Inventory: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          productId: { type: 'string', format: 'uuid' },
          VendorId: { type: 'string', format: 'uuid' },
          sku: { type: 'string' },
          totalStock: { type: 'integer' },
          availableStock: { type: 'integer' },
          reservedStock: { type: 'integer' },
          lowStockThreshold: { type: 'integer' },
          isLowStock: { type: 'boolean' },
          lastRestockedAt: { type: 'string', format: 'date-time' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      InventoryResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: { $ref: '#/components/schemas/Inventory' },
        },
      },
      PaginatedInventory: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              items: { type: 'array', items: { $ref: '#/components/schemas/Inventory' } },
              total: { type: 'integer' },
              page: { type: 'integer' },
              limit: { type: 'integer' },
              totalPages: { type: 'integer' },
            },
          },
        },
      },
      Notification: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid', nullable: true },
          type: { type: 'string', enum: ['EMAIL', 'SMS', 'PUSH', 'IN_APP'] },
          channel: { type: 'string', enum: ['EMAIL', 'SMS', 'PUSH', 'IN_APP'] },
          template: { type: 'string' },
          subject: { type: 'string' },
          content: { type: 'string' },
          status: { type: 'string', enum: ['PENDING', 'SENT', 'DELIVERED', 'FAILED'] },
          sentAt: { type: 'string', format: 'date-time' },
          deliveredAt: { type: 'string', format: 'date-time' },
          retryCount: { type: 'integer' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      NotificationResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: { $ref: '#/components/schemas/Notification' },
        },
      },
      PaginatedNotifications: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              items: { type: 'array', items: { $ref: '#/components/schemas/Notification' } },
              total: { type: 'integer' },
              page: { type: 'integer' },
              limit: { type: 'integer' },
              totalPages: { type: 'integer' },
            },
          },
        },
      },
      PaginatedUsers: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              users: { type: 'array', items: { $ref: '#/components/schemas/AuthUser' } },
              total: { type: 'integer' },
              page: { type: 'integer' },
              limit: { type: 'integer' },
            },
          },
        },
      },

      AuthUser: {
        type: 'object',
        description: 'User record returned by the auth service. The `id` field is the canonical user ID used across all services.',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'Canonical user ID — use this for all cross-service calls' },
          email: { type: 'string', format: 'email' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          phone: { type: 'string' },
          avatar: { type: 'string', format: 'uri' },
          role: { type: 'string', enum: ['CUSTOMER', 'Vendor', 'MANAGER', 'ADMIN'] },
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'] },
          oauthProvider: { type: 'string', enum: ['LOCAL', 'GOOGLE', 'FACEBOOK', 'APPLE', 'ANONYMOUS'] },
          emailVerified: { type: 'boolean' },
          phoneVerified: { type: 'boolean' },
          lastLoginAt: { type: 'string', format: 'date-time', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },

      // ── Shared sub-schemas ─────────────────────────────────────────────────
      Address: {
        type: 'object',
        required: ['fullName', 'phone', 'addressLine', 'district', 'zoneId'],
        properties: {
          fullName: { type: 'string' },
          phone: { type: 'string' },
          addressLine: { type: 'string' },
          area: { type: 'string', description: 'Specific area or neighborhood within the district (optional)' },
          district: { type: 'string' },
          upazila: { type: 'string' },
          // Canonical shipping zone identifier. Required for order creation when providing inline shippingAddress.
          zoneId: { type: 'string' },
          postalCode: { type: 'string' },
          country: { type: 'string', example: 'BD' },
        },
      },
      VendorAddress: {
        type: 'object',
        required: ['addressLine', 'district', 'postalCode', 'country'],
        properties: {
          addressLine: { type: 'string' },
          district: { type: 'string' },
          postalCode: { type: 'string' },
          country: { type: 'string', example: 'BD' },
        },
      },
      BankDetails: {
        type: 'object',
        required: ['bankName', 'accountName', 'accountNumber'],
        properties: {
          bankName: { type: 'string' },
          accountName: { type: 'string' },
          accountNumber: { type: 'string' },
          branchName: { type: 'string' },
          routingNumber: { type: 'string' },
          swiftCode: { type: 'string' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'VALIDATION_ERROR' },
              message: { type: 'string', example: 'Invalid request data' },
              details: { type: 'array', items: { type: 'object' } },
            },
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'UNAUTHORIZED' },
              message: { type: 'string', example: 'Unauthorized' },
            },
          },
        },
      },
    },

    parameters: {
      page: {
        name: 'page',
        in: 'query',
        description: 'Page number (1-based)',
        schema: { type: 'integer', default: 1, minimum: 1 },
      },
      limit: {
        name: 'limit',
        in: 'query',
        description: 'Items per page',
        schema: { type: 'integer', default: 20, minimum: 1, maximum: 100 },
      },
    },

    responses: {
      BadRequest: {
        description: 'Bad Request — validation failed or malformed input',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
      Unauthorized: {
        description: 'Unauthorized — missing or invalid JWT',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
      Forbidden: {
        description: 'Forbidden — insufficient permissions',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
      NotFound: {
        description: 'Not Found',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
      Conflict: {
        description: 'Conflict — resource already exists',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
      PaymentRequired: {
        description: 'Payment Required — payment gateway rejected the request',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
      ValidationError: {
        description: 'Unprocessable Entity — request body failed schema validation',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
      ServiceUnavailable: {
        description: 'Service Unavailable — upstream microservice is down',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
      InternalServerError: {
        description: 'Internal Server Error — unexpected server error',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
    },
  },
};

export default swaggerDocument;



