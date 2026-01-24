"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CurrencyInputProps extends Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	"onChange"
> {
	value?: string;
	onValueChange?: (value: string) => void;
}

export function CurrencyInput({
	value = "",
	onValueChange,
	className,
	...props
}: CurrencyInputProps) {
	const formatCurrency = (input: string) => {
		let val = input.replace(/\D/g, "");
		val = (Number(val) / 100).toFixed(2);
		val = val.replace(".", ",");
		val = val.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
		return val;
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const formatted = formatCurrency(e.target.value);
		onValueChange?.(formatted);
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		const char = String.fromCharCode(e.which || e.keyCode);
		if (!/[\d,]/.test(char)) {
			e.preventDefault();
		}
	};

	return (
		<Input
			{...props}
			type="text"
			value={value}
			onChange={handleChange}
			onKeyPress={handleKeyPress}
			className={cn(className)}
		/>
	);
}
