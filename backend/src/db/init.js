const fs = require("fs");
const path = require("path");

const { pool, query } = require("./pool");

const schemaPath = path.resolve(__dirname, "../../../database/schema.sql");

const run = async () => {
  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema file not found: ${schemaPath}`);
  }

  const schemaSql = fs.readFileSync(schemaPath, "utf8").trim();

  if (!schemaSql) {
    throw new Error(`Schema file is empty: ${schemaPath}`);
  }

  await query(schemaSql);
  console.log("Database schema initialized successfully.");
};

run()
  .catch((error) => {
    console.error(`Database initialization failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
