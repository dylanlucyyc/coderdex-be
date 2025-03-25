require("dotenv").config();
const fs = require("fs");
const csv = require("csvtojson");

const url = process.env.MYURL;

const createPokemon = async () => {
  let newData = await csv().fromFile("Pokemon.csv");
  // Remove duplicates based on ID while preserving the full object structure
  newData = Array.from(new Set(newData.map((e) => e["#"])))
    .map((id) => newData.find((e) => e["#"] === id))
    .map((e) => ({
      id: e["#"],
      name: e.Name,
      type: [e["Type 1"], e["Type 2"]].filter(Boolean), // Remove null/undefined types
      url: url + "images/" + e["#"],
    }))
    .filter((e) => e.name);

  let data = JSON.parse(fs.readFileSync("db.json"));

  data = {
    data: newData,
    totalPokemons: newData.length, // Count after filtering
  };

  fs.writeFileSync("db.json", JSON.stringify(data, null, 2));
  console.log(data);
};

createPokemon();
