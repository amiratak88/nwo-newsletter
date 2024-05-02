import express from "express";
import { completeUnsubscriptionSchema, subscriptionCreationSchema, unsubscriptionSchema } from "./schemas/index.js";
import { ZodError } from "zod";
import { isSqlite3Error, subscribe, unsubscribe, unsubscribeFromAll } from "./db/index.js";

const app = express();

app.use(express.json());

app.post("/subscribe", async (req, res) => {
	try {
		const params = subscriptionCreationSchema.parse(req.body);
		const subscription = await subscribe(params);

		res.status(201).json({ subscription });
	} catch (e) {
		if (e instanceof ZodError) {
			handleZodError(e, res);
		} else if (isSqlite3Error(e) && e.errno === 19) {
			res.status(422).json({ error: "You are already subscribed to this newsletter!" });
		} else {
			handleUnknownError(e, res);
		}
	}
});

app.post("/unsubscribe", async (req, res) => {
	try {
		const params = unsubscriptionSchema.parse(req.body);
		const subscription = await unsubscribe(params);

		if (subscription) res.status(200).json({ subscription });
		else res.status(422).send("Already unsubscribed!");
	} catch (e) {
		if (e instanceof ZodError) {
			handleZodError(e, res);
		} else {
			handleUnknownError(e, res);
		}
	}
});

app.post("/unsubscribe_from_all", async (req, res) => {
	try {
		const params = completeUnsubscriptionSchema.parse(req.body);
		const subscriptions = await unsubscribeFromAll(params);

		res.status(200).json({ subscriptions });
	} catch (e) {
		if (e instanceof ZodError) {
			handleZodError(e, res);
		} else {
			handleUnknownError(e, res);
		}
	}
});

function handleZodError(e: ZodError, res: express.Response): void {
	res.status(422).json({ errors: e.format() });
}

function handleUnknownError(e: unknown, res: express.Response): void {
	console.error(e);
	res.status(500).send("Something went wrong! Please try again later.");
}

app.listen(3000, () => {
	console.log("Express server started on port 3000");
});
