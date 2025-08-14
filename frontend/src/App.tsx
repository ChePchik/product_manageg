import { Plus } from "lucide-react";
import { useState } from "react";
import { Pagination } from "./components/paginations";
import { ProductModal } from "./components/product-modal";
import { ProductTable } from "./components/product-table";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { useProducts, type Product } from "./hooks/use-products";

export default function App() {
	const {
		products: currentProducts,
		currentPage,
		totalPages,
		addProduct,
		updateProduct,
		deleteProduct,
		goToPage,
	} = useProducts();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);

	const handleAddProduct = (productData: Omit<Product, "id">) => {
		addProduct(productData);
	};

	const handleEditProduct = (productData: Omit<Product, "id">) => {
		if (editingProduct) {
			updateProduct(editingProduct.id, productData);
			setEditingProduct(null);
		}
	};

	const handleDeleteProduct = (id: number) => {
		deleteProduct(id);
	};

	const openEditModal = (product: Product) => {
		setEditingProduct(product);
		setIsModalOpen(true);
	};

	const openAddModal = () => {
		setEditingProduct(null);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setEditingProduct(null);
	};

	return (
		<>
			<div className='container mx-auto p-6 max-w-6xl'>
				<div className='flex justify-between items-center mb-6'>
					<h1 className='text-3xl font-bold'>Управление товарами</h1>
					<Button onClick={openAddModal} className='flex items-center gap-2'>
						<Plus className='h-4 w-4' />
						Добавить товар
					</Button>
				</div>

				{/* <div className='mb-6'>
					<div className='relative max-w-md'>
						<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
						<Input
							placeholder='Поиск по названию или артикулу...'
							value={searchQuery}
							onChange={(e) => setSearch(e.target.value)}
							className='pl-10 pr-10'
						/>
						{searchQuery && (
							<Button
								variant='ghost'
								size='sm'
								onClick={clearSearch}
								className='absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0'
							>
								<X className='h-4 w-4' />
							</Button>
						)}
					</div>
					{searchQuery && (
						<p className='text-sm text-gray-600 mt-2'>Найдено товаров: {filteredProducts.length}</p>
					)}
				</div> */}

				<Card>
					<CardContent className='p-0'>
						<ProductTable
							products={currentProducts}
							onEdit={openEditModal}
							onDelete={handleDeleteProduct}
						/>
					</CardContent>
				</Card>

				{totalPages > 1 && (
					<div className='mt-6'>
						<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
					</div>
				)}

				<ProductModal
					isOpen={isModalOpen}
					onClose={closeModal}
					product={editingProduct}
					onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
				/>
			</div>
		</>
	);
}
