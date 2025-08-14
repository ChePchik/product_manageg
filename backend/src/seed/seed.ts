import "reflect-metadata";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/Product";

export async function run() {
	try {
		await AppDataSource.initialize();
		console.log("📦 Database connected");

		const repo = AppDataSource.getRepository(Product);

		// Удалим все старые товары
		await repo.clear();

		const products = Array.from({ length: 120 }).map((_, i) => {
			const product = new Product();
			product.article = `ART-${String(i + 1).padStart(3, "0")}`;
			product.name = `Товар ${i + 1}`;
			product.price = Math.floor(Math.random() * 1000) + 1 + "";
			product.quantity = Math.floor(Math.random() * 20);
			product.createdAt = new Date();
			return product;
		});

		await repo.save(products);

		console.log("Всё загрузилось");
		process.exit(0);
	} catch (err) {
		console.error("Ошибка ", err);
		process.exit(1);
	}
}

run();
