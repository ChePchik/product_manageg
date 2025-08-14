import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
	type: "postgres",
	host: process.env.DB_HOST || "dbpostgres",
	port: Number(process.env.DB_PORT || 5432),
	username: process.env.DB_USER || "root",
	password: process.env.DB_PASSWORD || "root",
	database: process.env.DB_NAME || "postgres",
	synchronize: true, // use migrations
	logging: false,
	entities: ["build/entity/*.js"],
	migrations: ["build/migration/*.js"],
});
