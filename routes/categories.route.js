const { Router } = require("express");
const { check, validationResult } = require("express-validator");
const { connection } = require("../connectSQL");

const route = Router();

route.get("/", async (req, res) => {
  const data = await connection().query(
    "SELECT id , category_name FROM categories"
  );
  res.status(200).json({ data: data[0] });
});

route.get("/:id", async (req, res) => {
  const { id } = req.params;
  const data = await connection().query(
    "SELECT * FROM categories WHERE id=?",
    id
  );
  res.status(200).json({ data: data[0] });
});

route.post(
  "/",
  check("name", "Имя категории не может быть пустым").isLength({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array() });
    }

    const { name, description } = req.body;
    const data = await connection().query(
      "INSERT INTO categories (category_name,description) VALUES (? , ?)",
      [name, description]
    );

    const { insertId } = data[0];

    res.status(200).json({ name, description, id: insertId });
  }
);

route.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const data = await connection().query(
    "DELETE FROM categories WHERE id=?",
    id
  );
  res.status(200).json({ data });
});

route.put(
  "/:id",
  check("name", "Имя не может быть пустым").isLength({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const { id } = req.params;
    const { name, description } = req.body;

    const data = await connection().query(
      "UPDATE categories SET category_name=? ,description=? WHERE id = ? ",
      [name, description, id]
    );

    res.status(200).json({ id, name, description });
  }
);

module.exports = route;
