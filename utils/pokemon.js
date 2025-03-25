const pokemonTypes = [
  "bug",
  "dragon",
  "fairy",
  "fire",
  "ghost",
  "ground",
  "normal",
  "psychic",
  "steel",
  "dark",
  "electric",
  "fighting",
  "flying",
  "grass",
  "ice",
  "poison",
  "rock",
  "water",
];

const validatePokemon = (pokemon) => {
  // Check for required fields
  if (!pokemon.name || !pokemon.id || !pokemon.type || !pokemon.url) {
    throw new Error("Missing required data.");
  }

  // Check types length
  if (
    !Array.isArray(pokemon.type) ||
    pokemon.type.length === 0 ||
    pokemon.type.length > 2
  ) {
    throw new Error("Pokémon can only have one or two types.");
  }

  // Validate each type
  pokemon.type.forEach((type) => {
    if (!pokemonTypes.includes(type.toLowerCase())) {
      throw new Error("Pokémon's type is invalid.");
    }
  });

  return true;
};

const getPokemonById = (pokemons, id) => {
  return pokemons.find((p) => p.id === id);
};

const getAdjacentPokemon = (pokemons, currentId) => {
  // Convert currentId to string to match database format
  currentId = currentId.toString();

  // Get max ID after converting all IDs to numbers for proper comparison
  const maxId = Math.max(...pokemons.map((p) => parseInt(p.id)));
  const currentIndex = pokemons.findIndex((p) => p.id === currentId);

  if (currentIndex === -1) return null;

  // Calculate previous and next IDs
  const prevId =
    currentId === "1" ? maxId.toString() : (parseInt(currentId) - 1).toString();
  const nextId =
    parseInt(currentId) === maxId ? "1" : (parseInt(currentId) + 1).toString();

  return {
    previousPokemon: pokemons.find((p) => p.id === prevId),
    pokemon: pokemons[currentIndex],
    nextPokemon: pokemons.find((p) => p.id === nextId),
  };
};

module.exports = {
  pokemonTypes,
  validatePokemon,
  getPokemonById,
  getAdjacentPokemon,
};
