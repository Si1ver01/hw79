const express = require("express");

const mySql = require("./connectSQL");
const categoriesRoute = require("./routes/categories.route");
const placesRoute = require("./routes/places.route");
const itemsRoute = require("./routes/items.route");

const app = express();
const PORT = 8000;

app.use(express.json());
app.use("/categories", categoriesRoute);
app.use("/places", placesRoute);
app.use("/items", itemsRoute);

const start = async () => {
  await mySql.main();

  app.listen(PORT, () => {
    console.log(`Server start on port ${PORT}`);
  });
};

start();
