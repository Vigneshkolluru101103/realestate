/**
* OnboardingForm — Single shared onboarding form for Phase 1.
*
* Used for ALL of:
*   ✅ Admin "Add Broker" modal
*   ✅ Broker public Signup
*   ✅ User direct Signup
*   ✅ User signup via Broker Invitation
*
* Fields: Personal details + Primary location.
* No business/professional fields in Phase 1.
*
* Props:
*   - compact      → tighter layout for modals (admin add-broker)
*   - lockedFields → read-only fields pre-filled from invitation context
*/
import React, { useState, useEffect } from "react";
import { locationService } from "../../services/api/locationService";
import { isValidPhone } from "../../utils/validation";
export const EMPTY_ONBOARDING_FORM = {
	firstName: "",
	lastName: "",
	email: "",
	mobile: "",
	addressLine1: "",
	addressLine2: "",
	city: "",
	district: "",
	state: "",
	pinCode: ""
};
export function validateOnboardingForm(data) {
	const errs = {};
	if (!data.firstName.trim()) errs.firstName = "First name is required.";
	if (!data.lastName.trim()) errs.lastName = "Last name is required.";
	if (!data.email.trim()) {
		errs.email = "Email is required.";
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
		errs.email = "Enter a valid email address.";
	}
	if (!data.mobile.trim()) {
		errs.mobile = "Mobile number is required.";
	} else if (!isValidPhone(data.mobile)) {
		errs.mobile = "Enter a valid 10-digit Indian mobile number.";
	}
	if (!data.addressLine1.trim()) errs.addressLine1 = "Address Line 1 is required.";
	if (!data.city.trim()) errs.city = "City is required.";
	if (!data.district.trim()) errs.district = "District is required.";
	const allowedStates = ["karnataka", "maharashtra", "telangana"];
	if (!data.state) {
		errs.state = "Please select a state.";
	} else if (!allowedStates.includes(data.state.toLowerCase())) {
		errs.state = "Only Karnataka, Maharashtra, and Telangana are active jurisdictions.";
	}
	if (!data.pinCode.trim()) {
		errs.pinCode = "PIN Code is required.";
	} else if (!/^\d{6}$/.test(data.pinCode.trim())) {
		errs.pinCode = "PIN Code must be 6 digits.";
	}
	return errs;
}
// ── Component ─────────────────────────────────────────────────
export const OnboardingForm = ({ data, onChange, errors = {}, disabled = false, compact = false, lockedFields = [] }) => {
	const [supportedStates, setSupportedStates] = useState([
		{ code: "KA", name: "Karnataka", status: "active" },
		{ code: "MH", name: "Maharashtra", status: "active" },
		{ code: "TG", name: "Telangana", status: "active" }
	]);
	const [districtOptions, setDistrictOptions] = useState([]);

	const dataRef = React.useRef(data);
	React.useEffect(() => {
		dataRef.current = data;
	}, [data]);

	useEffect(() => {
		let isMounted = true;
		locationService.getSupportedStates().then((states) => {
			if (isMounted && Array.isArray(states) && states.length > 0) {
				setSupportedStates(states);
				// If form doesn't have a state yet, auto-select Karnataka if it's the only one
				if (!dataRef.current.state && states.length === 1) {
					onChange({ ...dataRef.current, state: states[0].name });
				}
			}
		});
		return () => {
			isMounted = false;
		};
	}, []);

	useEffect(() => {
		if (data.state) {
			const districts = locationService.getDistrictsForState(data.state);
			setDistrictOptions(districts);
		} else {
			setDistrictOptions([]);
		}
	}, [data.state]);

	const set = (field) => (e) => onChange({
		...dataRef.current,
		[field]: e.target.value
	});
	const isLocked = (f) => lockedFields.includes(f);
	const isReadOnly = (f) => disabled || isLocked(f);
	const fieldHeight = compact ? 36 : 42;
	const fieldFontSz = compact ? 13 : 14;
	const rowGap = compact ? 12 : 18;
	const sectionGap = compact ? 16 : 22;
	// ── Style helpers ──────────────────────────────────────────
	const labelStyle = {
		display: "block",
		fontSize: compact ? 12 : 12.5,
		fontWeight: 600,
		color: "var(--color-text-secondary)",
		marginBottom: 5,
		letterSpacing: "0.01em"
	};
	const inputBase = (id) => ({
		width: "100%",
		height: fieldHeight,
		padding: "0 12px",
		border: "1px solid",
		borderColor: errors[id] ? "var(--status-error)" : "var(--color-border)",
		borderRadius: "var(--radius-md)",
		fontSize: fieldFontSz,
		color: "var(--color-text-primary)",
		backgroundColor: isReadOnly(id) ? "var(--color-surface-subtle)" : "var(--color-surface)",
		boxShadow: errors[id] ? "0 0 0 2px rgba(220,38,38,0.1)" : undefined,
		outline: "none",
		transition: "border-color 150ms ease, box-shadow 150ms ease",
		cursor: isReadOnly(id) ? "not-allowed" : undefined
	});
	const errMsg = {
		fontSize: 11.5,
		color: "var(--status-error)",
		marginTop: 4
	};
	const grid2 = {
		display: "grid",
		gridTemplateColumns: "1fr 1fr",
		gap: compact ? 10 : 14
	};
	// ── Field builder ──────────────────────────────────────────
	const Field = (id, label, required, inputEl, error) => <div style={{ marginBottom: rowGap }}>
      <label style={labelStyle} htmlFor={id}>
        {label}
        {required && <span style={{
		color: "var(--status-error)",
		marginLeft: 2
	}}>*</span>}
      </label>
      {inputEl}
      {error && <p style={errMsg}>{error}</p>}
    </div>;
	const Inp = (id, type = "text", placeholder = "", maxLength) => <input id={id} type={type} style={inputBase(id)} value={data[id]} onChange={set(id)} placeholder={placeholder} disabled={isReadOnly(id)} readOnly={isLocked(id)} maxLength={maxLength} autoComplete="off" />;
	// ── Render ─────────────────────────────────────────────────
	return <div>
      {/* Personal details */}
      <div style={grid2}>
        {Field("firstName", "First Name", true, Inp("firstName", "text", "Rahul"), errors.firstName)}
        {Field("lastName", "Last Name", true, Inp("lastName", "text", "Sharma"), errors.lastName)}
      </div>

      {Field("email", "Email", true, Inp("email", "email", "rahul@example.com"), errors.email)}

      {Field("mobile", "Mobile Number", true, <div style={{
		display: "flex",
		gap: 8
	}}>
          <span style={{
		height: fieldHeight,
		width: 56,
		flexShrink: 0,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		border: "1px solid var(--color-border)",
		borderRadius: "var(--radius-md)",
		backgroundColor: "var(--color-surface-subtle)",
		color: "var(--color-text-secondary)",
		fontSize: fieldFontSz,
		fontWeight: 600,
		letterSpacing: "0.02em",
		userSelect: "none"
	}}>
            +91
          </span>
          <input id="mobile" type="tel" style={{
		...inputBase("mobile"),
		flex: 1
	}} value={data.mobile} onChange={set("mobile")} placeholder="9876543210" disabled={isReadOnly("mobile")} readOnly={isLocked("mobile")} maxLength={10} autoComplete="off" />
        </div>, errors.mobile)}

      {/* Location separator */}
      <div style={{
		display: "flex",
		alignItems: "center",
		gap: 10,
		margin: `${sectionGap}px 0 ${rowGap}px`
	}}>
        <div style={{
		flex: 1,
		height: 1,
		backgroundColor: "var(--color-border)"
	}} />
        <span style={{
		fontSize: 10.5,
		fontWeight: 700,
		color: "var(--color-text-muted)",
		textTransform: "uppercase",
		letterSpacing: "0.09em",
		whiteSpace: "nowrap"
	}}>
          Primary Location
        </span>
        <div style={{
		flex: 1,
		height: 1,
		backgroundColor: "var(--color-border)"
	}} />
      </div>

      {Field("addressLine1", "Address Line 1", true, Inp("addressLine1", "text", "Flat / House no., Building, Street"), errors.addressLine1)}

      {Field("addressLine2", "Address Line 2", false, Inp("addressLine2", "text", "Area, Locality (optional)"), errors.addressLine2)}

      <div style={grid2}>
        {Field("city", "City", true, Inp("city", "text", "Bengaluru"), errors.city)}
        {Field(
          "district",
          "District",
          true,
          <div>
            <input
              id="district"
              type="text"
              list="district-options"
              style={inputBase("district")}
              value={data.district}
              onChange={set("district")}
              placeholder="e.g. Bengaluru Urban"
              disabled={isReadOnly("district")}
              readOnly={isLocked("district")}
              autoComplete="off"
            />
            {districtOptions.length > 0 && (
              <datalist id="district-options">
                {districtOptions.map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>
            )}
          </div>,
          errors.district
        )}
      </div>

      <div style={grid2}>
        {Field("state", "State", true, <select id="state" style={{
		...inputBase("state"),
		cursor: isReadOnly("state") ? "not-allowed" : "pointer"
	}} value={data.state} onChange={set("state")} disabled={isReadOnly("state")}>
            <option value="">Select State</option>
            {supportedStates.map((s) => (
              <option key={s.code || s.name} value={s.name}>
                {s.name} {s.status === "active" ? "(Active - Phase 1)" : ""}
              </option>
            ))}
          </select>, errors.state)}
        {Field("pinCode", "PIN Code", true, Inp("pinCode", "text", "560001", 6), errors.pinCode)}
      </div>
    </div>;
};
export const EMPTY_BROKER_FORM = EMPTY_ONBOARDING_FORM;
export const EMPTY_OWNER_FORM = EMPTY_ONBOARDING_FORM;
export const validateBrokerForm = validateOnboardingForm;
export const validateOwnerForm = validateOnboardingForm;
export const BrokerOnboardingForm = OnboardingForm;
export const OwnerOnboardingForm = OnboardingForm;
