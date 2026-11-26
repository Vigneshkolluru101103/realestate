// ============================================================
// API Base Client — connects to FastAPI backend
// All service modules use this client.
// ============================================================
import { getAccessToken } from "../../aws/cognito";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

class ApiError extends Error {
	status;
	constructor(status, message) {
		super(message);
		this.status = status;
		this.name = "ApiError";
	}
}

async function getAuthHeaders() {
	try {
		const token = await getAccessToken();
		if (token) return { Authorization: `Bearer ${token}` };

		// Fallback to active session storage if available
		const storedSession = typeof window !== "undefined"
			? window.localStorage.getItem("zd_brk_session") || window.localStorage.getItem("zapdocs_active_user_v1")
			: null;
		if (storedSession) {
			try {
				const parsed = JSON.parse(storedSession);
				if (parsed?.token) return { Authorization: `Bearer ${parsed.token}` };
			} catch {}
		}
		return { Authorization: "Bearer dev_broker_local" };
	} catch {
		return { Authorization: "Bearer dev_broker_local" };
	}
}

async function request(method, path, body, params) {
	const headers = await getAuthHeaders();
	const origin = typeof window !== "undefined" && window.location?.origin ? window.location.origin : "http://localhost:5173";
	const normalizedPath = path.startsWith("/") ? path : `/${path}`;
	const url = BASE_URL.startsWith("http")
		? new URL(`${BASE_URL}${normalizedPath}`)
		: new URL(`${BASE_URL}${normalizedPath}`, origin);

	if (params) {
		Object.entries(params).forEach(([k, v]) => {
			if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
		});
	}

	const res = await fetch(url.toString(), {
		method,
		headers: {
			"Content-Type": "application/json",
			...headers,
		},
		body: body ? JSON.stringify(body) : undefined,
	});

	if (!res.ok) {
		const err = await res.json().catch(() => ({ detail: res.statusText }));
		throw new ApiError(res.status, err.detail || err.message || "Request failed");
	}
	return res.json();
}

export const api = {
	get: (path, params) => request("GET", path, undefined, params),
	post: (path, body) => request("POST", path, body),
	put: (path, body) => request("PUT", path, body),
	patch: (path, body) => request("PATCH", path, body),
	delete: (path) => request("DELETE", path),
};

export { ApiError };
