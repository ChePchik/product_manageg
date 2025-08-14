// import * as express from "express";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import productrRouter from "./router/productRouter";

AppDataSource.initialize()
	.then(async () => {
		await AppDataSource.runMigrations(); // 1. применяем миграции
		const { seedIfEmpty } = await import("./seed/seed2");
		await seedIfEmpty();

		const app = express();
		app.use(express.json());
		app.use(cors());
		// app.get("/", (req: Request, res: Response) => {
		// 	res.json("Hello world");
		// });
		app.use("/api/products", productrRouter);
		app.listen(3000);

		console.log("Express server has started on port 3000.");
	})
	.catch((error) => console.log(error));
