import { describe, expect, it } from "vitest";
import { renderWithRouter } from "~/lib/testing-router-wrapper";
import { FoodTruckListFilters } from "./food-truck-list-filters";

describe("FoodTruckListFilters", () => {
	it("should render with default values", () => {
		const { getByRole, container } = renderWithRouter(
			<FoodTruckListFilters query={null} status={null} isLoading={false} />,
		);

		// Check if the search input is rendered with empty value
		const searchInput = getByRole("textbox", { name: "Search" });
		expect(searchInput).toBeInTheDocument();
		expect(searchInput).toHaveValue("");

		// Check if the status select is rendered with 'all' value
		const statusSelect = container.querySelector('select[name="status"]');
		expect(statusSelect).toBeInTheDocument();
		expect(statusSelect).toHaveValue("all");
	});

	it("should render with provided values", () => {
		const { container } = renderWithRouter(
			<FoodTruckListFilters
				query="test query"
				status="approved"
				isLoading={false}
			/>,
		);

		// Check if the search input has the provided value
		const searchInput = container.querySelector('input[name="query"]');
		expect(searchInput).toBeInTheDocument();
		expect(searchInput).toHaveValue("test query");

		// Check if the status select has the provided value
		const statusSelect = container.querySelector('select[name="status"]');
		expect(statusSelect).toBeInTheDocument();
		expect(statusSelect).toHaveValue("approved");
	});

	it("should handle loading state", () => {
		const { container } = renderWithRouter(
			<FoodTruckListFilters query={null} status={null} isLoading={true} />,
		);

		// Check if the status select is disabled during loading
		const statusSelect = container.querySelector('select[name="status"]');
		expect(statusSelect).toHaveAttribute("disabled");
	});

	it("should render clear button for search input", () => {
		const { container } = renderWithRouter(
			<FoodTruckListFilters query="test" status={null} isLoading={false} />,
		);

		const clearButton = container.querySelector("button");
		expect(clearButton).toBeInTheDocument();
		expect(clearButton).toHaveClass("cursor-pointer", "hover:text-orange-600");
	});

	it("should render all status options", () => {
		const { container, getByText } = renderWithRouter(
			<FoodTruckListFilters query={null} status={null} isLoading={false} />,
		);

		// the default value should be "All"
		expect(
			container.querySelector("span[data-slot='select-value']"),
		).toBeInTheDocument();

		// Check if all status options are rendered
		expect(
			container.querySelector("select[name='status']"),
		).toBeInTheDocument();
		expect(getByText("Approved")).toBeInTheDocument();
		expect(getByText("Requested")).toBeInTheDocument();
		expect(getByText("Expired")).toBeInTheDocument();
		expect(getByText("Suspended")).toBeInTheDocument();
	});

	it("should render with correct form structure", () => {
		const { container } = renderWithRouter(
			<FoodTruckListFilters query={null} status={null} isLoading={false} />,
		);

		const form = container.querySelector("form");
		expect(form).toBeInTheDocument();
		expect(form).toHaveClass("flex", "md:flex-row", "flex-col", "gap-4");
		expect(form).toHaveAttribute("method", "get");
	});
});
