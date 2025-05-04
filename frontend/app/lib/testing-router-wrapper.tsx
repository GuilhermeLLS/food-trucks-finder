import {
	createMemoryRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router";
import { render } from "vitest-browser-react";
import { TooltipProvider } from "~/components/ui/tooltip";

export function renderWithRouter(ui: React.ReactElement, { route = "/" } = {}) {
	const router = createMemoryRouter(
		createRoutesFromElements(
			<Route path="*" element={<TooltipProvider>{ui}</TooltipProvider>} />,
		),
		{
			initialEntries: [route],
		},
	);
	return render(<RouterProvider router={router} />);
}
