import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

/**
 * Swagger configuration
 * @returns {swaggerJsdoc.Options} Swagger options
 */

const swaggerSpec = swaggerJsdoc({
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Radomir's API",
      version: "1.0.0",
      description: "API documentation for Radomir's server",
    },
    servers: [
      {
        url: "http://localhost:3000", // Replace with your server URL
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Optional, for documentation clarity
        },
      },
    },
  },
  apis: ["./src/api/**/*.ts"], // Path to your API files
});

/**
 * Configure and return Swagger UI Express middleware
 * @param {string} url The URL to serve Swagger UI
 * @returns {Function} Express middleware to serve Swagger UI
 */
const swaggerUiMiddleware = swaggerUi.serve;
const swaggerDocs = swaggerUi.setup(swaggerSpec);

export { swaggerDocs, swaggerUiMiddleware };
