import { NextResponse } from "next/server";

export async function GET() {
	const baseUrl = "https://clickphotofinance.vercel.app";

	const urls = [
		"",
		"/calculadoras/plataformas/focoradical",
		"/precificacao/venda-de-fotos-plataformas",
		"/pesquisa",
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
			.map(
				(url) => `
      <url>
        <loc>${baseUrl}${url}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
    `,
			)
			.join("")}
  </urlset>`;

	return new NextResponse(xml, {
		headers: {
			"Content-Type": "application/xml",
		},
	});
}
