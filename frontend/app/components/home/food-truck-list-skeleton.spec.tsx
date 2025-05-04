import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { FoodTruckListSkeleton } from "./food-truck-list-skeleton";

describe("FoodTruckListSkeleton", () => {
  it("should render 10 skeleton items", () => {
    const { container } = render(<FoodTruckListSkeleton />);
    
    // Check if the container has the correct class
    expect(container.firstChild).toHaveClass("space-y-8");
    
    // Check if there are exactly 10 skeleton items
    const skeletons = container.querySelectorAll("[data-slot='skeleton']");
    expect(skeletons).toHaveLength(10);
  });

  it("should render skeleton items with correct dimensions", () => {
    const { container } = render(<FoodTruckListSkeleton />);
    
    const skeletons = container.querySelectorAll("[data-slot='skeleton']");
    for (const skeleton of skeletons) {
      expect(skeleton).toHaveClass("w-full", "h-28");
    }
  });
}); 