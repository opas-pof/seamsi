import { supabase } from "@/lib/supabase";

export type SaveDrawInput = {
	templeId: string;
	templeName: string;
	fortuneNumber: number;
	fortuneTitle: string;
	fortuneContent: string;
	userAgent?: string;
	ip?: string;
};

export async function saveDraw(input: SaveDrawInput) {
	const { error } = await supabase.from("draws").insert({
		temple_id: input.templeId,
		temple_name: input.templeName,
		fortune_number: input.fortuneNumber,
		fortune_title: input.fortuneTitle,
		fortune_content: input.fortuneContent,
		user_agent: input.userAgent ?? (typeof navigator !== "undefined" ? navigator.userAgent : null),
		ip: input.ip ?? null
	});
	return { error };
}


