import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Header from "@/components/layout/header";
import { SearchPopup } from "@/components/layout/search-popup";
import BannerInfo from "@/components/layout/banner-info";
const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Click Photo Finance | Gestão Financeira para Fotógrafos",
	description:
		"A ferramenta definitiva para fotógrafos gerenciarem finanças, orçamentos e fluxo de caixa de forma simples e profissional.",
	icons: {
		icon: "/favicon.ico",
	},
	verification: {
		google: "Iqyg4JwyPmFqdG3rQUBSisq-92xy-SG2xvbmGaEwYmU",
	},
	keywords: [
		"fotografia",
		"gestão financeira",
		"finanças para fotógrafos",
		"controle de orçamentos",
		"fluxo de caixa",
	],
	authors: [{ name: "Click Photo Finance" }],
	creator: "Click Photo Finance",
	publisher: "Click Photo Finance",
	robots: "index, follow",
	alternates: {
		canonical: "https://clickphotofinance.vercel.app/",
	},
	openGraph: {
		type: "website",
		url: "https://clickphotofinance.vercel.app/",
		title: "Click Photo Finance | Gestão Financeira para Fotógrafos",
		description:
			"Transforme sua paixão por fotografia em um negócio lucrativo com nossa gestão financeira.",
		siteName: "Click Photo Finance",
		images: [
			{
				url: "https://clickphotofinance.vercel.app/og_image.jpg", // Certifique-se de ter uma imagem na pasta public
				width: 1200,
				height: 630,
				alt: "Preview do Click Photo Finance",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Click Photo Finance",
		description:
			"Gestão financeira simplificada para profissionais da fotografia.",
		images: ["https://clickphotofinance.vercel.app/og_image.jpg"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Header />
				{children}
				<SearchPopup />
				<Toaster richColors position="top-right" />
				<BannerInfo />
			</body>
		</html>
	);
}
