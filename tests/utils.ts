import { execAsync } from "../src/db/index.js";
import { describe } from "node:test";

export async function cleanDb(): Promise<void> {
	const tables = await execAsync<{ name: string }>(
		"SELECT name FROM sqlite_master WHERE type = 'table' AND name != 'sqlite_sequence'",
	);
	const tableNames = tables.map((t) => t.name);

	await Promise.all(tableNames.map((tn) => execAsync(`DELETE FROM ${tn}`)));
}

type SuiteFn = NonNullable<Parameters<typeof describe>[0]>;

export function when(name: string, fn: SuiteFn): ReturnType<typeof describe> {
	return describe(`when ${name}`, fn);
}
