const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", "./src/views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require("dotenv").config();

let password = process.env.password;

// Connect DB
mongoose
  .connect(
    "mongodb+srv://mdh0588:" +
      password +
      "@cluster0.4lg1ztz.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected!"));

const PickleSchema = new mongoose.Schema({
  name: String,
  email: String,
  phoneNumber: String,
  city: String,
});

const Pickle = mongoose.model("pickleball_registrar", PickleSchema);

app.use(express.static("assets"));

app.get("/", (req, res) => {
  getPickles().then((foundPickles) => {
    res.render("index", { foundPickles, page_name: "index" });
  });
});

app.get("/register", (req, res) => {
  res.render("register", { page_name: "register" });
});

app.get("/user/:id", (req, res) => {
  const id = req.params.id;

  console.log(id);
  getPickle(id).then((foundPickle) => {
    res.render("pickle", { foundPickle, page_name: "index" });
  });
});

app.get("/user/edit/:id", (req, res) => {
  const id = req.params.id;
  getPickle(id).then((foundPickle) => {
    res.render("edit", { foundPickle, page_name: "index" });
  });
});

app.post("/register", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;
  const city = req.body.city;

  const user = new Pickle({
    name,
    email,
    phoneNumber,
    city,
  });

  user
    .save()
    .then((doc) => {
      console.log(doc._id.toString());
      res.redirect("/user/" + doc._id);
    })
    .catch((error) => {
      console.log(error);
    });
  
});

app.post("/delete", (req, res) => {
  let _id = req.body.id;
  deletePickle(_id).then((results) => {
    if (results) {
      console.log("delete successful");
      res.redirect("/");
    } else {
      console.log("err");
    }
  });
});

app.post('/user/edit', (req, res) => {
  const id = req.body.id;

  Pickle.findById(id).then((pickle) => {
    pickle.name = req.body.name;
    pickle.email = req.body.email;
    pickle.phoneNumber = req.body.phoneNumber;
    pickle.city = req.body.city;
    pickle.save().then(() => {
      console.log("Updated")
      res.redirect(`/user/${id}`);
    })
  })

});



app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

async function getPickles() {
  const Pickles = await Pickle.find({});
  return Pickles;
}

async function deletePickle(_id) {
  const results = Pickle.findOneAndRemove({ _id: _id });
  return results;
}

async function getPickle(_id) {
  const Pickles = await Pickle.find({ _id: _id });
  return Pickles;
}
