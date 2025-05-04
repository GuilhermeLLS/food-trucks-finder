import { useSearchParams } from "react-router";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "~/components/ui/pagination";

export function FoodTruckListPagination({ total }: { total: number }) {
	const [searchParams] = useSearchParams();
	const searchPage = Number.parseInt(searchParams.get("page") ?? "1", 10);
	const activePage = Number.isSafeInteger(searchPage) ? searchPage : 1;
	const pageSize = 10;
	const pageCount = Math.ceil(total / pageSize);
	const pagesToShow = Math.min(pageCount, 3);
	const lastPage = pageCount > 3 ? pageCount : undefined;
	const pagesArray = Array.from(
		{ length: pagesToShow },
		(_, index) => index + 1,
	);
	const hasPreviousPage = activePage > 1;
	const hasNextPage = activePage < pageCount;

	return (
		<Pagination>
			<PaginationContent>
				{hasPreviousPage ? (
					<PaginationItem>
						<PaginationPrevious
							keepSearchParams
							to={`?page=${activePage - 1}`}
						/>
					</PaginationItem>
				) : null}
				{pagesArray.map((page) => (
					<PaginationItem key={`page-${page}`}>
						<PaginationLink
							keepSearchParams
							to={`?page=${page}`}
							isActive={page === activePage}
						>
							{page}
						</PaginationLink>
					</PaginationItem>
				))}
				{lastPage ? (
					<>
						<PaginationEllipsis />
						<PaginationItem key={`page-${lastPage}`}>
							<PaginationLink
								keepSearchParams
								to={`?page=${lastPage}`}
								isActive={lastPage === activePage}
							>
								{lastPage}
							</PaginationLink>
						</PaginationItem>
					</>
				) : null}
				{hasNextPage ? (
					<PaginationItem>
						<PaginationNext keepSearchParams to={`?page=${activePage + 1}`} />
					</PaginationItem>
				) : null}
			</PaginationContent>
		</Pagination>
	);
}
