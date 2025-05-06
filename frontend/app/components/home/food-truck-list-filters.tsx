import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Form, useSubmit } from "react-router";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";

interface FoodTruckListFiltersProps {
	query: string | null;
	status: string | null;
	isLoading: boolean;
}

export function FoodTruckListFilters({
	query,
	status,
	isLoading,
}: FoodTruckListFiltersProps) {
	const submit = useSubmit();
	const inputRef = useRef<HTMLInputElement>(null);
	const formRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.value = query || "";
		}
	}, [query]);

	return (
		<Card>
			<CardContent>
				<Form
					ref={formRef}
					method="get"
					className="flex md:flex-row flex-col gap-4"
					onChange={() => {
						submit(formRef.current);
					}}
				>
					<Input
						name="query"
						ref={inputRef}
						type="text"
						defaultValue={query || ""}
						isLoading={isLoading}
						placeholder="Search by vendor or street name"
						endAdornment={
							<button
								type="button"
								className="cursor-pointer hover:text-accent"
								onClick={() => {
									if (inputRef.current) {
										inputRef.current.value = "";
										submit(formRef.current);
									}
								}}
							>
								<X size={16} />
							</button>
						}
					/>
					<Select
						name="status"
						defaultValue={status || "all"}
						disabled={isLoading}
					>
						<SelectTrigger
							className="md:w-auto w-full min-w-32"
							isLoading={isLoading}
						>
							<SelectValue placeholder="Select a status" />
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Status</SelectLabel>
									<SelectItem value="all">All</SelectItem>
									<SelectItem value="approved">Approved</SelectItem>
									<SelectItem value="requested">Requested</SelectItem>
									<SelectItem value="expired">Expired</SelectItem>
									<SelectItem value="suspend">Suspended</SelectItem>
								</SelectGroup>
							</SelectContent>
						</SelectTrigger>
					</Select>
				</Form>
			</CardContent>
		</Card>
	);
}
