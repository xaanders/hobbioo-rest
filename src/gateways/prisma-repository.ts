export interface IPrismaRepository {
  executeSelect: <T>(query: string, params?: any[]) => Promise<T[]>;
  executeUpdate: (query: string, params?: any[]) => Promise<number>;
  executeInsert: <T>(query: string, params?: any[]) => Promise<T>;
}

/* Example usage:

executeSelect:
const query = "SELECT * FROM users WHERE status = $1 AND user_type = $2";
const params = [1, 2]; // status = 1 (active), user_type = 2 (admin)
const users = await executeSelect<User>(query, params);

executeUpdate:
const query = "UPDATE users SET status = $1, updated_at = $2 WHERE id = $3";
const params = [0, new Date(), "user-123"]; // status = 0 (inactive), current timestamp, user id
const affectedRows = await executeUpdate(query, params);

executeInsert:
const query = "INSERT INTO users (id, first_name, last_name, email, user_type, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *";
const params = ["user-456", "John", "Doe", "john@example.com", 1, 1, new Date(), new Date()];
const newUser = await executeInsert<User>(query, params);
*/
