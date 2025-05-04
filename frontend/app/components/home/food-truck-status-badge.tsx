import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";
import type { FoodTruck } from "~/routes/home";

export type FoodTruckStatus = "APPROVED" | "REQUESTED" | "EXPIRED" | "SUSPEND";

export const badgeVariants: Record<
	FoodTruck["status"],
	{ color: string; text: string }
> = {
	APPROVED: { color: "bg-green-100 text-green-800", text: "Approved" },
	REQUESTED: { color: "bg-yellow-100 text-yellow-800", text: "Requested" },
	EXPIRED: { color: "bg-red-100 text-red-800", text: "Expired" },
	SUSPEND: { color: "bg-gray-100 text-gray-800", text: "Suspended" },
} as const;

interface FoodTruckStatusBadgeProps extends Pick<FoodTruck, "status"> {
	className?: string;
}

export function FoodTruckStatusBadge({
	status,
	className,
}: FoodTruckStatusBadgeProps) {
	const { color, text } = badgeVariants[status];
	return <Badge className={cn(color, className)}>{text}</Badge>;
}
