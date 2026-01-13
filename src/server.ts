import { env } from "./config/env.js";
import { connectDb } from "./config/db.js";
import { createApp } from "./app.js";

async function main() {
  await connectDb();
  const app = createApp();

  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Server running on http://localhost:${env.port}`);
    console.log(`📚 Swagger at        http://localhost:${env.port}/api/docs`);
  });
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
