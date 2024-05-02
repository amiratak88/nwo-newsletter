import * as z from "zod";

export const subscriptionSchema = z.object({
	id: z.string().uuid(),
	email: z.string().email(),
	industry: z.enum(["consumer health", "beauty", "tech"]),
	subcategory: z.enum(["new product releases", "mergers and acquisitions"]),
});
export const subscriptionCreationSchema = subscriptionSchema.omit({ id: true });
export const unsubscriptionSchema = subscriptionCreationSchema;
export const completeUnsubscriptionSchema = z.object({ email: z.string().email() });
