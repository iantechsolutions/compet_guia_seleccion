import parser from "fast-html-parser";

export async function getDetailsFromUrl(url: string | null | undefined) {
	if (!url)
		return {
			picture: null,
			pdf: null,
		};

	// document.querySelector(".carousel-item img").src
	const html = await fetch(url).then((res) => res.text());
	const parsed = parser.parse(html);

	const picture =
		parsed.querySelector(".carousel-item img")?.attributes.src || null;
	const pdf =
		parsed
			.querySelectorAll("a")
			.find((a) => a.text.trim().toLowerCase() === "descargar")?.attributes
			.href || null;

	return {
		picture,
		pdf,
	};
}
