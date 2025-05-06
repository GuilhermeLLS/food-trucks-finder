import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "~/lib/utils";

const typographyVariants = cva("", {
	variants: {
		/**
		 * Variant of the typographic defining it's tagName, font size and font family.
		 */
		variant: {
			footnote: "text-xs font-sans",
			callout: "text-sm font-sans",
			body: "text-base font-sans",
			subheadline: "text-lg font-sans",
			"heading-6": "text-xl font-serif",
			"heading-5": "text-2xl font-serif",
			"heading-4": "text-3xl font-serif",
			"heading-3": "text-4xl font-serif",
			"heading-2": "text-5xl font-serif",
			"heading-1": "text-6xl font-serif",
		},
		weight: {
			regular: "font-normal",
			medium: "font-medium",
			bold: "font-bold",
		},
		color: {
			primary: "text-gray-900 dark:text-gray-200",
			secondary: "text-gray-600 dark:text-gray-400",
			accent: "text-accent",
		},
	},
	defaultVariants: {
		variant: "body",
		weight: "regular",
		color: "primary",
	},
});

const tagsByVariant: Record<NonNullable<TypographyProps["variant"]>, string> = {
	footnote: "small",
	callout: "p",
	body: "p",
	subheadline: "h2",
	"heading-6": "h6",
	"heading-5": "h5",
	"heading-4": "h4",
	"heading-3": "h3",
	"heading-2": "h2",
	"heading-1": "h1",
};

export interface TypographyProps
	extends Omit<React.HTMLAttributes<HTMLParagraphElement>, "color">,
		VariantProps<typeof typographyVariants> {
	asChild?: boolean;
	className?: string;
}

export const Typography = React.forwardRef<
	HTMLParagraphElement,
	TypographyProps
>(
	(
		{
			className,
			variant,
			weight,
			color,
			asChild = false,
			...props
		}: TypographyProps,
		ref: React.ForwardedRef<HTMLParagraphElement>,
	) => {
		const Comp = asChild ? Slot : tagsByVariant[variant ?? "body"];
		return (
			<Comp
				className={cn(
					typographyVariants({ variant, weight, color, className }),
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);

Typography.displayName = "Typography";
