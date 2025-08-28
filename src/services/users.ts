import { pool } from "../config/db";
import * as UserModel from "../models/users";
import { FIND_USER_BY_EMAIL, FIND_USER_BY_ID, INSERT_USER, INSERT_USER_TOKEN } from "../queries/users";

export async function checkUserExists(email: string) {
  const result = await pool.query(FIND_USER_BY_EMAIL, [email]);
  return result.rows[0];
};

export async function checkUserExistsById(id: string) {
  const result = await pool.query(FIND_USER_BY_ID, [id]);
  return result.rows[0];
};

export async function registerUser(firstname: string, lastname: string, username: string,email: string, password: string) {
  const result = await pool.query(INSERT_USER, [firstname, lastname, username, email, password]);
  return result.rows[0];
};

export async function insertToken(token: string, email: string) {
  const result = await pool.query(INSERT_USER_TOKEN, [token, email]);
  console.log("check service input token :", result)
  return result.rows[0]
}
