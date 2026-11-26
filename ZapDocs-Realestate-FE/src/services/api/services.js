import { mockAgreements, mockCustomers, mockBrokers, mockJurisdictions, mockRules, mockTemplates, mockPayments, mockEStamps, mockESigns, mockAuditLogs, mockNotifications, mockProviders, mockDashboardStats, mockRecentActivity, mockSystemAlerts, mockCreditTransactions, mockGuestSigners, mockCharteredAccountants, mockRevenueRecords, mockRevenueStats } from "../../data/mockData";
import { failoverService } from "../failoverService";
import { storage } from "../../utils/storage.js";
import { api } from "./client";

const CUSTOMERS_STORAGE_KEY = "zd_customers_data";
const BROKERS_STORAGE_KEY = "zd_brokers_data";
const CAS_STORAGE_KEY = "zd_cas_data";

export function getStoredCustomers() {
	return storage.get(CUSTOMERS_STORAGE_KEY, mockCustomers);
}

export function setStoredCustomers(list) {
	storage.set(CUSTOMERS_STORAGE_KEY, list);
}

function sanitizeBrokerRecord(broker) {
	if (!broker || typeof broker !== "object" || Array.isArray(broker)) {
		return null;
	}
	const { password, token, secret, ...safe } = broker;
	return safe;
}

function sanitizeBrokersList(list) {
	if (!Array.isArray(list)) return [];
	return list.map(sanitizeBrokerRecord).filter(Boolean);
}

export function getStoredBrokers() {
	const stored = storage.get(BROKERS_STORAGE_KEY, null);
	if (!stored || !Array.isArray(stored) || stored.length === 0) {
		const fallback = sanitizeBrokersList(mockBrokers);
		storage.set(BROKERS_STORAGE_KEY, fallback);
		return fallback;
	}
	let needsMigration = false;
	const sanitized = [];

	for (const item of stored) {
		if (!item || typeof item !== "object" || Array.isArray(item) || typeof item.id !== "string" || !item.id.trim()) {
			needsMigration = true;
			continue;
		}
		if ("password" in item || "token" in item || "secret" in item) {
			needsMigration = true;
		}
		const safe = sanitizeBrokerRecord(item);
		if (safe) {
			sanitized.push(safe);
		}
	}

	if (sanitized.length === 0) {
		const fallback = sanitizeBrokersList(mockBrokers);
		storage.set(BROKERS_STORAGE_KEY, fallback);
		return fallback;
	}

	if (needsMigration) {
		storage.set(BROKERS_STORAGE_KEY, sanitized);
	}
	return sanitized;
}

export function setStoredBrokers(list) {
	const sanitized = sanitizeBrokersList(list);
	storage.set(BROKERS_STORAGE_KEY, sanitized);
}

export function getStoredCAs() {
	return storage.get(CAS_STORAGE_KEY, mockCharteredAccountants);
}

export function setStoredCAs(list) {
	storage.set(CAS_STORAGE_KEY, list);
}

const NOTIFICATIONS_STORAGE_KEY = "zd_notifications_data";

export function getStoredNotifications() {
	return storage.get(NOTIFICATIONS_STORAGE_KEY, mockNotifications);
}

export function setStoredNotifications(list) {
	storage.set(NOTIFICATIONS_STORAGE_KEY, list);
}

const AGREEMENTS_STORAGE_KEY = "zd_agreements_data";

export function getStoredAgreements() {
	const stored = storage.get(AGREEMENTS_STORAGE_KEY, mockAgreements);
	if (Array.isArray(stored)) {
		let updated = false;
		const customers = getStoredCustomers();
		const mapped = stored.map((agr) => {
			if (!agr.customerPhone && (agr.customerEmail || agr.customerName)) {
				const mockMatch = mockAgreements.find((m) => m.id === agr.id || m.docReferenceId === agr.docReferenceId);
				if (mockMatch?.customerPhone) {
					updated = true;
					return { ...agr, customerPhone: mockMatch.customerPhone };
				}
				const custMatch = customers.find(
					(c) =>
						(c.email && agr.customerEmail && c.email.toLowerCase() === agr.customerEmail.toLowerCase()) ||
						(c.name && agr.customerName && c.name.toLowerCase() === agr.customerName.toLowerCase())
				);
				if (custMatch?.phone) {
					updated = true;
					return { ...agr, customerPhone: custMatch.phone };
				}
			}
			return agr;
		});
		if (updated) {
			storage.set(AGREEMENTS_STORAGE_KEY, mapped);
			return mapped;
		}
		return stored;
	}
	return stored;
}

export function setStoredAgreements(list) {
	storage.set(AGREEMENTS_STORAGE_KEY, list);
}

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
function paginate(items, page = 1, pageSize = 20) {
	const start = (page - 1) * pageSize;
	const data = items.slice(start, start + pageSize);
	return {
		data,
		total: items.length,
		page,
		pageSize,
		totalPages: Math.ceil(items.length / pageSize)
	};
}
function delay(ms = 300) {
	return new Promise((r) => setTimeout(r, ms));
}
// ── Dashboard Service ─────────────────────────────────────────
// Helper to compute revenue stats dynamically from actual mock records
export function getDynamicRevenueStats() {
	const recs = mockRevenueRecords;
	let estampGross = 0, estampNet = 0, estampPlatform = 0, estampCost = 0, estampCertCount = 0;
	let esignGross = 0, esignNet = 0, esignPlatform = 0, esignCost = 0, esignCount = 0;
	let complianceGross = 0, complianceNet = 0, compliancePlatform = 0, complianceCost = 0, complianceCount = 0;
	let platformGross = 0, platformNet = 0, platformPlatform = 0;
	let bundleGross = 0, bundleNet = 0, bundlePlatform = 0;
	let agreementTxnCount = 0, complianceTxnCount = 0;
	let totalGross = 0, totalNet = 0;

	for (const r of recs) {
		const g = r.grossAmount || 0;
		const n = r.netRevenue || 0;
		const pf = r.platformFee || 0;
		const cost = r.govtOrCost || 0;

		totalGross += g;
		totalNet += n;

		if (r.category === "estamp") {
			estampGross += g;
			estampNet += n;
			estampPlatform += pf;
			estampCost += cost;
			estampCertCount++;
			agreementTxnCount++;
		} else if (r.category === "esign") {
			esignGross += g;
			esignNet += n;
			esignPlatform += pf;
			esignCost += cost;
			esignCount++;
			agreementTxnCount++;
		} else if (r.category === "compliance") {
			complianceGross += g;
			complianceNet += n;
			compliancePlatform += pf;
			complianceCost += cost;
			complianceCount++;
			complianceTxnCount++;
		} else if (r.category === "platform") {
			platformGross += g;
			platformNet += n;
			platformPlatform += pf;
			complianceGross += g;
			complianceNet += n;
			compliancePlatform += pf;
			complianceCost += cost;
			complianceCount++;
			complianceTxnCount++;
		} else if (r.category === "bundle") {
			bundleGross += g;
			bundleNet += n;
			bundlePlatform += pf;
			complianceGross += g;
			complianceNet += n;
			compliancePlatform += pf;
			complianceCost += cost;
			complianceCount++;
			complianceTxnCount++;
		}
	}

	// Single Consistent Revenue Definition:
	// Total Revenue = Agreement Revenue + Compliance Revenue
	// eStamp and eSign purchase costs are operational expenses and must NOT be included in Total Revenue.
	const agreementRevenue = estampPlatform + esignPlatform;
	const complianceRevenue = compliancePlatform;
	const totalRevenue = agreementRevenue + complianceRevenue;
	const totalProviderCost = estampCost + esignCost;

	const settledCount = recs.filter((r) => r.status === "settled").length;
	const settlementRate = recs.length > 0 ? Number(((settledCount / recs.length) * 100).toFixed(1)) : 0;

	return {
		// Authoritative Revenue (ZapDocs platform earnings)
		totalRevenue,
		agreementRevenue,
		complianceRevenue,
		estampRevenue: estampPlatform,
		esignRevenue: esignPlatform,
		// Provider purchase costs (expenses, strictly separated from revenue)
		totalProviderCost,
		totalPurchaseCost: totalProviderCost,
		estampCost,
		esignCost,
		// Transaction counts
		agreementTxnCount,
		complianceTxnCount,
		totalTxnCount: agreementTxnCount + complianceTxnCount,
		totalTransactions: recs.length,
		// Financial gross and net reconciliations
		grossTotal: totalGross,
		netTotal: totalNet,
		totalNetRevenue: totalNet,
		estampGross,
		estampNet,
		estampCertCount,
		esignGross,
		esignNet,
		esignCount,
		complianceGross,
		complianceNet,
		complianceCount,
		platformGross,
		platformNet,
		bundleGross,
		bundleNet,
		settlementRate,
		monthlyGrowthPct: 18.4
	};
}

// ── Dashboard Service ─────────────────────────────────────────
export const dashboardService = {
	getStats: async () => {
		await delay();
		// Compute Customer counts dynamically from stored customer datasets
		const storedCustomers = getStoredCustomers();
		const storedBrokers = getStoredBrokers();
		const storedCAs = getStoredCAs();

		const individualCustomers = storedCustomers.length;
		const brokerCustomers = storedBrokers.length;
		const caCustomers = storedCAs.length;
		const totalCustomers = individualCustomers + brokerCustomers + caCustomers;

		const activeIndividualCustomers = storedCustomers.filter((c) => c.status === "active").length;
		const activeBrokers = storedBrokers.filter((b) => b.status === "active").length;
		const activeCAs = storedCAs.filter((ca) => ca.status === "active").length;
		const activeCustomers = activeIndividualCustomers + activeBrokers + activeCAs;

		// Compute Revenue totals dynamically from actual mock revenue records
		const revStats = getDynamicRevenueStats();
		const totalRevenue = revStats.totalRevenue;
		const agreementRevenue = revStats.agreementRevenue;
		const complianceRevenue = revStats.complianceRevenue;
		const totalNetRevenue = revStats.netTotal;
		const estampRevenue = revStats.estampRevenue;
		const estampNet = revStats.estampNet;
		const esignRevenue = revStats.esignRevenue;
		const esignNet = revStats.esignNet;
		const totalProviderCost = revStats.totalProviderCost;
		const estampCost = revStats.estampCost;
		const esignCost = revStats.esignCost;
		const grossTotal = revStats.grossTotal;

		// Agreement metrics: compute dynamically from the actual stored agreements
		// using the exact same classification logic as AgreementsPage.jsx
		const storedAgreements = getStoredAgreements();
		const isCompleted = (a) => a.status === "completed";
		const isFailed = (a) =>
			a.status === "failed" ||
			a.paymentStatus === "failed" ||
			a.estampStatus === "failed" ||
			a.esignStatus === "failed";
		const isDraft = (a) => a.status === "draft";
		const isPending = (a) => {
			if (isCompleted(a) || isFailed(a) || isDraft(a)) return false;
			return [
				"payment_pending", "estamp_pending", "signing_pending",
				"signer1_signed", "signer2_invited", "signer2_signed",
				"finalizing", "pending", "in_progress", "active"
			].includes(a.status);
		};

		const totalAgreements = storedAgreements.length;
		let completedAgreements = 0, pendingAgreements = 0, failedAgreements = 0, draftAgreements = 0;
		// Track "today" using the mock reference date used elsewhere
		const todayStr = "2026-10-07";
		let agreementsToday = 0;
		for (const a of storedAgreements) {
			if (isCompleted(a)) completedAgreements++;
			else if (isFailed(a)) failedAgreements++;
			else if (isDraft(a)) draftAgreements++;
			else if (isPending(a)) pendingAgreements++;
			if (a.createdAt && a.createdAt.startsWith(todayStr)) agreementsToday++;
		}
		const completionRate = totalAgreements > 0 ? ((completedAgreements / totalAgreements) * 100).toFixed(1) : "0.0";

		return {
			// Dynamic agreement counts (consistent with AgreementsPage.jsx)
			totalAgreements,
			pendingAgreements,
			completedAgreements,
			failedAgreements,
			draftAgreements,
			agreementsToday,
			completionRate,
			// Customer counts
			totalCustomers,
			individualCustomers,
			brokerCustomers,
			caCustomers,
			activeCustomers,
			activeIndividualCustomers,
			activeBrokers,
			activeCAs,
			// Authoritative Revenue (dynamically derived from mockRevenueRecords)
			totalRevenue,
			agreementRevenue,
			complianceRevenue,
			estampRevenue,
			esignRevenue,
			totalProviderCost,
			estampCost,
			esignCost,
			grossTotal,
			totalNetRevenue,
			estampNet,
			esignNet,
			complianceNet: revStats.complianceNet,
			revenueStats: revStats
		};
	},
	getRecentActivity: async () => {
		await delay();
		return mockRecentActivity;
	},
	getAlerts: async () => {
		await delay();
		return mockSystemAlerts;
	}
};
import { generateDocReferenceId, getDocReferenceId } from "../../utils/docReference";
// ── Agreement Service ─────────────────────────────────────────
export const agreementService = {
	list: async (filters) => {
		if (!USE_MOCK) {
			try {
				const res = await api.get("/agreements", {
					page: filters?.page || 1,
					pageSize: filters?.pageSize || 20,
					status: filters?.status && filters.status !== "all" ? filters.status : undefined,
					search: filters?.search || undefined,
				});
				if (res && Array.isArray(res.items)) {
					const mapped = res.items.map((a) => ({
						id: a.agreement_id,
						docReferenceId: a.reference_id,
						title: a.title,
						status: a.status.toLowerCase(),
						customerName: a.tenant_name || a.owner_name || "Client",
						state: a.state_code === "KA" ? "Karnataka" : a.state_code,
						createdAt: a.created_at,
						...a
					}));
					return {
						data: mapped,
						total: res.total,
						page: res.page,
						pageSize: res.page_size,
						totalPages: Math.ceil(res.total / res.page_size) || 1,
					};
				}
			} catch (err) {
				console.warn("[ZapDocs] Backend /agreements call failed, using mock data:", err);
			}
		}
		await delay();
		let items = [...getStoredAgreements()];
		if (filters?.search) {
			const rawQ = filters.search.toLowerCase().trim().replace(/^#/, "");
			if (rawQ) {
				items = items.filter((a) => {
					const refId = (a.docReferenceId || getDocReferenceId(a) || "").toLowerCase();
					const id = (a.id || "").toLowerCase();
					const name = (a.customerName || "").toLowerCase();
					const email = (a.customerEmail || "").toLowerCase();
					const phone = (a.customerPhone || "").toLowerCase();
					const prop = (a.propertyAddress || "").toLowerCase();
					const state = (a.state || "").toLowerCase();
					const broker = (a.brokerName || "").toLowerCase();
					const pin = (a.pinCode || "").toLowerCase();
					const status = (a.status || "").toLowerCase();
					const statusFormatted = status.replace(/_/g, " ");
					const title = (a.title || a.documentName || a.agreementTitle || "rental agreement residential rental agreement").toLowerCase();
					const terms = [id, refId, name, email, phone, prop, state, broker, pin, status, statusFormatted, title];
					if (a.monthlyRent != null) terms.push(String(a.monthlyRent));
					if (a.securityDeposit != null) terms.push(String(a.securityDeposit));
					const fullMatch = terms.some((t) => t.includes(rawQ));
					if (fullMatch) return true;
					const words = rawQ.split(/\s+/).filter(Boolean);
					return words.length > 0 && words.every((w) => terms.some((t) => t.includes(w)));
				});
			}
		}
		if (filters?.state) items = items.filter((a) => a.state.toLowerCase() === filters.state.toLowerCase());
		if (filters?.status) items = items.filter((a) => a.status === filters.status);
		if (filters?.paymentStatus) items = items.filter((a) => a.paymentStatus === filters.paymentStatus);
		return paginate(items, Number(filters?.page) || 1, Number(filters?.pageSize) || 20);
	},
	get: async (id) => {
		if (!USE_MOCK && id) {
			try {
				const res = await api.get(`/documents/${id}`);
				if (res && (res.agreement_id || res.id)) {
					return {
						id: res.agreement_id || res.id,
						docReferenceId: res.reference_id || res.docReferenceId,
						status: res.status || "draft",
						...res.data
					};
				}
			} catch (err) {
				console.warn(`[ZapDocs] Backend /documents/${id} failed, using local fallback:`, err);
			}
		}
		await delay();
		return getStoredAgreements().find((a) => a.id === id || a.docReferenceId === id);
	},
	create: async (data) => {
		if (!USE_MOCK) {
			try {
				const res = await api.post("/documents", {
					title: data.title || "Residential Rental Agreement",
					state_code: (data.state || "KA").substring(0, 2).toUpperCase(),
					data: data
				});
				if (res && (res.agreement_id || res.reference_id)) {
					const created = {
						id: res.agreement_id || `agr_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
						docReferenceId: res.reference_id,
						status: res.status || "draft",
						...data,
						...res.data
					};
					const items = [...getStoredAgreements()];
					items.unshift(created);
					setStoredAgreements(items);
					return created;
				}
			} catch (err) {
				console.warn("[ZapDocs] Backend /documents create failed, using local generator:", err);
			}
		}
		await delay();
		const items = [...getStoredAgreements()];
		const date = new Date();
		const docRefId = generateDocReferenceId(data.state, date);
		const suffix = docRefId.split("-").pop() || Math.random().toString(36).substring(2, 8).toUpperCase();
		const newAgr = {
			id: `agr_${suffix}`,
			docReferenceId: docRefId,
			customerName: data.customerName,
			customerEmail: data.customerEmail || `${data.customerName.toLowerCase().replace(/\s+/g, "")}@example.com`,
			customerPhone: data.customerPhone || "+91 98765 43210",
			propertyAddress: data.propertyAddress || "102, Green Glen Layout, Outer Ring Road",
			state: data.state,
			pinCode: data.pinCode || "560103",
			status: data.status || "draft",
			estampStatus: data.estampStatus || "not_started",
			esignStatus: data.esignStatus || "not_started",
			paymentStatus: data.paymentStatus || "not_started",
			monthlyRent: data.monthlyRent || 25e3,
			securityDeposit: data.securityDeposit || 1e5,
			templateVersion: "2.4",
			ruleVersion: "1.8",
			createdAt: date.toISOString(),
			updatedAt: date.toISOString(),
			...data
		};
		items.unshift(newAgr);
		setStoredAgreements(items);
		return newAgr;
	},
	update: async (id, updates) => {
		await delay();
		const items = [...getStoredAgreements()];
		const idx = items.findIndex((a) => a.id === id || a.docReferenceId === id);
		if (idx !== -1) {
			items[idx] = {
				...items[idx],
				...updates,
				updatedAt: new Date().toISOString()
			};
			setStoredAgreements(items);
			return items[idx];
		}
		return null;
	},
	getTimeline: async (id) => {
		await delay();
		const a = getStoredAgreements().find((ag) => ag.id === id || ag.docReferenceId === id);
		if (!a) return [];
		const steps = [
			{
				step: 1,
				label: "Agreement Created",
				status: "done",
				timestamp: a.createdAt,
				actor: "Customer/Broker"
			},
			{
				step: 2,
				label: "Property & Jurisdiction Selected",
				status: "done",
				description: `${a.state} — PIN ${a.pinCode}`
			},
			{
				step: 3,
				label: "Details Validated",
				status: "done"
			},
			{
				step: 4,
				label: "Draft Generated",
				status: "done",
				description: `Template v${a.templateVersion}, Rule v${a.ruleVersion}`
			},
			{
				step: 5,
				label: "Payment Initiated",
				status: a.paymentStatus !== "not_started" ? "done" : "pending"
			},
			{
				step: 6,
				label: "Payment Verified",
				status: a.paymentStatus === "captured" ? "done" : a.paymentStatus === "failed" ? "error" : a.paymentStatus === "reconciliation" ? "active" : "pending"
			},
			{
				step: 7,
				label: "Broker Credit Handled",
				status: a.paymentStatus === "captured" ? "done" : "pending"
			},
			{
				step: 8,
				label: "eStamp Initiated",
				status: [
					"estamp_pending",
					"estamp_completed",
					"signing_pending",
					"signer1_signed",
					"signer2_invited",
					"signer2_signed",
					"finalizing",
					"completed"
				].includes(a.status) ? "done" : "pending"
			},
			{
				step: 9,
				label: "eStamp Completed",
				status: a.estampStatus === "completed" ? "done" : a.estampStatus === "failed" || a.estampStatus === "retry_required" ? "error" : a.estampStatus === "pending" || a.estampStatus === "processing" ? "active" : "pending"
			},
			{
				step: 10,
				label: "Signer 1 Signed (Landlord)",
				status: [
					"signer1_signed",
					"signer2_invited",
					"signer2_signed",
					"finalizing",
					"completed"
				].includes(a.esignStatus) ? "done" : a.esignStatus === "signer1_invited" ? "active" : "pending"
			},
			{
				step: 11,
				label: "Signer 2 Invited (Tenant)",
				status: [
					"signer2_invited",
					"signer2_signed",
					"completed"
				].includes(a.esignStatus) ? "done" : "pending"
			},
			{
				step: 12,
				label: "Signer 2 Signed (Tenant)",
				status: ["signer2_signed", "completed"].includes(a.esignStatus) ? "done" : a.esignStatus === "signer2_invited" ? "active" : "pending"
			},
			{
				step: 13,
				label: "Agreement Finalized",
				status: a.status === "completed" ? "done" : a.status === "finalizing" ? "active" : "pending"
			},
			{
				step: 14,
				label: "PDF Generated & Stored",
				status: a.status === "completed" ? "done" : "pending",
				description: a.completedAt ? "SHA-256 audit chain complete" : undefined
			},
			{
				step: 15,
				label: "Notifications Sent",
				status: a.status === "completed" ? "done" : "pending"
			}
		];
		return steps;
	}
};
// ── User Service ──────────────────────────────────────────────
export const userService = {
	listCustomers: async (filters) => {
		if (!USE_MOCK) {
			try {
				const res = await api.get("/admin/owners", {
					page: filters?.page || 1,
					pageSize: filters?.pageSize || 20,
					status: filters?.status && filters.status !== "all" ? filters.status : undefined
				});
				if (res && Array.isArray(res.items)) {
					const mapped = res.items.map((o) => ({
						id: o.ownerId,
						name: o.displayName,
						email: o.email,
						phone: o.phone,
						state: o.state || "Karnataka",
						status: (o.status || "active").toLowerCase(),
						createdAt: o.createdAt,
						agreementCount: o.agreementCount || 0
					}));
					return {
						data: mapped,
						total: res.total,
						page: res.page,
						pageSize: res.pageSize,
						totalPages: Math.ceil(res.total / res.pageSize) || 1
					};
				}
			} catch (err) {
				console.warn("[ZapDocs] Backend /admin/owners call failed, using mock data:", err);
			}
		}
		await delay();
		let items = [...getStoredCustomers()];
		if (filters?.search) {
			const q = filters.search.toLowerCase().trim();
			items = items.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.phone && c.phone.toLowerCase().includes(q)) || c.id.toLowerCase().includes(q));
		}
		if (filters?.status && filters.status !== "all") {
			items = items.filter((c) => c.status === filters.status);
		}
		if (filters?.state && filters.state !== "all") {
			items = items.filter((c) => (c.state || "").toLowerCase() === filters.state.toLowerCase());
		}
		return paginate(items, Number(filters?.page) || 1, Number(filters?.pageSize) || 20);
	},
	getCustomer: async (id) => {
		if (!USE_MOCK && id) {
			try {
				const res = await api.get(`/owners/${id}`);
				if (res && res.ownerId) {
					return {
						id: res.ownerId,
						name: res.displayName,
						email: res.email,
						phone: res.phone,
						status: (res.status || "active").toLowerCase(),
						createdAt: res.createdAt
					};
				}
			} catch (err) {
				console.warn(`[ZapDocs] Backend /owners/${id} failed, using local mock:`, err);
			}
		}
		await delay();
		return getStoredCustomers().find((c) => c.id === id);
	},
	createCustomer: async (customerData) => {
		if (!USE_MOCK) {
			try {
				const res = await api.post("/owners", {
					displayName: customerData.name,
					email: customerData.email,
					phone: customerData.phone
				});
				if (res && res.ownerId) {
					const newCustomer = {
						id: res.ownerId,
						name: res.displayName,
						email: res.email,
						phone: res.phone,
						state: customerData.state || "Karnataka",
						status: "active",
						createdAt: res.createdAt || new Date().toISOString(),
						lastActiveAt: new Date().toISOString(),
						...customerData
					};
					const items = [...getStoredCustomers()];
					items.unshift(newCustomer);
					setStoredCustomers(items);
					return newCustomer;
				}
			} catch (err) {
				console.warn("[ZapDocs] Backend /owners create failed, using local storage:", err);
			}
		}
		await delay(200);
		const items = [...getStoredCustomers()];
		const nowIso = new Date().toISOString();
		const newCustomer = {
			id: customerData.id || `usr_${Date.now().toString().slice(-6)}`,
			name: customerData.name,
			email: customerData.email,
			phone: customerData.phone,
			state: customerData.state || "Karnataka",
			agreementCount: customerData.agreementCount || 0,
			pendingAgreements: customerData.pendingAgreements || 0,
			status: customerData.status || "active",
			createdAt: customerData.createdAt || nowIso,
			lastActiveAt: customerData.lastActiveAt || nowIso,
			...customerData
		};
		items.unshift(newCustomer);
		setStoredCustomers(items);
		return newCustomer;
	},
	updateCustomer: async (id, updates) => {
		await delay();
		const items = [...getStoredCustomers()];
		const idx = items.findIndex((c) => c.id === id);
		if (idx !== -1) {
			items[idx] = {
				...items[idx],
				...updates,
				lastActiveAt: new Date().toISOString()
			};
			setStoredCustomers(items);
			return items[idx];
		}
		return null;
	},
	deleteCustomer: async (id) => {
		await delay();
		const items = [...getStoredCustomers()];
		const idx = items.findIndex((c) => c.id === id);
		if (idx !== -1) {
			const deleted = items.splice(idx, 1)[0];
			setStoredCustomers(items);
			return { success: true, id, data: deleted };
		}
		return { success: false };
	},
	listGuestSigners: async (filters) => {
		await delay();
		return paginate(mockGuestSigners, Number(filters?.page) || 1, 20);
	}
};

// ── Broker Service ────────────────────────────────────────────
export const brokerService = {
	list: async (filters) => {
		if (!USE_MOCK) {
			try {
				const res = await api.get("/admin/brokers", {
					page: filters?.page || 1,
					pageSize: filters?.pageSize || 20,
					status: filters?.status && filters.status !== "all" ? filters.status : undefined
				});
				if (res && Array.isArray(res.items)) {
					const mapped = res.items.map((b) => ({
						id: b.brokerId,
						name: b.businessName,
						email: b.email || "broker@example.com",
						phone: b.phone || "+91 98765 00000",
						status: (b.status || "active").toLowerCase(),
						firmName: b.businessName,
						createdAt: b.createdAt
					}));
					return {
						data: mapped,
						total: res.total,
						page: res.page,
						pageSize: res.pageSize,
						totalPages: Math.ceil(res.total / res.pageSize) || 1
					};
				}
			} catch (err) {
				console.warn("[ZapDocs] Backend /admin/brokers call failed, using mock data:", err);
			}
		}
		await delay();
		let items = [...getStoredBrokers()];
		if (filters?.search) {
			const q = filters.search.toLowerCase().trim();
			items = items.filter((b) => b.name.toLowerCase().includes(q) || b.email.toLowerCase().includes(q) || (b.phone && b.phone.toLowerCase().includes(q)) || b.id.toLowerCase().includes(q) || (b.firmName && b.firmName.toLowerCase().includes(q)));
		}
		if (filters?.status && filters.status !== "all") {
			items = items.filter((b) => b.status === filters.status);
		}
		if (filters?.state && filters.state !== "all") {
			items = items.filter((b) => (b.state || "").toLowerCase() === filters.state.toLowerCase());
		}
		return paginate(items, Number(filters?.page) || 1, Number(filters?.pageSize) || 20);
	},
	get: async (id) => {
		if (!USE_MOCK && id) {
			try {
				const res = await api.get(`/brokers/${id}`);
				if (res && res.brokerId) {
					return {
						id: res.brokerId,
						name: res.businessName,
						firmName: res.businessName,
						status: (res.status || "active").toLowerCase(),
						createdAt: res.createdAt
					};
				}
			} catch (err) {
				console.warn(`[ZapDocs] Backend /brokers/${id} failed, using local mock:`, err);
			}
		}
		await delay();
		return getStoredBrokers().find((b) => b.id === id);
	},
	getCreditHistory: async (id) => {
		await delay();
		return mockCreditTransactions.filter((t) => t.brokerId === id);
	},
	updateStatus: async (id, status) => {
		await delay();
		const items = [...getStoredBrokers()];
		const idx = items.findIndex((b) => b.id === id);
		if (idx !== -1) {
			items[idx] = { ...items[idx], status };
			setStoredBrokers(items);
		}
	},
	adjustCredits: async (id, amount, reason) => {
		await delay();
		const items = [...getStoredBrokers()];
		const idx = items.findIndex((b) => b.id === id);
		if (idx !== -1) {
			items[idx] = {
				...items[idx],
				creditBalance: (items[idx].creditBalance || 0) + amount,
				totalCredits: (items[idx].totalCredits || 0) + (amount > 0 ? amount : 0)
			};
			setStoredBrokers(items);
		}
	},
	create: async (data) => {
		if (!USE_MOCK) {
			try {
				const res = await api.post("/brokers", {
					businessName: data.firmName || data.name || "Broker Agency"
				});
				if (res && res.brokerId) {
					const newBroker = {
						id: res.brokerId,
						name: data.name || res.businessName,
						firmName: res.businessName,
						email: data.email,
						phone: data.phone,
						status: "active",
						createdAt: res.createdAt || new Date().toISOString(),
						lastActiveAt: new Date().toISOString(),
						...data
					};
					const items = [...getStoredBrokers()];
					items.unshift(newBroker);
					setStoredBrokers(items);
					return newBroker;
				}
			} catch (err) {
				console.warn("[ZapDocs] Backend /brokers create failed, using local storage:", err);
			}
		}
		await delay(200);
		const fullName = data.name || [data.firstName, data.lastName].filter(Boolean).join(" ");
		const cleanPhone = (data.phone || data.mobile || "").trim();
		const brokerId = data.id || `BRK-${Math.floor(10000 + Math.random() * 90000)}`;
		const nowIso = new Date().toISOString();
		
		const { password: _pw, token: _tok, secret: _sec, ...cleanData } = data || {};
		const newBroker = {
			id: brokerId,
			name: fullName,
			firstName: data.firstName || fullName.split(" ")[0] || "",
			lastName: data.lastName || fullName.split(" ").slice(1).join(" ") || "",
			email: data.email,
			phone: cleanPhone.startsWith("+91") ? cleanPhone : `+91 ${cleanPhone.replace(/\D/g, "").slice(-10)}`,
			mobile: cleanPhone.replace(/\D/g, "").slice(-10),
			addressLine1: data.addressLine1 || "",
			addressLine2: data.addressLine2 || "",
			city: data.city || "",
			district: data.district || "",
			state: data.state || "Karnataka",
			pinCode: data.pinCode || "",
			status: data.status || "active",
			creditBalance: data.creditBalance ?? 50,
			creditsUsed: data.creditsUsed ?? 0,
			totalCredits: data.totalCredits ?? 50,
			plan: data.plan || "Professional",
			firmName: data.firmName || `${fullName} Realty`,
			reraNumber: data.reraNumber || data.regNumber || `PRM/KA/RERA/${Date.now().toString().slice(-6)}`,
			agreementsCreated: data.agreementsCreated ?? 0,
			totalAgreements: data.totalAgreements ?? 0,
			createdAt: data.createdAt || nowIso,
			lastActiveAt: data.lastActiveAt || nowIso,
			...cleanData
		};

		const items = [...getStoredBrokers()];
		items.unshift(newBroker);
		setStoredBrokers(items);
		return newBroker;
	},
	update: async (id, data) => {
		await delay();
		const items = [...getStoredBrokers()];
		const idx = items.findIndex((b) => b.id === id);
		if (idx !== -1) {
			const { password: _pw, token: _tok, secret: _sec, ...cleanData } = data || {};
			items[idx] = {
				...items[idx],
				...cleanData,
				lastActiveAt: new Date().toISOString()
			};
			setStoredBrokers(items);
			return items[idx];
		}
		throw new Error("Broker not found");
	},
	delete: async (id) => {
		await delay();
		const items = [...getStoredBrokers()];
		const idx = items.findIndex((b) => b.id === id);
		if (idx !== -1) {
			const deleted = items.splice(idx, 1)[0];
			setStoredBrokers(items);
			return { success: true, id, data: deleted };
		}
		throw new Error("Broker not found");
	}
};

// ── Chartered Accountant Service ──────────────────────────────
export const caService = {
	list: async (filters) => {
		await delay();
		let items = [...getStoredCAs()];
		if (filters?.search) {
			const q = filters.search.toLowerCase().trim();
			items = items.filter((ca) => ca.name.toLowerCase().includes(q) || (ca.firmName && ca.firmName.toLowerCase().includes(q)) || ca.email.toLowerCase().includes(q) || (ca.phone && ca.phone.toLowerCase().includes(q)) || ca.id.toLowerCase().includes(q) || (ca.membershipNo && ca.membershipNo.toLowerCase().includes(q)) || (ca.firmRegNo && ca.firmRegNo.toLowerCase().includes(q)));
		}
		if (filters?.status && filters.status !== "all") {
			items = items.filter((ca) => ca.status === filters.status);
		}
		if (filters?.state && filters.state !== "all") {
			items = items.filter((ca) => (ca.state || "").toLowerCase() === filters.state.toLowerCase());
		}
		return paginate(items, Number(filters?.page) || 1, Number(filters?.pageSize) || 20);
	},
	get: async (id) => {
		await delay();
		return getStoredCAs().find((ca) => ca.id === id);
	},
	create: async (data) => {
		await delay(200);
		const fullName = data.name.startsWith("CA ") ? data.name : `CA ${data.name}`;
		const cleanPhone = (data.phone || "").trim();
		const caId = data.id || `CA-${Date.now().toString().slice(-5)}`;
		const nowIso = new Date().toISOString();

		const newCA = {
			id: caId,
			name: fullName,
			email: data.email,
			phone: cleanPhone.startsWith("+91") ? cleanPhone : `+91 ${cleanPhone.replace(/\D/g, "").slice(-10)}`,
			state: data.state || "Karnataka",
			status: data.status || "active",
			firmName: data.firmName || `${fullName} & Associates LLP`,
			firmRegNo: data.firmRegNo || data.regNumber || `FRN 0${Date.now().toString().slice(-5)}S`,
			membershipNo: data.membershipNo || `FCA-${Date.now().toString().slice(-6)}`,
			clientCount: data.clientCount ?? 8,
			agreementsManaged: data.agreementsManaged ?? 2,
			practiceArea: data.practiceArea || "Corporate Leases & Real Estate",
			createdAt: data.createdAt || nowIso,
			lastActiveAt: data.lastActiveAt || nowIso,
			...data
		};
		const items = [...getStoredCAs()];
		items.unshift(newCA);
		setStoredCAs(items);
		return newCA;
	},
	delete: async (id) => {
		await delay();
		const items = [...getStoredCAs()];
		const idx = items.findIndex((c) => c.id === id);
		if (idx !== -1) {
			const deleted = items.splice(idx, 1)[0];
			setStoredCAs(items);
			return { success: true, id, data: deleted };
		}
		return { success: false };
	},
	update: async (id, data) => {
		await delay();
		const items = [...getStoredCAs()];
		const idx = items.findIndex((c) => c.id === id);
		if (idx !== -1) {
			items[idx] = {
				...items[idx],
				...data,
				lastActiveAt: new Date().toISOString()
			};
			setStoredCAs(items);
			return items[idx];
		}
		throw new Error("CA not found");
	},
	updateStatus: async (id, status) => {
		await delay();
		const items = [...getStoredCAs()];
		const idx = items.findIndex((c) => c.id === id);
		if (idx !== -1) {
			items[idx] = { ...items[idx], status };
			setStoredCAs(items);
		}
	}
};
// ── Jurisdiction Service ──────────────────────────────────────
export const jurisdictionService = {
	list: async () => {
		await delay();
		return [...mockJurisdictions];
	},
	get: async (id) => {
		await delay();
		return mockJurisdictions.find((j) => j.id === id);
	},
	toggle: async (id, enabled) => {
		await delay();
		const j = mockJurisdictions.find((item) => item.id === id);
		if (j) {
			j.enabled = enabled;
			j.status = enabled ? "active" : "inactive";
			j.lastUpdated = new Date().toISOString();
		}
		console.log("PATCH /admin/jurisdictions/" + id, { enabled });
	},
	create: async (data) => {
		await delay();
		const newJur = {
			...data,
			id: `jur_${data.code || Math.random().toString(36).substring(2, 6).toUpperCase()}`,
			lastUpdated: new Date().toISOString()
		};
		mockJurisdictions.unshift(newJur);
		console.log("POST /admin/jurisdictions", newJur);
		return newJur;
	},
	update: async (id, updates) => {
		await delay();
		const idx = mockJurisdictions.findIndex((j) => j.id === id);
		if (idx !== -1) {
			mockJurisdictions[idx] = {
				...mockJurisdictions[idx],
				...updates,
				lastUpdated: new Date().toISOString()
			};
			console.log("PUT /admin/jurisdictions/" + id, mockJurisdictions[idx]);
			return mockJurisdictions[idx];
		}
		throw new Error("Jurisdiction not found");
	}
};
// ── Rule Service ──────────────────────────────────────────────
export const ruleService = {
	list: async () => {
		await delay();
		return [...mockRules];
	},
	get: async (id) => {
		await delay();
		return mockRules.find((r) => r.id === id);
	},
	create: async (data) => {
		await delay();
		const statePrefix = (data.state || data.jurisdiction || "KA").substring(0, 2).toUpperCase();
		const newRule = {
			...data,
			id: `rule_${statePrefix}_${Date.now().toString().slice(-4)}`,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};
		mockRules.unshift(newRule);
		return newRule;
	},
	update: async (id, updates) => {
		await delay();
		const idx = mockRules.findIndex((r) => r.id === id);
		if (idx !== -1) {
			mockRules[idx] = {
				...mockRules[idx],
				...updates,
				updatedAt: new Date().toISOString()
			};
			return mockRules[idx];
		}
		throw new Error("Rule not found");
	},
	delete: async (id) => {
		await delay();
		const idx = mockRules.findIndex((r) => r.id === id);
		if (idx !== -1) {
			const deleted = mockRules.splice(idx, 1)[0];
			return { success: true, id, data: deleted };
		}
		throw new Error("Rule not found");
	},
	updateStatus: async (id, status) => {
		await delay();
		const r = mockRules.find((x) => x.id === id);
		if (r) {
			r.status = status;
			r.updatedAt = new Date().toISOString();
		}
		console.log("PATCH /admin/rules/" + id + "/status", { status });
	}
};
// ── Template Service ──────────────────────────────────────────
export const templateService = {
	list: async () => {
		await delay();
		return [...mockTemplates];
	},
	get: async (id) => {
		await delay();
		return mockTemplates.find((t) => t.id === id);
	},
	create: async (data) => {
		await delay();
		const statePrefix = (data.state || data.jurisdiction || "IN").substring(0, 2).toUpperCase();
		const newTmpl = {
			...data,
			id: `tmpl_${statePrefix}_${Math.random().toString(36).substring(2, 7)}`,
			updatedAt: new Date().toISOString()
		};
		mockTemplates.unshift(newTmpl);
		console.log("POST /admin/templates", newTmpl);
		return newTmpl;
	},
	update: async (id, updates) => {
		await delay();
		const idx = mockTemplates.findIndex((t) => t.id === id);
		if (idx !== -1) {
			mockTemplates[idx] = {
				...mockTemplates[idx],
				...updates,
				updatedAt: new Date().toISOString()
			};
			console.log("PUT /admin/templates/" + id, mockTemplates[idx]);
			return mockTemplates[idx];
		}
		throw new Error("Template not found");
	},
	delete: async (id) => {
		await delay();
		const idx = mockTemplates.findIndex((t) => t.id === id);
		if (idx !== -1) {
			const deleted = mockTemplates.splice(idx, 1)[0];
			return { success: true, id, data: deleted };
		}
		throw new Error("Template not found");
	}
};
// ── Payment Service ───────────────────────────────────────────
export const paymentService = {
	list: async (filters) => {
		await delay();
		let items = [...mockPayments];
		if (filters?.status) items = items.filter((p) => p.status === filters.status);
		return paginate(items, Number(filters?.page) || 1, 20);
	},
	get: async (id) => {
		await delay();
		return mockPayments.find((p) => p.id === id);
	},
	createOrder: async (orderPayload) => {
		if (!USE_MOCK) {
			try {
				const res = await api.post("/payments/orders", orderPayload);
				if (res && (res.orderId || res.order_id)) return res;
			} catch (err) {
				console.warn("[ZapDocs] Backend /payments/orders call failed, using mock order:", err);
			}
		}
		await delay();
		return {
			orderId: `order_${Date.now().toString(36)}`,
			amount: orderPayload?.amount || 49900,
			currency: "INR",
			status: "created"
		};
	}
};
// ── eStamp Service ────────────────────────────────────────────
export const estampService = {
	list: async (filters) => {
		await delay();
		let items = [...mockEStamps];
		if (filters?.status) items = items.filter((e) => e.status === filters.status);
		return paginate(items, Number(filters?.page) || 1, 20);
	},
	get: async (id) => {
		await delay();
		return mockEStamps.find((e) => e.id === id);
	},
	retry: async (id) => {
		const stamp = mockEStamps.find((e) => e.id === id);
		if (!stamp) throw new Error("eStamp record not found");
		const result = await failoverService.executeWithFailover("estamp", stamp.id, "stamp_procure", async (provider) => {
			await delay(500);
			stamp.retryCount = (stamp.retryCount || 0) + 1;
			stamp.status = "completed";
			stamp.vendor = provider;
			stamp.completedAt = new Date().toISOString();
			stamp.errorMessage = undefined;
			stamp.certificateNumber = `IN-${stamp.state === "Karnataka" ? "KA" : stamp.state === "Telangana" ? "TG" : "MH"}${Math.floor(1e7 + Math.random() * 9e7)}S`;
			stamp.providerRef = `TXN-${provider.split(" ")[0].toUpperCase()}-${Date.now().toString().slice(-6)}`;
			return stamp;
		});
		return result;
	}
};
// ── eSign Service ─────────────────────────────────────────────
export const esignService = {
	list: async (filters) => {
		await delay();
		return paginate(mockESigns, Number(filters?.page) || 1, 20);
	},
	get: async (id) => {
		await delay();
		return mockESigns.find((e) => e.id === id);
	},
	resendInvite: async (id) => {
		const sign = mockESigns.find((s) => s.id === id);
		if (!sign) throw new Error("eSign record not found");
		const result = await failoverService.executeWithFailover("esign", sign.id, "resend_invitation", async (provider) => {
			await delay(450);
			sign.provider = provider;
			sign.sentAt = new Date().toISOString();
			if (sign.status === "failed") {
				sign.status = "pending";
				sign.errorMessage = undefined;
			}
			return sign;
		});
		return result;
	}
};
// ── Audit Service ─────────────────────────────────────────────
export const auditService = { list: async (filters) => {
	await delay();
	let items = [...mockAuditLogs];
	if (filters?.actorRole) items = items.filter((l) => l.actorRole === filters.actorRole);
	if (filters?.result) items = items.filter((l) => l.result === filters.result);
	if (filters?.search) {
		const q = filters.search.toLowerCase();
		items = items.filter((l) => l.action.toLowerCase().includes(q) || (l.entityId && l.entityId.toLowerCase().includes(q)) || (l.actor && l.actor.toLowerCase().includes(q)) || (l.actorEmail && l.actorEmail.toLowerCase().includes(q)));
	}
	if (filters?.date) {
		const now = new Date("2026-10-07T23:59:59Z");
		if (filters.date === "today") {
			items = items.filter((l) => (l.timestamp || "").slice(0, 10) === "2026-10-07");
		} else if (filters.date === "week") {
			const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
			items = items.filter((l) => new Date(l.timestamp) >= sevenDaysAgo);
		} else if (filters.date === "month") {
			const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
			items = items.filter((l) => new Date(l.timestamp) >= thirtyDaysAgo);
		}
	}
	return paginate(items, Number(filters?.page) || 1, Number(filters?.pageSize) || 20);
} };
// ── Notification Service ──────────────────────────────────────
export const notificationService = {
	list: async (filters) => {
		await delay();
		let items = [...getStoredNotifications()];
		if (filters?.status) {
			const s = filters.status.toLowerCase();
			items = items.filter((n) => (n.readStatus || "read").toLowerCase() === s || (n.status || "").toLowerCase() === s);
		}
		return paginate(items, Number(filters?.page) || 1, Number(filters?.pageSize) || 20);
	},
	markAsRead: async (id) => {
		await delay(150);
		const items = [...getStoredNotifications()];
		const idx = items.findIndex((n) => n.id === id);
		if (idx !== -1) {
			items[idx] = { ...items[idx], readStatus: "Read" };
			setStoredNotifications(items);
			return items[idx];
		}
	},
	markAsUnread: async (id) => {
		await delay(150);
		const items = [...getStoredNotifications()];
		const idx = items.findIndex((n) => n.id === id);
		if (idx !== -1) {
			items[idx] = { ...items[idx], readStatus: "Unread" };
			setStoredNotifications(items);
			return items[idx];
		}
	},
	markAllAsRead: async () => {
		await delay(200);
		const items = getStoredNotifications().map((n) => ({ ...n, readStatus: "Read" }));
		setStoredNotifications(items);
		return items;
	},
	broadcast: async (data) => {
		await delay(200);
		const items = [...getStoredNotifications()];
		const newNotif = {
			id: `ntf_${Date.now().toString(36)}`,
			title: data.title,
			message: data.message,
			category: data.category || "System",
			priority: data.priority || "Normal",
			recipient: data.recipient || "All Users",
			relatedId: data.relatedId || `SYS-${Math.floor(1000 + Math.random() * 9000)}`,
			status: "sent",
			readStatus: "Unread",
			createdAt: new Date().toISOString(),
			sentAt: new Date().toISOString(),
			type: data.type || "system_announcement"
		};
		items.unshift(newNotif);
		setStoredNotifications(items);
		return newNotif;
	}
};
// ── System Service ────────────────────────────────────────────
export const systemService = { getProviderHealth: async () => {
	await delay();
	return mockProviders;
} };
// ── Revenue Service ───────────────────────────────────────────
export const revenueService = {
	getStats: async () => {
		await delay();
		return getDynamicRevenueStats();
	},
	list: async (category, filters) => {
		await delay();
		let items = [...mockRevenueRecords];
		if (category && category !== "overview" && category !== "total-revenue") {
			if (category === "estamp-revenue") {
				items = items.filter((r) => r.category === "estamp");
			} else if (category === "esign-revenue") {
				items = items.filter((r) => r.category === "esign");
			} else if (category === "compliance-revenue") {
				items = items.filter((r) => ["compliance", "platform", "bundle"].includes(r.category));
			}
		}
		if (filters?.search) {
			const q = filters.search.toLowerCase().trim();
			items = items.filter((r) => r.transactionRef.toLowerCase().includes(q) || r.customerName.toLowerCase().includes(q) || r.agreementId.toLowerCase().includes(q) || r.settlementId.toLowerCase().includes(q) || r.state && r.state.toLowerCase().includes(q) || r.provider && r.provider.toLowerCase().includes(q) || r.typeLabel.toLowerCase().includes(q));
		}
		if (filters?.status) {
			items = items.filter((r) => r.status === filters.status);
		}
		if (filters?.state) {
			items = items.filter((r) => r.state?.toLowerCase() === filters.state.toLowerCase());
		}
		if (filters?.category && filters.category !== "all") {
			if (filters.category === "compliance") {
				items = items.filter((r) => ["compliance", "platform", "bundle"].includes(r.category));
			} else {
				items = items.filter((r) => r.category === filters.category);
			}
		}
		return paginate(items, Number(filters?.page) || 1, Number(filters?.pageSize) || 20);
	},
	get: async (id) => {
		await delay();
		return mockRevenueRecords.find((r) => r.id === id);
	}
};
// ── Purchase Service (eStamp & eSign Operational Purchases) ───
export const purchaseService = {
	getStats: async () => {
		await delay();
		const s = getDynamicRevenueStats();
		return {
			totalSpent: s.totalProviderCost,
			estampSpent: s.estampCost,
			esignSpent: s.esignCost,
			estampCount: s.estampCertCount,
			esignCount: s.esignCount,
			totalCount: s.estampCertCount + s.esignCount
		};
	},
	list: async (category, filters) => {
		await delay();
		let items = mockRevenueRecords.filter((r) => r.category === "estamp" || r.category === "esign");
		if (category === "estamp-purchases") {
			items = items.filter((r) => r.category === "estamp");
		} else if (category === "esign-purchases") {
			items = items.filter((r) => r.category === "esign");
		}
		if (filters?.search) {
			const q = filters.search.toLowerCase().trim();
			items = items.filter(
				(r) =>
					r.transactionRef.toLowerCase().includes(q) ||
					r.customerName.toLowerCase().includes(q) ||
					r.agreementId.toLowerCase().includes(q) ||
					(r.state && r.state.toLowerCase().includes(q)) ||
					(r.provider && r.provider.toLowerCase().includes(q))
			);
		}
		if (filters?.status) {
			items = items.filter((r) => r.status === filters.status);
		}
		if (filters?.state) {
			items = items.filter((r) => r.state?.toLowerCase() === filters.state.toLowerCase());
		}
		return paginate(items, Number(filters?.page) || 1, Number(filters?.pageSize) || 20);
	},
	get: async (id) => {
		await delay();
		return mockRevenueRecords.find((r) => (r.category === "estamp" || r.category === "esign") && r.id === id);
	}
};
if (!USE_MOCK) {
	// Production: re-export real api client wrappers
	// (replace mock implementations above with api.get/post calls)
	console.info("[ZapDocs] Running in live API mode. Backend:", import.meta.env.VITE_API_BASE_URL);
}
