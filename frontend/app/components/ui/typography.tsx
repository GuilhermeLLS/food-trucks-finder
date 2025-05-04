import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
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
			"display-3": "text-7xl font-serif",
			"display-2": "text-8xl font-serif",
			"display-1": "text-9xl font-serif",
		},
		/**
		 * Indicate the typographic font weight.
		 */
		weight: {
			thin: "font-thin",
			light: "font-light",
			regular: "font-normal",
			medium: "font-medium",
			bold: "font-bold",
			heavy: "font-heavy",
			"grand-heavy": "font-grand-heavy",
		},
		/**
		 * Indicate the typographic color.
		 */
		color: {
			primary: "text-gray-900 dark:text-gray-200",
			secondary: "text-gray-600 dark:text-gray-400",
			tertiary: "text-gray-500 dark:text-gray-300",
			accent: "text-accent",
			danger: "text-danger",
			success: "text-success-60 dark:text-success-40",
		},
	},
	defaultVariants: {
		variant: "body",
		weight: "regular",
		color: "primary",
	},
});

const tagsByVariant: Record<NonNullable<TypographyProps["variant"]>, string> = {
	footnote: "p",
	callout: "p",
	body: "p",
	subheadline: "h2",
	"heading-6": "h6",
	"heading-5": "h5",
	"heading-4": "h4",
	"heading-3": "h3",
	"heading-2": "h2",
	"heading-1": "h1",
	"display-3": "h1",
	"display-2": "h1",
	"display-1": "h1",
};

export interface TypographyProps
	extends Omit<React.HTMLAttributes<HTMLParagraphElement>, "color">,
		VariantProps<typeof typographyVariants> {
	/**
	 * Use the asChild prop to compose [Radix's](https://www.radix-ui.com/primitives/docs/guides/composition) functionality onto alternative element types or your own React components.
	 */
	asChild?: boolean;
	/**
	 * Avoid using classes that affect the typographic style.
	 */
	className?: string;
}

/**
 * We provide a clear hierarchy and a simple set of systematic and accessible typographic styles to apply structure to your interface.
 *
 * `PP Agrandir Text` is the primary typeface for user interfaces; it is used for body text, buttons, and other interface elements.
 *
 * `PP Agrandir` is used for headings and other display text.
 */
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
