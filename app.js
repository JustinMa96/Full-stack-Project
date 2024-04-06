import express from "express";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "membership_management",
  password: "mjj19960301",
  port: 5432,
});
db.connect();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

let members = [];

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM members ORDER BY id ASC");
    members = result.rows;

    res.render("index.ejs", {
      pageTitle: "Membership Management System",
      members: members,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/addMember", async (req, res) => {
  const { name, gender, age, phone } = req.body;
  try {
    await db.query("INSERT INTO members (name, gender, age, phone) VALUES ($1, $2, $3, $4)", [name, gender, age, phone]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/deleteMember", async (req, res) => {
  const memberId = req.body.id;
  try {
    await db.query("DELETE FROM members WHERE id = $1", [memberId]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
