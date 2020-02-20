const { Router } = require("express");
const { check, validationResult } = require("express-validator");
const { connection } = require("../connectSQL");
const upload = require("../multer");

const router = Router();

router.get("/", async (req, res) => {
  const data = await connection().query(
    "SELECT id , id_category , id_place, name FROM items"
  );
  res.status(200).json({ data: data[0] });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const data = await connection().query("SELECT * FROM items WHERE id=?", id);
  res.status(200).json({ data: data[0] });
});

router.post(
  "/",
  [
    upload.single("image"),
    check("name", "Имя предмета не может быть пустым").isLength({ min: 1 }),
    check("categoryId", "Номер категории не указан").isLength({ min: 1 }),
    check("placeId", "Номер места не указан").isLength({ min: 1 })
  ],
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    let filename = null;

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    if (req.file) {
      filename = req.file.filename;
    }

    const { name, categoryId, placeId, description } = req.body;

    const data = await connection().query(
      "INSERT INTO items (id_category , id_place , name , description , photo) VALUES(?,?,?,?,?)",
      [categoryId, placeId, name, description, filename]
    );

    const { insertId } = data[0];

    res.status(200).json({
      id: insertId,
      categoryId,
      placeId,
      name,
      description,
      photo: filename
    });
  }
);

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const data = await connection().query("DELETE FROM items WHERE id=?", id);
  res.status(200).json({ data });
});

router.put(
  "/:id",
  [
    upload.single("image"),
    check("name", "Имя предмета не может быть пустым").isLength({ min: 1 }),
    check("categoryId", "Номер категории не указан").isLength({ min: 1 }),
    check("placeId", "Номер места не указан").isLength({ min: 1 })
  ],
  async (req, res) => {
    const { id } = req.params;
    let filename = null;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    if (req.file) {
      filename = req.file.filename;
    }

    const { name, categoryId, placeId, description } = req.body;

    await connection().query(
      "UPDATE items SET name=? , id_category=? , id_place=? , description=? , photo=? WHERE id=?",
      [name, categoryId, placeId, description, filename, id]
    );

    res
      .status(200)
      .json({ id, name, categoryId, placeId, description, filename });
  }
);

module.exports = router;
