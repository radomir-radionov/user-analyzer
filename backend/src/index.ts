import dotenv from "dotenv";
import createApp from "./app";
import { swaggerDocs, swaggerUiMiddleware } from "./config/swagger";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = createApp();

app.use("/api-docs", swaggerUiMiddleware, swaggerDocs);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
