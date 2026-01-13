import { swaggerSpec } from "./swagger.js";

// helper schemas (פשוטים וברורים)
const UserSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    role: { type: "string", enum: ["customer", "admin"] },
    name: { type: "string" },
    email: { type: "string" },
  },
};

const AuthResponseSchema = {
  type: "object",
  properties: {
    user: UserSchema,
    accessToken: { type: "string" },
  },
};

const ProductSchema = {
  type: "object",
  properties: {
    _id: { type: "string" },
    name: { type: "string" },
    price: { type: "number" },
    category: { type: "string" },
    expiryDate: { type: "string", format: "date-time" },
    imageUrl: { type: "string", nullable: true },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
};

const OrderSchema = {
  type: "object",
  properties: {
    _id: { type: "string" },
    userId: { type: "string" },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          productId: { type: "string" },
          nameSnapshot: { type: "string" },
          priceSnapshot: { type: "number" },
          qty: { type: "number" },
        },
      },
    },
    total: { type: "number" },
    customer: {
      type: "object",
      properties: {
        fullName: { type: "string" },
        phone: { type: "string" },
        address: { type: "string" },
        notes: { type: "string", nullable: true },
      },
    },
    status: {
      type: "string",
      enum: ["NEW", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELED"],
    },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
};

(swaggerSpec as any).paths = {
  // ---------------- AUTH ----------------
  "/api/auth/register": {
    post: {
      tags: ["Auth"],
      security: [],
      summary: "Register customer",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "email", "password"],
              properties: {
                name: { type: "string", example: "Ruvi" },
                email: { type: "string", example: "ruvi@test.com" },
                password: { type: "string", example: "123456" },
              },
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Created",
          content: { "application/json": { schema: AuthResponseSchema } },
        },
        "400": { description: "Validation error" },
        "409": { description: "Email already exists" },
      },
    },
  },

  "/api/auth/login": {
    post: {
      tags: ["Auth"],
      security: [],
      summary: "Login (customer/admin)",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: { type: "string", example: "admin@admin.com" },
                password: { type: "string", example: "Admin1234!" },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "OK",
          content: { "application/json": { schema: AuthResponseSchema } },
        },
        "401": { description: "Invalid credentials" },
      },
    },
  },

  "/api/auth/me": {
    get: {
      tags: ["Auth"],
      summary: "Get current user (requires Bearer token)",
      responses: {
        "200": {
          description: "OK",
          content: { "application/json": { schema: { type: "object", properties: { user: UserSchema } } } },
        },
        "401": { description: "Missing/invalid token" },
      },
    },
  },

  // ---------------- PRODUCTS ----------------
  "/api/products": {
    get: {
      tags: ["Products"],
      summary: "List products (supports filters)",
      parameters: [
        { name: "q", in: "query", required: false, schema: { type: "string" }, description: "Search by name" },
        { name: "cat", in: "query", required: false, schema: { type: "string" }, description: "Category or 'all'" },
        { name: "min", in: "query", required: false, schema: { type: "string" }, description: "Min price" },
        { name: "max", in: "query", required: false, schema: { type: "string" }, description: "Max price" },
        {
          name: "sort",
          in: "query",
          required: false,
          schema: { type: "string", enum: ["price-asc", "price-desc"] },
          description: "Sort by price",
        },
      ],
      responses: {
        "200": {
          description: "OK",
          content: { "application/json": { schema: { type: "array", items: ProductSchema } } },
        },
        "401": { description: "Missing/invalid token" },
      },
    },

    post: {
      tags: ["Products"],
      summary: "Create product (Admin only)",
      description: "Admin only",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "price", "category", "expiryDate"],
              properties: {
                name: { type: "string", example: "Milk 3%" },
                price: { type: "number", example: 6.9 },
                category: { type: "string", example: "Dairy" },
                expiryDate: { type: "string", example: "2026-02-01" },
                imageUrl: {
                  type: "string",
                  example: "https://images.unsplash.com/photo-1580915411954-282cb1b0d780",
                },
              },
            },
          },
        },
      },
      responses: {
        "201": { description: "Created", content: { "application/json": { schema: ProductSchema } } },
        "401": { description: "Missing/invalid token" },
        "403": { description: "Forbidden (not admin)" },
        "400": { description: "Validation error" },
      },
    },
  },

  "/api/products/{id}": {
    get: {
      tags: ["Products"],
      summary: "Get product by id",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      responses: {
        "200": { description: "OK", content: { "application/json": { schema: ProductSchema } } },
        "401": { description: "Missing/invalid token" },
        "404": { description: "Not found" },
      },
    },

    patch: {
      tags: ["Products"],
      summary: "Update product (Admin only)",
      description: "Admin only",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string", example: "Milk 1%" },
                price: { type: "number", example: 5.9 },
                category: { type: "string", example: "Dairy" },
                expiryDate: { type: "string", example: "2026-02-05" },
                imageUrl: { type: "string", example: "https://example.com/milk.png" },
              },
            },
          },
        },
      },
      responses: {
        "200": { description: "OK", content: { "application/json": { schema: ProductSchema } } },
        "401": { description: "Missing/invalid token" },
        "403": { description: "Forbidden (not admin)" },
        "404": { description: "Not found" },
      },
    },

    delete: {
      tags: ["Products"],
      summary: "Delete product (Admin only)",
      description: "Admin only",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      responses: {
        "204": { description: "No Content" },
        "401": { description: "Missing/invalid token" },
        "403": { description: "Forbidden (not admin)" },
        "404": { description: "Not found" },
      },
    },
  },

  // ---------------- ORDERS ----------------
  "/api/orders": {
    post: {
      tags: ["Orders"],
      summary: "Create order (customer/admin user token required)",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["items", "customer"],
              properties: {
                items: {
                  type: "array",
                  minItems: 1,
                  items: {
                    type: "object",
                    required: ["productId", "qty"],
                    properties: {
                      productId: { type: "string", example: "65f0c7d2a4b1c2d3e4f5a678" },
                      qty: { type: "number", example: 2 },
                    },
                  },
                },
                customer: {
                  type: "object",
                  required: ["fullName", "phone", "address"],
                  properties: {
                    fullName: { type: "string", example: "Ruvi Redner" },
                    phone: { type: "string", example: "050-1234567" },
                    address: { type: "string", example: "Tel Aviv, Dizengoff 10" },
                    notes: { type: "string", example: "Ring the bell", nullable: true },
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        "201": { description: "Created", content: { "application/json": { schema: OrderSchema } } },
        "401": { description: "Missing/invalid token" },
        "400": { description: "Validation error / invalid productId" },
      },
    },
  },

  "/api/orders/my": {
    get: {
      tags: ["Orders"],
      summary: "Get my orders",
      responses: {
        "200": { description: "OK", content: { "application/json": { schema: { type: "array", items: OrderSchema } } } },
        "401": { description: "Missing/invalid token" },
      },
    },
  },

  "/api/orders/admin/all": {
    get: {
      tags: ["Admin"],
      summary: "Admin: list all orders",
      description: "Admin only",
      responses: {
        "200": { description: "OK", content: { "application/json": { schema: { type: "array", items: OrderSchema } } } },
        "401": { description: "Missing/invalid token" },
        "403": { description: "Forbidden (not admin)" },
      },
    },
  },

  "/api/orders/admin/{id}/status": {
    patch: {
      tags: ["Admin"],
      summary: "Admin: update order status",
      description: "Admin only",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["status"],
              properties: {
                status: {
                  type: "string",
                  enum: ["NEW", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELED"],
                  example: "SHIPPED",
                },
              },
            },
          },
        },
      },
      responses: {
        "200": { description: "OK", content: { "application/json": { schema: OrderSchema } } },
        "401": { description: "Missing/invalid token" },
        "403": { description: "Forbidden (not admin)" },
        "404": { description: "Order not found" },
      },
    },
  },
};
