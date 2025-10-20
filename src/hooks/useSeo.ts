import { useEffect } from "react";
import { applySeo, defaultSeo, SeoBase } from "@/lib/seo";

export function useSeo(meta?: Partial<SeoBase>) {
	useEffect(() => {
		applySeo({ ...defaultSeo, ...(meta || {}) });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(meta)]);
}

export default useSeo;


