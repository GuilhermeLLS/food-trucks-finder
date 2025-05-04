import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { FoodTruckAccordion } from "./food-truck-accordion";
import type { FoodTruck } from "~/routes/home";

const mockFoodTrucks: FoodTruck[] = [
	{
		locationid: 1,
		applicant: "Test Food Applicant",
		facility_type: "Truck",
		address: "123 Test St",
		status: "APPROVED",
		food_items: "Hot Dogs:Burritos:Tacos",
		days_hours: "Mo-Fr: 9AM-5PM; Sa-Su: 10AM-6PM",
		expiration_date: "2024-12-31",
		permit: "PERMIT123",
		schedule: "https://example.com/schedule",
		latitude: 37.7749,
		longitude: -122.4194,
		location_description: "Near the park",
	},
	{
		locationid: 2,
		applicant: "Another Food Applicant",
		facility_type: "Push Cart",
		address: "456 Test Ave",
		status: "REQUESTED",
		food_items: "Ice Cream:Sandwiches",
		days_hours: "Mo-Su: 11AM-8PM",
		expiration_date: "2024-06-30",
		permit: "PERMIT456",
		schedule: "https://example.com/schedule2",
		latitude: 37.7833,
		longitude: -122.4167,
		location_description: "Downtown area",
	},
];

describe("FoodTruckAccordion", () => {
	it("should render empty accordion when no food trucks are provided", () => {
		const { container } = render(<FoodTruckAccordion foodTrucks={[]} />);
		expect(
			container.querySelectorAll("[data-slot='accordion-item']"),
		).toHaveLength(0);
	});

	it("should render correct number of accordion items", () => {
		const { container } = render(
			<FoodTruckAccordion foodTrucks={mockFoodTrucks} />,
		);
		expect(
			container.querySelectorAll("[data-slot='accordion-item']"),
		).toHaveLength(2);
	});

	it("should render food truck details correctly", async () => {
		const { getByText, container } = render(
			<FoodTruckAccordion foodTrucks={[mockFoodTrucks[0]]} />,
		);

		// Check header information
		expect(getByText("Test Food Applicant")).toBeInTheDocument();
		expect(getByText("Truck")).toBeInTheDocument();
		expect(getByText("123 Test St")).toBeInTheDocument();
		expect(getByText("Approved")).toBeInTheDocument();

		// Check expanded content
		const accordionItem = container.querySelector(
			"[data-slot='accordion-item']",
		);
		expect(accordionItem).toHaveClass(
			"overflow-hidden",
			"hover:shadow-md",
			"transition-shadow",
			"bg-white",
		);

		await getByText("Test Food Applicant").click();

		// Check food items
		expect(getByText("Hot Dogs")).toBeInTheDocument();
		expect(getByText("Burritos")).toBeInTheDocument();
		expect(getByText("Tacos")).toBeInTheDocument();

		// Check formatted hours
		expect(getByText("Mo-Fr: 9AM-5PM • Sa-Su: 10AM-6PM")).toBeInTheDocument();

		// Check permit expiration
		expect(
			getByText(new Date("2024-12-31").toLocaleDateString()),
		).toBeInTheDocument();

		// Check permit number
		expect(getByText("PERMIT123")).toBeInTheDocument();

		// Check location description
		expect(getByText("Near the park")).toBeInTheDocument();
	});

	it("should handle missing optional data gracefully", async () => {
		const incompleteTruck: FoodTruck = {
			locationid: 3,
			applicant: "Incomplete Truck",
			facility_type: "",
			address: "",
			status: "EXPIRED",
			food_items: "",
			days_hours: "",
			expiration_date: "2024-12-31",
			permit: "PERMIT789",
			schedule: "https://example.com/schedule3",
			latitude: 37.7833,
			longitude: -122.4167,
			location_description: "",
		};

		const { getByText } = render(
			<FoodTruckAccordion foodTrucks={[incompleteTruck]} />,
		);

		await getByText("Incomplete Truck").click();

		// Check fallback texts
		expect(getByText("Unknown Type")).toBeInTheDocument();
		expect(getByText("Address not available")).toBeInTheDocument();
		expect(getByText("Hours not available")).toBeInTheDocument();
		expect(getByText("No food items available")).toBeInTheDocument();
	});

	it("should render correct status badge for each status", () => {
		const trucksWithDifferentStatuses: FoodTruck[] = [
			{ ...mockFoodTrucks[0], status: "APPROVED" },
			{ ...mockFoodTrucks[0], status: "REQUESTED" },
			{ ...mockFoodTrucks[0], status: "EXPIRED" },
			{ ...mockFoodTrucks[0], status: "SUSPEND" },
		];

		const { getByText } = render(
			<FoodTruckAccordion foodTrucks={trucksWithDifferentStatuses} />,
		);

		expect(getByText("Approved")).toBeInTheDocument();
		expect(getByText("Requested")).toBeInTheDocument();
		expect(getByText("Expired")).toBeInTheDocument();
		expect(getByText("Suspended")).toBeInTheDocument();
	});

	it("should render correct action buttons with proper links", async () => {
		const { getByText, container } = render(
			<FoodTruckAccordion foodTrucks={[mockFoodTrucks[0]]} />,
		);

		await getByText("Test Food Applicant").click();

		const scheduleLink = container.querySelector(
			'a[href="https://example.com/schedule"]',
		);
		expect(scheduleLink).toBeInTheDocument();
		expect(scheduleLink).toHaveAttribute("target", "_blank");
		expect(scheduleLink).toHaveAttribute("rel", "noopener noreferrer");

		const mapLink = container.querySelector(
			'a[href="https://www.google.com/maps/search/?api=1&query=37.7749,-122.4194"]',
		);
		expect(mapLink).toBeInTheDocument();
		expect(mapLink).toHaveAttribute("target", "_blank");
		expect(mapLink).toHaveAttribute("rel", "noopener noreferrer");
	});
});
