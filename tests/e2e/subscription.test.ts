import { describe, it, beforeEach } from "node:test";
import { cleanDb, when } from "../utils.js";
import request from "supertest";
import app from "../../src/app.js";
import { execAsync, getCount } from "../../src/db/index.js";
import { expect } from "expect";

beforeEach(cleanDb);

describe("subscription", () => {
	it("successfully subscribes to a newsletter", async () => {
		const response = await request(app)
			.post("/subscribe")
			.send({ email: "john.doe@example.org", industry: "tech", source: "news", subcategory: "new product releases" })
			.expect(201);

		expect(await getCount("subscriptions")).toBe(1);

		const subscription = response.body.subscription;

		expect(subscription).toEqual({
			id: expect.any(Number),
			email: "john.doe@example.org",
			industry: "tech",
			source: "news",
			subcategory: "new product releases",
		});
	});

	when("already subscribed to a newsletter", () => {
		beforeEach(async () => {
			await execAsync(
				"INSERT INTO subscriptions (email, industry, source, subcategory) VALUES ('john.doe@example.org', 'tech', 'news', 'new product releases')",
			);
		});

		it("does not subscribe to the same newsletter again", async () => {
			const response = await request(app)
				.post("/subscribe")
				.send({ email: "john.doe@example.org", industry: "tech", source: "news", subcategory: "new product releases" })
				.expect(422);

			expect(await getCount("subscriptions")).toBe(1);
			expect(response.body).toEqual({ error: "You are already subscribed to this newsletter!" });
		});

		it("can subscribe to a different newsletter", async () => {
			const response = await request(app)
				.post("/subscribe")
				.send({
					email: "john.doe@example.org",
					industry: "beauty",
					source: "news",
					subcategory: "new product releases",
				})
				.expect(201);

			expect(await getCount("subscriptions")).toBe(2);

			const subscription = response.body.subscription;

			expect(subscription).toEqual({
				id: expect.any(Number),
				email: "john.doe@example.org",
				industry: "beauty",
				source: "news",
				subcategory: "new product releases",
			});
		});
	});

	when("a required field is missing", async () => {
		it("does not create a subscription and returns a 422 error", async () => {
			const response = await request(app)
				.post("/subscribe")
				.send({ email: "john.doe@example.org", source: "news", subcategory: "new product releases" })
				.expect(422);

			expect(await getCount("subscriptions")).toBe(0);
			expect(response.body).toEqual({ errors: { _errors: [], industry: { _errors: ["Required"] } } });
		});
	});

	when("industry is invalid", async () => {
		it("does not create a subscription and returns a 422 error", async () => {
			const response = await request(app)
				.post("/subscribe")
				.send({
					email: "john.doe@example.org",
					industry: "some random industry",
					source: "news",
					subcategory: "new product releases",
				})
				.expect(422);

			expect(await getCount("subscriptions")).toBe(0);
			expect(response.body).toEqual({
				errors: {
					_errors: [],
					industry: {
						_errors: [
							"Invalid enum value. Expected 'consumer health' | 'beauty' | 'tech', received 'some random industry'",
						],
					},
				},
			});
		});
	});
});
