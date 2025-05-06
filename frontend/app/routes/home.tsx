import { Suspense, use } from "react";
import { useNavigation, useSearchParams } from "react-router";
import { FoodTruckAccordion } from "~/components/home/food-truck-accordion";
import { FoodTruckListFilters } from "~/components/home/food-truck-list-filters";
import { FoodTruckListPagination } from "~/components/home/food-truck-list-pagination";
import { FoodTruckListSkeleton } from "~/components/home/food-truck-list-skeleton";
import type { FoodTruckStatus } from "~/components/home/food-truck-status-badge";
import { Button } from "~/components/ui/button";
import {
	EmptyState,
	EmptyStateActions,
	EmptyStateDescription,
	EmptyStateTitle,
} from "~/components/ui/empty-state";
import { Typography } from "~/components/ui/typography";
import type { Route } from "./+types/home";

export interface FoodTruck {
	locationid: number;
	applicant: string;
	facility_type: string;
	location_description: string;
	address: string;
	food_items: string[];
	latitude: number;
	longitude: number;
	schedule: string;
	status: FoodTruckStatus;
	permit: string;
	days_hours: string;
	expiration_date: string;
}

interface LoaderData {
	food_trucks: FoodTruck[];
	total: number;
}

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "SF Food Trucks Finder" },
		{ name: "description", content: "Find food trucks in San Francisco" },
	];
}

export async function loader({ request }: Route.LoaderArgs) {
	const searchParams = new URL(request.url).searchParams;
	const result = getFoodTrucks(searchParams);
	const query = searchParams.get("query");
	const status = searchParams.get("status");
	return { result, query, status };
}

async function getFoodTrucks(
	searchParams: URLSearchParams,
): Promise<LoaderData> {
	const result = await fetch(
		`${import.meta.env.VITE_BACKEND_HOST}/foodtrucks${searchParams.toString() ? `?${searchParams.toString()}` : ""}`,
	);
	const data = await result.json();
	return data;
}

export default function Home({ loaderData }: Route.ComponentProps) {
	const { result, query, status } = loaderData;
	const navigation = useNavigation();
	const isLoading = navigation.state === "loading";

	return (
		<div className="space-y-8 p-6 bg-orange-50 h-[100vh] flex flex-col">
			<div className="space-y-2">
				<Typography
					variant="heading-2"
					weight="bold"
					color="accent"
					className="text-center"
					asChild
				>
					<h1>SF Food Trucks Finder</h1>
				</Typography>
				<Typography variant="subheadline" className="text-center">
					Discover delicious food trucks around San Francisco. Search by vendor
					name or street location.
				</Typography>
			</div>
			<FoodTruckListFilters
				query={query}
				status={status}
				isLoading={isLoading}
			/>
			<Suspense fallback={<FoodTruckListSkeleton />}>
				{isLoading ? (
					<FoodTruckListSkeleton />
				) : (
					<>
						<ListResult p={result} />
					</>
				)}
			</Suspense>
		</div>
	);
}

function ListResult({ p }: { p: Promise<LoaderData> }) {
	const { food_trucks, total } = use(p);
	const [_, setSearchParams] = useSearchParams();

	return total === 0 ? (
		<EmptyState>
			<EmptyStateTitle>No food trucks found</EmptyStateTitle>
			<EmptyStateDescription>
				No food trucks found in the area. Please try again with a different
				location.
			</EmptyStateDescription>
			<EmptyStateActions>
				<Button type="button" onClick={() => setSearchParams({})}>
					Clear filters
				</Button>
			</EmptyStateActions>
		</EmptyState>
	) : (
		<>
			<FoodTruckAccordion foodTrucks={food_trucks} />
			<FoodTruckListPagination total={total} />
		</>
	);
}
