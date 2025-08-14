import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import type { Product } from "../hooks/use-products";
import { ProductForm } from "./product-form";

interface ProductModalProps {
	isOpen: boolean;
	onClose: () => void;
	product?: Product | null;
	onSubmit: (product: Omit<Product, "id">) => void;
}

export function ProductModal({ isOpen, onClose, product, onSubmit }: ProductModalProps) {
	const handleSubmit = (productData: Omit<Product, "id">) => {
		onSubmit(productData);
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='sm:max-w-[600px]'>
				<DialogHeader>
					<DialogTitle>{product ? "Редактировать товар" : "Добавить товар"}</DialogTitle>
				</DialogHeader>
				<ProductForm product={product} onSubmit={handleSubmit} onCancel={onClose} />
			</DialogContent>
		</Dialog>
	);
}
