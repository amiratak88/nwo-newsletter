import sqlite3 from "sqlite3";

if (!process.env.DB) {
	throw Error("DB env variable must be provided");
}

export const db = new sqlite3.Database(process.env.DB);

export type Sqlite3Error = Error & {
	errno: number;
	code: string;
};

export function isSqlite3Error(e: unknown): e is Sqlite3Error {
	return e instanceof Error && "errno" in e && "code" in e;
}

export function execAsync<T = unknown>(query: string): Promise<T[]> {
	return new Promise((resolve, reject) => {
		db.all<T>(query, (err, rows) => {
			if (err) reject(err);
			else resolve(rows);
		});
	});
}

export async function getCount(tableName: string): Promise<number> {
	const countObjects = await execAsync<{ count: number }>(`SELECT COUNT(*) as count FROM ${tableName}`);

	return countObjects[0].count;
}
