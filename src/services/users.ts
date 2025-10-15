import { pool } from "../config/db";
import {
  FIND_USER_BY_EMAIL,
  FIND_USER_BY_ID,
  GET_TOKEN_BY_EMAIL,
  INSERT_USER,
  INSERT_USER_OTP,
  SET_PASSWORD,
  UPDATE_USER_TOKEN,
  UPDATE_VERIFY_STATUS,
} from "../queries/users";

export async function checkUserExists(email: string) {
  const result = await pool.query(FIND_USER_BY_EMAIL, [email]);
  return result.rows[0];
}

export async function checkUserExistsById(id: string) {
  const result = await pool.query(FIND_USER_BY_ID, [id]);
  return result.rows[0];
}

export async function registerUser(
  email: string,
  password: string,
  username: string
) {
  const result = await pool.query(SET_PASSWORD, [email, password, username]);
  return result.rows[0];
}

export async function insertToken(token: string, email: string) {
  const result = await pool.query(UPDATE_USER_TOKEN, [token, email]);
  return result.rows[0];
}

export async function insertOtp(
  email: string,
  otp: string,
  expired: Date
  // username: string,
  // firstname: string,
  // lastname: string
) {
  const result = await pool.query(INSERT_USER_OTP, [
    email,
    otp,
    expired,
    // username,
    // firstname,
    // lastname,
  ]);
  return result.rows[0];
}

export async function getOtpByEmail(email: string) {
  const result = await pool.query(GET_TOKEN_BY_EMAIL, [email]);
  return result.rows[0];
}

export async function verificationUser(email: string) {
  const result = await pool.query(UPDATE_VERIFY_STATUS, [email]);
  return result.rows[0];
}
