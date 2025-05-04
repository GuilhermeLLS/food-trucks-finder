import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/components/ui/accordion";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { BookOpen, Calendar, Clock, MapPin, Tag, Utensils } from "lucide-react";
import type { FoodTruck } from "~/routes/home";
import { FoodTruckStatusBadge } from "./food-truck-status-badge";
import { Typography } from "~/components/ui/typography";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "~/components/ui/tooltip";

export function FoodTruckAccordion({
	foodTrucks,
}: { foodTrucks: FoodTruck[] }) {
	const formatHours = (hours: string) => {
		if (!hours) return "Hours not available";
		return hours.replace(/;/g, " • ");
	};

	return (
		<Accordion type="multiple" className="space-y-4">
			{foodTrucks.map((truck) => {
				// Format food items for better readability
				const foodItems = truck.food_items
					? truck.food_items
							.split(":")
							.map((item: string) => item.trim())
							.filter(Boolean)
					: [];

				return (
					<AccordionItem
						key={`${truck.locationid}-${truck.permit}`}
						value={`${truck.locationid}-${truck.permit}`}
						className="overflow-hidden hover:shadow-md transition-shadow bg-white"
					>
						<AccordionTrigger className="hover:no-underline">
							<div className="flex flex-1 items-center justify-between pr-4">
								<div className="text-left">
									<Typography variant="body" weight="bold">
										{truck.applicant}
									</Typography>
									<div className="flex flex-wrap items-center gap-2 mt-1">
										<div className="flex items-center gap-1">
											<Tag size={14} className="text-orange-600" />
											<Typography variant="callout" color="secondary">
												{truck.facility_type || "Unknown Type"}
											</Typography>
										</div>
										<div className="flex items-center gap-1">
											<MapPin size={14} className="text-orange-600" />
											<Typography variant="callout" color="secondary">
												{truck.address || "Address not available"}
											</Typography>
										</div>
									</div>
								</div>
								<FoodTruckStatusBadge status={truck.status} />
							</div>
						</AccordionTrigger>
						<AccordionContent className="p-4">
							<div className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min">
									<DetailsItem title="Address" icon={<MapPin size={14} className="text-orange-600" />}>
										<Typography variant="callout">{truck.address}</Typography>
										{truck.location_description && (
											<Typography variant="callout" color="secondary">
												{truck.location_description}
											</Typography>
										)}
									</DetailsItem>

									<DetailsItem title="Hours" icon={<Clock size={14} className="text-orange-600" />}>
										<Typography variant="callout">
											{formatHours(truck.days_hours)}
										</Typography>
									</DetailsItem>

									<DetailsItem title="Permit Expiration" icon={<Calendar size={14} className="text-orange-600" />}>
										<Typography variant="callout">
											{new Date(truck.expiration_date).toLocaleDateString()}
										</Typography>
									</DetailsItem>

									<DetailsItem title="Food Items" icon={<Utensils size={14} className="text-orange-600" />}>
										{foodItems.length ? (
											<div className="flex items-center flex-wrap gap-2">
												{foodItems.map((item, index) => (
													<Tooltip key={`${truck.locationid}-${item}-${index}`}>
														<TooltipTrigger>
															<Badge
																variant="outline"
																className="max-w-48 justify-start"
															>
																<Typography
																	variant="footnote"
																	className="text-ellipsis whitespace-nowrap overflow-hidden"
																>
																	{item}
																</Typography>
															</Badge>
														</TooltipTrigger>
														<TooltipContent>
															<Typography
																variant="callout"
																className="text-white"
															>
																{item}
															</Typography>
														</TooltipContent>
													</Tooltip>
												))}
											</div>
										) : (
											<Typography variant="callout" color="secondary">
												No food items available
											</Typography>
										)}
									</DetailsItem>

									<DetailsItem title="Permit Number" icon={<BookOpen size={14} className="text-orange-600" />}>
										<Typography variant="callout">{truck.permit}</Typography>
									</DetailsItem>
								</div>

								<div className="flex flex-wrap gap-2">
									<Button variant="outline" size="sm" asChild>
										<a
											href={truck.schedule}
											target="_blank"
											rel="noopener noreferrer"
										>
											<Calendar size={14} className="text-orange-600" /> View
											Schedule
										</a>
									</Button>
									<Button variant="outline" size="sm" asChild>
										<a
											href={`https://www.google.com/maps/search/?api=1&query=${truck.latitude},${truck.longitude}`}
											target="_blank"
											rel="noopener noreferrer"
										>
											<MapPin size={14} className="text-orange-600" /> View on
											Map
										</a>
									</Button>
								</div>
							</div>
						</AccordionContent>
					</AccordionItem>
				);
			})}
		</Accordion>
	);
}

interface DetailsItemProps extends React.PropsWithChildren {
	title: string;
	icon: React.ReactNode;	
}

function DetailsItem({ title, icon, children }: DetailsItemProps) {
	return (
		<div className="space-y-1">
			<div className="flex gap-2 items-center">
				{icon}
				<Typography variant="callout" weight="bold">
					{title}
				</Typography>
			</div>
			{children}
		</div>
	);
}
