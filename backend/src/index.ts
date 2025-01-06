import createApp from "./app";
import keys from "./config/keys";
import { swaggerDocs, swaggerUiMiddleware } from "./config/swagger";

const app = createApp();

app.use("/api-docs", swaggerUiMiddleware, swaggerDocs);

app.listen(keys.app.port, () => {
  console.log(`🚀 Server running on http://localhost:${keys.app.port}`);
});
