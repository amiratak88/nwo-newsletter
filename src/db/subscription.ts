import {
	completeUnsubscriptionSchema,
	subscriptionCreationSchema,
	subscriptionSchema,
	unsubscriptionSchema,
} from "../schemas/index.js";
import * as z from "zod";
import { execAsync } from "./index.js";

type Subscription = z.infer<typeof subscriptionSchema>;

export async function subscribe(params: z.infer<typeof subscriptionCreationSchema>): Promise<Subscription> {
	const validatedParams = subscriptionCreationSchema.parse(params);

	const subscriptions = await execAsync<Subscription>(
		"INSERT INTO subscriptions (email, industry, source, subcategory) VALUES (?, ?, ?, ?) RETURNING *",
		[validatedParams.email, validatedParams.industry, validatedParams.source, validatedParams.subcategory],
	);

	return subscriptions[0];
}

export async function unsubscribe(
	params: z.infer<typeof subscriptionCreationSchema>,
): Promise<Subscription | undefined> {
	const validatedParams = unsubscriptionSchema.parse(params);

	const subscriptions = await execAsync<Subscription>(
		"DELETE FROM subscriptions WHERE email = ? AND industry = ? AND source = ? AND subcategory = ? RETURNING *",
		[validatedParams.email, validatedParams.industry, validatedParams.source, validatedParams.subcategory],
	);

	return subscriptions[0];
}

export async function unsubscribeFromAll(
	params: z.infer<typeof completeUnsubscriptionSchema>,
): Promise<Subscription[]> {
	const validatedParams = completeUnsubscriptionSchema.parse(params);

	const subscriptions = await execAsync<Subscription>("DELETE FROM subscriptions WHERE email = ? RETURNING *", [
		validatedParams.email,
	]);

	return subscriptions;
}
