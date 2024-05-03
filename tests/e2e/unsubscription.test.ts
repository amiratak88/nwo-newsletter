import { describe, it, beforeEach } from "node:test";
import { cleanDb } from "../utils.js";
import request from "supertest";
import app from "../../src/app.js";
import { execAsync, getCount } from "../../src/db/index.js";
import { expect } from "expect";

beforeEach(async () => {
	await cleanDb();
	await execAsync(
		`
    INSERT INTO subscriptions
      (email, industry, subcategory)
    VALUES
      ('john.doe@example.org', 'tech', 'new product releases'),
      ('john.doe@example.org', 'beauty', 'new product releases')
    `,
	);
});

describe("unsubscribing from a single newsletter", () => {
	it("successfully unsubscribes from the specified newsletter", async () => {
		const response = await request(app)
			.post("/unsubscribe")
			.send({ email: "john.doe@example.org", industry: "tech", subcategory: "new product releases" })
			.expect(200);

		expect(await getCount("subscriptions")).toBe(1);

		const subscription = response.body.subscription;

		expect(subscription).toEqual({
			id: expect.any(Number),
			email: "john.doe@example.org",
			industry: "tech",
			subcategory: "new product releases",
		});
	});

	it("returns an error when unsubscribing from a non-existing subscription", async () => {
		const response = await request(app)
			.post("/unsubscribe")
			.send({ email: "john.doe@example.org", industry: "tech", subcategory: "mergers and acquisitions" })
			.expect(422);

		expect(await getCount("subscriptions")).toBe(2);
		expect(response.body).toEqual({ error: "Already unsubscribed!" });
	});
});

describe("unsubscribing from all newsletters", () => {
	it("successfully unsubscribes from all newsletters", async () => {
		const response = await request(app)
			.post("/unsubscribe_from_all")
			.send({ email: "john.doe@example.org" })
			.expect(200);

		expect(await getCount("subscriptions")).toBe(0);

		const subscriptions = response.body.subscriptions;

		expect(subscriptions).toContainEqual({
			id: expect.any(Number),
			email: "john.doe@example.org",
			industry: "tech",
			subcategory: "new product releases",
		});

		expect(subscriptions).toContainEqual({
			id: expect.any(Number),
			email: "john.doe@example.org",
			industry: "beauty",
			subcategory: "new product releases",
		});
	});
});
