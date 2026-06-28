const bcrypt = require("bcryptjs");

const { query } = require("../db/pool");
const { signToken } = require("../utils/jwt");

const PASSWORD_SALT_ROUNDS = 12;

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const toUserResponse = (user) => ({
  id: user.id,
  fullName: user.full_name,
  email: user.email,
  role: user.role,
  isActive: user.is_active,
  createdAt: user.created_at,
  updatedAt: user.updated_at,
});

const findUserByEmail = async (email) => {
  const result = await query(
    `SELECT id, full_name, email, password_hash, role, is_active, created_at, updated_at
     FROM users
     WHERE email = $1`,
    [email]
  );

  return result.rows[0] || null;
};

const register = async ({ fullName, email, password, role }) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw createError("Email is already registered.", 409);
  }

  const passwordHash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);

  try {
    const result = await query(
      `INSERT INTO users (full_name, email, password_hash, role)
       VALUES ($1, $2, $3, $4::user_role)
       RETURNING id, full_name, email, role, is_active, created_at, updated_at`,
      [fullName, email, passwordHash, role || "STUDENT"]
    );

    const user = toUserResponse(result.rows[0]);
    const token = signToken(user);

    return {
      user,
      token,
    };
  } catch (error) {
    if (error.code === "23505") {
      throw createError("Email is already registered.", 409);
    }

    throw error;
  }
};

const login = async ({ email, password }) => {
  const userWithPassword = await findUserByEmail(email);

  if (!userWithPassword) {
    throw createError("Invalid email or password.", 401);
  }

  if (!userWithPassword.is_active) {
    throw createError("User account is inactive.", 403);
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    userWithPassword.password_hash
  );

  if (!isPasswordValid) {
    throw createError("Invalid email or password.", 401);
  }

  const user = toUserResponse(userWithPassword);
  const token = signToken(user);

  return {
    user,
    token,
  };
};

const getCurrentUser = async (userId) => {
  const result = await query(
    `SELECT id, full_name, email, role, is_active, created_at, updated_at
     FROM users
     WHERE id = $1`,
    [userId]
  );

  const user = result.rows[0];

  if (!user) {
    throw createError("Authenticated user was not found.", 404);
  }

  if (!user.is_active) {
    throw createError("User account is inactive.", 403);
  }

  return toUserResponse(user);
};

module.exports = {
  register,
  login,
  getCurrentUser,
};
