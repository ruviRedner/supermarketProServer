import "dotenv/config";

function must(key: string) {
  const v = process.env[key];
  if (!v) throw new Error(`Missing env: ${key}`);
  return v;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  mongoUri: must("MONGO_URI"),
  jwtSecret: must("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",

  adminEmail: must("ADMIN_EMAIL"),
  adminPassword: must("ADMIN_PASSWORD"),
  adminName: process.env.ADMIN_NAME ?? "Admin",
};
