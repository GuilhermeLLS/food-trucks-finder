import { beforeEach, describe, expect, it, vi } from "vitest";
import { FoodTruckListPagination } from "./food-truck-list-pagination";
import { renderWithRouter } from "~/lib/testing-router-wrapper";

describe("FoodTruckListPagination", () => {
	beforeEach(() => vi.clearAllMocks());

	it("should not render when total is 0", () => {
		const { container } = renderWithRouter(
			<FoodTruckListPagination total={0} />,
		);
		expect(container.querySelector("nav")).toBeInTheDocument();
		expect(container.querySelectorAll("li").length).toBe(0);
	});

	it("should render first page correctly when total is less than page size", () => {
		const { getByText, container } = renderWithRouter(
			<FoodTruckListPagination total={5} />,
		);

		// Should show only page 1
		expect(getByText("1")).toBeInTheDocument();

		expect(
			container.querySelector("button[aria-label='Go to previous page']"),
		).toBeNull();
		expect(
			container.querySelector("button[aria-label='Go to next page']"),
		).toBeNull();
	});

	it("should render first page correctly when total is more than page size", () => {
		const { getByText, container } = renderWithRouter(
			<FoodTruckListPagination total={25} />,
		);

		// Should show pages 1, 2, 3 and last page
		expect(getByText("1")).toBeInTheDocument();
		expect(getByText("2")).toBeInTheDocument();
		expect(getByText("3")).toBeInTheDocument();

		// Previous button should not be visible
		expect(
			container.querySelector("button[aria-label='Go to previous page']"),
		).toBeNull();

		// Next button should be visible
		expect(getByText("Next")).toBeInTheDocument();
	});

	it("should render middle page correctly", () => {
		const { getByText } = renderWithRouter(
			<FoodTruckListPagination total={50} />,
			{ route: "/?page=2" },
		);

		// Should show pages 1, 2, 3 and last page
		expect(getByText("1")).toBeInTheDocument();
		expect(getByText("2")).toBeInTheDocument();
		expect(getByText("3")).toBeInTheDocument();
		expect(getByText("5")).toBeInTheDocument(); // Last page

		// Both Previous and Next buttons should be visible
		expect(getByText("Previous")).toBeInTheDocument();
		expect(getByText("Next")).toBeInTheDocument();
	});

	it("should render last page correctly", () => {
		const { getByText, container } = renderWithRouter(
			<FoodTruckListPagination total={50} />,
			{ route: "/?page=5" },
		);

		// Should show pages 1, 2, 3 and last page
		expect(getByText("1")).toBeInTheDocument();
		expect(getByText("2")).toBeInTheDocument();
		expect(getByText("3")).toBeInTheDocument();
		expect(getByText("5")).toBeInTheDocument(); // Last page

		// Previous button should be visible
		expect(getByText("Previous")).toBeInTheDocument();

		// Next button should not be visible
		expect(
			container.querySelector("button[aria-label='Go to next page']"),
		).toBeNull();
	});

	it("should handle invalid page number gracefully", () => {
		const { getByText } = renderWithRouter(
			<FoodTruckListPagination total={50} />,
			{ route: "/?page=invalid" },
		);

		// Should default to page 1
		expect(getByText("1")).toHaveAttribute("aria-current", "page");
	});
});
