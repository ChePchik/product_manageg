import { useState, useEffect, useMemo } from "react";

export interface Product {
	id: number;
	name: string;
	article: string;
	price: number;
	quantity: number;
}

const ITEMS_PER_PAGE = 5;
const API_URL = "http://localhost:3000/api";

export function useProducts() {
	const [products, setProducts] = useState<Product[]>([]);
	const [totalPages, setTotalPages] = useState(1);
	const [currentPage, setCurrentPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");

	// Получаем список товаров
	useEffect(() => {
		fetchProducts(currentPage);
	}, [currentPage]);

	const filteredProducts = useMemo(() => {
		if (!searchQuery.trim()) {
			return products;
		}

		const query = searchQuery.toLowerCase().trim();
		return products.filter(
			(product) =>
				product.name.toLowerCase().includes(query) || product.article.toLowerCase().includes(query),
		);
	}, [products, searchQuery]);

	const fetchProducts = async (page: number) => {
		try {
			setLoading(true);
			setError(null);
			const res = await fetch(`${API_URL}/products?page=${page}&limit=${ITEMS_PER_PAGE}`);
			if (!res.ok) throw new Error("Ошибка при получении товаров");
			const data = await res.json();
			setProducts(data.data);
			setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE));
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setLoading(false);
		}
	};

	const addProduct = async (productData: Omit<Product, "id">) => {
		const res = await fetch(`${API_URL}/products`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(productData),
		});
		if (res.ok) {
			fetchProducts(currentPage);
		}
	};

	const updateProduct = async (id: number, productData: Omit<Product, "id">) => {
		const res = await fetch(`${API_URL}/products/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(productData),
		});
		if (res.ok) {
			fetchProducts(currentPage);
		}
	};

	const deleteProduct = async (id: number) => {
		const res = await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
		if (res.ok) {
			// Если удалили последний товар на странице — сдвигаем назад
			if (products.length === 1 && currentPage > 1) {
				setCurrentPage(currentPage - 1);
			} else {
				fetchProducts(currentPage);
			}
		}
	};

	const getProduct = (id: number) => products.find((p) => p.id === id);

	const goToPage = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	const setSearch = (query: string) => {
		setSearchQuery(query);
		setCurrentPage(1); // Сбрасываем на первую страницу при поиске
	};

	const clearSearch = () => {
		setSearchQuery("");
		setCurrentPage(1);
	};

	const nextPage = () => {
		if (currentPage < totalPages) setCurrentPage((p) => p + 1);
	};

	const prevPage = () => {
		if (currentPage > 1) setCurrentPage((p) => p - 1);
	};

	return {
		products,
		currentPage,
		totalPages,
		loading,
		error,
		addProduct,
		updateProduct,
		deleteProduct,
		getProduct,
		goToPage,
		nextPage,
		prevPage,
		//
		setSearch,
		searchQuery,
		clearSearch,
		filteredProducts,
	};
}
