import "dotenv/config";


export const env = {
  port: Number(process.env.PORT ?? 4000),
  mongoUri: process.env.MONGO_URI ?? "mongodb+srv://ruby:7966@cluster0.xjvgc.mongodb.net/?appName=supermarketPro",
  jwtSecret: process.env.JWT_SECRET ?? "super-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",

  adminEmail: process.env.ADMIN_EMAIL ?? "admin@example.com",
  adminPassword: process.env.ADMIN_PASSWORD ?? "theHook7966",
  adminName: process.env.ADMIN_NAME ?? "Admin",
};
