type SeoBase = {
	title: string;
	description?: string;
	keywords?: string[];
	image?: string;
};

export type TempleSeo = SeoBase & {
	templeId: string;
};

export type FortuneSeo = SeoBase & {
	templeId: string;
	fortuneNumber: number;
};

export const defaultSeo: SeoBase = {
	title: "ทำนายดวงชะตา - เสี่ยงเซียมซีออนไลน์",
	description:
		"ทำนายดวงชะตาด้วยเซียมซีจากวัดดังทั่วกรุงเทพฯ เสี่ยงเซียมซีออนไลน์ ฟรี พร้อมคำทำนายและคำแนะนำ",
	keywords: ["เซียมซี", "เสี่ยงเซียมซี", "ทำนายดวง", "วัด", "คำทำนาย"],
	image: "https://lovable.dev/opengraph-image-p98pqg.png"
};

// โครงสร้างข้อมูล SEO แบบรวมศูนย์ สามารถเก็บ/โหลดจาก DB ทีหลังได้
export const seoRegistry = {
	index: defaultSeo,
	prophesy: {
		title: "เลือกวิธีทำนาย - เสี่ยงเซียมซี",
		description: "เลือกวิธีทำนายที่คุณสนใจ เช่น เสี่ยงเซียมซี",
		keywords: ["ทำนาย", "เซียมซี", "ดูดวง"]
	} satisfies SeoBase
} as const;

export function applySeo(meta: SeoBase) {
	const title = meta.title || defaultSeo.title;
	const description = meta.description || defaultSeo.description;
	const keywords = meta.keywords || defaultSeo.keywords;
	const image = meta.image || defaultSeo.image;

	if (typeof document !== "undefined") {
		document.title = title;

		setMetaTag("name", "description", description ?? "");
		setMetaTag("name", "keywords", keywords?.join(", ") ?? "");

		setMetaTag("property", "og:title", title);
		setMetaTag("property", "og:description", description ?? "");
		setMetaTag("property", "og:image", image ?? "");

		setMetaTag("name", "twitter:title", title);
		setMetaTag("name", "twitter:description", description ?? "");
		setMetaTag("name", "twitter:image", image ?? "");
	}
}

function setMetaTag(attrName: "name" | "property", key: string, value: string) {
	let el = document.querySelector(`meta[${attrName}="${key}"]`) as HTMLMetaElement | null;
	if (!el) {
		el = document.createElement("meta");
		el.setAttribute(attrName, key);
		document.head.appendChild(el);
	}
	el.setAttribute("content", value);
}


