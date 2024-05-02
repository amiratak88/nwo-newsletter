import express from "express";

const app = express();

app.get("/test", (req, res) => {
	res.status(200).json({ a: "yo" }).end();
});

app.listen(3000, () => {
	console.log("Express server started on port 3000");
});
