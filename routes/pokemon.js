const express = require("express");
const router = express.Router();
const fs = require("fs");
const { validatePokemon, getAdjacentPokemon } = require("../utils/pokemon");

// Helper function to read Pokemon data
const readPokemonData = () => {
  const data = JSON.parse(fs.readFileSync("db.json"));
  return data.data;
};

// Helper function to write Pokemon data
const writePokemonData = (pokemons) => {
  const data = {
    data: pokemons,
    totalPokemons: pokemons.length,
  };
  fs.writeFileSync("db.json", JSON.stringify(data, null, 2));
};

// Get all Pokemons with optional filters
router.get("/", (req, res) => {
  try {
    const pokemons = readPokemonData();
    const { types, name, page = 1, limit = 20 } = req.query;

    let filteredPokemons = pokemons;

    if (types) {
      filteredPokemons = filteredPokemons.filter((p) =>
        p.types.map((t) => t.toLowerCase()).includes(types.toLowerCase())
      );
    }

    if (name) {
      filteredPokemons = filteredPokemons.filter((p) =>
        p.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    // Calculate pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedPokemons = filteredPokemons.slice(startIndex, endIndex);

    res.json({
      data: paginatedPokemons,
      total: filteredPokemons.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(filteredPokemons.length / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single Pokemon with previous and next
router.get("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const pokemons = readPokemonData();
    const result = getAdjacentPokemon(pokemons, id);

    if (!result) {
      return res.status(404).json({ error: "Pokemon not found" });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new Pokemon
router.post("/", (req, res) => {
  try {
    const newPokemon = req.body;
    const pokemons = readPokemonData();

    // Validate new Pokemon
    validatePokemon(newPokemon);

    // Check for existing Pokemon
    if (
      pokemons.some((p) => p.id === newPokemon.id || p.name === newPokemon.name)
    ) {
      throw new Error("The Pokémon exists.");
    }

    // Add new Pokemon
    pokemons.push(newPokemon);
    writePokemonData(pokemons);

    res.status(201).json(newPokemon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Pokemon
router.put("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updateData = req.body;
    const pokemons = readPokemonData();

    const pokemonIndex = pokemons.findIndex((p) => p.id === id);
    if (pokemonIndex === -1) {
      return res.status(404).json({ error: "Pokemon not found" });
    }

    // Merge existing Pokemon with update data
    const updatedPokemon = { ...pokemons[pokemonIndex], ...updateData };

    // Validate updated Pokemon
    validatePokemon(updatedPokemon);

    // Check if name is being changed and if it already exists
    if (
      updateData.name &&
      updateData.name !== pokemons[pokemonIndex].name &&
      pokemons.some((p) => p.name === updateData.name)
    ) {
      throw new Error("The Pokémon name already exists.");
    }

    pokemons[pokemonIndex] = updatedPokemon;
    writePokemonData(pokemons);

    res.json(updatedPokemon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Pokemon
router.delete("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const pokemons = readPokemonData();

    const pokemonIndex = pokemons.findIndex((p) => p.id === id);
    if (pokemonIndex === -1) {
      return res.status(404).json({ error: "Pokemon not found" });
    }

    pokemons.splice(pokemonIndex, 1);
    writePokemonData(pokemons);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
