import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

/**
 * Swagger configuration
 * @returns {swaggerJsdoc.Options} Swagger options
 */

const swaggerSpec = swaggerJsdoc({
  swaggerDefinition: {
    openapi: "3.0.0", // OpenAPI version
    info: {
      title: "Radomir's API", // Your API's title
      version: "1.0.0", // Your API version
      description: "API documentation for Radomir's server", // Description
    },
    servers: [
      {
        url: "http://localhost:3000", // Base URL for your API
      },
    ],
  },
  apis: ["./src/api/**/*.ts"], // Path to your route files (e.g., controllers, models)
});

/**
 * Configure and return Swagger UI Express middleware
 * @param {string} url The URL to serve Swagger UI
 * @returns {Function} Express middleware to serve Swagger UI
 */
const swaggerUiMiddleware = swaggerUi.serve;
const swaggerDocs = swaggerUi.setup(swaggerSpec);

export { swaggerDocs, swaggerUiMiddleware };
