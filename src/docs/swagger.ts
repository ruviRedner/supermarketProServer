import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SupermarketPro API",
      version: "1.0.0",
    },
    servers: [{ url: "https://supermarket-pro-server-ruvi-ruby7966-dev.apps.rm2.thpm.p1.openshiftapps.com" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [], // אנחנו נשמור את התיעוד כ־handwritten routes below (פשוט ומובן)
});
