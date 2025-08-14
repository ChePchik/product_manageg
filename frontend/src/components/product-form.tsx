import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import type { Product } from "../hooks/use-products";

interface ProductFormProps {
	product?: Product | null;
	onSubmit: (product: Omit<Product, "id">) => void;
	onCancel: () => void;
}

interface FormErrors {
	name?: string;
	article?: string;
	price?: string;
	quantity?: string;
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
	const [formData, setFormData] = useState({
		name: "",
		article: "",
		price: "",
		quantity: "",
	});
	const [errors, setErrors] = useState<FormErrors>({});

	useEffect(() => {
		if (product) {
			setFormData({
				name: product.name,
				article: product.article,
				price: product.price.toString(),
				quantity: product.quantity.toString(),
			});
		} else {
			setFormData({
				name: "",
				article: "",
				price: "",
				quantity: "",
			});
		}
		setErrors({});
	}, [product]);

	const validateForm = (): boolean => {
		const newErrors: FormErrors = {};

		if (!formData.name.trim()) {
			newErrors.name = "Название обязательно для заполнения";
		}

		if (!formData.article.trim()) {
			newErrors.article = "Артикул обязателен для заполнения";
		}

		const price = Number.parseFloat(formData.price);
		if (!formData.price.trim()) {
			newErrors.price = "Цена обязательна для заполнения";
		} else if (isNaN(price)) {
			newErrors.price = "Цена должна быть числом";
		} else if (price < 0) {
			newErrors.price = "Цена не может быть отрицательной";
		}

		const quantity = Number.parseInt(formData.quantity);
		if (!formData.quantity.trim()) {
			newErrors.quantity = "Количество обязательно для заполнения";
		} else if (isNaN(quantity)) {
			newErrors.quantity = "Количество должно быть числом";
		} else if (quantity < 0) {
			newErrors.quantity = "Количество не может быть отрицательным";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (validateForm()) {
			onSubmit({
				name: formData.name.trim(),
				article: formData.article.trim(),
				price: Number.parseFloat(formData.price),
				quantity: Number.parseInt(formData.quantity),
			});
		}
	};

	const handleInputChange = (field: keyof typeof formData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-4'>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<div className='space-y-2'>
					<Label htmlFor='name'>Название</Label>
					<Input
						id='name'
						value={formData.name}
						onChange={(e) => handleInputChange("name", e.target.value)}
						className={errors.name ? "border-destructive" : ""}
						placeholder='Введите название товара'
					/>
					{errors.name && <p className='text-sm text-destructive'>{errors.name}</p>}
				</div>

				<div className='space-y-2'>
					<Label htmlFor='article'>Артикул</Label>
					<Input
						id='article'
						value={formData.article}
						onChange={(e) => handleInputChange("article", e.target.value)}
						className={errors.article ? "border-destructive" : ""}
						placeholder='Введите артикул'
					/>
					{errors.article && <p className='text-sm text-destructive'>{errors.article}</p>}
				</div>

				<div className='space-y-2'>
					<Label htmlFor='price'>Цена</Label>
					<Input
						id='price'
						type='number'
						step='0.01'
						min='0'
						value={formData.price}
						onChange={(e) => handleInputChange("price", e.target.value)}
						className={errors.price ? "border-destructive" : ""}
						placeholder='Введите цену'
					/>
					{errors.price && <p className='text-sm text-destructive'>{errors.price}</p>}
				</div>

				<div className='space-y-2'>
					<Label htmlFor='quantity'>Количество</Label>
					<Input
						id='quantity'
						type='number'
						min='0'
						value={formData.quantity}
						onChange={(e) => handleInputChange("quantity", e.target.value)}
						className={errors.quantity ? "border-destructive" : ""}
						placeholder='Введите количество'
					/>
					{errors.quantity && <p className='text-sm text-destructive'>{errors.quantity}</p>}
				</div>
			</div>

			<div className='flex gap-2 pt-4'>
				<Button type='submit'>{product ? "Сохранить изменения" : "Добавить товар"}</Button>
				<Button type='button' variant='outline' onClick={onCancel}>
					Отмена
				</Button>
			</div>
		</form>
	);
}
