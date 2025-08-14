import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/Product";
import { productCreateSchema, productUpdateSchema } from "../validation/product.dto";

const router = Router();

// GET /products?page=1&limit=50
router.get("/", async (req: Request, res: Response) => {
	const page = Math.max(parseInt(String(req.query.page || 1), 10) || 1, 1);
	const limitRaw = Math.max(parseInt(String(req.query.limit || 50), 10) || 50, 1);
	const limit = Math.min(limitRaw, 50); // не более 50 на страницу
	const skip = (page - 1) * limit;

	const repo = AppDataSource.getRepository(Product);
	const [items, total] = await repo.findAndCount({
		order: { id: "ASC" },
		take: limit,
		skip,
	});

	// price to number
	const data = items.map((p) => ({
		...p,
		price: Number(p.price),
	}));

	res.json({ data, total });
});

// POST /products
router.post("/", async (req: Request, res: Response) => {
	const parsed = productCreateSchema.safeParse(req.body);
	if (!parsed.success) {
		return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
	}
	const dto = parsed.data;

	const repo = AppDataSource.getRepository(Product);
	const product = repo.create({
		article: dto.article,
		name: dto.name,
		price: dto.price.toFixed(2),
		quantity: dto.quantity,
	});

	try {
		await repo.save(product);
		return res.status(201).json({ ...product, price: Number(product.price) });
	} catch (e: any) {
		if (e.code === "23505") {
			return res.status(409).json({ message: "Артикул уже существует" });
		}
		return res.status(500).json({ message: "Ошибка сохранения" });
	}
});

// PUT /products/:id
router.put("/:id", async (req: Request, res: Response) => {
	const id = Number(req.params.id);
	if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: "Некорректный id" });

	const parsed = productUpdateSchema.safeParse(req.body);
	if (!parsed.success) {
		return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
	}
	const dto = parsed.data;

	const repo = AppDataSource.getRepository(Product);
	const product = await repo.findOneBy({ id });
	if (!product) return res.status(404).json({ message: "Товар не найден" });

	if (dto.article !== undefined) product.article = dto.article;
	if (dto.name !== undefined) product.name = dto.name;
	if (dto.price !== undefined) product.price = dto.price.toFixed(2);
	if (dto.quantity !== undefined) product.quantity = dto.quantity;

	try {
		await repo.save(product);
		return res.json({ ...product, price: Number(product.price) });
	} catch (e: any) {
		if (e.code === "23505") {
			return res.status(409).json({ message: "Артикул уже существует" });
		}
		return res.status(500).json({ message: "Ошибка обновления" });
	}
});

// DELETE /products/:id
router.delete("/:id", async (req: Request, res: Response) => {
	const id = Number(req.params.id);
	if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: "Некорректный id" });
	const repo = AppDataSource.getRepository(Product);
	const result = await repo.delete(id);
	if (result.affected === 0) return res.status(404).json({ message: "Товар не найден" });
	return res.status(204).send();
});

export default router;
