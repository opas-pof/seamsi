type SeoBase = {
	title: string;
	description?: string;
	keywords?: string[];
	image?: string;
	ogTitle?: string;
	ogDescription?: string;
};

export type TempleSeo = SeoBase & {
	templeId: string;
};

export type FortuneSeo = SeoBase & {
	templeId: string;
	fortuneNumber: number;
};

export const defaultSeo: SeoBase = {
	title: "เสี่ยงเซียมซี เช็กลัคนา ดูดวง 12 ราศี พร้อมสุ่มพรวิเศษแม่น ๆ",
	description:"เปิดดวง เสี่ยงเซียมซี เช็กลัคนา ดวงชะตา 12 ราศี ดูดวงออนไลน์ฟรี พร้อมสุ่มพรวิเศษ เปิดคำทำนายแม่น ๆ และเคล็ดลับเสริมดวงที่ดูดวง kapook.com",
	keywords: ["เซียมซี", "ดูดวง", "ดวง", "ดวงชะตา", "กราฟชีวิต", "เช็คลัคนา", "ราศี", "ดูดวงวันเดือนปีเกิด", "ดูดวงออนไลน์", "ดูดวงฟรี"],
	image: "/assets/images/og-fortune.jpg"
};

// โครงสร้างข้อมูล SEO แบบรวมศูนย์ สามารถเก็บ/โหลดจาก DB ทีหลังได้
export const seoRegistry = {
	index: defaultSeo,
	fortune: {
		title: "เสี่ยงเซียมซี เช็กลัคนา ดูดวง 12 ราศี พร้อมสุ่มพรวิเศษแม่น ๆ",
		description: "เปิดดวง เสี่ยงเซียมซี เช็กลัคนา ดวงชะตา 12 ราศี ดูดวงออนไลน์ฟรี พร้อมสุ่มพรวิเศษ เปิดคำทำนายแม่น ๆ และเคล็ดลับเสริมดวงที่ดูดวง kapook.com",
		keywords: ["เซียมซี", "ดูดวง", "ดวง", "ดวงชะตา", "กราฟชีวิต", "เช็คลัคนา", "ราศี", "ดูดวงวันเดือนปีเกิด", "ดูดวงออนไลน์", "ดูดวงฟรี"],
		image: "/assets/images/og-fortune.jpg",
		ogTitle: "เสี่ยงเซียมซี เช็กลัคนา ดูดวง 12 ราศีแม่น ๆ ฟรี !",
		ogDescription: "พร้อมสุ่มพรวิเศษ และเปิดคำทำนายสุดแม่น สายมูห้ามพลาดที่ kapook.com"
	} satisfies SeoBase,
	seamsi: {
		title: "เสี่ยงเซียมซี ดูดวงเซียมซีออนไลน์แม่น ๆ",
		description: "เสี่ยงเซียมซีวัด ดูดวงเซียมซีออนไลน์ฟรี พร้อมเปิดคำทำนายเซียมซีแม่น ๆ ทั้ง ดวงชะตาความรัก การงาน การเงิน สุขภาพ และเคล็ดลับเสริมดวง ที่ kapook.com",
		keywords: ["เซียมซี", "เสี่ยงเซียมซี", "ดูดวงเซียมซี", "ดูดวงเซียมซีแม่นๆ", "ดูดวงเซียมซีฟรี", "เสี่ยงเซียมซีวัด", "เซียมซีออนไลน์", "ดูดวง", "ดวงชะตา", "ทำนาย"],
		image: "/assets/images/og-fortune.jpg",
		ogTitle: "เสี่ยงเซียมซีออนไลน์ เช็กดวงฟรี !",
		ogDescription: "เปิดคำทำนายสุดแม่น พร้อมเคล็ดเสริมดวงที่ kapook.com"
	} satisfies SeoBase,
	lagna: {
		title: "เช็กลัคนาราศี ดูดวงลัคนาราศีเกิด",
		description: "เช็กลัคนาราศีเกิด ดูดวงลัคนาแม่น ๆ จากวันเดือนปีเกิดฟรี พร้อมคำนวณลัคนาราศี เพื่อวิเคราะห์ดวงชะตา กราฟชีวิต ความรัก การงาน การเงิน สุขภาพ ที่ kapook.com",
		keywords: ["ลัคนา", "ลัคนาราศี", "ดูดวงลัคนาแม่นๆ", "เช็กลัคนา", "ลัคนาราศีเกิด", "ดูดวง", "ทำนาย", "ดวงชะตา", "กราฟชีวิต", "ดูดวงวันเดือนปีเกิด", "ดวง"],
		image: "/assets/images/og-fortune.jpg",
		ogTitle: "เช็กดวงลัคนาราศีเกิดแม่น ๆ ฟรี",
		ogDescription: "ใส่วันเดือนปีเกิด คำนวณลัคนาได้ง่าย ๆ ที่ดูดวง kapook.com"
	} satisfies SeoBase
} as const;

export function applySeo(meta: SeoBase) {
	const title = meta.title || defaultSeo.title;
	const description = meta.description || defaultSeo.description;
	const keywords = meta.keywords || defaultSeo.keywords;
	const image = meta.image || defaultSeo.image;
	const ogTitle = meta.ogTitle ?? title;
	const ogDescription = meta.ogDescription ?? description;

	if (typeof document !== "undefined") {
		document.title = title;

		setMetaTag("name", "description", description ?? "");
		setMetaTag("name", "keywords", keywords?.join(", ") ?? "");

		setMetaTag("property", "og:title", ogTitle);
		setMetaTag("property", "og:description", ogDescription ?? "");
		setMetaTag("property", "og:image", image ?? "");

		setMetaTag("name", "twitter:title", ogTitle);
		setMetaTag("name", "twitter:description", ogDescription ?? "");
		setMetaTag("name", "twitter:image", image ?? "");
	}
}

// สร้าง SEO สำหรับหน้าไดนามิก: รายละเอียดวัด
export function buildTempleSeo(input: { id: string; name: string; description?: string; location?: string; image?: string }): TempleSeo {
  return {
    title: `${input.name} - เสี่ยงเซียมซี`,
    description: input.description || `เสี่ยงเซียมซีที่ ${input.name}${input.location ? ` (${input.location})` : ""}`,
    keywords: [input.name, "เซียมซี", input.location || ""].filter(Boolean),
    image: input.image,
    ogTitle: `${input.name} - เสี่ยงเซียมซีออนไลน์`,
    ogDescription: input.description || `เปิดคำทำนายจาก ${input.name} พร้อมเคล็ดเสริมดวง`
  } as TempleSeo;
}

// สร้าง SEO สำหรับหน้าไดนามิก: ผลเซียมซี (เลขใบเซียมซี)
export function buildPredictionSeo(input: { templeName?: string; fortuneNumber: number; image?: string; excerpt?: string }): FortuneSeo {
  const titleBase = input.templeName ? `${input.templeName} - ใบที่ ${input.fortuneNumber}` : `เซียมซี ใบที่ ${input.fortuneNumber}`;
  return {
    title: `${titleBase} - ผลทำนายเซียมซี`,
    description: input.excerpt || `ผลทำนายใบที่ ${input.fortuneNumber}${input.templeName ? ` จาก ${input.templeName}` : ""}`,
    keywords: ["เซียมซี", String(input.fortuneNumber), input.templeName || ""].filter(Boolean),
    image: input.image,
    ogTitle: `${titleBase} - เช็กคำทำนายฟรี`,
    ogDescription: input.excerpt || `เปิดคำทำนายใบที่ ${input.fortuneNumber} พร้อมคำแนะนำเสริมดวง`
  } as FortuneSeo;
}

// อ่าน SEO/SMO จากเรคคอร์ดวัด (ถ้ามี) ไม่มีก็ fallback ไป builder
export function buildSeoFromTempleRecord(row: {
  temple_id: string;
  name: string;
  description?: string | null;
  location?: string | null;
  image?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string[] | null;
  seo_image?: string | null;
  smo_title?: string | null;
  smo_description?: string | null;
}): TempleSeo {
  const base = buildTempleSeo({
    id: row.temple_id,
    name: row.name,
    description: row.description ?? undefined,
    location: row.location ?? undefined,
    image: row.image ?? undefined
  });
  return {
    ...base,
    title: row.seo_title ?? base.title,
    description: row.seo_description ?? base.description,
    keywords: row.seo_keywords ?? base.keywords,
    image: row.seo_image ?? base.image,
    ogTitle: row.smo_title ?? base.ogTitle,
    ogDescription: row.smo_description ?? base.ogDescription,
    templeId: row.temple_id
  };
}

// อ่าน SEO/SMO จากเรคคอร์ดเซียมซี (ถ้ามี) ไม่มีก็ fallback ไป builder
export function buildSeoFromFortuneRecord(args: {
  fortune: {
    fortune_number: number;
    title?: string | null;
    content?: string | null;
    seo_title?: string | null;
    seo_description?: string | null;
    seo_keywords?: string[] | null;
    seo_image?: string | null;
    smo_title?: string | null;
    smo_description?: string | null;
  };
  temple?: { name?: string | null; image?: string | null };
}): FortuneSeo {
  const base = buildPredictionSeo({
    templeName: args.temple?.name ?? undefined,
    fortuneNumber: args.fortune.fortune_number,
    image: args.temple?.image ?? undefined,
    excerpt: args.fortune.title ?? undefined
  });
  return {
    ...base,
    title: args.fortune.seo_title ?? base.title,
    description: args.fortune.seo_description ?? base.description,
    keywords: args.fortune.seo_keywords ?? base.keywords,
    image: args.fortune.seo_image ?? base.image,
    ogTitle: args.fortune.smo_title ?? base.ogTitle,
    ogDescription: args.fortune.smo_description ?? base.ogDescription,
    templeId: "",
    fortuneNumber: args.fortune.fortune_number
  };
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


