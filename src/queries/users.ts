export const FIND_USER_BY_EMAIL = `
  SELECT id, username, email, password
  FROM "users"
  WHERE email = $1
`;

export const FIND_USER_BY_ID = `
  SELECT id, username, email, password, firstname, lastname
  FROM "users"
  WHERE id = $1
`;

export const INSERT_USER = `
  INSERT INTO "users" (firstname, lastname, username, email, password)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING id, firstname, lastname, username, email
`;

export const INSERT_USER_TOKEN = `
  UPDATE "users"
  SET token = $1
  WHERE email = $2
  RETURNING id, username, email, token;
`;

