const express = require("express");
const cors = require("cors");
const pokemonRouter = require("./routes/pokemon");

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/pokemons", pokemonRouter);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to CoderDex API!");
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

app.listen(port, () => {
  console.log(`CoderDex API listening on port ${port}`);
});
