// d:\PAGEVIEWX\PROJETOS-WEB\ClickFinance\clickfinance\components\search-popup.tsx
"use client";

import { useState, useEffect } from "react";
import { X, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SearchPopupProps {
	isManual?: boolean;
	isOpen?: boolean;
	onClose?: () => void;
}

export function SearchPopup({
	isManual = false,
	isOpen = false,
	onClose,
}: SearchPopupProps) {
	const [autoVisible, setAutoVisible] = useState(false);

	const isVisible = isManual ? isOpen : autoVisible;

	useEffect(() => {
		if (isManual) {
			return;
		}

		// Verifica se o usuário já fechou o popup nesta sessão
		const hasClosed = sessionStorage.getItem("search-popup-closed");

		// Verifica se já estamos na página de pesquisa para não mostrar o popup
		const isSearchPage = window.location.pathname === "/pesquisa";

		if (!hasClosed && !isSearchPage) {
			// Delay de 3 segundos para aparecer
			const timer = setTimeout(() => {
				setAutoVisible(true);
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [isManual]);

	const handleClose = () => {
		if (!isManual) {
			setAutoVisible(false);
		}
		sessionStorage.setItem("search-popup-closed", "true");
		if (onClose) onClose();
	};

	if (!isVisible) return null;

	return (
		<div className="fixed left-1/2 top-1/2 z-50 w-full max-w-87.5 -translate-x-1/2 -translate-y-1/2 animate-in fade-in zoom-in-95 duration-500 px-4 md:px-0">
			<Card className="shadow-2xl border-primary/20 bg-white/95 backdrop-blur-sm relative overflow-hidden">
				<div className="absolute top-0 left-0 w-1 h-full bg-primary" />
				<button
					onClick={handleClose}
					className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-gray-100"
					aria-label="Fechar"
				>
					<X className="h-4 w-4" />
				</button>
				<CardHeader className="pb-2 pl-6">
					<div className="flex items-center gap-2 mb-1">
						<MessageSquare className="h-5 w-5 text-primary" />
						<CardTitle className="text-md">Sua opinião importa!</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="pl-6 pb-4">
					<p className="text-base text-muted-foreground mb-4">
						Ajude-nos a melhorar o ClickFinance respondendo a uma pesquisa
						rápida.
					</p>
					<Button asChild className="w-full h-9 text-sm" onClick={handleClose}>
						<Link href="/pesquisa">Responder Pesquisa</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
