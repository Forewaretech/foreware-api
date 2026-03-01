import "dotenv/config";

import app from "./app.js";

const PORT = process.env.PORT || 3030;
const HOST = process.env.HOST || "http://localhost";

app.listen(PORT, () => {
  console.log(`Server ready at: ${HOST}:${PORT}`);
});
