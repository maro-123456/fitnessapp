const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Exercise = require("./models/Exercise");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connecté"))
.catch(err => console.log(err));

const exercises = [
  { name: "Bench Press", category: "chest", image: "https://i.imgur.com/benchpress.jpg" },
  { name: "Squat", category: "legs", image: "https://i.imgur.com/squat.jpg" },
  { name: "Deadlift", category: "back", image: "https://i.imgur.com/deadlift.jpg" },
  { name: "Bicep Curl", category: "arms", image: "https://i.imgur.com/bicep.jpg" },
  { name: "Crunch", category: "abs", image: "https://i.imgur.com/crunch.jpg" }
];

Exercise.insertMany(exercises)
  .then(() => {
    console.log("Exercices ajoutés !");
    mongoose.disconnect();
  })
  .catch(err => console.log(err));