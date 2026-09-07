import { app } from "./app.js";
import { config } from "./config/index.js";

app.listen(config.PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 FiverrGrowth Backend API Gateway Running!`);
  console.log(`📡 URL: http://localhost:${config.PORT}`);
  console.log(`📚 Swagger Docs: http://localhost:${config.PORT}/api/docs`);
  console.log(`=================================================`);
});
