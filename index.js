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
  for (const g of games) {
    try {
      await Schema.create(g);
      console.log(`${g.title} 👌`);
    } catch (error) {
      console.log(`${g.title} ❌`);
    }
  }
  mongoose.connection.close();
}

main()
  .then(() => console.log(`we are done 😊!`))
  .catch((err) => console.error(`error: `, err));
