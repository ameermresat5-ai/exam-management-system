require("../config/env");

const { Pool } = require("pg");

const databaseUrl = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: databaseUrl,
});

const query = (text, params) => {
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is not set. Add it to backend/.env before using database features."
    );
  }

  return pool.query(text, params);
};

module.exports = {
  pool,
  query,
};
