import { Typography } from "./typography";

function EmptyState({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col items-center gap-3 justify-center max-w-md self-center">
			{children}
		</div>
	);
}

function EmptyStateTitle({ children }: { children: React.ReactNode }) {
	return (
		<Typography variant="body" weight="bold">
			{children}
		</Typography>
	);
}

function EmptyStateDescription({ children }: { children: React.ReactNode }) {
	return (
		<Typography variant="callout" color="secondary" className="text-center">
			{children}
		</Typography>
	);
}

function EmptyStateActions({ children }: { children: React.ReactNode }) {
	return <div className="flex flex-col gap-2">{children}</div>;
}
export {
	EmptyState,
	EmptyStateActions,
	EmptyStateDescription,
	EmptyStateTitle,
};
