const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "StartupBridge API",
      version: "1.0.0",
      description:
        "REST API documentation for the StartupBridge platform — connecting Entrepreneurs with Mentors.",
    },
    servers: [
      {
        url: "http://localhost:8080",
        description: "Local Development Server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT access token. Obtain it from /api/user/login",
        },
      },
      schemas: {
        // ─── User ────────────────────────────────────────────────────
        RegisterRequest: {
          type: "object",
          required: ["userName", "mobile", "email", "password", "role"],
          properties: {
            userName:  { type: "string", example: "john_doe" },
            mobile:    { type: "string", example: "9876543210" },
            email:     { type: "string", format: "email", example: "john@example.com" },
            password:  { type: "string", example: "Pass@1234" },
            role:      { type: "string", enum: ["Entrepreneur", "Mentor"], example: "Entrepreneur" },
            resume:    { type: "string", format: "binary", description: "PDF resume (required for Mentor)" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email:    { type: "string", format: "email", example: "john@example.com" },
            password: { type: "string", example: "Pass@1234" },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            accessToken: { type: "string" },
            userName:    { type: "string" },
            role:        { type: "string" },
            ID:          { type: "string" },
          },
        },
        UpdateMentorStatusRequest: {
          type: "object",
          required: ["userId", "status"],
          properties: {
            userId: { type: "string", example: "64f1a2b3c4d5e6f7a8b9c0d1" },
            status: { type: "string", enum: ["active", "rejected"] },
          },
        },
        UpdateUserRequest: {
          type: "object",
          required: ["userId"],
          properties: {
            userId: { type: "string", example: "64f1a2b3c4d5e6f7a8b9c0d1" },
            role:   { type: "string", enum: ["Entrepreneur", "Mentor", "Admin"] },
            status: { type: "string", enum: ["active", "pending", "rejected"] },
          },
        },
        User: {
          type: "object",
          properties: {
            _id:       { type: "string" },
            userName:  { type: "string" },
            email:     { type: "string" },
            mobile:    { type: "string" },
            role:      { type: "string" },
            status:    { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        DashboardResponse: {
          type: "object",
          properties: {
            ideasCount:         { type: "integer", example: 5 },
            mentorsCount:       { type: "integer", example: 12 },
            recentSubmissions:  { type: "array", items: { $ref: "#/components/schemas/StartupSubmission" } },
          },
        },

        // ─── StartupProfile ──────────────────────────────────────────
        StartupProfileRequest: {
          type: "object",
          required: ["category", "description", "fundingLimit", "avgEquityExpectation", "targetIndustry", "preferredStage"],
          properties: {
            category:             { type: "string", example: "FinTech" },
            description:          { type: "string", example: "Looking for early-stage fintech startups." },
            fundingLimit:         { type: "number", example: 500000 },
            avgEquityExpectation: { type: "number", example: 15 },
            targetIndustry:       { type: "string", example: "Finance" },
            preferredStage:       { type: "string", enum: ["idea", "MVP", "pre-revenue", "scaling", "established"], example: "MVP" },
          },
        },
        StartupProfile: {
          type: "object",
          properties: {
            _id:                  { type: "string" },
            mentorId:             { type: "string" },
            category:             { type: "string" },
            description:          { type: "string" },
            fundingLimit:         { type: "number" },
            avgEquityExpectation: { type: "number" },
            targetIndustry:       { type: "string" },
            preferredStage:       { type: "string" },
            createdAt:            { type: "string", format: "date-time" },
            updatedAt:            { type: "string", format: "date-time" },
          },
        },

        // ─── StartupSubmission ────────────────────────────────────────
        StartupSubmissionRequest: {
          type: "object",
          required: ["userName", "startupProfileId", "marketPotential", "launchYear", "expectedFunding", "address", "pitchDeckFile"],
          properties: {
            userName:         { type: "string", example: "john_doe" },
            startupProfileId: { type: "string", example: "64f1a2b3c4d5e6f7a8b9c0d1" },
            marketPotential:  { type: "number", example: 1000000 },
            launchYear:       { type: "string", format: "date", example: "2024-01-01" },
            expectedFunding:  { type: "number", example: 250000 },
            address:          { type: "string", example: "Mumbai, Maharashtra" },
            pitchDeckFile:    { type: "string", format: "binary", description: "PDF pitch deck (max 10MB)" },
          },
        },
        GetAllSubmissionsRequest: {
          type: "object",
          properties: {
            page:    { type: "integer", default: 1, example: 1 },
            limit:   { type: "integer", default: 10, example: 10 },
            search:  { type: "string", example: "john" },
            status:  { type: "string", enum: ["Submitted", "Shortlisted", "Rejected"] },
            sortBy:  { type: "string", example: "submissionDate" },
            order:   { type: "string", enum: ["asc", "desc"], example: "desc" },
          },
        },
        StartupSubmission: {
          type: "object",
          properties: {
            _id:              { type: "string" },
            userId:           { type: "string" },
            userName:         { type: "string" },
            startupProfileId: { type: "string" },
            submissionDate:   { type: "string", format: "date-time" },
            marketPotential:  { type: "number" },
            launchYear:       { type: "string", format: "date-time" },
            expectedFunding:  { type: "number" },
            status:           { type: "string", enum: ["Submitted", "Shortlisted", "Rejected"] },
            address:          { type: "string" },
            pitchDeckFile:    { type: "string", description: "Base64 encoded PDF" },
            createdAt:        { type: "string", format: "date-time" },
            updatedAt:        { type: "string", format: "date-time" },
          },
        },
        UpdateSubmissionRequest: {
          type: "object",
          properties: {
            status:          { type: "string", enum: ["Submitted", "Shortlisted", "Rejected"] },
            marketPotential: { type: "number" },
            expectedFunding: { type: "number" },
            address:         { type: "string" },
          },
        },

        // ─── Generic ─────────────────────────────────────────────────
        MessageResponse: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
        PaginatedSubmissions: {
          type: "object",
          properties: {
            page:       { type: "integer" },
            limit:      { type: "integer" },
            totalCount: { type: "integer" },
            totalPages: { type: "integer" },
            data:       { type: "array", items: { $ref: "#/components/schemas/StartupSubmission" } },
          },
        },
      },
    },

    // ─── Global security (can override per route) ─────────────────────
    security: [{ BearerAuth: [] }],

    paths: {
      // ══════════════════════════════════════════════════
      //  USER ROUTES  /api/user
      // ══════════════════════════════════════════════════
      "/api/user/register": {
        post: {
          tags: ["User"],
          summary: "Register a new user (Entrepreneur or Mentor)",
          security: [],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: { $ref: "#/components/schemas/RegisterRequest" },
              },
            },
          },
          responses: {
            201: { description: "Registration successful / Application submitted", content: { "application/json": { schema: { $ref: "#/components/schemas/MessageResponse" } } } },
            400: { description: "Validation error / Email already exists", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            500: { description: "Internal server error" },
          },
        },
      },

      "/api/user/login": {
        post: {
          tags: ["User"],
          summary: "Login and receive access + refresh tokens",
          security: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
              },
            },
          },
          responses: {
            200: { description: "Login successful", content: { "application/json": { schema: { $ref: "#/components/schemas/LoginResponse" } } } },
            401: { description: "Invalid credentials" },
            403: { description: "Account pending or rejected" },
            404: { description: "User not found" },
            500: { description: "Internal server error" },
          },
        },
      },

      "/api/user/refresh": {
        get: {
          tags: ["User"],
          summary: "Refresh access token using HTTP-only refresh cookie",
          security: [],
          responses: {
            200: { description: "New access token issued", content: { "application/json": { schema: { $ref: "#/components/schemas/LoginResponse" } } } },
            401: { description: "No refresh token" },
            403: { description: "Invalid or expired refresh token" },
          },
        },
      },

      "/api/user/pending-mentors": {
        get: {
          tags: ["User"],
          summary: "Get all Mentors with pending status (Admin only)",
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: "List of pending mentors", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/User" } } } } },
            403: { description: "Forbidden - Admin only" },
            500: { description: "Internal server error" },
          },
        },
      },

      "/api/user/approve-mentor": {
        post: {
          tags: ["User"],
          summary: "Approve or reject a Mentor application (Admin only)",
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdateMentorStatusRequest" },
              },
            },
          },
          responses: {
            200: { description: "Mentor status updated", content: { "application/json": { schema: { $ref: "#/components/schemas/MessageResponse" } } } },
            400: { description: "Invalid status value" },
            403: { description: "Forbidden - Admin only" },
            404: { description: "User not found" },
            500: { description: "Internal server error" },
          },
        },
      },

      "/api/user/all-users": {
        get: {
          tags: ["User"],
          summary: "Get all users excluding Admins (Admin only)",
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: "List of users", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/User" } } } } },
            403: { description: "Forbidden - Admin only" },
            500: { description: "Internal server error" },
          },
        },
      },

      "/api/user/update-user": {
        put: {
          tags: ["User"],
          summary: "Update user role or status (Admin only)",
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdateUserRequest" },
              },
            },
          },
          responses: {
            200: { description: "User updated successfully", content: { "application/json": { schema: { $ref: "#/components/schemas/MessageResponse" } } } },
            403: { description: "Forbidden - Admin only" },
            404: { description: "User not found" },
            500: { description: "Internal server error" },
          },
        },
      },

      "/api/user/resume/{id}": {
        get: {
          tags: ["User"],
          summary: "Download/view mentor resume PDF (Admin only)",
          security: [{ BearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" }, description: "User ID" },
          ],
          responses: {
            200: { description: "PDF file returned", content: { "application/pdf": { schema: { type: "string", format: "binary" } } } },
            403: { description: "Forbidden - Admin only" },
            404: { description: "User or resume not found" },
            500: { description: "Internal server error" },
          },
        },
      },

      "/api/user/entrepreneur/dashboard": {
        get: {
          tags: ["User"],
          summary: "Get dashboard data for Entrepreneur or Mentor",
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: "Dashboard stats and recent submissions", content: { "application/json": { schema: { $ref: "#/components/schemas/DashboardResponse" } } } },
            403: { description: "Forbidden" },
            500: { description: "Internal server error" },
          },
        },
      },

      // ══════════════════════════════════════════════════
      //  STARTUP PROFILE ROUTES  /api/startupProfile
      // ══════════════════════════════════════════════════
      "/api/startupProfile/getAllStartupProfiles": {
        get: {
          tags: ["Startup Profile"],
          summary: "Get all startup profiles (any authenticated user)",
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: "List of all startup profiles", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/StartupProfile" } } } } },
            401: { description: "Unauthorized" },
            500: { description: "Internal server error" },
          },
        },
      },

      "/api/startupProfile/getStartupProfileById/{id}": {
        get: {
          tags: ["Startup Profile"],
          summary: "Get a single startup profile by ID",
          security: [{ BearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Startup Profile ID" },
          ],
          responses: {
            200: { description: "Startup profile found", content: { "application/json": { schema: { $ref: "#/components/schemas/StartupProfile" } } } },
            404: { description: "Profile not found" },
            500: { description: "Internal server error" },
          },
        },
      },

      "/api/startupProfile/getStartupProfilesByMentorId/{mentorId}": {
        get: {
          tags: ["Startup Profile"],
          summary: "Get all profiles created by a specific Mentor (Mentor only)",
          security: [{ BearerAuth: [] }],
          parameters: [
            { name: "mentorId", in: "path", required: true, schema: { type: "string" }, description: "Mentor's User ID" },
          ],
          responses: {
            200: { description: "List of mentor's startup profiles", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/StartupProfile" } } } } },
            403: { description: "Forbidden - Mentor only" },
            500: { description: "Internal server error" },
          },
        },
      },

      "/api/startupProfile/addStartupProfile": {
        post: {
          tags: ["Startup Profile"],
          summary: "Create a new startup profile (Mentor only)",
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/StartupProfileRequest" },
              },
            },
          },
          responses: {
            200: { description: "Profile added successfully", content: { "application/json": { schema: { $ref: "#/components/schemas/MessageResponse" } } } },
            403: { description: "Forbidden - Mentor only" },
            500: { description: "Internal server error" },
          },
        },
      },

      "/api/startupProfile/updateStartupProfile/{id}": {
        put: {
          tags: ["Startup Profile"],
          summary: "Update a startup profile (Mentor only, must be owner)",
          security: [{ BearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Startup Profile ID" },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/StartupProfileRequest" },
              },
            },
          },
          responses: {
            200: { description: "Profile updated successfully", content: { "application/json": { schema: { $ref: "#/components/schemas/MessageResponse" } } } },
            403: { description: "Forbidden - not the owner" },
            404: { description: "Profile not found" },
            500: { description: "Internal server error" },
          },
        },
      },

      "/api/startupProfile/deleteStartupProfile/{id}": {
        delete: {
          tags: ["Startup Profile"],
          summary: "Delete a startup profile (Mentor only, must be owner)",
          security: [{ BearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Startup Profile ID" },
          ],
          responses: {
            200: { description: "Profile deleted successfully", content: { "application/json": { schema: { $ref: "#/components/schemas/MessageResponse" } } } },
            403: { description: "Forbidden - not the owner" },
            404: { description: "Profile not found" },
            500: { description: "Internal server error" },
          },
        },
      },

      // ══════════════════════════════════════════════════
      //  STARTUP SUBMISSION ROUTES  /api/startupSubmission
      // ══════════════════════════════════════════════════
      "/api/startupSubmission/addStartupSubmission": {
        post: {
          tags: ["Startup Submission"],
          summary: "Submit a startup idea with a pitch deck PDF (Entrepreneur only)",
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: { $ref: "#/components/schemas/StartupSubmissionRequest" },
              },
            },
          },
          responses: {
            200: { description: "Submission added successfully", content: { "application/json": { schema: { $ref: "#/components/schemas/MessageResponse" } } } },
            400: { description: "Validation / file error" },
            403: { description: "Forbidden - Entrepreneur only" },
          },
        },
      },

      "/api/startupSubmission/getAllStartupSubmissions": {
        post: {
          tags: ["Startup Submission"],
          summary: "Get all submissions with filtering, pagination and sorting (Mentor only)",
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: false,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/GetAllSubmissionsRequest" },
              },
            },
          },
          responses: {
            200: { description: "Paginated list of submissions", content: { "application/json": { schema: { $ref: "#/components/schemas/PaginatedSubmissions" } } } },
            403: { description: "Forbidden - Mentor only" },
            500: { description: "Internal server error" },
          },
        },
      },

      "/api/startupSubmission/getSubmissionsByUserId/{userId}": {
        get: {
          tags: ["Startup Submission"],
          summary: "Get all submissions by a specific user (Entrepreneur only)",
          security: [{ BearerAuth: [] }],
          parameters: [
            { name: "userId", in: "path", required: true, schema: { type: "string" }, description: "User ID of the Entrepreneur" },
          ],
          responses: {
            200: { description: "List of user submissions", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/StartupSubmission" } } } } },
            403: { description: "Forbidden - Entrepreneur only" },
            500: { description: "Internal server error" },
          },
        },
      },

      "/api/startupSubmission/getStartupSubmissionById/{id}": {
        get: {
          tags: ["Startup Submission"],
          summary: "Get a single submission by ID (Mentor only)",
          security: [{ BearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Submission ID" },
          ],
          responses: {
            200: { description: "Submission details", content: { "application/json": { schema: { $ref: "#/components/schemas/StartupSubmission" } } } },
            403: { description: "Forbidden - Mentor only" },
            404: { description: "Submission not found" },
            500: { description: "Internal server error" },
          },
        },
      },

      "/api/startupSubmission/updateStartupSubmission/{id}": {
        put: {
          tags: ["Startup Submission"],
          summary: "Update a submission status or fields (Mentor only)",
          security: [{ BearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Submission ID" },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdateSubmissionRequest" },
              },
            },
          },
          responses: {
            200: { description: "Submission updated successfully", content: { "application/json": { schema: { $ref: "#/components/schemas/MessageResponse" } } } },
            403: { description: "Forbidden - Mentor only" },
            404: { description: "Submission not found" },
            500: { description: "Internal server error" },
          },
        },
      },

      "/api/startupSubmission/deleteStartupSubmission/{id}": {
        delete: {
          tags: ["Startup Submission"],
          summary: "Delete a submission (Entrepreneur only, must be Pending status)",
          security: [{ BearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Submission ID" },
          ],
          responses: {
            200: { description: "Submission deleted successfully", content: { "application/json": { schema: { $ref: "#/components/schemas/MessageResponse" } } } },
            400: { description: "Cannot delete a processed submission" },
            403: { description: "Forbidden - Entrepreneur only" },
            404: { description: "Submission not found" },
            500: { description: "Internal server error" },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

/**
 * Call this in your app.js / server.js:
 *
 *   const { setupSwagger } = require('./swagger');
 *   setupSwagger(app);
 *
 * Then visit: http://localhost:8080/api-docs
 */
const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "StartupBridge API Docs",
    swaggerOptions: {
      persistAuthorization: true,
    },
  }));
  console.log("Swagger docs available at http://localhost:8080/api-docs");
};

module.exports = { setupSwagger };