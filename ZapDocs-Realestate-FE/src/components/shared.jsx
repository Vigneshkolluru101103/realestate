import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { Loader2, AlertCircle, FileX, Search, X, ChevronDown, ChevronUp, Check } from "lucide-react";
// ── Subtle Skeleton Loader ───────────────────────────────────
export const TableSkeleton = ({ rows = 5, columns = 6 }) => <div style={{ padding: "4px 0" }}>
	{Array.from({ length: rows }).map((_, rIdx) => <div key={rIdx} className="skeleton-table-row" style={{
		display: "grid",
		gridTemplateColumns: `repeat(${columns}, 1fr)`,
		gap: 16,
		padding: "14px 16px",
		borderBottom: "1px solid var(--color-border-subtle)"
	}}>
		{Array.from({ length: columns }).map((_, cIdx) => <div key={cIdx} className="skeleton" style={{
			height: 14,
			borderRadius: 4,
			width: cIdx === 0 ? "60%" : cIdx === columns - 1 ? "40%" : "80%"
		}} />)}
	</div>)}
</div>;
// ── Loading State ─────────────────────────────────────────────
export const LoadingState = ({ message = "Loading…" }) => <div style={{
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	padding: "60px 20px",
	color: "var(--color-text-secondary)"
}}>
	<Loader2 size={22} style={{
		animation: "spin 1s linear infinite",
		color: "var(--color-brand)",
		marginBottom: 12
	}} />
	<p style={{
		fontSize: 13,
		color: "var(--color-text-secondary)"
	}}>{message}</p>
	<style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
</div>;
// ── Error State (Human-readable, with technical details) ──────
export const ErrorState = ({ message = "The service is temporarily unavailable. Please try again.", technicalDetails, onRetry }) => {
	const [showTech, setShowTech] = useState(false);
	return <div style={{
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		padding: "50px 20px",
		textAlign: "center"
	}}>
		<div style={{
			width: 40,
			height: 40,
			borderRadius: "50%",
			backgroundColor: "var(--status-error-bg)",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			color: "var(--status-error)",
			marginBottom: 12
		}}>
			<AlertCircle size={20} />
		</div>
		<p style={{
			fontSize: 15,
			fontWeight: 600,
			color: "var(--color-text-primary)",
			marginBottom: 4
		}}>
			Unable to load data
		</p>
		<p style={{
			fontSize: 13,
			color: "var(--color-text-secondary)",
			maxWidth: 400,
			marginBottom: 16
		}}>
			{message}
		</p>

		<div style={{
			display: "flex",
			gap: 10,
			alignItems: "center"
		}}>
			{onRetry && <button className="btn btn-outline" onClick={onRetry}>
				Try again
			</button>}
			{technicalDetails && <button className="btn btn-ghost btn-sm" onClick={() => setShowTech((s) => !s)} style={{ fontSize: 12 }}>
				<span>Technical details</span>
				{showTech ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
			</button>}
		</div>

		{showTech && technicalDetails && <div style={{
			marginTop: 16,
			textAlign: "left",
			maxWidth: 440,
			width: "100%",
			background: "var(--color-surface-subtle)",
			border: "1px solid var(--color-border)",
			borderRadius: 6,
			padding: 12,
			fontSize: 11.5,
			fontFamily: "monospace",
			color: "var(--color-text-secondary)",
			whiteSpace: "pre-wrap",
			wordBreak: "break-all",
			overflowWrap: "anywhere"
		}}>
			{technicalDetails}
		</div>}
	</div>;
};
export const EmptyState = ({ title = "No records found", description = "Try changing your filters or search.", icon, action }) => <div style={{
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	padding: "50px 20px",
	textAlign: "center"
}}>
	<div style={{
		width: 44,
		height: 44,
		borderRadius: "50%",
		backgroundColor: "#f3f4f6",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		color: "#9ca3af",
		marginBottom: 12
	}}>
		{icon ?? <FileX size={20} />}
	</div>
	<p style={{
		fontSize: 14,
		fontWeight: 600,
		color: "var(--color-text-primary)",
		marginBottom: 4
	}}>{title}</p>
	<p style={{
		fontSize: 12.5,
		color: "var(--color-text-secondary)",
		maxWidth: 340,
		marginBottom: action ? 16 : 0
	}}>{description}</p>
	{action && <div>{action}</div>}
</div>;
const badgeMap = {
	// Green -> Completed / Paid / Active / Approved / Signed / Healthy / Operational
	completed: {
		label: "Completed",
		type: "success"
	},
	paid: {
		label: "Paid",
		type: "success"
	},
	captured: {
		label: "Paid",
		type: "success"
	},
	active: {
		label: "Active",
		type: "success"
	},
	operational: {
		label: "Operational",
		type: "success"
	},
	approved: {
		label: "Approved",
		type: "success"
	},
	signed: {
		label: "Signed",
		type: "success"
	},
	healthy: {
		label: "Healthy",
		type: "success"
	},
	success: {
		label: "Success",
		type: "success"
	},
	// Amber -> Pending / In Review / Degraded / Low / Unread
	pending: {
		label: "Pending",
		type: "warning"
	},
	pending_approval: {
		label: "Pending Approval",
		type: "warning"
	},
	"pending approval": {
		label: "Pending Approval",
		type: "warning"
	},
	payment_pending: {
		label: "Payment Pending",
		type: "warning"
	},
	estamp_pending: {
		label: "Stamping Pending",
		type: "warning"
	},
	signing_pending: {
		label: "Awaiting Signatures",
		type: "warning"
	},
	signer2_invited: {
		label: "Tenant Invited",
		type: "warning"
	},
	degraded: {
		label: "Degraded",
		type: "warning"
	},
	low: {
		label: "Low",
		type: "warning"
	},
	unread: {
		label: "Unread",
		type: "warning"
	},
	retry_required: {
		label: "Retry Required",
		type: "warning"
	},
	reconciliation: {
		label: "Reconciliation",
		type: "warning"
	},
	not_started: {
		label: "Not Started",
		type: "warning"
	},
	// Red -> Failed / Down / Exhausted / Cancelled / Rejected
	failed: {
		label: "Failed",
		type: "error"
	},
	down: {
		label: "Down",
		type: "error"
	},
	exhausted: {
		label: "Exhausted",
		type: "error"
	},
	unavailable: {
		label: "Unavailable",
		type: "error"
	},
	suspended: {
		label: "Suspended",
		type: "error"
	},
	rejected: {
		label: "Rejected",
		type: "error"
	},
	failure: {
		label: "Failed",
		type: "error"
	},
	cancelled: {
		label: "Cancelled",
		type: "error"
	},
	important: {
		label: "Important",
		type: "error"
	},
	// Blue -> Processing / In Progress / Sent / Verified
	processing: {
		label: "Processing",
		type: "info"
	},
	in_progress: {
		label: "In Progress",
		type: "info"
	},
	"in progress": {
		label: "In Progress",
		type: "info"
	},
	authorized: {
		label: "Authorized",
		type: "info"
	},
	order_created: {
		label: "Order Created",
		type: "info"
	},
	details_validated: {
		label: "Validated",
		type: "info"
	},
	payment_verified: {
		label: "Payment Verified",
		type: "info"
	},
	estamp_completed: {
		label: "Stamped",
		type: "info"
	},
	signer1_signed: {
		label: "Landlord Signed",
		type: "info"
	},
	landlord_signed: {
		label: "Landlord Signed",
		type: "info"
	},
	signer2_signed: {
		label: "Tenant Signed",
		type: "info"
	},
	tenant_signed: {
		label: "Tenant Signed",
		type: "info"
	},
	finalizing: {
		label: "Finalizing",
		type: "info"
	},
	refunded: {
		label: "Refunded",
		type: "info"
	},
	sent: {
		label: "Sent",
		type: "info"
	},
	// Neutral / Gray -> Draft / Inactive / Archived / Read
	draft: {
		label: "Draft",
		type: "neutral"
	},
	created: {
		label: "Created",
		type: "neutral"
	},
	inactive: {
		label: "Inactive",
		type: "neutral"
	},
	archived: {
		label: "Archived",
		type: "neutral"
	},
	read: {
		label: "Read",
		type: "neutral"
	}
};
export const StatusBadge = ({ status, labelOverride }) => {
	const normalized = (status || "").toLowerCase().trim();
	const entry = badgeMap[normalized] || {
		label: labelOverride || status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
		type: "warning"
	};
	return <span className={`status-badge ${entry.type}`}>
		{labelOverride || entry.label}
	</span>;
};
export const StatCard = ({ label, value, subtext }) => <div className="metric-card">
	<div className="metric-card-label">{label}</div>
	<div className="metric-card-value">{typeof value === "number" ? value.toLocaleString() : value}</div>
	{subtext && <div className="metric-card-sub">{subtext}</div>}
</div>;
export const Pagination = ({ page = 1, totalPages = 1, total = 0, pageSize = 10, onPageChange, itemLabel }) => {
	const start = Math.max(1, (page - 1) * pageSize + 1);
	const end = Math.min(page * pageSize, total);
	if (total === 0) return null;
	const pages = [];
	if (totalPages <= 5) {
		for (let i = 1; i <= totalPages; i++) pages.push(i);
	} else {
		pages.push(1);
		if (page > 3) pages.push("...");
		const startP = Math.max(2, page - 1);
		const endP = Math.min(totalPages - 1, page + 1);
		for (let i = startP; i <= endP; i++) {
			if (!pages.includes(i)) pages.push(i);
		}
		if (page < totalPages - 2) pages.push("...");
		pages.push(totalPages);
	}
	return <div style={{
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		padding: "12px 16px",
		borderTop: "1px solid var(--color-border)",
		backgroundColor: "var(--color-surface-subtle)",
		fontSize: 12.5,
		color: "var(--color-text-secondary)",
		flexWrap: "wrap",
		gap: 12
	}}>
		<span>Showing {start}–{end} of {total.toLocaleString()}{itemLabel ? ` ${itemLabel}` : ""}</span>
		<div style={{
			display: "flex",
			alignItems: "center",
			gap: 4
		}}>
			<button className="btn btn-outline btn-sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)} aria-label="Previous page" style={{
				height: 30,
				padding: "0 10px",
				fontSize: 12
			}}>
				Previous
			</button>
			{pages.map((p, idx) => typeof p === "number" ? <button key={idx} className={`btn btn-sm ${page === p ? "btn-primary" : "btn-outline"}`} style={{
				minWidth: 30,
				height: 30,
				padding: "0 6px",
				fontSize: 12,
				fontWeight: page === p ? 600 : 400
			}} onClick={() => onPageChange(p)}>
				{p}
			</button> : <span key={idx} style={{
				padding: "0 4px",
				color: "var(--color-text-muted)",
				fontSize: 12
			}}>
				…
			</span>)}
			<button className="btn btn-outline btn-sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} aria-label="Next page" style={{
				height: 30,
				padding: "0 10px",
				fontSize: 12
			}}>
				Next
			</button>
		</div>
	</div>;
};
export const SearchInput = ({ value, onChange, placeholder = "Search…" }) => <div style={{
	position: "relative",
	display: "flex",
	alignItems: "center",
	minWidth: 240
}}>
	<Search size={14} style={{
		position: "absolute",
		left: 12,
		color: "#64748b",
		pointerEvents: "none"
	}} />
	<input type="text" className="form-input" style={{
		paddingLeft: 34,
		fontSize: 13,
		height: 36,
		borderRadius: "var(--radius-pill)",
		backgroundColor: "#ffffff",
		border: "1px solid rgba(0, 0, 0, 0.14)",
		boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)"
	}} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} />
</div>;
export const Modal = ({ open, onClose, title, children, footer, maxWidth = 520 }) => {
	React.useEffect(() => {
		if (!open) return;
		const handleKeyDown = (e) => {
			if (e.key === "Escape" && onClose) {
				e.stopPropagation();
				onClose();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [open, onClose]);

	if (!open) return null;

	const handleOverlayClick = (e) => {
		e.stopPropagation();
		if (e.target === e.currentTarget && onClose) {
			onClose();
		}
	};

	const modalElement = (
		<div
			className="modal-overlay active"
			id="zd-shared-modal-overlay"
			style={{
				position: "fixed",
				inset: 0,
				backgroundColor: "rgba(15, 23, 42, 0.45)",
				backdropFilter: "blur(20px) saturate(180%)",
				WebkitBackdropFilter: "blur(20px) saturate(180%)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: "max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left))",
				zIndex: 99999,
				opacity: 1,
				visibility: "visible",
				pointerEvents: "auto"
			}}
			onClick={handleOverlayClick}
			role="dialog"
			aria-modal="true"
		>
			<div
				className="modal-content"
				style={{
					maxWidth,
					width: "100%",
					backgroundColor: "rgba(255, 255, 255, 0.94)",
					backdropFilter: "blur(24px) saturate(190%)",
					WebkitBackdropFilter: "blur(24px) saturate(190%)",
					borderRadius: 20,
					border: "1px solid rgba(220, 232, 248, 0.85)",
					boxShadow: "0 24px 60px -10px rgba(15, 23, 42, 0.18), 0 10px 24px -5px rgba(15, 23, 42, 0.06)",
					opacity: 1,
					visibility: "visible",
					pointerEvents: "auto",
					position: "relative",
					maxHeight: "min(90vh, calc(100dvh - 32px))",
					display: "flex",
					flexDirection: "column",
					animation: "appleModalScaleIn 220ms cubic-bezier(0.16, 1, 0.3, 1)",
					willChange: "transform, opacity",
					overflow: "hidden"
				}}
				onClick={(e) => e.stopPropagation()}
			>
				<div
					className="modal-header"
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						padding: "16px 20px",
						borderBottom: "1px solid var(--color-border, #e2e8f0)",
						flexShrink: 0,
						gap: 12
					}}
				>
					<span
						className="modal-title"
						style={{
							fontWeight: 600,
							fontSize: 16,
							color: "var(--color-text-primary, #0f172a)",
							minWidth: 0,
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap"
						}}
					>
						{title}
					</span>
					<button
						type="button"
						className="modal-close-x-btn"
						id="modal-close-x-btn"
						onClick={(e) => {
							e.stopPropagation();
							if (onClose) onClose();
						}}
						aria-label="Close modal"
						style={{
							display: "inline-flex",
							alignItems: "center",
							justifyContent: "center",
							width: 32,
							height: 32,
							borderRadius: 6,
							border: "1px solid transparent",
							backgroundColor: "transparent",
							color: "var(--color-text-secondary, #64748b)",
							cursor: "pointer",
							padding: 0,
							transition: "all 0.15s ease"
						}}
					>
						<X size={18} />
					</button>
				</div>
				<div
					className="modal-body"
					style={{
						padding: "20px",
						overflowY: "auto",
						flexGrow: 1,
						minHeight: 0,
						WebkitOverflowScrolling: "touch"
					}}
				>
					{children}
				</div>
				{footer && (
					<div
						className="modal-footer"
						style={{
							padding: "14px 20px",
							borderTop: "1px solid var(--color-border, #e2e8f0)",
							backgroundColor: "var(--color-surface-subtle, #f8fafc)",
							display: "flex",
							alignItems: "center",
							justifyContent: "flex-end",
							flexWrap: "wrap",
							gap: 8,
							flexShrink: 0
						}}
					>
						{footer}
					</div>
				)}
			</div>
		</div>
	);

	return typeof document !== "undefined" ? createPortal(modalElement, document.body) : modalElement;
};
export const ConfirmDialog = ({ open, title, message, confirmLabel = "Confirm", danger, onConfirm, onCancel }) => {
	if (!open) return null;
	return <Modal open={open} onClose={onCancel} title={title} maxWidth={440} footer={<>
		<button className="btn btn-outline" onClick={onCancel}>
			Cancel
		</button>
		<button className={`btn ${danger ? "btn-danger" : "btn-primary"}`} onClick={onConfirm}>
			{confirmLabel}
		</button>
	</>}>
		<p style={{
			fontSize: 13.5,
			color: "var(--color-text-secondary)",
			lineHeight: 1.5
		}}>
			{message}
		</p>
	</Modal>;
};
// ── Standardized Info Row ─────────────────────────────────────
export const InfoRow = ({ label, value }) => (
	<div
		className="info-row"
		style={{
			display: "flex",
			justifyContent: "space-between",
			alignItems: "flex-start",
			gap: 12,
			padding: "8px 0",
			borderBottom: "1px solid var(--color-border-subtle)",
			fontSize: 13,
			minWidth: 0
		}}
	>
		<span
			className="info-row-label"
			style={{
				color: "var(--color-text-secondary)",
				fontWeight: 450,
				flexShrink: 0,
				maxWidth: "48%"
			}}
		>
			{label}
		</span>
		<span
			className="info-row-value"
			style={{
				color: "var(--color-text-primary)",
				fontWeight: 500,
				textAlign: "right",
				wordBreak: "break-word",
				overflowWrap: "anywhere",
				minWidth: 0,
				flex: 1
			}}
		>
			{value}
		</span>
	</div>
);
// ── Horizontal Agreement Progress Timeline ─────────────────────
// 6-step human-readable timeline:
// Created -> Payment -> eStamp -> Landlord Signed -> Tenant Signed -> Completed
export const HorizontalAgreementTimeline = ({ currentStatus }) => {
	const steps = [
		{
			key: "created",
			label: "Created"
		},
		{
			key: "payment",
			label: "Payment"
		},
		{
			key: "estamp",
			label: "eStamp"
		},
		{
			key: "landlord_signed",
			label: "Landlord Signed"
		},
		{
			key: "tenant_signed",
			label: "Tenant Signed"
		},
		{
			key: "completed",
			label: "Completed"
		}
	];
	const getStepIndex = (st) => {
		const s = st.toLowerCase();
		if (s === "completed") return 5;
		if (s === "finalizing" || s === "signer2_signed") return 4;
		if (s === "signer1_signed" || s === "signer2_invited") return 3;
		if (s === "estamp_completed" || s === "signing_pending") return 2;
		if (s === "payment_verified" || s === "estamp_pending") return 1;
		return 0;
	};
	const activeIdx = getStepIndex(currentStatus);
	return <div className="card" style={{
		padding: "24px 28px",
		marginBottom: 24
	}}>
		<div style={{
			fontSize: 12,
			fontWeight: 700,
			color: "#475569",
			textTransform: "uppercase",
			letterSpacing: "0.06em",
			marginBottom: 20
		}}>
			Agreement Progress
		</div>
		<div className="timeline-horizontal">
			<div className="timeline-track">
				<div className="timeline-track-fill" style={{ width: `${activeIdx / (steps.length - 1) * 100}%` }} />
			</div>
			{steps.map((st, i) => {
				const isDone = i < activeIdx || activeIdx === 5 && i === 5;
				const isCurrent = i === activeIdx && activeIdx < 5;
				const statusCls = isDone ? "completed" : isCurrent ? "active" : "";
				return <div key={st.key} className={`timeline-step ${statusCls}`}>
					<div className="timeline-dot">
						{isDone ? "✓" : i + 1}
					</div>
					<div className="timeline-label">{st.label}</div>
				</div>;
			})}
		</div>
	</div>;
};

// ── Viewport-Aware Custom Filter Dropdown ───────────────────────
export const CustomDropdown = ({
	value,
	onChange,
	options,
	children,
	placeholder = "Select...",
	ariaLabel,
	id,
	name,
	className = "",
	style = {},
	disabled = false,
	minMenuWidth = 140
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [menuCoords, setMenuCoords] = useState(null);
	const [focusedIndex, setFocusedIndex] = useState(-1);
	const containerRef = useRef(null);
	const buttonRef = useRef(null);
	const menuRef = useRef(null);

	// Normalize options from options prop or children (<option>)
	const normalizedOptions = useMemo(() => {
		if (Array.isArray(options)) {
			return options.map((opt) =>
				typeof opt === "object" && opt !== null
					? { value: opt.value ?? "", label: opt.label ?? String(opt.value ?? ""), disabled: !!opt.disabled }
					: { value: String(opt), label: String(opt), disabled: false }
			);
		}
		if (children) {
			const parsed = [];
			React.Children.forEach(children, (child) => {
				if (!child) return;
				if (child.type === "option" || child.props) {
					parsed.push({
						value: child.props.value ?? "",
						label: child.props.children ?? child.props.label ?? String(child.props.value ?? ""),
						disabled: !!child.props.disabled
					});
				}
			});
			return parsed;
		}
		return [];
	}, [options, children]);

	// Current selected item
	const selectedOption = useMemo(() => {
		const found = normalizedOptions.find((opt) => String(opt.value) === String(value));
		return found || null;
	}, [normalizedOptions, value]);

	const displayLabel = selectedOption
		? selectedOption.label
		: (placeholder || (normalizedOptions[0] ? normalizedOptions[0].label : ""));

	// Intelligent viewport-aware positioning
	const updatePosition = useCallback(() => {
		if (!buttonRef.current) return;
		const rect = buttonRef.current.getBoundingClientRect();
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		const PADDING = 8;

		// Constrain menu width to available viewport space
		const maxAvailableWidth = Math.max(120, vw - PADDING * 2);
		let targetWidth = Math.max(rect.width, minMenuWidth);
		if (targetWidth > maxAvailableWidth) {
			targetWidth = maxAvailableWidth;
		}

		// Horizontal position: clamp inside viewport edges
		let left = rect.left;
		if (left + targetWidth > vw - PADDING) {
			left = vw - PADDING - targetWidth;
		}
		if (left < PADDING) {
			left = PADDING;
		}

		// Vertical position: measure space below vs space above
		const spaceBelow = vh - rect.bottom - PADDING;
		const spaceAbove = rect.top - PADDING;
		const preferredMaxHeight = 240;

		if (spaceBelow < 180 && spaceAbove > spaceBelow) {
			// Flip above
			const availableHeight = Math.min(preferredMaxHeight, Math.max(90, spaceAbove - 6));
			setMenuCoords({
				placement: "top",
				bottom: vh - rect.top + 4,
				left,
				width: targetWidth,
				maxHeight: availableHeight
			});
		} else {
			// Open below
			const availableHeight = Math.min(preferredMaxHeight, Math.max(90, spaceBelow - 6));
			setMenuCoords({
				placement: "bottom",
				top: rect.bottom + 4,
				left,
				width: targetWidth,
				maxHeight: availableHeight
			});
		}
	}, [minMenuWidth]);

	// Open / close interactions
	useEffect(() => {
		if (!isOpen) return;

		updatePosition();

		const handleOutsideClick = (e) => {
			if (containerRef.current && containerRef.current.contains(e.target)) {
				return;
			}
			if (menuRef.current && menuRef.current.contains(e.target)) {
				return;
			}
			setIsOpen(false);
		};

		const handleKeyDown = (e) => {
			if (e.key === "Escape") {
				e.preventDefault();
				setIsOpen(false);
				if (buttonRef.current) buttonRef.current.focus();
			} else if (e.key === "ArrowDown") {
				e.preventDefault();
				setFocusedIndex((prev) => {
					const next = prev + 1;
					return next < normalizedOptions.length ? next : 0;
				});
			} else if (e.key === "ArrowUp") {
				e.preventDefault();
				setFocusedIndex((prev) => {
					const next = prev - 1;
					return next >= 0 ? next : normalizedOptions.length - 1;
				});
			} else if (e.key === "Enter" && focusedIndex >= 0 && focusedIndex < normalizedOptions.length) {
				e.preventDefault();
				const item = normalizedOptions[focusedIndex];
				if (!item.disabled) {
					handleSelect(item.value);
				}
			}
		};

		const handleScrollOrResize = () => {
			if (!buttonRef.current) return;
			const rect = buttonRef.current.getBoundingClientRect();
			if (rect.bottom < 0 || rect.top > window.innerHeight) {
				setIsOpen(false);
			} else {
				updatePosition();
			}
		};

		document.addEventListener("mousedown", handleOutsideClick);
		document.addEventListener("touchstart", handleOutsideClick, { passive: true });
		document.addEventListener("keydown", handleKeyDown);
		window.addEventListener("resize", handleScrollOrResize);
		window.addEventListener("scroll", handleScrollOrResize, true);

		return () => {
			document.removeEventListener("mousedown", handleOutsideClick);
			document.removeEventListener("touchstart", handleOutsideClick);
			document.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("resize", handleScrollOrResize);
			window.removeEventListener("scroll", handleScrollOrResize, true);
		};
	}, [isOpen, updatePosition, focusedIndex, normalizedOptions]);

	const handleSelect = (optVal) => {
		setIsOpen(false);
		if (onChange) {
			const syntheticEvent = {
				target: { value: optVal, name, id },
				currentTarget: { value: optVal, name, id },
				value: optVal
			};
			onChange(optVal, syntheticEvent);
		}
		if (buttonRef.current) {
			buttonRef.current.focus();
		}
	};

	const handleToggle = () => {
		if (disabled) return;
		if (!isOpen) {
			updatePosition();
			const currentIdx = normalizedOptions.findIndex((opt) => String(opt.value) === String(value));
			setFocusedIndex(currentIdx >= 0 ? currentIdx : 0);
		}
		setIsOpen((prev) => !prev);
	};

	const menuStyle = menuCoords
		? {
			position: "fixed",
			left: `${menuCoords.left}px`,
			width: `${menuCoords.width}px`,
			maxHeight: `${menuCoords.maxHeight}px`,
			...(menuCoords.placement === "top"
				? { bottom: `${menuCoords.bottom}px` }
				: { top: `${menuCoords.top}px` }),
			zIndex: 99999
		}
		: { display: "none" };

	return (
		<div
			ref={containerRef}
			className={`custom-filter-dropdown ${className}`}
			style={{ position: "relative", display: "inline-block", ...style }}
		>
			<button
				ref={buttonRef}
				type="button"
				id={id}
				name={name}
				disabled={disabled}
				className={`form-select custom-dropdown-btn ${isOpen ? "open" : ""}`}
				onClick={handleToggle}
				aria-haspopup="listbox"
				aria-expanded={isOpen}
				aria-label={ariaLabel || (typeof displayLabel === "string" ? displayLabel : "Filter option")}
			>
				<span className="custom-dropdown-label">{displayLabel}</span>
				<ChevronDown size={14} className={`custom-dropdown-chevron ${isOpen ? "open" : ""}`} />
			</button>

			{isOpen &&
				typeof document !== "undefined" &&
				createPortal(
					<div
						ref={menuRef}
						role="listbox"
						aria-label={ariaLabel}
						className="custom-dropdown-menu"
						style={menuStyle}
					>
						{normalizedOptions.map((opt, idx) => {
							const isSelected = String(opt.value) === String(value);
							const isFocused = idx === focusedIndex;
							return (
								<button
									key={`${opt.value}-${idx}`}
									type="button"
									role="option"
									aria-selected={isSelected}
									disabled={opt.disabled}
									className={`custom-dropdown-option ${isSelected ? "selected" : ""} ${isFocused ? "focused" : ""
										}`}
									onClick={() => handleSelect(opt.value)}
									onMouseEnter={() => setFocusedIndex(idx)}
								>
									<span className="custom-dropdown-option-text">{opt.label}</span>
									{isSelected && <Check size={14} className="custom-dropdown-check" />}
								</button>
							);
						})}
					</div>,
					document.body
				)}
		</div>
	);
};
