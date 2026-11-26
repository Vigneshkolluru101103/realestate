// ── Dashboard ─────────────────────────────────────────────────
export const mockDashboardStats = {
	totalAgreements: 10,
	agreementsToday: 4,
	pendingAgreements: 6,
	completedAgreements: 2,
	totalCustomers: 31,
	individualCustomers: 11,
	totalBrokers: 10,
	totalCAs: 10,
	pendingPayments: 0,
	failedTransactions: 1
};
export const mockRecentActivity = [
	{
		id: "act-001",
		type: "agreement_created",
		description: "Agreement agr_KA2E9X created by Broker Ramesh Kumar",
		entityId: "agr_KA2E9X",
		entityType: "agreement",
		timestamp: "2026-10-07T11:42:00Z",
		status: "info"
	},
	{
		id: "act-002",
		type: "payment_captured",
		description: "Payment ₹3,500 captured for agr_KA2E8W",
		entityId: "agr_KA2E8W",
		entityType: "payment",
		timestamp: "2026-10-07T11:38:00Z",
		status: "success"
	},
	{
		id: "act-003",
		type: "estamp_completed",
		description: "eStamp completed for agr_KA2E7V — Karnataka, ₹500",
		entityId: "agr_KA2E7V",
		entityType: "estamp",
		timestamp: "2026-10-07T11:30:00Z",
		status: "success"
	},
	{
		id: "act-004",
		type: "signer1_signed",
		description: "Signer 1 (Landlord) completed signing for agr_KA2E6U",
		entityId: "agr_KA2E6U",
		entityType: "esign",
		timestamp: "2026-10-07T11:22:00Z",
		status: "success"
	},
	{
		id: "act-005",
		type: "signer2_invited",
		description: "Tenant (Signer 2) invite sent via SMS for agr_KA2E5T",
		entityId: "agr_KA2E5T",
		entityType: "esign",
		timestamp: "2026-10-07T11:15:00Z",
		status: "info"
	},
	{
		id: "act-006",
		type: "agreement_finalized",
		description: "Agreement agr_KA2E4S finalized — final bundle stored",
		entityId: "agr_KA2E4S",
		entityType: "agreement",
		timestamp: "2026-10-07T10:58:00Z",
		status: "success"
	},
	{
		id: "act-007",
		type: "payment_failed",
		description: "Payment failed for agr_KA2E3R — Razorpay: insufficient funds",
		entityId: "agr_KA2E3R",
		entityType: "payment",
		timestamp: "2026-10-07T10:44:00Z",
		status: "error"
	},
	{
		id: "act-008",
		type: "estamp_failed",
		description: "eStamp provider timeout for agr_KA2E2Q — retry queued",
		entityId: "agr_KA2E2Q",
		entityType: "estamp",
		timestamp: "2026-10-07T10:30:00Z",
		status: "error"
	}
];
export const mockSystemAlerts = [
	{
		id: "alr-001",
		type: "payment_failure",
		message: "3 payments in reconciliation state — manual review required",
		severity: "high",
		createdAt: "2026-10-07T10:00:00Z"
	},
	{
		id: "alr-002",
		type: "provider_failure",
		message: "eStamp provider returned timeout on 2 requests (retry #1 queued)",
		severity: "medium",
		createdAt: "2026-10-07T10:30:00Z"
	},
	{
		id: "alr-003",
		type: "rule_issue",
		message: "Karnataka rule v1.1 draft awaiting admin approval",
		severity: "low",
		createdAt: "2026-10-06T18:00:00Z"
	}
];
// ── Agreements ────────────────────────────────────────────────
export const mockAgreements = [
	{
		id: "agr_MH8F3A",
		docReferenceId: "ZD-MH-202610-MH8F3A",
		customerName: "Amit Deshmukh",
		customerEmail: "amit.d@gmail.com",
		brokerName: "Pooja Deshmukh",
		propertyAddress: "Flat 402, Clover Highlands, NIBM Road, Pune",
		state: "Maharashtra",
		pinCode: "411048",
		monthlyRent: 38e3,
		securityDeposit: 15e4,
		status: "completed",
		paymentStatus: "captured",
		estampStatus: "completed",
		esignStatus: "completed",
		ruleVersion: "1.2",
		templateVersion: "2.0",
		createdAt: "2026-10-06T15:30:00Z",
		updatedAt: "2026-10-07T11:10:00Z",
		completedAt: "2026-10-07T11:10:00Z"
	},
	{
		id: "agr_TL5C2B",
		docReferenceId: "ZD-TL-202610-TL5C2B",
		customerName: "Sai Kiran Rao",
		customerEmail: "saikiran.rao@gmail.com",
		brokerName: "Hyderabad Premier Living",
		propertyAddress: "Tower B, Flat 804, My Home Bhooja, HITEC City, Hyderabad",
		state: "Telangana",
		pinCode: "500081",
		monthlyRent: 42e3,
		securityDeposit: 126e3,
		status: "signing_pending",
		paymentStatus: "captured",
		estampStatus: "completed",
		esignStatus: "signer1_invited",
		ruleVersion: "1.1",
		templateVersion: "1.5",
		createdAt: "2026-10-07T09:15:00Z",
		updatedAt: "2026-10-07T11:05:00Z"
	},
	{
		id: "agr_KA2E9X",
		docReferenceId: "ZD-KA-202610-KA2E9X",
		customerName: "Anand Mehta",
		customerEmail: "anand.m@gmail.com",
		customerPhone: "+91 98765 43210",
		brokerName: "Ramesh Kumar",
		propertyAddress: "No. 14, 3rd Cross, Indiranagar, Bengaluru",
		state: "Karnataka",
		pinCode: "560038",
		monthlyRent: 28e3,
		securityDeposit: 84e3,
		status: "draft",
		paymentStatus: "not_started",
		estampStatus: "not_started",
		esignStatus: "not_started",
		ruleVersion: "1.0",
		templateVersion: "1.0",
		createdAt: "2026-10-07T11:42:00Z",
		updatedAt: "2026-10-07T11:42:00Z"
	},
	{
		id: "agr_KA2E8W",
		docReferenceId: "ZD-KA-202610-KA2E8W",
		customerName: "Priya Nair",
		customerEmail: "priya.nair@outlook.com",
		customerPhone: "+91 87654 32109",
		brokerName: "Sujatha Brokers",
		propertyAddress: "Flat 202, Palm Grove, Koramangala, Bengaluru",
		state: "Karnataka",
		pinCode: "560034",
		monthlyRent: 35e3,
		securityDeposit: 105e3,
		status: "estamp_pending",
		paymentStatus: "captured",
		estampStatus: "pending",
		esignStatus: "not_started",
		ruleVersion: "1.0",
		templateVersion: "1.0",
		createdAt: "2026-10-07T10:20:00Z",
		updatedAt: "2026-10-07T11:38:00Z"
	},
	{
		id: "agr_KA2E7V",
		docReferenceId: "ZD-KA-202610-KA2E7V",
		customerName: "Suresh Pillai",
		customerEmail: "suresh.p@gmail.com",
		customerPhone: "+91 76543 21098",
		brokerName: null,
		propertyAddress: "45, Jayanagar 4th Block, Bengaluru",
		state: "Karnataka",
		pinCode: "560041",
		monthlyRent: 2e4,
		securityDeposit: 6e4,
		status: "signing_pending",
		paymentStatus: "captured",
		estampStatus: "completed",
		esignStatus: "signer1_invited",
		ruleVersion: "1.0",
		templateVersion: "1.0",
		createdAt: "2026-10-06T14:10:00Z",
		updatedAt: "2026-10-07T11:30:00Z"
	},
	{
		id: "agr_KA2E6U",
		docReferenceId: "ZD-KA-202610-KA2E6U",
		customerName: "Lakshmi Devi",
		customerEmail: "lakshmi.d@yahoo.com",
		customerPhone: "+91 65432 10987",
		brokerName: "Ramesh Kumar",
		propertyAddress: "7B, MG Road Apartments, Bengaluru",
		state: "Karnataka",
		pinCode: "560001",
		monthlyRent: 45e3,
		securityDeposit: 18e4,
		status: "signer2_invited",
		paymentStatus: "captured",
		estampStatus: "completed",
		esignStatus: "signer1_signed",
		ruleVersion: "1.0",
		templateVersion: "1.0",
		createdAt: "2026-10-06T09:00:00Z",
		updatedAt: "2026-10-07T11:22:00Z"
	},
	{
		id: "agr_KA2E5T",
		docReferenceId: "ZD-KA-202610-KA2E5T",
		customerName: "Vikram Sharma",
		customerEmail: "vikram.s@gmail.com",
		customerPhone: "+91 54321 09876",
		brokerName: "PropRight Realty",
		propertyAddress: "No. 9, HSR Layout, Sector 1, Bengaluru",
		state: "Karnataka",
		pinCode: "560102",
		monthlyRent: 32e3,
		securityDeposit: 96e3,
		status: "signer2_invited",
		paymentStatus: "captured",
		estampStatus: "completed",
		esignStatus: "signer2_invited",
		ruleVersion: "1.0",
		templateVersion: "1.0",
		createdAt: "2026-10-05T16:30:00Z",
		updatedAt: "2026-10-07T11:15:00Z"
	},
	{
		id: "agr_KA2E4S",
		docReferenceId: "ZD-KA-202610-KA2E4S",
		customerName: "Kavitha Rao",
		customerEmail: "kavitha.r@gmail.com",
		customerPhone: "+91 43210 98765",
		brokerName: "PropRight Realty",
		propertyAddress: "No. 22, Whitefield, Bengaluru",
		state: "Karnataka",
		pinCode: "560066",
		monthlyRent: 25e3,
		securityDeposit: 75e3,
		status: "completed",
		paymentStatus: "captured",
		estampStatus: "completed",
		esignStatus: "completed",
		ruleVersion: "1.0",
		templateVersion: "1.0",
		createdAt: "2026-10-04T11:00:00Z",
		updatedAt: "2026-10-07T10:58:00Z",
		completedAt: "2026-10-07T10:58:00Z"
	},
	{
		id: "agr_KA2E3R",
		docReferenceId: "ZD-KA-202610-KA2E3R",
		customerName: "Rajan Nair",
		customerEmail: "rajan.n@gmail.com",
		customerPhone: "+91 32109 87654",
		brokerName: null,
		propertyAddress: "Plot 12, Electronic City, Bengaluru",
		state: "Karnataka",
		pinCode: "560100",
		monthlyRent: 18e3,
		securityDeposit: 54e3,
		status: "payment_pending",
		paymentStatus: "failed",
		estampStatus: "not_started",
		esignStatus: "not_started",
		ruleVersion: "1.0",
		templateVersion: "1.0",
		createdAt: "2026-10-07T08:00:00Z",
		updatedAt: "2026-10-07T10:44:00Z"
	},
	{
		id: "agr_KA2E2Q",
		docReferenceId: "ZD-KA-202610-KA2E2Q",
		customerName: "Deepa Krishnan",
		customerEmail: "deepa.k@outlook.com",
		customerPhone: "+91 21098 76543",
		brokerName: "Sujatha Brokers",
		propertyAddress: "No. 5, Malleshwaram, Bengaluru",
		state: "Karnataka",
		pinCode: "560003",
		monthlyRent: 22e3,
		securityDeposit: 66e3,
		status: "estamp_pending",
		paymentStatus: "captured",
		estampStatus: "retry_required",
		esignStatus: "not_started",
		ruleVersion: "1.0",
		templateVersion: "1.0",
		createdAt: "2026-10-06T12:00:00Z",
		updatedAt: "2026-10-07T10:30:00Z"
	}
];
// ── Customers ─────────────────────────────────────────────────
export const mockCustomers = [
	{
		id: "usr_10245",
		name: "Rahul Kumar",
		email: "rahul@example.com",
		phone: "+91 98765 1234",
		state: "Karnataka",
		agreementCount: 3,
		pendingAgreements: 1,
		status: "active",
		createdAt: "2026-08-10T10:00:00Z",
		lastActiveAt: "2026-10-06T11:42:00Z"
	},
	{
		id: "usr_C001",
		name: "Anand Mehta",
		email: "anand.m@gmail.com",
		phone: "+91 98765 43210",
		state: "Karnataka",
		agreementCount: 2,
		pendingAgreements: 1,
		status: "active",
		createdAt: "2026-08-15T10:00:00Z",
		lastActiveAt: "2026-10-07T11:42:00Z"
	},
	{
		id: "usr_C002",
		name: "Priya Nair",
		email: "priya.nair@outlook.com",
		phone: "+91 87654 32109",
		state: "Karnataka",
		agreementCount: 3,
		pendingAgreements: 1,
		status: "active",
		createdAt: "2026-07-20T09:00:00Z",
		lastActiveAt: "2026-10-07T10:20:00Z"
	},
	{
		id: "usr_C003",
		name: "Suresh Pillai",
		email: "suresh.p@gmail.com",
		phone: "+91 76543 21098",
		state: "Karnataka",
		agreementCount: 1,
		pendingAgreements: 1,
		status: "active",
		createdAt: "2026-09-01T11:00:00Z",
		lastActiveAt: "2026-10-06T14:10:00Z"
	},
	{
		id: "usr_C004",
		name: "Lakshmi Devi",
		email: "lakshmi.d@yahoo.com",
		phone: "+91 65432 10987",
		state: "Karnataka",
		agreementCount: 4,
		pendingAgreements: 0,
		status: "active",
		createdAt: "2026-06-10T08:00:00Z",
		lastActiveAt: "2026-10-06T09:00:00Z"
	},
	{
		id: "usr_C005",
		name: "Vikram Sharma",
		email: "vikram.s@gmail.com",
		phone: "+91 54321 09876",
		state: "Karnataka",
		agreementCount: 1,
		pendingAgreements: 1,
		status: "active",
		createdAt: "2026-09-25T15:00:00Z",
		lastActiveAt: "2026-10-05T16:30:00Z"
	},
	{
		id: "usr_C006",
		name: "Kavitha Rao",
		email: "kavitha.r@gmail.com",
		phone: "+91 43210 98765",
		state: "Karnataka",
		agreementCount: 2,
		pendingAgreements: 0,
		status: "active",
		createdAt: "2026-08-01T10:00:00Z",
		lastActiveAt: "2026-10-07T10:58:00Z"
	},
	{
		id: "usr_C007",
		name: "Rajan Nair",
		email: "rajan.n@gmail.com",
		phone: "+91 32109 87654",
		state: "Karnataka",
		agreementCount: 1,
		pendingAgreements: 1,
		status: "active",
		createdAt: "2026-10-01T09:00:00Z",
		lastActiveAt: "2026-10-07T10:44:00Z"
	},
	{
		id: "usr_C008",
		name: "Deepa Krishnan",
		email: "deepa.k@outlook.com",
		phone: "+91 21098 76543",
		state: "Karnataka",
		agreementCount: 2,
		pendingAgreements: 0,
		status: "inactive",
		createdAt: "2026-07-05T14:00:00Z",
		lastActiveAt: "2026-10-06T12:00:00Z"
	},
	{
		id: "usr_C009",
		name: "Amit Deshmukh",
		email: "amit.d@gmail.com",
		phone: "+91 99123 45678",
		state: "Maharashtra",
		agreementCount: 2,
		pendingAgreements: 0,
		status: "active",
		createdAt: "2026-09-10T09:00:00Z",
		lastActiveAt: "2026-10-07T11:10:00Z"
	},
	{
		id: "usr_C010",
		name: "Sai Kiran Rao",
		email: "saikiran.rao@gmail.com",
		phone: "+91 94401 23456",
		state: "Telangana",
		agreementCount: 1,
		pendingAgreements: 1,
		status: "active",
		createdAt: "2026-09-12T10:00:00Z",
		lastActiveAt: "2026-10-07T11:05:00Z"
	}
];
export const mockGuestSigners = [
	{
		id: "gs_001",
		executionId: "agr_KA2E6U",
		name: "Mohan Verma",
		phone: "+91 99887 76655",
		signerNumber: 2,
		status: "invited",
		invitedAt: "2026-10-07T11:22:00Z"
	},
	{
		id: "gs_002",
		executionId: "agr_KA2E5T",
		name: "Sita Ram",
		phone: "+91 88776 65544",
		signerNumber: 2,
		status: "session_created",
		invitedAt: "2026-10-07T11:15:00Z"
	},
	{
		id: "gs_003",
		executionId: "agr_KA2E4S",
		name: "Asha Devi",
		phone: "+91 77665 54433",
		signerNumber: 2,
		status: "signed",
		invitedAt: "2026-10-07T09:00:00Z",
		signedAt: "2026-10-07T10:45:00Z"
	}
];
// ── Brokers ───────────────────────────────────────────────────
export const mockBrokers = [
	{
		id: "BRK-10245",
		name: "Suresh Kumar",
		email: "suresh@example.com",
		phone: "+91 98765 12345",
		firmName: "Kumar Realty & Associates",
		state: "Karnataka",
		status: "active",
		creditBalance: 42,
		creditsUsed: 58,
		totalCredits: 100,
		plan: "Professional",
		agreementsCreated: 18,
		totalAgreements: 18,
		reraNumber: "PRM/KA/RERA/1251/310/AG/220915/001892",
		createdAt: "2026-01-15T09:00:00Z",
		lastActiveAt: "2026-10-06T15:30:00Z"
	},
	{
		id: "BRK-10246",
		name: "Ramesh Kumar",
		email: "ramesh@rkconsultants.in",
		phone: "+91 98765 11111",
		firmName: "RK Property Consultants",
		state: "Karnataka",
		status: "active",
		creditBalance: 145,
		creditsUsed: 155,
		totalCredits: 300,
		plan: "Enterprise",
		agreementsCreated: 312,
		totalAgreements: 32,
		reraNumber: "PRM/KA/RERA/1251/308/AG/210412/000943",
		createdAt: "2025-11-01T10:00:00Z",
		lastActiveAt: "2026-10-07T11:42:00Z"
	},
	{
		id: "BRK-10247",
		name: "Pooja Deshmukh",
		email: "pooja@mumbaiproperties.in",
		phone: "+91 98200 45678",
		firmName: "Prime Mumbai Properties",
		state: "Maharashtra",
		status: "active",
		creditBalance: 65,
		creditsUsed: 35,
		totalCredits: 100,
		plan: "Professional",
		agreementsCreated: 24,
		totalAgreements: 24,
		reraNumber: "A51900028472",
		createdAt: "2026-02-10T11:30:00Z",
		lastActiveAt: "2026-10-07T08:15:00Z"
	},
	{
		id: "BRK-10248",
		name: "Sujatha Realtors",
		email: "admin@sujathabrokers.com",
		phone: "+91 87654 22222",
		firmName: "Sujatha Realty",
		state: "Karnataka",
		status: "active",
		creditBalance: 8,
		creditsUsed: 92,
		totalCredits: 100,
		plan: "Standard",
		agreementsCreated: 187,
		totalAgreements: 29,
		reraNumber: "PRM/KA/RERA/1251/310/AG/230110/003421",
		createdAt: "2026-01-20T14:15:00Z",
		lastActiveAt: "2026-10-07T10:30:00Z"
	},
	{
		id: "BRK-10249",
		name: "Aditya Patil",
		email: "aditya.patil@punerealty.com",
		phone: "+91 97654 33221",
		firmName: "Pune Urban Real Estate",
		state: "Maharashtra",
		status: "active",
		creditBalance: 12,
		creditsUsed: 38,
		totalCredits: 50,
		plan: "Standard",
		agreementsCreated: 14,
		totalAgreements: 14,
		reraNumber: "A52100019284",
		createdAt: "2026-03-05T09:45:00Z",
		lastActiveAt: "2026-10-06T17:20:00Z"
	},
	{
		id: "BRK-10250",
		name: "Karthik Raja",
		email: "karthik@hyderabadliving.com",
		phone: "+91 99887 76655",
		firmName: "Hyderabad Premier Living",
		state: "Telangana",
		status: "active",
		creditBalance: 88,
		creditsUsed: 62,
		totalCredits: 150,
		plan: "Professional",
		agreementsCreated: 21,
		totalAgreements: 21,
		reraNumber: "TSRERA/HYD/2023/004120",
		createdAt: "2026-02-18T16:20:00Z",
		lastActiveAt: "2026-10-05T14:10:00Z"
	},
	{
		id: "BRK-10251",
		name: "Neha Kulkarni",
		email: "neha@thaneestates.in",
		phone: "+91 91234 56789",
		firmName: "Thane Green Estates",
		state: "Maharashtra",
		status: "active",
		creditBalance: 24,
		creditsUsed: 26,
		totalCredits: 50,
		plan: "Standard",
		agreementsCreated: 9,
		totalAgreements: 9,
		reraNumber: "A51700034190",
		createdAt: "2026-04-12T10:10:00Z",
		lastActiveAt: "2026-10-04T12:00:00Z"
	},
	{
		id: "BRK-10252",
		name: "Manjunath Gowda",
		email: "manju@mysorehomes.co",
		phone: "+91 94481 23456",
		firmName: "Heritage Realty Mysore",
		state: "Karnataka",
		status: "active",
		creditBalance: 31,
		creditsUsed: 19,
		totalCredits: 50,
		plan: "Standard",
		agreementsCreated: 11,
		totalAgreements: 11,
		reraNumber: "PRM/KA/RERA/1251/311/AG/240201/005612",
		createdAt: "2026-05-01T12:00:00Z",
		lastActiveAt: "2026-10-03T16:45:00Z"
	},
	{
		id: "BRK-10253",
		name: "HomeLink Services",
		email: "contact@homelink.in",
		phone: "+91 96543 44444",
		firmName: "HomeLink Realty Hub",
		state: "Karnataka",
		status: "inactive",
		creditBalance: 0,
		creditsUsed: 50,
		totalCredits: 50,
		plan: "Basic",
		agreementsCreated: 16,
		totalAgreements: 16,
		reraNumber: "PRM/KA/RERA/1251/310/AG/210819/001402",
		createdAt: "2025-10-15T08:00:00Z",
		lastActiveAt: "2026-08-15T16:00:00Z"
	},
	{
		id: "BRK-10254",
		name: "Apex Realty Solutions",
		email: "contact@apexrealty.co",
		phone: "+91 93210 98765",
		firmName: "Apex Realty Solutions LLP",
		state: "Maharashtra",
		status: "inactive",
		creditBalance: 0,
		creditsUsed: 100,
		totalCredits: 100,
		plan: "Professional",
		agreementsCreated: 40,
		totalAgreements: 40,
		reraNumber: "A52000045612",
		createdAt: "2025-08-20T11:00:00Z",
		lastActiveAt: "2026-07-28T14:30:00Z"
	}
];
export const mockCreditTransactions = [
	(
	// Transactions for BRK-10245 (Suresh Kumar)
	{
		id: "ctx_101",
		brokerId: "BRK-10245",
		type: "debit",
		amount: -1,
		description: "Agreement Created",
		balance: 42,
		executionId: "agr_KA2E9X",
		createdAt: "2026-10-06T15:30:00Z"
	}),
	{
		id: "ctx_102",
		brokerId: "BRK-10245",
		type: "credit",
		amount: 20,
		description: "Credit Purchase",
		balance: 43,
		createdAt: "2026-10-01T10:00:00Z"
	},
	{
		id: "ctx_103",
		brokerId: "BRK-10245",
		type: "debit",
		amount: -1,
		description: "Agreement Created",
		balance: 23,
		executionId: "agr_KA2E8W",
		createdAt: "2026-09-28T14:10:00Z"
	},
	{
		id: "ctx_104",
		brokerId: "BRK-10245",
		type: "debit",
		amount: -1,
		description: "Agreement Created",
		balance: 24,
		executionId: "agr_KA2E7V",
		createdAt: "2026-09-25T11:20:00Z"
	},
	{
		id: "ctx_105",
		brokerId: "BRK-10245",
		type: "credit",
		amount: 50,
		description: "Plan Purchase (Professional)",
		balance: 25,
		createdAt: "2026-08-15T09:00:00Z"
	},
	(
	// Transactions for other brokers
	{
		id: "ctx_001",
		brokerId: "BRK-10246",
		type: "credit",
		amount: 50,
		description: "Plan top-up — Enterprise package",
		balance: 145,
		createdAt: "2026-10-01T10:00:00Z"
	}),
	{
		id: "ctx_002",
		brokerId: "BRK-10246",
		type: "reservation",
		amount: -1,
		description: "Credit reserved for agr_KA2E9X",
		balance: 95,
		executionId: "agr_KA2E9X",
		createdAt: "2026-10-07T11:42:00Z"
	},
	{
		id: "ctx_003",
		brokerId: "BRK-10248",
		type: "debit",
		amount: -1,
		description: "Agreement Created",
		balance: 8,
		executionId: "agr_KA2E8W",
		createdAt: "2026-10-07T11:38:00Z"
	}
];
// ── Chartered Accountants ─────────────────────────────────────
export const mockCharteredAccountants = [
	{
		id: "CA-40101",
		name: "CA Anil Kothari",
		firmName: "Kothari & Associates LLP",
		email: "anil@kotharica.com",
		phone: "+91 98450 11223",
		state: "Karnataka",
		membershipNo: "FCA-214589",
		firmRegNo: "FRN 012489S",
		clientCount: 54,
		agreementsManaged: 28,
		status: "active",
		practiceArea: "Corporate Leases & Real Estate",
		createdAt: "2026-01-10T09:00:00Z",
		lastActiveAt: "2026-10-07T11:20:00Z"
	},
	{
		id: "CA-40102",
		name: "CA Priya Sundaram",
		firmName: "Sundaram & Subramanian CAs",
		email: "priya@sundaramca.in",
		phone: "+91 98201 33445",
		state: "Karnataka",
		membershipNo: "ACA-309182",
		firmRegNo: "FRN 004512S",
		clientCount: 86,
		agreementsManaged: 42,
		status: "active",
		practiceArea: "Tax Audit & Lease Verification",
		createdAt: "2025-11-20T10:30:00Z",
		lastActiveAt: "2026-10-07T10:45:00Z"
	},
	{
		id: "CA-40103",
		name: "CA Manoj Sharma",
		firmName: "M. Sharma & Partners",
		email: "manoj@sharmatax.com",
		phone: "+91 98112 55667",
		state: "Maharashtra",
		membershipNo: "FCA-102948",
		firmRegNo: "FRN 018273W",
		clientCount: 110,
		agreementsManaged: 64,
		status: "active",
		practiceArea: "Commercial Property & Stamp Duty",
		createdAt: "2025-09-15T11:00:00Z",
		lastActiveAt: "2026-10-07T09:15:00Z"
	},
	{
		id: "CA-40104",
		name: "CA Meenakshi Iyer",
		firmName: "Iyer Financial Advisory",
		email: "meenakshi@iyerca.in",
		phone: "+91 94440 66778",
		state: "Karnataka",
		membershipNo: "ACA-412093",
		firmRegNo: "FRN 021980S",
		clientCount: 38,
		agreementsManaged: 16,
		status: "active",
		practiceArea: "HRA Compliance & Tenant Verification",
		createdAt: "2026-02-14T14:00:00Z",
		lastActiveAt: "2026-10-06T16:30:00Z"
	},
	{
		id: "CA-40105",
		name: "CA R. V. Deshmukh",
		firmName: "Deshmukh & Kelkar Associates",
		email: "rvdeshmukh@dkca.co.in",
		phone: "+91 97654 88990",
		state: "Maharashtra",
		membershipNo: "FCA-089471",
		firmRegNo: "FRN 007621W",
		clientCount: 92,
		agreementsManaged: 37,
		status: "active",
		practiceArea: "Industrial & Warehousing Leases",
		createdAt: "2025-12-05T08:30:00Z",
		lastActiveAt: "2026-10-06T14:10:00Z"
	},
	{
		id: "CA-40106",
		name: "CA Harish Singhal",
		firmName: "Singhal & Co. Chartered Accountants",
		email: "harish@singhalca.org",
		phone: "+91 99100 22334",
		state: "Karnataka",
		membershipNo: "FCA-178492",
		firmRegNo: "FRN 015432S",
		clientCount: 45,
		agreementsManaged: 21,
		status: "active",
		practiceArea: "NRI Property Taxation & Rental Proofs",
		createdAt: "2026-03-01T12:00:00Z",
		lastActiveAt: "2026-10-05T17:00:00Z"
	},
	{
		id: "CA-40107",
		name: "CA Swati Sen",
		firmName: "Sen & Sengupta Audit LLP",
		email: "swati@senca.in",
		phone: "+91 98301 44556",
		state: "Maharashtra",
		membershipNo: "ACA-523109",
		firmRegNo: "FRN 032104W",
		clientCount: 29,
		agreementsManaged: 12,
		status: "active",
		practiceArea: "Commercial Lease Audit & Legal Deeds",
		createdAt: "2026-04-18T10:00:00Z",
		lastActiveAt: "2026-10-05T11:40:00Z"
	},
	{
		id: "CA-40108",
		name: "CA Vikramaditya Hegde",
		firmName: "Hegde & Rao Chartered Accountants",
		email: "vikram@hegdeca.com",
		phone: "+91 98860 77889",
		state: "Karnataka",
		membershipNo: "FCA-193847",
		firmRegNo: "FRN 009841S",
		clientCount: 68,
		agreementsManaged: 31,
		status: "active",
		practiceArea: "Retail Chains & Co-working Agreements",
		createdAt: "2026-02-28T09:15:00Z",
		lastActiveAt: "2026-10-04T15:20:00Z"
	},
	{
		id: "CA-40109",
		name: "CA Rajesh Aggarwal",
		firmName: "Aggarwal & Rao Tax Consultants",
		email: "rajesh@aggarwalca.in",
		phone: "+91 98105 99001",
		state: "Telangana",
		membershipNo: "FCA-076123",
		firmRegNo: "FRN 002194S",
		clientCount: 74,
		agreementsManaged: 18,
		status: "active",
		practiceArea: "Commercial Rental Compliance",
		createdAt: "2025-10-12T13:45:00Z",
		lastActiveAt: "2026-08-20T16:00:00Z"
	},
	{
		id: "CA-40110",
		name: "CA Devendra Patil",
		firmName: "Patil Global Advisory Services",
		email: "devendra@patiladvisory.com",
		phone: "+91 98220 12340",
		state: "Maharashtra",
		membershipNo: "FCA-142857",
		firmRegNo: "FRN 014890W",
		clientCount: 31,
		agreementsManaged: 8,
		status: "inactive",
		practiceArea: "Property Trust & Estate Documentation",
		createdAt: "2025-08-30T10:20:00Z",
		lastActiveAt: "2026-07-15T11:30:00Z"
	}
];
// ── Jurisdictions ─────────────────────────────────────────────
export const mockJurisdictions = [
	{
		id: "jur_KA",
		state: "Karnataka",
		code: "KA",
		enabled: true,
		status: "active",
		activeRulesCount: 2,
		ruleVersion: "1.0",
		currentRuleVersion: "1.0",
		effectiveDate: "2026-01-01",
		lastUpdated: "2026-09-15T10:00:00Z",
		approvalStatus: "approved",
		requiresRegistration: false,
		stampActReference: "Karnataka Stamp Act, Article 30",
		estampConfig: {
			enabled: true,
			provider: "StockHolding (SHCIL)",
			maxStampDuty: 500,
			processingType: "automated",
			certificateFormat: "Certificate with QR"
		},
		esignConfig: {
			enabled: true,
			provider: "NSDL (Aadhaar)",
			signatureType: "aadhaar_otp",
			signerSequence: "sequential",
			otpExpiryMinutes: 10
		}
	},
	{
		id: "jur_MH",
		state: "Maharashtra",
		code: "MH",
		enabled: false,
		status: "inactive",
		activeRulesCount: 1,
		ruleVersion: "1.0",
		currentRuleVersion: "1.0",
		effectiveDate: "2026-01-01",
		lastUpdated: "2026-10-01T10:00:00Z",
		approvalStatus: "pending_rollout",
		requiresRegistration: true,
		stampActReference: "Maharashtra Stamp Act, Article 36A",
		estampConfig: {
			enabled: false,
			provider: "GRAS (Govt. of Maharashtra)",
			minStampDuty: 100,
			processingType: "automated",
			certificateFormat: "Certificate with QR"
		},
		esignConfig: {
			enabled: false,
			provider: "CDAC / NSDL",
			signatureType: "all",
			signerSequence: "sequential",
			otpExpiryMinutes: 15
		}
	},
	{
		id: "jur_TG",
		state: "Telangana",
		code: "TG",
		enabled: false,
		status: "inactive",
		activeRulesCount: 1,
		ruleVersion: "1.0",
		currentRuleVersion: "1.0",
		effectiveDate: "2026-02-01",
		lastUpdated: "2026-10-01T10:00:00Z",
		approvalStatus: "pending_rollout",
		requiresRegistration: false,
		stampActReference: "Telangana Stamp Act, Article 35",
		estampConfig: {
			enabled: false,
			provider: "StockHolding (SHCIL) & IGRS Telangana",
			minStampDuty: 100,
			processingType: "automated",
			certificateFormat: "Certificate with QR"
		},
		esignConfig: {
			enabled: false,
			provider: "NSDL / CDAC (Aadhaar)",
			signatureType: "aadhaar_otp",
			signerSequence: "sequential",
			otpExpiryMinutes: 10
		}
	}
];
// ── Rules ─────────────────────────────────────────────────────
export const mockRules = [
	{
		id: "rule_KA_1_0",
		name: "Karnataka Residential Lease Stamp Duty Rule",
		jurisdiction: "Karnataka",
		state: "Karnataka",
		version: "1.0",
		status: "active",
		effectiveDate: "2026-01-01",
		createdBy: "admin@zapdocs.in",
		approvedBy: "superadmin@zapdocs.in",
		createdAt: "2025-12-10T10:00:00Z",
		updatedAt: "2026-01-01T00:00:00Z",
		config: {
			stampDutyFormula: "0.5% of (annual_rent + deposit)",
			stampDutyCap: 500,
			registrationRequired: false,
			articleReference: "Article 30",
			actReference: "Karnataka Stamp Act"
		},
		notes: "Karnataka Residential Lease Stamp Duty Rule",
		summary: "Standard residential stamp duty computation under Article 30 Karnataka Stamp Act. Duty capped at ₹500.",
		approvalHistory: [
			{
				step: "Draft Created",
				actor: "admin@zapdocs.in",
				date: "2025-11-20",
				status: "completed"
			},
			{
				step: "Submitted for Review",
				actor: "admin@zapdocs.in",
				date: "2025-12-05",
				status: "completed"
			},
			{
				step: "Approved by Legal",
				actor: "legal@zapdocs.in",
				date: "2025-12-28",
				status: "completed"
			},
			{
				step: "Activated",
				actor: "system",
				date: "2026-01-01",
				status: "completed"
			}
		]
	},
	{
		id: "rule_KA_1_2",
		name: "Karnataka Standard 11-Month Tenancy Rule",
		jurisdiction: "Karnataka",
		state: "Karnataka",
		version: "1.0",
		status: "active",
		effectiveDate: "2026-01-15",
		createdBy: "admin@zapdocs.in",
		approvedBy: "superadmin@zapdocs.in",
		createdAt: "2026-01-15T10:00:00Z",
		updatedAt: "2026-01-15T00:00:00Z",
		config: {
			stampDutyFormula: "Fixed ₹100 for 11-month non-commercial tenancy",
			stampDutyCap: 100,
			registrationRequired: false,
			articleReference: "Article 30(b)",
			actReference: "Karnataka Stamp Act"
		},
		notes: "Karnataka Standard 11-Month Tenancy Rule",
		summary: "Fixed statutory stamp duty schedule for 11-month non-commercial tenancy agreements in Karnataka.",
		approvalHistory: [
			{
				step: "Draft Created",
				actor: "admin@zapdocs.in",
				date: "2026-01-02",
				status: "completed"
			},
			{
				step: "Approved by Legal",
				actor: "legal@zapdocs.in",
				date: "2026-01-12",
				status: "completed"
			},
			{
				step: "Activated",
				actor: "system",
				date: "2026-01-15",
				status: "completed"
			}
		]
	},
	{
		id: "rule_MH_1_0",
		name: "Maharashtra Leave & License Stamp Duty Rule",
		jurisdiction: "Maharashtra",
		state: "Maharashtra",
		version: "1.0",
		status: "active",
		effectiveDate: "2026-01-01",
		createdBy: "admin@zapdocs.in",
		approvedBy: "superadmin@zapdocs.in",
		createdAt: "2026-01-01T10:00:00Z",
		updatedAt: "2026-01-01T10:00:00Z",
		config: {
			stampDutyFormula: "0.25% of (rent + non_refundable_deposits + 10%*refundable_deposit)",
			registrationRequired: true,
			registrationAuthority: "Maharashtra SRO",
			articleReference: "Article 36A",
			actReference: "Maharashtra Stamp Act"
		},
		notes: "Maharashtra Leave & License Stamp Duty Rule",
		summary: "Calculates stamp duty for residential leave and license agreements under Article 36A Maharashtra Stamp Act.",
		approvalHistory: [
			{
				step: "Draft Created",
				actor: "admin@zapdocs.in",
				date: "2025-12-10",
				status: "completed"
			},
			{
				step: "Approved by Legal",
				actor: "legal@zapdocs.in",
				date: "2025-12-30",
				status: "completed"
			},
			{
				step: "Activated",
				actor: "system",
				date: "2026-01-01",
				status: "completed"
			}
		]
	},
	{
		id: "rule_TG_1_0",
		name: "Telangana Residential Tenancy Stamp Duty Rule",
		jurisdiction: "Telangana",
		state: "Telangana",
		version: "1.0",
		status: "active",
		effectiveDate: "2026-02-01",
		createdBy: "admin@zapdocs.in",
		approvedBy: "superadmin@zapdocs.in",
		createdAt: "2026-01-20T10:00:00Z",
		updatedAt: "2026-02-01T00:00:00Z",
		config: {
			stampDutyFormula: "0.5% of annual rent consideration",
			stampDutyCap: 500,
			registrationRequired: false,
			articleReference: "Article 35",
			actReference: "Telangana Stamp Act"
		},
		notes: "Telangana Residential Tenancy Stamp Duty Rule",
		summary: "Standard residential stamp duty computation under Article 35 Telangana Stamp Act. Capped at statutory limit.",
		approvalHistory: [
			{
				step: "Draft Created",
				actor: "admin@zapdocs.in",
				date: "2026-01-10",
				status: "completed"
			},
			{
				step: "Approved by Legal",
				actor: "legal@zapdocs.in",
				date: "2026-01-25",
				status: "completed"
			},
			{
				step: "Activated",
				actor: "system",
				date: "2026-02-01",
				status: "completed"
			}
		]
	},
	{
		id: "rule_KA_1_1",
		name: "Karnataka Security Deposit Classification Amendment",
		jurisdiction: "Karnataka",
		state: "Karnataka",
		version: "1.1",
		status: "pending_approval",
		effectiveDate: "2027-01-01",
		createdBy: "admin@zapdocs.in",
		createdAt: "2026-10-01T10:00:00Z",
		updatedAt: "2026-10-06T18:00:00Z",
		config: {
			stampDutyFormula: "0.5% of (annual_rent + deposit)",
			stampDutyCap: 500,
			registrationRequired: false,
			articleReference: "Article 30",
			actReference: "Karnataka Stamp Act"
		},
		notes: "Karnataka Security Deposit Classification Amendment",
		summary: "Clarification on refundable vs non-refundable deposit classification for residential agreements.",
		approvalHistory: [
			{
				step: "Draft Created",
				actor: "admin@zapdocs.in",
				date: "2026-09-15",
				status: "completed"
			},
			{
				step: "Submitted for Review",
				actor: "admin@zapdocs.in",
				date: "2026-10-01",
				status: "completed"
			},
			{
				step: "Pending Legal Review",
				actor: "legal@zapdocs.in",
				date: "2026-10-06",
				status: "current"
			}
		]
	},
	{
		id: "rule_MH_1_0_b",
		name: "Maharashtra SRO Mandatory e-Registration Protocol",
		jurisdiction: "Maharashtra",
		state: "Maharashtra",
		version: "1.0.1",
		status: "approved",
		effectiveDate: "2026-11-01",
		createdBy: "admin@zapdocs.in",
		approvedBy: "superadmin@zapdocs.in",
		createdAt: "2026-09-01T10:00:00Z",
		updatedAt: "2026-10-04T12:00:00Z",
		config: {
			stampDutyFormula: "Standard 0.25% + ₹1,000 SRO portal registration fee",
			registrationRequired: true,
			registrationAuthority: "Maharashtra SRO",
			articleReference: "Section 55 MRC Act",
			actReference: "Maharashtra Stamp Act"
		},
		notes: "Maharashtra SRO Mandatory e-Registration Protocol",
		summary: "Verification and mandatory submission requirements under Section 55 MRC Act 1999 for urban properties.",
		approvalHistory: [
			{
				step: "Draft Created",
				actor: "admin@zapdocs.in",
				date: "2026-09-01",
				status: "completed"
			},
			{
				step: "Submitted for Review",
				actor: "admin@zapdocs.in",
				date: "2026-09-20",
				status: "completed"
			},
			{
				step: "Approved by Superadmin",
				actor: "superadmin@zapdocs.in",
				date: "2026-10-04",
				status: "completed"
			}
		]
	},
	{
		id: "rule_MH_1_1",
		name: "Maharashtra Commercial Tenancy Draft Rule",
		jurisdiction: "Maharashtra",
		state: "Maharashtra",
		version: "1.1-draft",
		status: "draft",
		effectiveDate: "2027-02-01",
		createdBy: "admin@zapdocs.in",
		createdAt: "2026-10-02T16:00:00Z",
		updatedAt: "2026-10-02T16:00:00Z",
		config: {
			stampDutyFormula: "0.50% of annual license consideration",
			registrationRequired: true,
			articleReference: "Article 36B",
			actReference: "Maharashtra Stamp Act"
		},
		notes: "Maharashtra Commercial Tenancy Draft Rule",
		summary: "Draft formula for multi-year commercial tenancy and escalating rent structures.",
		approvalHistory: [{
			step: "Draft Created",
			actor: "admin@zapdocs.in",
			date: "2026-10-02",
			status: "current"
		}]
	},
	{
		id: "rule_KA_2_0",
		name: "Karnataka Digital Stamping Revision",
		jurisdiction: "Karnataka",
		state: "Karnataka",
		version: "2.0-draft",
		status: "draft",
		effectiveDate: "2027-04-01",
		createdBy: "admin@zapdocs.in",
		createdAt: "2026-09-25T11:00:00Z",
		updatedAt: "2026-09-25T11:00:00Z",
		config: {
			stampDutyFormula: "Dynamic duty with automated StockHolding certificate sync",
			registrationRequired: false,
			articleReference: "Article 30 Revision",
			actReference: "Karnataka Stamp Act"
		},
		notes: "Karnataka Digital Stamping Revision",
		summary: "Proposed updates to support integrated high-volume corporate lease processing.",
		approvalHistory: [{
			step: "Draft Created",
			actor: "admin@zapdocs.in",
			date: "2026-09-25",
			status: "current"
		}]
	},
	{
		id: "rule_KA_0_9",
		name: "Karnataka 2025 Stamp Duty Schedule (Legacy)",
		jurisdiction: "Karnataka",
		state: "Karnataka",
		version: "0.9",
		status: "archived",
		effectiveDate: "2025-01-01",
		createdBy: "admin@zapdocs.in",
		approvedBy: "superadmin@zapdocs.in",
		createdAt: "2024-11-01T10:00:00Z",
		updatedAt: "2025-12-31T23:59:59Z",
		config: {
			stampDutyFormula: "Flat 0.5% calculation without cap",
			registrationRequired: false,
			articleReference: "Article 30 (2025)",
			actReference: "Karnataka Stamp Act"
		},
		notes: "Karnataka 2025 Stamp Duty Schedule (Legacy)",
		summary: "Legacy schedule used during 2025 pilot phase. Replaced by version 1.0.",
		approvalHistory: [
			{
				step: "Draft Created",
				actor: "admin@zapdocs.in",
				date: "2024-11-01",
				status: "completed"
			},
			{
				step: "Approved",
				actor: "superadmin@zapdocs.in",
				date: "2024-12-15",
				status: "completed"
			},
			{
				step: "Archived",
				actor: "admin@zapdocs.in",
				date: "2025-12-31",
				status: "completed"
			}
		]
	},
	{
		id: "rule_MH_0_9",
		name: "Maharashtra 2025 Standard Leave & License (Legacy)",
		jurisdiction: "Maharashtra",
		state: "Maharashtra",
		version: "0.9",
		status: "archived",
		effectiveDate: "2025-06-01",
		createdBy: "admin@zapdocs.in",
		approvedBy: "superadmin@zapdocs.in",
		createdAt: "2025-05-10T10:00:00Z",
		updatedAt: "2025-12-31T23:59:59Z",
		config: {
			stampDutyFormula: "Manual calculation table based on municipal zone",
			registrationRequired: true,
			articleReference: "Article 36A (2025)",
			actReference: "Maharashtra Stamp Act"
		},
		notes: "Maharashtra 2025 Standard Leave & License (Legacy)",
		summary: "Pre-production rule configuration for pilot testing in Pune and Mumbai districts.",
		approvalHistory: [
			{
				step: "Draft Created",
				actor: "admin@zapdocs.in",
				date: "2025-05-10",
				status: "completed"
			},
			{
				step: "Approved",
				actor: "superadmin@zapdocs.in",
				date: "2025-05-28",
				status: "completed"
			},
			{
				step: "Archived",
				actor: "admin@zapdocs.in",
				date: "2025-12-31",
				status: "completed"
			}
		]
	}
];
// ── Templates ─────────────────────────────────────────────────
export const DEFAULT_TEMPLATE_PARAMETERS = [
	{
		key: "landlord_name",
		label: "Landlord / Lessor Name",
		category: "party",
		dataType: "text",
		defaultValue: "Anand Mehta",
		required: true,
		description: "Legal name of the property owner as per title deed / PAN"
	},
	{
		key: "landlord_address",
		label: "Landlord Residential Address",
		category: "party",
		dataType: "text",
		defaultValue: "No. 14, 3rd Cross, Indiranagar, Bengaluru",
		required: true,
		description: "Permanent residential address of the landlord"
	},
	{
		key: "landlord_phone",
		label: "Landlord Mobile Number",
		category: "party",
		dataType: "text",
		defaultValue: "+91 98450 12345",
		required: true,
		description: "Phone number for SMS alerts and communications"
	},
	{
		key: "landlord_aadhaar_last4",
		label: "Landlord Aadhaar (Last 4)",
		category: "party",
		dataType: "text",
		defaultValue: "8842",
		required: true,
		description: "Last four digits of landlord UID"
	},
	{
		key: "tenant_name",
		label: "Tenant / Lessee Name",
		category: "party",
		dataType: "text",
		defaultValue: "Rahul Verma",
		required: true,
		description: "Full legal name of primary tenant as per government ID"
	},
	{
		key: "tenant_permanent_address",
		label: "Tenant Permanent Address",
		category: "party",
		dataType: "text",
		defaultValue: "Flat 402, Green Glen Layout, Bellandur, Bengaluru",
		required: true,
		description: "Permanent hometown address of the tenant"
	},
	{
		key: "tenant_phone",
		label: "Tenant Mobile Number",
		category: "party",
		dataType: "text",
		defaultValue: "+91 99887 76655",
		required: true,
		description: "Tenant phone number for OTP eSigning"
	},
	{
		key: "tenant_aadhaar_last4",
		label: "Tenant Aadhaar (Last 4)",
		category: "party",
		dataType: "text",
		defaultValue: "5619",
		required: true,
		description: "Last four digits of tenant UID"
	},
	{
		key: "property_address",
		label: "Leased Premises Address",
		category: "property",
		dataType: "text",
		defaultValue: "Flat 302, Palm Grove Apartments, 12th Main, Koramangala 4th Block, Bengaluru",
		required: true,
		description: "Complete address of the rented premises"
	},
	{
		key: "property_city",
		label: "Property City",
		category: "property",
		dataType: "text",
		defaultValue: "Bengaluru",
		required: true,
		description: "City jurisdiction where premises is located"
	},
	{
		key: "state",
		label: "Jurisdiction State",
		category: "property",
		dataType: "text",
		defaultValue: "Karnataka",
		required: true,
		description: "Governing state for stamp duty calculation"
	},
	{
		key: "pin_code",
		label: "Postal PIN Code",
		category: "property",
		dataType: "text",
		defaultValue: "560034",
		required: true,
		description: "Postal area code of the premises"
	},
	{
		key: "monthly_rent",
		label: "Monthly Rent (₹)",
		category: "financial",
		dataType: "currency",
		defaultValue: "28,000",
		required: true,
		description: "Agreed monthly rental amount payable"
	},
	{
		key: "security_deposit",
		label: "Refundable Security Deposit (₹)",
		category: "financial",
		dataType: "currency",
		defaultValue: "84,000",
		required: true,
		description: "Interest-free refundable security deposit"
	},
	{
		key: "maintenance_charges",
		label: "Monthly Maintenance (₹)",
		category: "financial",
		dataType: "currency",
		defaultValue: "2,500",
		required: false,
		description: "Apartment society maintenance fee"
	},
	{
		key: "rent_due_day",
		label: "Rent Due Day of Month",
		category: "financial",
		dataType: "text",
		defaultValue: "5th",
		required: true,
		description: "Monthly payment deadline"
	},
	{
		key: "deposit_payment_mode",
		label: "Deposit Payment Mode",
		category: "financial",
		dataType: "text",
		defaultValue: "Bank NEFT/UPI Transfer",
		required: false,
		description: "Payment method used for deposit"
	},
	{
		key: "tenancy_period_months",
		label: "Tenancy Duration (Months)",
		category: "tenancy",
		dataType: "number",
		defaultValue: "11",
		required: true,
		description: "Total term of tenancy period"
	},
	{
		key: "start_date",
		label: "Commencement Date",
		category: "tenancy",
		dataType: "date",
		defaultValue: "01 Nov 2026",
		required: true,
		description: "Date from which lease takes effect"
	},
	{
		key: "end_date",
		label: "Expiration Date",
		category: "tenancy",
		dataType: "date",
		defaultValue: "30 Sep 2027",
		required: true,
		description: "Date of tenancy term conclusion"
	},
	{
		key: "notice_period_months",
		label: "Notice Period (Months)",
		category: "tenancy",
		dataType: "number",
		defaultValue: "1",
		required: true,
		description: "Advance notice required for termination"
	},
	{
		key: "lock_in_period_months",
		label: "Lock-In Period (Months)",
		category: "tenancy",
		dataType: "number",
		defaultValue: "3",
		required: false,
		description: "Minimum lock-in duration"
	},
	{
		key: "stamp_duty_amount",
		label: "Statutory Stamp Duty (₹)",
		category: "statutory",
		dataType: "currency",
		defaultValue: "500",
		required: true,
		description: "State government stamp duty calculation"
	},
	{
		key: "estamp_cert_no",
		label: "eStamp Certificate Number",
		category: "statutory",
		dataType: "text",
		defaultValue: "IN-KA99482710389271U",
		required: true,
		description: "Government digital eStamp certificate ID"
	}
];
export const DEFAULT_TEMPLATE_CONTENT = `RENTAL AGREEMENT

This RENTAL AGREEMENT is entered into and executed at {{property_city}}, State of {{state}}, on this {{start_date}}, by and between:

FIRST PARTY (LESSOR / LANDLORD):
{{landlord_name}}, residing at {{landlord_address}}, Contact: {{landlord_phone}}, Aadhaar ending in {{landlord_aadhaar_last4}} (hereinafter called the "LESSOR" / "LANDLORD", which term shall unless repugnant to the context include their legal heirs, executors, administrators, and assigns) of the FIRST PART;

AND

SECOND PARTY (LESSEE / TENANT):
{{tenant_name}}, residing permanently at {{tenant_permanent_address}}, Contact: {{tenant_phone}}, Aadhaar ending in {{tenant_aadhaar_last4}} (hereinafter called the "LESSEE" / "TENANT", which term shall unless repugnant to the context include their legal representatives and permitted assigns) of the SECOND PART.

WHEREAS the Landlord is the lawful and absolute owner of the premises situated at {{property_address}}, PIN: {{pin_code}} (hereinafter referred to as the "SCHEDULED PREMISES").

AND WHEREAS the Tenant has approached the Landlord to let out the Scheduled Premises for non-commercial residential occupancy, and the Landlord has consented to grant the lease under the following terms and covenants:

NOW THEREFORE, THIS INDENTURE WITNESSETH AS FOLLOWS:

1. TENANCY PERIOD & COMMENCEMENT
The tenancy shall be for an initial fixed term of {{tenancy_period_months}} (eleven) months commencing from {{start_date}} up to and including {{end_date}}. The agreement may be extended or renewed upon mutual written consent with mutually agreed escalation terms.

2. MONTHLY RENT & UTILITY CHARGES
The Tenant agrees to pay the Landlord a fixed monthly rent of ₹{{monthly_rent}} (Rupees in words) on or before the {{rent_due_day}} day of every calendar month. In addition to rent, monthly maintenance charges of ₹{{maintenance_charges}} shall be paid to the Apartment Owners Association. Water and electricity charges shall be borne directly by the Tenant as per official meter billing.

3. REFUNDABLE SECURITY DEPOSIT
The Tenant has paid to the Landlord an interest-free refundable security deposit of ₹{{security_deposit}} via {{deposit_payment_mode}}, the receipt whereof the Landlord hereby acknowledges. The deposit shall be refunded to the Tenant at the time of vacating possession, subject to deduction of unpaid rent, utility bills, or repairs for damages beyond fair wear and tear.

4. NOTICE PERIOD & LOCK-IN PERIOD
Both parties agree to a lock-in period of {{lock_in_period_months}} month(s) from commencement. After the lock-in period, either party may terminate this agreement by serving {{notice_period_months}} month(s) prior written notice. If the Tenant vacates during the lock-in period, rent for the remaining lock-in duration shall be forfeited.

5. RESTRICTIONS ON USE & SUB-LETTING
The Scheduled Premises shall be used strictly and exclusively for private residential living by {{tenant_name}} and immediate family members. The Tenant shall not sub-let, assign, or transfer any part of the premises to third parties, nor carry out any commercial, unlawful, or offensive activities.

6. REPAIRS & MAINTENANCE
The Tenant shall maintain the Scheduled Premises in good and tenantable condition. Minor day-to-day repairs (fuses, tap washers, minor plumbing) shall be borne by the Tenant, while structural repairs, seepage, and external painting shall remain the responsibility of the Landlord.

7. INSPECTION OF PREMISES
The Landlord or their authorized agent shall have the right to inspect the premises at reasonable times during daylight hours with reasonable prior notice to the Tenant.

8. STATUTORY eSTAMP DUTY & eSIGN EXECUTION
This agreement is stamped under Article 30 of the {{state}} Stamp Act for a statutory stamp duty of ₹{{stamp_duty_amount}} under eStamp Certificate Number {{estamp_cert_no}}. The parties execute this agreement electronically via legally admissible Aadhaar eSign verification.

IN WITNESS WHEREOF the Landlord and Tenant have set their respective hands and digital signatures on the day, month, and year first written above.`;
export const mockTemplates = [
	{
		id: "tmpl_KA_1_0",
		name: "Karnataka 11-Month Residential Rental Agreement",
		jurisdiction: "Karnataka",
		state: "Karnataka",
		version: "1.0",
		status: "active",
		effectiveDate: "2026-01-01",
		createdBy: "admin@zapdocs.in",
		updatedAt: "2026-01-01T00:00:00Z",
		description: "Standard 11-month non-commercial residential rental contract for Bengaluru and Karnataka urban jurisdictions. Includes rent escalation, maintenance, and security deposit terms.",
		changeSummary: "Production release incorporating Article 30 Karnataka Stamp Act compliance and automated eStamp endorsement.",
		variables: [
			"landlord_name",
			"tenant_name",
			"property_address",
			"monthly_rent",
			"security_deposit",
			"start_date",
			"end_date",
			"stamp_duty_amount",
			"estamp_cert_no"
		],
		content: DEFAULT_TEMPLATE_CONTENT,
		parameters: DEFAULT_TEMPLATE_PARAMETERS,
		versionHistory: [{
			version: "v1.0",
			status: "active",
			created: "2026-01-01",
			updatedBy: "admin@zapdocs.in",
			changeSummary: "Production baseline version with compliant stamp duty schedule."
		}, {
			version: "v0.9",
			status: "archived",
			created: "2025-11-15",
			updatedBy: "legal@zapdocs.in",
			changeSummary: "Pre-launch pilot draft with standard legal covenants."
		}]
	},
	{
		id: "tmpl_MH_1_0",
		name: "Maharashtra Leave & License Agreement",
		jurisdiction: "Maharashtra",
		state: "Maharashtra",
		version: "1.0",
		status: "active",
		effectiveDate: "2026-01-15",
		createdBy: "admin@zapdocs.in",
		updatedAt: "2026-01-15T10:00:00Z",
		description: "Statutory Leave and License deed drafted pursuant to Section 55 of Maharashtra Rent Control Act 1999 and Article 36A Stamp Act. Covers Mumbai and Pune municipal corporations.",
		changeSummary: "Updated with mandatory biometric/Aadhaar eSign disclaimer and Section 55 registration clauses.",
		variables: [
			"licensor_name",
			"licensee_name",
			"premises_address",
			"monthly_license_fee",
			"deposit",
			"start_date",
			"end_date",
			"stamp_duty_amount",
			"registration_no"
		],
		versionHistory: [{
			version: "v1.0",
			status: "active",
			created: "2026-01-15",
			updatedBy: "admin@zapdocs.in",
			changeSummary: "Official Maharashtra registration compatible release."
		}, {
			version: "v0.9",
			status: "archived",
			created: "2025-10-20",
			updatedBy: "compliance@zapdocs.in",
			changeSummary: "Initial draft for pilot validation."
		}]
	},
	{
		id: "tmpl_TG_1_0",
		name: "Telangana Standard Residential Lease Agreement",
		jurisdiction: "Telangana",
		state: "Telangana",
		version: "1.0",
		status: "active",
		effectiveDate: "2026-02-01",
		createdBy: "admin@zapdocs.in",
		updatedAt: "2026-02-01T10:00:00Z",
		description: "Standard residential rental and lease agreement pursuant to Article 35 Stamp Act and Telangana tenancy guidelines. Covers Hyderabad, Ranga Reddy, and urban municipalities.",
		changeSummary: "Production release with integrated IGRS Telangana eStamp and digital Aadhaar eSign execution.",
		variables: [
			"lessor_name",
			"lessee_name",
			"property_address",
			"monthly_rent",
			"security_deposit",
			"start_date",
			"end_date",
			"stamp_duty_amount"
		],
		versionHistory: [{
			version: "v1.0",
			status: "active",
			created: "2026-02-01",
			updatedBy: "admin@zapdocs.in",
			changeSummary: "Initial Telangana production release."
		}]
	},
	{
		id: "tmpl_KA_comm_1_0",
		name: "Karnataka Commercial Premises Lease Agreement",
		jurisdiction: "Karnataka",
		state: "Karnataka",
		version: "1.0",
		status: "active",
		effectiveDate: "2026-02-01",
		createdBy: "admin@zapdocs.in",
		updatedAt: "2026-02-01T12:00:00Z",
		description: "Commercial premises lease agreement for office spaces, retail outlets, and commercial establishments with standard GST and tax deduction at source provisions.",
		changeSummary: "Approved commercial template with standard commercial terms, fit-out periods, and lock-in covenants.",
		variables: [
			"lessor_name",
			"lessee_name",
			"commercial_unit_no",
			"monthly_rent",
			"security_deposit",
			"gstin_number",
			"lock_in_period"
		],
		versionHistory: [{
			version: "v1.0",
			status: "active",
			created: "2026-02-01",
			updatedBy: "legal@zapdocs.in",
			changeSummary: "Initial commercial release."
		}]
	},
	{
		id: "tmpl_KA_2_0_draft",
		name: "Karnataka Bilingual Agreement (Kannada / English)",
		jurisdiction: "Karnataka",
		state: "Karnataka",
		version: "2.0-draft",
		status: "draft",
		effectiveDate: "2026-12-01",
		createdBy: "legal@zapdocs.in",
		updatedAt: "2026-10-02T14:30:00Z",
		description: "Dual-column bilingual tenancy agreement with Kannada and English translations side-by-side for rural and peri-urban sub-registrar offices.",
		changeSummary: "Draft bilingual layout awaiting legal translator sign-off and Karnataka state bar review.",
		variables: [
			"landlord_name_kn",
			"tenant_name_kn",
			"property_address_kn",
			"monthly_rent",
			"security_deposit"
		],
		versionHistory: [{
			version: "v2.0-draft",
			status: "draft",
			created: "2026-10-02",
			updatedBy: "legal@zapdocs.in",
			changeSummary: "Created draft bilingual version."
		}]
	},
	{
		id: "tmpl_MH_1_1_draft",
		name: "Maharashtra SRO Digital Submission Standard Form",
		jurisdiction: "Maharashtra",
		state: "Maharashtra",
		version: "1.1-draft",
		status: "draft",
		effectiveDate: "2026-11-15",
		createdBy: "compliance@zapdocs.in",
		updatedAt: "2026-10-05T09:15:00Z",
		description: "Optimized Leave and License document structure adhering to revised IGR Maharashtra schema requirements for automated portal integration.",
		changeSummary: "Updated metadata mapping for direct SRO batch submission without manual re-keying.",
		variables: [
			"licensor_name",
			"licensee_name",
			"sro_code",
			"property_tax_id",
			"monthly_fee",
			"deposit"
		],
		versionHistory: [{
			version: "v1.1-draft",
			status: "draft",
			created: "2026-10-05",
			updatedBy: "compliance@zapdocs.in",
			changeSummary: "Initial draft for IGR automated integration."
		}]
	},
	{
		id: "tmpl_KA_0_9_legacy",
		name: "Karnataka 2025 Standard Tenancy (Legacy)",
		jurisdiction: "Karnataka",
		state: "Karnataka",
		version: "0.9",
		status: "archived",
		effectiveDate: "2025-01-01",
		createdBy: "admin@zapdocs.in",
		updatedAt: "2025-12-31T23:59:59Z",
		description: "Original pilot tenancy template deployed across Bengaluru in early 2025 prior to the Article 30 digital stamping update.",
		changeSummary: "Archived and replaced by version 1.0 with integrated eStamp certificate headers.",
		variables: [
			"landlord_name",
			"tenant_name",
			"property_address",
			"monthly_rent",
			"security_deposit"
		],
		versionHistory: [{
			version: "v0.9",
			status: "archived",
			created: "2025-01-01",
			updatedBy: "admin@zapdocs.in",
			changeSummary: "Legacy template retired on 31 Dec 2025."
		}]
	}
];
// ── Payments ──────────────────────────────────────────────────
export const mockPayments = [
	{
		id: "pay_10245",
		agreementId: "agr_KA2E9X",
		customerName: "Rahul Kumar",
		amount: 25e3,
		currency: "INR",
		status: "captured",
		razorpayOrderId: "order_QzL9810245",
		razorpayPaymentId: "pay_QzL9810245_ref",
		createdAt: "2026-10-06T11:42:00Z",
		capturedAt: "2026-10-06T11:44:00Z"
	},
	{
		id: "pay_001",
		agreementId: "agr_KA2E4S",
		customerName: "Kavitha Rao",
		amount: 25e3,
		currency: "INR",
		status: "captured",
		razorpayOrderId: "order_QzL1234567",
		razorpayPaymentId: "pay_QzL7654321",
		createdAt: "2026-10-04T11:05:00Z",
		capturedAt: "2026-10-04T11:07:00Z"
	},
	{
		id: "pay_002",
		agreementId: "agr_KA2E8W",
		customerName: "Priya Nair",
		amount: 35e3,
		currency: "INR",
		status: "captured",
		razorpayOrderId: "order_QzL2345678",
		razorpayPaymentId: "pay_QzL8765432",
		createdAt: "2026-10-07T10:20:00Z",
		capturedAt: "2026-10-07T10:22:00Z"
	},
	{
		id: "pay_003",
		agreementId: "agr_KA2E3R",
		customerName: "Rajan Nair",
		amount: 18e3,
		currency: "INR",
		status: "failed",
		razorpayOrderId: "order_QzL3456789",
		createdAt: "2026-10-07T10:40:00Z",
		failedAt: "2026-10-07T10:43:00Z",
		failureReason: "Payment declined: Insufficient funds in customer bank account"
	},
	{
		id: "pay_004",
		agreementId: "agr_KA2E7V",
		customerName: "Suresh Pillai",
		amount: 2e4,
		currency: "INR",
		status: "captured",
		razorpayOrderId: "order_QzL4567890",
		razorpayPaymentId: "pay_QzL9876543",
		createdAt: "2026-10-06T14:10:00Z",
		capturedAt: "2026-10-06T14:12:00Z"
	},
	{
		id: "pay_005",
		agreementId: "agr_KA2E6U",
		customerName: "Lakshmi Devi",
		amount: 45e3,
		currency: "INR",
		status: "captured",
		razorpayOrderId: "order_QzL5678901",
		razorpayPaymentId: "pay_QzL0987654",
		createdAt: "2026-10-06T09:05:00Z",
		capturedAt: "2026-10-06T09:07:00Z"
	},
	{
		id: "pay_006",
		agreementId: "agr_KA2E5T",
		customerName: "Vikram Sharma",
		amount: 32e3,
		currency: "INR",
		status: "order_created",
		razorpayOrderId: "order_QzL7890123",
		createdAt: "2026-10-07T09:15:00Z"
	},
	{
		id: "pay_007",
		agreementId: "agr_KA2E2Q",
		customerName: "Deepa Krishnan",
		amount: 22e3,
		currency: "INR",
		status: "refunded",
		razorpayOrderId: "order_QzL8901234",
		razorpayPaymentId: "pay_QzL1122334",
		createdAt: "2026-10-05T12:00:00Z",
		capturedAt: "2026-10-05T12:05:00Z"
	}
];
// ── eStamp ────────────────────────────────────────────────────
export const mockEStamps = [
	{
		id: "stp_10245",
		agreementId: "agr_KA2E9X",
		customerName: "Rahul Kumar",
		state: "Karnataka",
		jurisdiction: "Karnataka",
		status: "completed",
		providerRef: "KARES20261006-10245",
		certificateNumber: "IN-KA991823487123A",
		stampDutyAmount: 500,
		createdAt: "2026-10-06T11:45:00Z",
		completedAt: "2026-10-06T11:52:00Z",
		retryCount: 0,
		ruleVersion: "v1.0",
		effectiveDate: "01 Jan 2026",
		vendor: "SignDesk"
	},
	{
		id: "stp_001",
		agreementId: "agr_KA2E4S",
		customerName: "Kavitha Rao",
		state: "Karnataka",
		jurisdiction: "Karnataka",
		status: "completed",
		providerRef: "KARES20261004-8821",
		certificateNumber: "IN-KA882190341255K",
		stampDutyAmount: 500,
		createdAt: "2026-10-04T11:08:00Z",
		completedAt: "2026-10-04T11:12:00Z",
		retryCount: 0,
		ruleVersion: "v1.0",
		effectiveDate: "01 Jan 2026",
		vendor: "SignDesk"
	},
	{
		id: "stp_002",
		agreementId: "agr_KA2E8W",
		customerName: "Priya Nair",
		state: "Karnataka",
		jurisdiction: "Karnataka",
		status: "pending",
		stampDutyAmount: 500,
		createdAt: "2026-10-07T10:23:00Z",
		retryCount: 0,
		ruleVersion: "v1.0",
		effectiveDate: "01 Jan 2026",
		vendor: "SignDesk"
	},
	{
		id: "stp_003",
		agreementId: "agr_MH3F1A",
		customerName: "Amit Deshmukh",
		state: "Maharashtra",
		jurisdiction: "Maharashtra",
		status: "processing",
		providerRef: "MHGRAS20261007-4401",
		stampDutyAmount: 1e3,
		createdAt: "2026-10-07T11:10:00Z",
		retryCount: 0,
		ruleVersion: "v1.0",
		effectiveDate: "01 Jan 2026",
		vendor: "e-GRAS Maharashtra"
	},
	{
		id: "stp_004",
		agreementId: "agr_KA2E2Q",
		customerName: "Deepa Krishnan",
		state: "Karnataka",
		jurisdiction: "Karnataka",
		status: "failed",
		stampDutyAmount: 500,
		createdAt: "2026-10-06T12:05:00Z",
		errorMessage: "Provider API timeout: Gateway connection dropped after 30000ms",
		retryCount: 2,
		ruleVersion: "v1.0",
		effectiveDate: "01 Jan 2026",
		vendor: "SignDesk"
	},
	{
		id: "stp_005",
		agreementId: "agr_MH3F2B",
		customerName: "Sunita Patil",
		state: "Maharashtra",
		jurisdiction: "Maharashtra",
		status: "completed",
		providerRef: "MHGRAS20261005-9920",
		certificateNumber: "IN-MH552091483719M",
		stampDutyAmount: 1e3,
		createdAt: "2026-10-05T14:20:00Z",
		completedAt: "2026-10-05T14:35:00Z",
		retryCount: 0,
		ruleVersion: "v1.0",
		effectiveDate: "01 Jan 2026",
		vendor: "e-GRAS Maharashtra"
	},
	{
		id: "stp_006",
		agreementId: "agr_KA2E7V",
		customerName: "Suresh Pillai",
		state: "Karnataka",
		jurisdiction: "Karnataka",
		status: "completed",
		providerRef: "KARES20261006-5534",
		certificateNumber: "IN-KA553412890471S",
		stampDutyAmount: 500,
		createdAt: "2026-10-06T14:13:00Z",
		completedAt: "2026-10-06T14:20:00Z",
		retryCount: 0,
		ruleVersion: "v1.0",
		effectiveDate: "01 Jan 2026",
		vendor: "SignDesk"
	},
	{
		id: "stp_007",
		agreementId: "agr_MH3F3C",
		customerName: "Rohan Kulkarni",
		state: "Maharashtra",
		jurisdiction: "Maharashtra",
		status: "pending",
		stampDutyAmount: 1e3,
		createdAt: "2026-10-07T09:40:00Z",
		retryCount: 0,
		ruleVersion: "v1.0",
		effectiveDate: "01 Jan 2026",
		vendor: "e-GRAS Maharashtra"
	}
];
export const mockESigns = [
	{
		id: "sig_10245",
		agreementId: "agr_KA2E9X",
		signerName: "Rahul Kumar",
		signerRole: "Landlord",
		signerEmail: "rahul.kumar@gmail.com",
		signerPhone: "+91 98765 43210",
		status: "completed",
		sentAt: "2026-10-06T11:45:00Z",
		signedAt: "2026-10-06T12:15:00Z",
		isGuestSigner: false,
		signer1Name: "Rahul Kumar",
		signer1Status: "signed",
		signer1SignedAt: "2026-10-06T12:15:00Z",
		signer2Name: "Anand Mehta",
		signer2Status: "pending",
		provider: "Leegality (Protean NSDL)",
		createdAt: "2026-10-06T11:45:00Z"
	},
	{
		id: "sig_001",
		agreementId: "agr_KA2E4S",
		signerName: "Kavitha Rao",
		signerRole: "Landlord",
		signerEmail: "kavitha.r@gmail.com",
		signerPhone: "+91 98765 11223",
		status: "completed",
		sentAt: "2026-10-04T11:15:00Z",
		signedAt: "2026-10-04T12:30:00Z",
		isGuestSigner: false,
		signer1Name: "Kavitha Rao",
		signer1Status: "signed",
		signer1SignedAt: "2026-10-04T12:30:00Z",
		signer2Name: "Asha Devi",
		signer2Status: "signed",
		signer2SignedAt: "2026-10-04T14:45:00Z",
		finalizedAt: "2026-10-04T14:50:00Z",
		provider: "Leegality",
		createdAt: "2026-10-04T11:15:00Z"
	},
	{
		id: "sig_002",
		agreementId: "agr_KA2E4S",
		signerName: "Asha Devi",
		signerRole: "Tenant",
		signerEmail: "asha.devi@gmail.com",
		signerPhone: "+91 98765 22334",
		status: "completed",
		sentAt: "2026-10-04T12:35:00Z",
		signedAt: "2026-10-04T14:45:00Z",
		isGuestSigner: true,
		signer1Name: "Kavitha Rao",
		signer1Status: "signed",
		signer1SignedAt: "2026-10-04T12:30:00Z",
		signer2Name: "Asha Devi",
		signer2Status: "signed",
		signer2SignedAt: "2026-10-04T14:45:00Z",
		finalizedAt: "2026-10-04T14:50:00Z",
		provider: "Leegality",
		createdAt: "2026-10-04T12:35:00Z"
	},
	{
		id: "sig_003",
		agreementId: "agr_KA2E6U",
		signerName: "Lakshmi Devi",
		signerRole: "Landlord",
		signerEmail: "lakshmi.d@yahoo.com",
		signerPhone: "+91 98765 33445",
		status: "completed",
		sentAt: "2026-10-06T10:00:00Z",
		signedAt: "2026-10-06T11:22:00Z",
		isGuestSigner: false,
		signer1Name: "Lakshmi Devi",
		signer1Status: "signed",
		signer1SignedAt: "2026-10-06T11:22:00Z",
		signer2Name: "Mohan Verma",
		signer2Status: "invited",
		provider: "Leegality",
		createdAt: "2026-10-06T10:00:00Z"
	},
	{
		id: "sig_004",
		agreementId: "agr_KA2E6U",
		signerName: "Mohan Verma",
		signerRole: "Tenant",
		signerEmail: "mohan.v@outlook.com",
		signerPhone: "+91 99887 76655",
		status: "in_progress",
		sentAt: "2026-10-06T11:25:00Z",
		isGuestSigner: true,
		signer1Name: "Lakshmi Devi",
		signer1Status: "signed",
		signer1SignedAt: "2026-10-06T11:22:00Z",
		signer2Name: "Mohan Verma",
		signer2Status: "invited",
		provider: "Leegality",
		createdAt: "2026-10-06T11:25:00Z"
	},
	{
		id: "sig_005",
		agreementId: "agr_KA2E5T",
		signerName: "Sita Ram",
		signerRole: "Tenant",
		signerEmail: "sita.ram@gmail.com",
		signerPhone: "+91 88776 65544",
		status: "pending",
		sentAt: "2026-10-07T10:05:00Z",
		isGuestSigner: true,
		signer1Name: "Vikram Sharma",
		signer1Status: "signed",
		signer1SignedAt: "2026-10-07T10:00:00Z",
		signer2Name: "Sita Ram",
		signer2Status: "pending",
		provider: "Leegality",
		createdAt: "2026-10-07T10:05:00Z"
	},
	{
		id: "sig_006",
		agreementId: "agr_KA2E7V",
		signerName: "Suresh Pillai",
		signerRole: "Landlord",
		signerEmail: "suresh.p@gmail.com",
		signerPhone: "+91 76543 21098",
		status: "pending",
		sentAt: "2026-10-07T08:30:00Z",
		isGuestSigner: false,
		signer1Name: "Suresh Pillai",
		signer1Status: "pending",
		signer2Name: "Deepa Krishnan",
		signer2Status: "pending",
		provider: "Leegality",
		createdAt: "2026-10-07T08:30:00Z"
	},
	{
		id: "sig_007",
		agreementId: "agr_KA2E3R",
		signerName: "Rajan Nair",
		signerRole: "Landlord",
		signerEmail: "rajan.n@gmail.com",
		signerPhone: "+91 87654 32109",
		status: "failed",
		sentAt: "2026-10-07T09:15:00Z",
		isGuestSigner: false,
		signer1Name: "Rajan Nair",
		signer1Status: "failed",
		signer2Name: "Karan Joshi",
		signer2Status: "pending",
		errorMessage: "Aadhaar OTP verification failed: Max attempts exceeded (Provider error: ERR_OTP_EXPIRED)",
		provider: "Leegality (NSDL e-Sign)",
		createdAt: "2026-10-07T09:15:00Z"
	}
];
// ── Audit Logs ────────────────────────────────────────────────
export const mockAuditLogs = [
	{
		id: "log_001",
		timestamp: "2026-10-07T11:42:00Z",
		actor: "broker:brk_001",
		actorRole: "BROKER",
		action: "CREATE_AGREEMENT",
		entity: "agreement",
		entityId: "agr_KA2E9X",
		result: "success",
		description: "Broker created new agreement"
	},
	{
		id: "log_002",
		timestamp: "2026-10-07T10:23:00Z",
		actor: "system",
		actorRole: "SYSTEM",
		action: "INITIATE_ESTAMP",
		entity: "estamp",
		entityId: "stp_002",
		result: "success",
		description: "eStamp request submitted to provider after payment capture"
	},
	{
		id: "log_003",
		timestamp: "2026-10-07T10:22:00Z",
		actor: "system",
		actorRole: "SYSTEM",
		action: "CAPTURE_PAYMENT",
		entity: "payment",
		entityId: "pay_002",
		result: "success",
		description: "Payment verified and captured via Razorpay webhook"
	},
	{
		id: "log_004",
		timestamp: "2026-10-07T11:22:00Z",
		actor: "signer:sig_002",
		actorRole: "SIGNER",
		action: "COMPLETE_ESIGN",
		entity: "esign",
		entityId: "sig_002",
		result: "success",
		description: "Signer 1 (Landlord) completed eSign via Leegality"
	},
	{
		id: "log_005",
		timestamp: "2026-10-07T10:44:00Z",
		actor: "system",
		actorRole: "SYSTEM",
		action: "PAYMENT_FAILED",
		entity: "payment",
		entityId: "pay_003",
		result: "failure",
		description: "Razorpay reported payment failure — insufficient funds"
	},
	{
		id: "log_006",
		timestamp: "2026-10-06T18:00:00Z",
		actor: "admin@zapdocs.in",
		actorRole: "ADMIN",
		action: "SUBMIT_RULE_FOR_APPROVAL",
		entity: "rule",
		entityId: "rule_KA_1_1",
		result: "success",
		description: "Karnataka rule v1.1 submitted for approval"
	},
	{
		id: "log_007",
		timestamp: "2026-10-07T10:30:00Z",
		actor: "system",
		actorRole: "SYSTEM",
		action: "ESTAMP_PROVIDER_TIMEOUT",
		entity: "estamp",
		entityId: "stp_004",
		result: "failure",
		description: "eStamp provider timeout — retry queued"
	},
	{
		id: "log_008",
		timestamp: "2026-10-07T10:58:00Z",
		actor: "system",
		actorRole: "SYSTEM",
		action: "FINALIZE_AGREEMENT",
		entity: "agreement",
		entityId: "agr_KA2E4S",
		result: "success",
		description: "Agreement finalized — final PDF stored and notifications dispatched"
	}
];
// ── Notifications ─────────────────────────────────────────────
export const mockNotifications = [
	{
		id: "ntf_001",
		agreementId: "agr_KA2E9X",
		relatedId: "#AGR-KA2E9X",
		title: "Payment verification completed",
		message: "Payment of ₹25,000 for agreement #AGR-KA2E9X has been successfully verified and credited.",
		category: "Payment",
		priority: "Normal",
		recipient: "Admin",
		status: "sent",
		readStatus: "Unread",
		createdAt: "2026-10-06T11:45:00Z",
		sentAt: "2026-10-06T11:45:00Z",
		type: "payment_confirmation"
	},
	{
		id: "ntf_002",
		agreementId: "agr_KA2E9X",
		relatedId: "#AGR-KA2E9X",
		title: "eStamp certificate generated",
		message: "Statutory eStamp duty certificate IN-KA991823487123A has been generated and attached to agreement bundle.",
		category: "eStamp",
		priority: "Normal",
		recipient: "Admin",
		status: "sent",
		readStatus: "Unread",
		createdAt: "2026-10-06T11:52:00Z",
		sentAt: "2026-10-06T11:52:00Z",
		type: "estamp_completed"
	},
	{
		id: "ntf_003",
		agreementId: "agr_KA2E8W",
		relatedId: "#AGR-KA2E8W",
		title: "High-value agreement signing required",
		message: "Commercial tenancy agreement #AGR-KA2E8W requires secondary compliance authorization before final seal.",
		category: "Agreement",
		priority: "Important",
		recipient: "Compliance Team",
		status: "sent",
		readStatus: "Unread",
		createdAt: "2026-10-07T10:20:00Z",
		sentAt: "2026-10-07T10:20:00Z",
		type: "agreement_completed"
	},
	{
		id: "ntf_004",
		relatedId: "SYS-BK-20261007",
		title: "Scheduled database backup completed",
		message: "Daily automated encryption backup archived successfully to vault storage without errors.",
		category: "System",
		priority: "Normal",
		recipient: "System Admin",
		status: "sent",
		readStatus: "Read",
		createdAt: "2026-10-07T04:00:00Z",
		sentAt: "2026-10-07T04:00:00Z",
		type: "system_alert"
	},
	{
		id: "ntf_005",
		agreementId: "agr_KA2E4S",
		relatedId: "#AGR-KA2E4S",
		title: "Both parties completed eSign",
		message: "Landlord (Kavitha Rao) and Tenant have completed digital Aadhaar signing sessions for #AGR-KA2E4S.",
		category: "eSign",
		priority: "Important",
		recipient: "Admin",
		status: "sent",
		readStatus: "Read",
		createdAt: "2026-10-07T11:25:00Z",
		sentAt: "2026-10-07T11:25:00Z",
		type: "signing_invitation"
	},
	{
		id: "ntf_006",
		relatedId: "pay_QzL3456789",
		title: "Payment gateway retry resolved",
		message: "Transient bank network reconciliation on transaction pay_QzL3456789 was successfully resolved on retry.",
		category: "Payment",
		priority: "Normal",
		recipient: "Finance Ops",
		status: "sent",
		readStatus: "Read",
		createdAt: "2026-10-06T14:15:00Z",
		sentAt: "2026-10-06T14:15:00Z",
		type: "payment_confirmation"
	},
	{
		id: "ntf_007",
		relatedId: "rule_MH_1_0_b",
		title: "Maharashtra jurisdiction rule draft pending",
		message: "Draft rule update for SRO Section 55 registration awaits final legal administrator approval.",
		category: "System",
		priority: "Important",
		recipient: "Superadmin",
		status: "sent",
		readStatus: "Unread",
		createdAt: "2026-10-05T18:00:00Z",
		sentAt: "2026-10-05T18:00:00Z",
		type: "system_alert"
	},
	{
		id: "ntf_008",
		agreementId: "agr_KA2E7V",
		relatedId: "#AGR-KA2E7V",
		title: "Agreement finalized and stored",
		message: "Final certified legal bundle for #AGR-KA2E7V generated and delivered to customer registered email.",
		category: "Agreement",
		priority: "Normal",
		recipient: "Admin",
		status: "sent",
		readStatus: "Read",
		createdAt: "2026-10-06T14:22:00Z",
		sentAt: "2026-10-06T14:22:00Z",
		type: "agreement_completed"
	},
	{
		id: "ntf_009",
		agreementId: "agr_KA2E5T",
		relatedId: "#AGR-KA2E5T",
		title: "eSign invitation SMS delivered",
		message: "Signing session invitation link dispatched to tenant phone number ending in ••••5544.",
		category: "eSign",
		priority: "Normal",
		recipient: "Operations",
		status: "sent",
		readStatus: "Read",
		createdAt: "2026-10-07T11:16:00Z",
		sentAt: "2026-10-07T11:16:00Z",
		type: "signing_invitation"
	},
	{
		id: "ntf_010",
		relatedId: "HEALTH-CHK-1007",
		title: "System health check passed",
		message: "All core integrations (eStamp provider, eSign provider, Vault Storage, Database) operational with 99.9% uptime.",
		category: "System",
		priority: "Normal",
		recipient: "DevOps Admin",
		status: "sent",
		readStatus: "Read",
		createdAt: "2026-10-07T08:00:00Z",
		sentAt: "2026-10-07T08:00:00Z",
		type: "system_alert"
	}
];
// ── System providers ──────────────────────────────────────────
export const mockProviders = [
	{
		name: "Razorpay",
		type: "payment",
		status: "operational",
		lastSuccess: "2026-10-07T11:38:00Z",
		failureCount: 0
	},
	{
		name: "Leegality eStamp",
		type: "estamp",
		status: "degraded",
		lastSuccess: "2026-10-07T11:12:00Z",
		lastFailure: "2026-10-07T10:30:00Z",
		failureCount: 2,
		retryState: "retry_1_queued"
	},
	{
		name: "Leegality eSign",
		type: "esign",
		status: "operational",
		lastSuccess: "2026-10-07T11:22:00Z",
		failureCount: 0
	},
	{
		name: "Object Storage (S3)",
		type: "storage",
		status: "operational",
		lastSuccess: "2026-10-07T10:58:00Z",
		failureCount: 0
	},
	{
		name: "PostgreSQL Database",
		type: "database",
		status: "operational",
		lastSuccess: "2026-10-07T11:45:00Z",
		failureCount: 0
	}
];
// ── Revenue Mock Data ─────────────────────────────────────────
export const mockRevenueStats = {
	grossTotal: 62860,
	netTotal: 36359,
	estampGross: 6450,
	estampNet: 1296,
	estampCertCount: 8,
	esignGross: 2760,
	esignNet: 1501,
	esignCount: 7,
	complianceGross: 53650,
	complianceNet: 33562,
	complianceCount: 13,
	platformGross: 40450,
	platformNet: 27696,
	monthlyGrowthPct: 18.4,
	settlementRate: 82.1,
	totalTransactions: 28
};
export const mockRevenueRecords = [
	(
	// ── eStamp Revenue Records ──
	{
		id: "rev_stp_001",
		transactionRef: "TXN-STP-8821901",
		agreementId: "agr_KA2E8W",
		customerName: "Priya Nair",
		category: "estamp",
		typeLabel: "eStamp Duty & Notary Processing",
		grossAmount: 750,
		platformFee: 200,
		govtOrCost: 500,
		gstAmount: 36,
		netRevenue: 164,
		paymentMethod: "UPI (Google Pay)",
		status: "settled",
		createdAt: "2026-10-07T10:20:00Z",
		settlementId: "SET-99210-KA",
		state: "Karnataka",
		provider: "SignDesk (StockHolding)",
		breakdownSummary: "Govt Stamp: ₹500, ZapDocs Platform Fee: ₹200, GST 18%: ₹36"
	}),
	{
		id: "rev_stp_002",
		transactionRef: "TXN-STP-8821902",
		agreementId: "agr_KA2E4S",
		customerName: "Kavitha Rao",
		category: "estamp",
		typeLabel: "eStamp Certificate Issuance",
		grossAmount: 750,
		platformFee: 200,
		govtOrCost: 500,
		gstAmount: 36,
		netRevenue: 164,
		paymentMethod: "Net Banking (HDFC)",
		status: "settled",
		createdAt: "2026-10-04T11:05:00Z",
		settlementId: "SET-99201-KA",
		state: "Karnataka",
		provider: "SignDesk",
		breakdownSummary: "Govt Stamp: ₹500, Convenience Fee: ₹200, GST 18%: ₹36"
	},
	{
		id: "rev_stp_003",
		transactionRef: "TXN-STP-8821903",
		agreementId: "agr_MH3F1A",
		customerName: "Amit Deshmukh",
		category: "estamp",
		typeLabel: "Maharashtra SRO eStamp Franking",
		grossAmount: 1350,
		platformFee: 300,
		govtOrCost: 1e3,
		gstAmount: 54,
		netRevenue: 246,
		paymentMethod: "Credit Card (Visa)",
		status: "processing",
		createdAt: "2026-10-07T11:10:00Z",
		settlementId: "SET-99214-MH",
		state: "Maharashtra",
		provider: "e-GRAS Maharashtra",
		breakdownSummary: "Statutory Duty: ₹1,000, Processing Fee: ₹300, GST: ₹54"
	},
	{
		id: "rev_stp_004",
		transactionRef: "TXN-STP-8821904",
		agreementId: "agr_MH3F2B",
		customerName: "Sunita Patil",
		category: "estamp",
		typeLabel: "Maharashtra e-Registration Stamp Duty",
		grossAmount: 1350,
		platformFee: 300,
		govtOrCost: 1e3,
		gstAmount: 54,
		netRevenue: 246,
		paymentMethod: "UPI (PhonePe)",
		status: "settled",
		createdAt: "2026-10-05T14:20:00Z",
		settlementId: "SET-99205-MH",
		state: "Maharashtra",
		provider: "e-GRAS Maharashtra",
		breakdownSummary: "State Revenue Dept: ₹1,000, ZapDocs Fee: ₹300, GST: ₹54"
	},
	{
		id: "rev_stp_005",
		transactionRef: "TXN-STP-8821905",
		agreementId: "agr_KA2E7V",
		customerName: "Suresh Pillai",
		category: "estamp",
		typeLabel: "Article 30 Digital eStamp Endorsement",
		grossAmount: 750,
		platformFee: 200,
		govtOrCost: 500,
		gstAmount: 36,
		netRevenue: 164,
		paymentMethod: "Debit Card (ICICI)",
		status: "settled",
		createdAt: "2026-10-06T14:10:00Z",
		settlementId: "SET-99209-KA",
		state: "Karnataka",
		provider: "SignDesk",
		breakdownSummary: "Karnataka Stamp Act Art 30: ₹500, Handling Fee: ₹200, GST: ₹36"
	},
	{
		id: "rev_stp_006",
		transactionRef: "TXN-STP-8821906",
		agreementId: "agr_TG4G1A",
		customerName: "Rajesh Malhotra",
		category: "estamp",
		typeLabel: "Telangana Non-Judicial eStamp Bond",
		grossAmount: 300,
		platformFee: 180,
		govtOrCost: 100,
		gstAmount: 32,
		netRevenue: 148,
		paymentMethod: "UPI (Paytm)",
		status: "settled",
		createdAt: "2026-10-03T16:00:00Z",
		settlementId: "SET-99195-TG",
		state: "Telangana",
		provider: "StockHolding (SHCIL) & IGRS",
		breakdownSummary: "Govt Stamp: ₹100, Service Fee: ₹180, GST: ₹32"
	},
	{
		id: "rev_stp_007",
		transactionRef: "TXN-STP-8821907",
		agreementId: "agr_TG5H1A",
		customerName: "Karthik Subramanian",
		category: "estamp",
		typeLabel: "Telangana Statutory Tenancy Stamp",
		grossAmount: 450,
		platformFee: 200,
		govtOrCost: 200,
		gstAmount: 36,
		netRevenue: 164,
		paymentMethod: "Net Banking (SBI)",
		status: "settled",
		createdAt: "2026-10-02T12:30:00Z",
		settlementId: "SET-99188-TG",
		state: "Telangana",
		provider: "StockHolding (SHCIL) & IGRS",
		breakdownSummary: "Govt Duty: ₹200, Service Fee: ₹200, GST: ₹36"
	},
	{
		id: "rev_stp_008",
		transactionRef: "TXN-STP-8821908",
		agreementId: "agr_KA2E2Q",
		customerName: "Deepa Krishnan",
		category: "estamp",
		typeLabel: "eStamp Gateway Retrial & Re-Order",
		grossAmount: 750,
		platformFee: 200,
		govtOrCost: 500,
		gstAmount: 36,
		netRevenue: 0,
		paymentMethod: "UPI (GPay)",
		status: "refunded",
		createdAt: "2026-10-06T12:00:00Z",
		settlementId: "REF-88129-KA",
		state: "Karnataka",
		provider: "SignDesk",
		breakdownSummary: "Refunded due to provider gateway timeout"
	},
	(
	// ── eSign Revenue Records ──
	{
		id: "rev_sig_001",
		transactionRef: "TXN-SIG-771901",
		agreementId: "agr_KA2E4S",
		customerName: "Kavitha Rao",
		category: "esign",
		typeLabel: "Dual Signer Aadhaar eSign (Landlord + Tenant)",
		grossAmount: 350,
		platformFee: 250,
		govtOrCost: 70,
		gstAmount: 45,
		netRevenue: 205,
		paymentMethod: "UPI (Google Pay)",
		status: "settled",
		createdAt: "2026-10-04T12:30:00Z",
		settlementId: "SET-99201-ES",
		state: "Karnataka",
		provider: "Leegality (Protean NSDL)",
		authMethod: "Aadhaar OTP",
		breakdownSummary: "UIDAI API cost: ₹70 (2 signers), ZapDocs eSign fee: ₹250, GST: ₹45"
	}),
	{
		id: "rev_sig_002",
		transactionRef: "TXN-SIG-771902",
		agreementId: "agr_KA2E6U",
		customerName: "Lakshmi Devi",
		category: "esign",
		typeLabel: "Aadhaar OTP Signer Verification",
		grossAmount: 180,
		platformFee: 130,
		govtOrCost: 35,
		gstAmount: 23,
		netRevenue: 107,
		paymentMethod: "Net Banking (Axis)",
		status: "settled",
		createdAt: "2026-10-06T11:22:00Z",
		settlementId: "SET-99209-ES",
		state: "Karnataka",
		provider: "Leegality",
		authMethod: "Aadhaar OTP",
		breakdownSummary: "Single signer Aadhaar eSign verification pass"
	},
	{
		id: "rev_sig_003",
		transactionRef: "TXN-SIG-771903",
		agreementId: "agr_MH3F2B",
		customerName: "Sunita Patil",
		category: "esign",
		typeLabel: "Class 3 Digital Signature Certificate (DSC)",
		grossAmount: 650,
		platformFee: 450,
		govtOrCost: 150,
		gstAmount: 81,
		netRevenue: 369,
		paymentMethod: "Corporate Credit Card",
		status: "settled",
		createdAt: "2026-10-05T14:40:00Z",
		settlementId: "SET-99205-ES",
		state: "Maharashtra",
		provider: "SignDesk (eMudhra)",
		authMethod: "DSC Token",
		breakdownSummary: "Commercial token signing with timestamping & cryptographic validation"
	},
	{
		id: "rev_sig_004",
		transactionRef: "TXN-SIG-771904",
		agreementId: "agr_KA2E9X",
		customerName: "Rahul Kumar",
		category: "esign",
		typeLabel: "Aadhaar eSign Biometric / OTP Bundle",
		grossAmount: 350,
		platformFee: 250,
		govtOrCost: 70,
		gstAmount: 45,
		netRevenue: 205,
		paymentMethod: "UPI (PhonePe)",
		status: "settled",
		createdAt: "2026-10-06T12:15:00Z",
		settlementId: "SET-99210-ES",
		state: "Karnataka",
		provider: "Leegality (NSDL)",
		authMethod: "Aadhaar OTP",
		breakdownSummary: "2 Signers executed via Protean ESP gateway"
	},
	{
		id: "rev_sig_005",
		transactionRef: "TXN-SIG-771905",
		agreementId: "agr_TG4G1A",
		customerName: "Rajesh Malhotra",
		category: "esign",
		typeLabel: "Hyderabad IT Corridor Commercial eSign",
		grossAmount: 700,
		platformFee: 500,
		govtOrCost: 140,
		gstAmount: 90,
		netRevenue: 410,
		paymentMethod: "UPI (BHIM)",
		status: "settled",
		createdAt: "2026-10-03T16:20:00Z",
		settlementId: "SET-99195-TG",
		state: "Telangana",
		provider: "Digio",
		authMethod: "Aadhaar OTP",
		breakdownSummary: "4 Parties (2 Lessors, 2 Lessees) sequential Aadhaar signing"
	},
	{
		id: "rev_sig_006",
		transactionRef: "TXN-SIG-771906",
		agreementId: "agr_KA2E3R",
		customerName: "Rajan Nair",
		category: "esign",
		typeLabel: "Aadhaar OTP Signature Session (Failed)",
		grossAmount: 180,
		platformFee: 130,
		govtOrCost: 35,
		gstAmount: 23,
		netRevenue: 0,
		paymentMethod: "UPI (Paytm)",
		status: "refunded",
		createdAt: "2026-10-07T09:20:00Z",
		settlementId: "REF-77109-ES",
		state: "Karnataka",
		provider: "Leegality",
		authMethod: "Aadhaar OTP",
		breakdownSummary: "Refunded after 3 failed OTP timeout attempts"
	},
	{
		id: "rev_sig_007",
		transactionRef: "TXN-SIG-771907",
		agreementId: "agr_MH3F3C",
		customerName: "Rohan Kulkarni",
		category: "esign",
		typeLabel: "FastTrack Aadhaar eSign Session",
		grossAmount: 350,
		platformFee: 250,
		govtOrCost: 70,
		gstAmount: 45,
		netRevenue: 205,
		paymentMethod: "Credit Card (Mastercard)",
		status: "processing",
		createdAt: "2026-10-07T09:45:00Z",
		settlementId: "SET-99216-ES",
		state: "Maharashtra",
		provider: "Leegality",
		authMethod: "Aadhaar OTP",
		breakdownSummary: "Session initiated, tenant awaiting final OTP submission"
	},
	(
	// ── Total / Platform Bundle Revenue Records ──
	{
		id: "rev_tot_001",
		transactionRef: "TXN-PLT-551001",
		agreementId: "agr_KA2E8W",
		customerName: "Priya Nair",
		category: "bundle",
		typeLabel: "Full Agreement Execution Bundle (eStamp + 2 eSigns + Vault)",
		grossAmount: 1850,
		platformFee: 750,
		govtOrCost: 570,
		gstAmount: 114,
		netRevenue: 636,
		paymentMethod: "UPI (Google Pay)",
		status: "settled",
		createdAt: "2026-10-07T10:20:00Z",
		settlementId: "SET-99210-ALL",
		state: "Karnataka",
		breakdownSummary: "Govt Stamp: ₹500, eSign API: ₹70, ZapDocs Platform Fee: ₹750, GST: ₹114"
	}),
	{
		id: "rev_tot_002",
		transactionRef: "TXN-PLT-551002",
		agreementId: "agr_KA2E4S",
		customerName: "Kavitha Rao",
		category: "bundle",
		typeLabel: "Residential Tenancy All-Inclusive Pack",
		grossAmount: 1850,
		platformFee: 750,
		govtOrCost: 570,
		gstAmount: 114,
		netRevenue: 636,
		paymentMethod: "Net Banking (HDFC)",
		status: "settled",
		createdAt: "2026-10-04T11:05:00Z",
		settlementId: "SET-99201-ALL",
		state: "Karnataka",
		breakdownSummary: "Complete rental workflow automation package"
	},
	{
		id: "rev_tot_003",
		transactionRef: "TXN-PLT-551003",
		agreementId: "agr_KA2E6U",
		customerName: "Lakshmi Devi",
		category: "platform",
		typeLabel: "Legal Review & Custom Template Surcharge",
		grossAmount: 950,
		platformFee: 750,
		govtOrCost: 100,
		gstAmount: 114,
		netRevenue: 636,
		paymentMethod: "Net Banking (Axis)",
		status: "settled",
		createdAt: "2026-10-06T09:05:00Z",
		settlementId: "SET-99208-ALL",
		state: "Karnataka",
		breakdownSummary: "Custom commercial covenants addendum drafting fee"
	},
	{
		id: "rev_tot_004",
		transactionRef: "TXN-PLT-551004",
		agreementId: "agr_BRK_RECHG_01",
		customerName: "Ramesh Kumar (RK Realty)",
		category: "platform",
		typeLabel: "Broker Wallet Recharge (100 Agreement Credits)",
		grossAmount: 14500,
		platformFee: 12e3,
		govtOrCost: 1500,
		gstAmount: 2160,
		netRevenue: 9840,
		paymentMethod: "Net Banking (ICICI Corporate)",
		status: "settled",
		createdAt: "2026-10-05T10:15:00Z",
		settlementId: "SET-99204-BRK",
		state: "Karnataka",
		breakdownSummary: "Bulk broker subscription package @ ₹145/agreement tier"
	},
	{
		id: "rev_tot_005",
		transactionRef: "TXN-PLT-551005",
		agreementId: "agr_CA_FIRM_01",
		customerName: "CA Rajesh Aggarwal (R. Aggarwal & Co)",
		category: "platform",
		typeLabel: "Chartered Accountant Annual Corporate Compliance License",
		grossAmount: 25e3,
		platformFee: 21e3,
		govtOrCost: 2e3,
		gstAmount: 3780,
		netRevenue: 17220,
		paymentMethod: "NEFT / RTGS Transfer",
		status: "settled",
		createdAt: "2026-10-01T15:30:00Z",
		settlementId: "SET-99175-CA",
		state: "Karnataka",
		breakdownSummary: "Annual partner tier including 250 HRA audits & lease compliance verification"
	},
	{
		id: "rev_tot_006",
		transactionRef: "TXN-PLT-551006",
		agreementId: "agr_MH3F1A",
		customerName: "Amit Deshmukh",
		category: "bundle",
		typeLabel: "Maharashtra SRO Digital Filing Bundle",
		grossAmount: 2650,
		platformFee: 950,
		govtOrCost: 1150,
		gstAmount: 171,
		netRevenue: 779,
		paymentMethod: "Credit Card (Visa)",
		status: "settled",
		createdAt: "2026-10-07T11:10:00Z",
		settlementId: "SET-99214-ALL",
		state: "Maharashtra",
		breakdownSummary: "State eStamp ₹1,000 + Biometric eSign + ZapDocs filing automation fee"
	},
	{
		id: "rev_tot_007",
		transactionRef: "TXN-PLT-551007",
		agreementId: "agr_KA2E7V",
		customerName: "Suresh Pillai",
		category: "bundle",
		typeLabel: "Standard 11-Month Rental Automation Package",
		grossAmount: 1850,
		platformFee: 750,
		govtOrCost: 570,
		gstAmount: 114,
		netRevenue: 636,
		paymentMethod: "UPI (Paytm)",
		status: "settled",
		createdAt: "2026-10-06T14:10:00Z",
		settlementId: "SET-99209-ALL",
		state: "Karnataka",
		breakdownSummary: "Fixed statutory Article 30 schedule + 2 eSign invitations"
	},
	{
		id: "rev_tot_008",
		transactionRef: "TXN-PLT-551008",
		agreementId: "agr_TG4G1A",
		customerName: "Rajesh Malhotra",
		category: "bundle",
		typeLabel: "Telangana Tenancy Bundle (IGRS eStamp + Dual eSign)",
		grossAmount: 1450,
		platformFee: 650,
		govtOrCost: 170,
		gstAmount: 99,
		netRevenue: 551,
		paymentMethod: "UPI (Google Pay)",
		status: "settled",
		createdAt: "2026-10-03T16:00:00Z",
		settlementId: "SET-99195-TG",
		state: "Telangana",
		breakdownSummary: "Integrated IGRS stamp generation and Digio eSign workflow"
	},
	(
	// ── Compliance Revenue Records ──
	{
		id: "rev_cmp_001",
		transactionRef: "TXN-CMP-661001",
		agreementId: "agr_KA2E8W",
		customerName: "Priya Nair",
		category: "compliance",
		typeLabel: "Tenant Police Verification & Screening",
		grossAmount: 450,
		platformFee: 400,
		govtOrCost: 50,
		gstAmount: 61,
		netRevenue: 339,
		paymentMethod: "UPI (Google Pay)",
		status: "settled",
		createdAt: "2026-10-07T10:35:00Z",
		settlementId: "SET-99210-CMP",
		state: "Karnataka",
		provider: "Karnataka Police Portal",
		breakdownSummary: "Official Bangalore Police jurisdictional tenant verification submission"
	}),
	{
		id: "rev_cmp_002",
		transactionRef: "TXN-CMP-661002",
		agreementId: "agr_MH3F1A",
		customerName: "Amit Deshmukh",
		category: "compliance",
		typeLabel: "Aadhaar & PAN Identity KYC Verification",
		grossAmount: 350,
		platformFee: 300,
		govtOrCost: 50,
		gstAmount: 45,
		netRevenue: 255,
		paymentMethod: "Credit Card (Visa)",
		status: "settled",
		createdAt: "2026-10-07T11:25:00Z",
		settlementId: "SET-99214-CMP",
		state: "Maharashtra",
		provider: "Protean KYC / NSDL",
		breakdownSummary: "Instant UIDAI + NSDL biometric & document background clearance"
	},
	{
		id: "rev_cmp_003",
		transactionRef: "TXN-CMP-661003",
		agreementId: "agr_CA_FIRM_01",
		customerName: "CA Rajesh Aggarwal (R. Aggarwal & Co)",
		category: "compliance",
		typeLabel: "CA Statutory Lease Audit & Title Verification Pack",
		grossAmount: 1850,
		platformFee: 1600,
		govtOrCost: 250,
		gstAmount: 244,
		netRevenue: 1356,
		paymentMethod: "NEFT Transfer",
		status: "settled",
		createdAt: "2026-10-06T15:00:00Z",
		settlementId: "SET-99209-CMP",
		state: "Karnataka",
		provider: "ZapDocs Legal Ops",
		breakdownSummary: "Full Section 65B Indian Evidence Act certified compliance audit pack"
	},
	{
		id: "rev_cmp_004",
		transactionRef: "TXN-CMP-661004",
		agreementId: "agr_TG4G1A",
		customerName: "Rajesh Malhotra",
		category: "compliance",
		typeLabel: "Hyderabad Police Tenant Clearance Verification",
		grossAmount: 500,
		platformFee: 450,
		govtOrCost: 50,
		gstAmount: 68,
		netRevenue: 382,
		paymentMethod: "UPI (BHIM)",
		status: "settled",
		createdAt: "2026-10-03T16:45:00Z",
		settlementId: "SET-99195-CMP",
		state: "Telangana",
		provider: "Telangana Police HawkEye",
		breakdownSummary: "Cyberabad commissionerate tenant background clearance report"
	},
	{
		id: "rev_cmp_005",
		transactionRef: "TXN-CMP-661005",
		agreementId: "agr_MH3F2B",
		customerName: "Sunita Patil",
		category: "compliance",
		typeLabel: "Tenancy Risk & Credit Verification Check",
		grossAmount: 400,
		platformFee: 350,
		govtOrCost: 50,
		gstAmount: 54,
		netRevenue: 296,
		paymentMethod: "UPI (PhonePe)",
		status: "processing",
		createdAt: "2026-10-05T15:10:00Z",
		settlementId: "SET-99205-CMP",
		state: "Maharashtra",
		provider: "CIBIL / Experian",
		breakdownSummary: "Credit score check & court record litigations history scan"
	}
];
