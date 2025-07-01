"use client";

import { useToast } from "@/hooks/use-toast";
import { Toast, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/Toast/toast";
import React, { memo } from "react";

interface ToasterProps {
	viewportClassName?: string;
}

export const Toaster = memo(function Toaster({ viewportClassName }: ToasterProps) {
	const { toasts, dismiss } = useToast();

	return (
		<ToastProvider>
			{toasts.map(function ({ id, title, description, action, ...props }) {
				const { onClick, ...restProps } = props as typeof props & { onClick?: React.MouseEventHandler<HTMLDivElement> };

				return (
					<Toast
						key={id}
						{...restProps}
						onClick={(event) => {
							dismiss(id);
							onClick?.(event);
						}}
					>
						<div className="grid gap-1">
							{title && <ToastTitle>{title}</ToastTitle>}
							{description && <ToastDescription>{description}</ToastDescription>}
						</div>
						{action}
					</Toast>
				);
			})}
			<ToastViewport className={viewportClassName} />
		</ToastProvider>
	);
});
