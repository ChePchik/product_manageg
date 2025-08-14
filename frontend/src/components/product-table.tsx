import type { Product } from "../hooks/use-products";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Edit, Trash2 } from "lucide-react";

interface ProductTableProps {
	products: Product[];
	onEdit: (product: Product) => void;
	onDelete: (id: number) => void;
}

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("ru-RU").format(price);
	};

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className='w-16'>ID</TableHead>
					<TableHead>Название</TableHead>
					<TableHead>Артикул</TableHead>
					<TableHead className='text-right'>Цена</TableHead>
					<TableHead className='text-right'>Количество</TableHead>
					<TableHead className='w-32 text-center'>Действия</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{products.map((product) => (
					<TableRow key={product.id}>
						<TableCell className='font-medium'>{product.id}</TableCell>
						<TableCell>{product.name}</TableCell>
						<TableCell className='font-mono text-sm'>{product.article}</TableCell>
						<TableCell className='text-right'>{formatPrice(product.price)}</TableCell>
						<TableCell className='text-right'>{product.quantity}</TableCell>
						<TableCell>
							<div className='flex justify-center gap-2'>
								<Button
									variant='outline'
									size='sm'
									onClick={() => onEdit(product)}
									className='h-8 w-8 p-0'
								>
									<Edit className='h-4 w-4' />
								</Button>
								<Button
									variant='outline'
									size='sm'
									onClick={() => onDelete(product.id)}
									className='h-8 w-8 p-0 text-destructive hover:text-destructive'
								>
									<Trash2 className='h-4 w-4' />
								</Button>
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
