require("dotenv").config();
const mongoose = require("mongoose");

const Xbox = require("./src/xbox");

mongoose.connect("mongodb://localhost/xbox");

const defaultURL = process.env.DEFAULT_URL;
const targetURL = process.env.TARGET_URL;
const date = new Date();

const Schema = mongoose.model(date.toISOString().slice(0, 10), {
  title: String,
  poster: String,
  price: Number,
  wholeSalePrice: Number,
});

async function main() {
  const xbox = new Xbox(defaultURL, targetURL);
  const games = await xbox.download();

  games.forEach(async (g) => {
    const schema = new Schema(g);
    const saved = await schema.save();
    console.log(saved)
  });
}

main().then();
