import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import {
	FoodTruckStatusBadge,
	badgeVariants,
	type FoodTruckStatus,
} from "./food-truck-status-badge";

describe("FoodTruckStatusBadge", () => {
	it("should render correct badge for variant", () => {
		for (const [status, { color, text }] of Object.entries(badgeVariants)) {
			const { getByText } = render(
				<FoodTruckStatusBadge status={status as FoodTruckStatus} />,
			);
			expect(getByText(text)).toBeInTheDocument();
			expect(getByText(text)).toHaveClass(color);
		}
	});
});
