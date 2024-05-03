import {
	completeUnsubscriptionSchema,
	subscriptionCreationSchema,
	subscriptionSchema,
	unsubscriptionSchema,
} from "../schemas/index.js";
import * as z from "zod";
import { db } from "./index.js";

type Subscription = z.infer<typeof subscriptionSchema>;

export function subscribe(params: z.infer<typeof subscriptionCreationSchema>): Promise<Subscription> {
	const validatedParams = subscriptionCreationSchema.parse(params);

	return new Promise((resolve, reject) => {
		db.get<Subscription>(
			"INSERT INTO subscriptions (email, industry, subcategory) VALUES (?, ?, ?) RETURNING *",
			[validatedParams.email, validatedParams.industry, validatedParams.subcategory],
			(err, row) => {
				if (err) reject(err);
				else resolve(row);
			},
		);
	});
}

export function unsubscribe(params: z.infer<typeof subscriptionCreationSchema>): Promise<Subscription | undefined> {
	const validatedParams = unsubscriptionSchema.parse(params);

	return new Promise((resolve, reject) => {
		db.get<Subscription>(
			"DELETE FROM subscriptions WHERE email = ? AND industry = ? AND subcategory = ? RETURNING *",
			[validatedParams.email, validatedParams.industry, validatedParams.subcategory],
			(err, row) => {
				if (err) reject(err);
				else resolve(row);
			},
		);
	});
}

export function unsubscribeFromAll(params: z.infer<typeof completeUnsubscriptionSchema>): Promise<Subscription[]> {
	const validatedParams = completeUnsubscriptionSchema.parse(params);

	return new Promise((resolve, reject) => {
		db.all<Subscription>(
			"DELETE FROM subscriptions WHERE email = ? RETURNING *",
			[validatedParams.email],
			(err, rows) => {
				if (err) reject(err);
				else resolve(rows);
			},
		);
	});
}
