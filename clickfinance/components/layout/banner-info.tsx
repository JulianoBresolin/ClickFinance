"use client";

import { useState, useEffect } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function BannerInfo() {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			const bannerClosed = sessionStorage.getItem("mvp-banner-closed");
			if (!bannerClosed) {
				setIsOpen(true);
			}
		}, 0);
		return () => clearTimeout(timer);
	}, []);

	const handleOpenChange = (open: boolean) => {
		setIsOpen(open);
		if (!open) {
			sessionStorage.setItem("mvp-banner-closed", "true");
		}
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Aviso: Plataforma em Versão de Teste (MVP)
					</AlertDialogTitle>
					<AlertDialogDescription className="text-stone-700">
						Esta é uma versão inicial para testes. As informações inseridas nos
						formulários de cálculo{" "}
						<strong>não são salvas ou armazenadas</strong>. Apenas os dados do
						formulário de pesquisa são coletados para análise e melhoria da
						plataforma.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogAction>Entendi</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
