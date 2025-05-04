import { LoaderCircle } from "lucide-react";
import type * as React from "react";

import { cn } from "~/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
	endAdornment?: React.ReactNode;
	isLoading?: boolean;
}

function Input({
	className,
	type,
	endAdornment,
	isLoading,
	...props
}: InputProps) {
	return (
		<div className="relative flex w-full items-center">
			<input
				type={type}
				data-slot="input"
				className={cn(
					"file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-white px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
					"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
					"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
					endAdornment && "pr-8",
					className,
				)}
				{...props}
			/>
			{endAdornment || isLoading ? (
				<div className="absolute right-3 flex items-center">
					{isLoading ? (
						<LoaderCircle className="size-4 animate-spin" />
					) : (
						endAdornment
					)}
				</div>
			) : null}
		</div>
	);
}

export { Input };
