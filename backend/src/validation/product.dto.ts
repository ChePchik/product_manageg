import { z } from "zod";

export const productCreateSchema = z.object({
	article: z.string().min(1, "Артикул обязателен"),
	name: z.string().min(1, "Название обязательно"),
	price: z.number({ error: "Цена должна быть числом" }).positive("Цена должна быть > 0"),
	quantity: z
		.number({ error: "Количество должно быть числом" })
		.min(0, "Количество должно быть ≥ 0")
		.int("Количество должно быть целым")
		.default(0),
});

export const productUpdateSchema = productCreateSchema.partial();

export type ProductCreateDto = z.infer<typeof productCreateSchema>;
export type ProductUpdateDto = z.infer<typeof productUpdateSchema>;
