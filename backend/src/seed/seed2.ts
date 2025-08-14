import { AppDataSource } from "../data-source";
import { Product } from "../entity/Product";

const sample: Array<Pick<Product, "article" | "name" | "price" | "quantity">> = Array.from({
	length: 120,
}).map((_, i) => ({
	article: `NB-${(i + 1).toString().padStart(3, "0")}`,
	name: `Товар ${i + 1}`,
	price: ((i + 1) * 10 + 0.99).toFixed(2) as unknown as any,
	quantity: (i * 3) % 17,
}));

export async function seedIfEmpty() {
	const repo = AppDataSource.getRepository(Product);
	const count = await repo.count();
	if (count > 0) return;
	await repo.createQueryBuilder().insert().into(Product).values(sample).execute();
	console.log(`Seeded ${sample.length} products`);
}
