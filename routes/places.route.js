const { Router } = require("express");
const { check, validationResult } = require("express-validator");
const { connection } = require("../connectSQL");

const route = Router();

route.get("/", async (req, res) => {
  const data = await connection().query("SELECT id , place_name FROM places");
  res.status(200).json({ data: data[0] });
});

route.get("/:id", async (req, res) => {
  const { id } = req.params;
  const data = await connection().query("SELECT * FROM places WHERE id=?", id);
  res.status(200).json({ data: data[0] });
});

route.post(
  "/",
  check("name", "Имя локации не может быть пустым").isLength({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(200).json({ error: errors.array() });
    }

    const { name, description } = req.body;

    const data = await connection().query(
      "INSERT INTO places (place_name,description) VALUES(? , ?)",
      [name, description]
    );

    const { insertId } = data[0];

    res.status(200).json({ id: insertId, name, description });
  }
);

route.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const data = connection().query("DELETE FROM places WHERE id=?", id);
  res.status(200).json({ data });
});

route.put(
  "/:id",
  check("name", "Имя места не может быть пустым"),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    const { id } = req.params;
    const { name, description } = req.body;

    connection().query(
      "UPDATE places SET place_name=? , description=? WHERE id=?",
      [name, description, id],
      function(err, results) {
        console.log("Ya popal v etot block =======");
      }
    );

    res.status(200).json({ id, name, description });
  }
);

module.exports = route;
