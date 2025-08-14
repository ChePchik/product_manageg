import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
	const handlePrevious = () => {
		if (currentPage > 1) {
			onPageChange(currentPage - 1);
		}
	};

	const handleNext = () => {
		if (currentPage < totalPages) {
			onPageChange(currentPage + 1);
		}
	};

	return (
		<div className='flex items-center justify-center gap-4'>
			<Button
				variant='outline'
				onClick={handlePrevious}
				disabled={currentPage === 1}
				className='flex items-center gap-2 bg-transparent'
			>
				<ChevronLeft className='h-4 w-4' />
				Назад
			</Button>

			<span className='text-sm text-muted-foreground'>
				Страница {currentPage} из {totalPages}
			</span>

			<Button
				variant='outline'
				onClick={handleNext}
				disabled={currentPage === totalPages}
				className='flex items-center gap-2 bg-transparent'
			>
				Вперед
				<ChevronRight className='h-4 w-4' />
			</Button>
		</div>
	);
}
