"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface NumberInputProps extends Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	"onChange" | "value"
> {
	value?: string | number;
	onValueChange?: (value: string) => void;
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
	({ value, onValueChange, className, ...props }, ref) => {
		const format = (val: string | number | undefined) => {
			if (val === "" || val === null || val === undefined) {
				return "";
			}
			const stringValue = String(val).replace(/\D/g, "");
			if (stringValue === "") {
				return "";
			}
			return new Intl.NumberFormat("pt-BR").format(Number(stringValue));
		};

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const rawValue = e.target.value.replace(/\D/g, "");
			onValueChange?.(rawValue);
		};

		const displayValue = format(value);

		return (
			<Input
				{...props}
				ref={ref}
				value={displayValue}
				onChange={handleChange}
				className={cn(className)}
				type="text"
				inputMode="numeric"
			/>
		);
	},
);
NumberInput.displayName = "NumberInput";
