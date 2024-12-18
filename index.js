let express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
var methodOverride = require("method-override");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Setting up EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Sample data for posts
let posts = [
  {
    id: uuidv4(),
    title: "Post 1",
    content: "This is the content of Post 1",
    author: "John Doe",
    date: "2022-01-01",
  },
  {
    id: uuidv4(),
    title: "Post 2",
    content: "This is the content of Post 2",
    author: "Jane Smith",
    date: "2022-02-02",
  },
  {
    id: uuidv4(),
    title: "Post 3",
    content: "This is the content of Post 3",
    author: "Michael Johnson",
    date: "2022-03-03",
  },
];

// Routes
// Display all posts
app.get("/posts", (req, res) => {
  res.render("index.ejs", { posts });
});

// Form to create a new post
app.get("/posts/new", (req, res) => {
  res.render("new.ejs");
});

// Create a new post
app.post("/posts", (req, res) => {
  let { title, content, author, date } = req.body;
  let id = uuidv4();
  posts.push({ id, title, content, author, date });
  res.redirect("/posts");
});

// Display a single post
app.get("/posts/:id", (req, res) => {
  let { id } = req.params;
  let post = posts.find((post) => id === post.id);
  if (!post) {
    return res.render("error.ejs");
  }
  res.render("show.ejs", { post });
});

// Edit a post
app.get("/posts/:id/edit", (req, res) => {
  let { id } = req.params;
  let post = posts.find((post) => id === post.id);
  res.render("edit.ejs", { post });
});

// Update a post
app.patch("/posts/:id", (req, res) => {
  let { id } = req.params;
  let newTitle = req.body.title;
  let newContent = req.body.content;
  let post = posts.find((post) => id === post.id);
  post.title = newTitle;
  post.content = newContent;
  res.redirect("/posts");
});

// Delete a post
app.delete("/posts/:id", (req, res) => {
  let { id } = req.params;
  posts = posts.filter((post) => id !== post.id);
  res.redirect("/posts");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
