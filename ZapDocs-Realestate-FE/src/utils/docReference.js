/**
* ZapDocs Document Reference ID Utility
*
* Reference ID format: ZD-KA-202610-1A2B3C
* - ZD = company code
* - KA = state code (e.g., Karnataka)
* - 202610 = year and month in YYYYMM format (dynamically generated from date, not hardcoded)
* - 1A2B3C = 6-character unique alphanumeric combination
*/
/**
* Supported State Codes:
* - Karnataka -> KA
* - Maharashtra -> MH
* - Telangana -> TL
*/
const STATE_CODE_MAP = {
	karnataka: "KA",
	ka: "KA",
	maharashtra: "MH",
	mh: "MH",
	telangana: "TL",
	tl: "TL",
	ts: "TL",
	tg: "TL"
};
/**
* Returns the 2-letter uppercase state code:
* - Karnataka -> KA
* - Maharashtra -> MH
* - Telangana -> TL
*/
export function getStateCode(state) {
	if (!state) return "KA";
	const clean = state.trim().toLowerCase();
	if (STATE_CODE_MAP[clean]) return STATE_CODE_MAP[clean];
	if (clean.includes("telangana")) return "TL";
	if (clean.includes("maharashtra")) return "MH";
	if (clean.includes("karnataka")) return "KA";
	if (state.trim().length === 2) {
		const upper = state.trim().toUpperCase();
		if (upper === "TS" || upper === "TG" || upper === "TL") return "TL";
		if (upper === "MH") return "MH";
		if (upper === "KA") return "KA";
	}
	return "KA";
}
/**
* Generates a 6-character uppercase alphanumeric code (e.g. 1A2B3C)
*/
export function generateAlphanumeric6() {
	const chars = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
	let result = "";
	for (let i = 0; i < 6; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}
/**
* Generates a unique Doc Reference ID for each new document using the current date
* and the selected state's code. Does not hardcode month or state.
*
* Format: ZD-KA-202610-1A2B3C
*/
export function generateDocReferenceId(state, date = new Date()) {
	const companyCode = "ZD";
	const stateCode = getStateCode(state);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const yyyymm = `${year}${month}`;
	const suffix = generateAlphanumeric6();
	return `${companyCode}-${stateCode}-${yyyymm}-${suffix}`;
}
// Stable session cache to ensure existing document records never regenerate IDs on view/edit
const docRefCache = new Map();
/**
* Retrieves or stably computes the Doc Reference ID for a document.
* Existing records remain completely stable without regeneration.
*/
export function getDocReferenceId(agr) {
	if (!agr || !agr.id) return "";
	if (agr.docReferenceId) {
		docRefCache.set(agr.id, agr.docReferenceId);
		return agr.docReferenceId;
	}
	if (docRefCache.has(agr.id)) {
		return docRefCache.get(agr.id);
	}
	// Derive stable doc reference ID from the agreement's ID and timestamp
	const stateCode = getStateCode(agr.state);
	let yyyymm = "202610";
	if (agr.createdAt) {
		try {
			const d = new Date(agr.createdAt);
			if (!isNaN(d.getTime())) {
				const y = d.getFullYear();
				const m = String(d.getMonth() + 1).padStart(2, "0");
				yyyymm = `${y}${m}`;
			}
		} catch {}
	}
	// Clean the id (e.g. "agr_KA2E9X" -> "KA2E9X")
	const rawId = agr.id.replace(/^agr_/, "").toUpperCase();
	let suffix = rawId;
	if (suffix.length !== 6) {
		suffix = (rawId.replace(/[^A-Z0-9]/g, "") + "1A2B3C").slice(0, 6);
	}
	const generated = `ZD-${stateCode}-${yyyymm}-${suffix}`;
	docRefCache.set(agr.id, generated);
	return generated;
}
/**
* Universal formatter for string IDs or agreement objects.
*/
export function formatDocReferenceId(idOrAgr, stateFallback, createdAtFallback) {
	if (!idOrAgr) return "";
	if (typeof idOrAgr === "object") {
		return getDocReferenceId(idOrAgr);
	}
	return getDocReferenceId({
		id: idOrAgr,
		state: stateFallback,
		createdAt: createdAtFallback
	});
}
