const fs = require("fs");
const path = require("path");

const { pool, query } = require("./pool");

const seedPath = path.resolve(__dirname, "../../../database/seed.sql");

const run = async () => {
  if (!fs.existsSync(seedPath)) {
    throw new Error(`Seed file not found: ${seedPath}`);
  }

  const seedSql = fs.readFileSync(seedPath, "utf8").trim();

  if (!seedSql) {
    console.log("Seed file is empty. Nothing to run.");
    return;
  }

  await query(seedSql);
  console.log("Database seed completed successfully.");
};

run()
  .catch((error) => {
    console.error(`Database seed failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
