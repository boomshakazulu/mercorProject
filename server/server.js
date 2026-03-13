const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const routes = require("./routes");

app.use(express.json());
app.use(cors());

app.get("/api", routes);

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
