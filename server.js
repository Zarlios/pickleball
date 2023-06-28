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

// Connect DB
mongoose
  .connect(
    "mongodb+srv://mdh0588:FD4jQmhtrsEzzgtp@cluster0.4lg1ztz.mongodb.net/?retryWrites=true&w=majority"
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
  res.render("register", { page_name: "register"});
})

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
    .then( (doc) => {
      console.log(doc._id.toString());
    })
    .catch( (error) => {
      console.log(error);
    });
  res.redirect("/")
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

async function getPickles() {
  const Pickles = await Pickle.find({});
  return Pickles;
}
