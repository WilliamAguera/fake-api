const express = require("express");
const cors = require("cors");
const uuid = require("uuid/v1");
const { posts } = require("./db.json");

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;
const perPage = 5;

app.get("/posts", (_req, res) => {
  const page = _req.query.page || 1;
  const splitTo = page * perPage;
  const p = splitTo - perPage;

  let data = posts;
  data = posts.slice(p, splitTo);
  res.status(200).json({ data, total: posts.length });
});

// app.post("/posts", (req, res) => {
//   const author = req.body.author;
//   const post = req.body.post;
//   const id = uuid();

//   posts.push({
//     id,
//     author,
//     post,
//   });

//   res.status(201).json({
//     id,
//   });
// });

app.get("/posts/:id", (req, res) => {
  const id = req.params.id;

  const filtered = posts.find((q) => q.id == id);

  if (filtered) {
    res.status(200).json(filtered);
  } else {
    res.status(404).send("Not Found");
  }
});

app.delete("/posts/:id", (req, res) => {
  const id = req.params.id;

  const filtered = posts.filter((q) => q.id !== id);

  if (filtered.length === posts.length) {
    res.status(404).send("Not Found");
  } else {
    posts = filtered;
    res.status(204).end();
  }
});

app.patch("/posts/:id", (req, res) => {
  const id = req.params.id;

  const filtered = posts.filter((q) => q.id !== id);
  if (filtered.length !== posts.length) {
    const author = req.body.author;
    const quote = req.body.quote;

    filtered.push({
      id,
      author,
      quote,
    });

    posts = filtered;
    res.status(200).send("OK");
  } else {
    res.status(404).send("Not Found");
  }
});

app.listen(port, () => console.log(`Backend listening on port ${port}!`));
