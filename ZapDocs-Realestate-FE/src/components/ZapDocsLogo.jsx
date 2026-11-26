import React from "react";
export const ZapDocsLogo = ({ size = "md", variant = "horizontal", badge, subtitle, showTagline = true, fullWidth = false, textColor, onClick, className = "", style = {} }) => {
	// Dimension configurations
	const config = {
		sm: {
			iconSize: 22,
			fontSize: 15,
			taglineSize: 9,
			badgeSize: 9.5,
			gap: 8,
			logoH: 34,
			vIconH: 38,
			vGap: 12
		},
		md: {
			iconSize: 26,
			fontSize: 17,
			taglineSize: 9.5,
			badgeSize: 10,
			gap: 10,
			logoH: 42,
			vIconH: 46,
			vGap: 14
		},
		lg: {
			iconSize: 34,
			fontSize: 24,
			taglineSize: 10.5,
			badgeSize: 11,
			gap: 12,
			logoH: 64,
			vIconH: 54,
			vGap: 14
		},
		xl: {
			iconSize: 42,
			fontSize: 30,
			taglineSize: 12,
			badgeSize: 12,
			gap: 14,
			logoH: 84,
			vIconH: 66,
			vGap: 16
		}
	}[size];
	const primaryTextColor = textColor || "var(--color-text-primary, #0f172a)";
	const displayTagline = subtitle || (showTagline ? "Smart Loop | LegalTech" : undefined);
	if (variant === "icon-only") {
		return <div className={`zapdocs-logo-wrapper ${className}`} onClick={onClick} style={{
			display: "inline-flex",
			alignItems: "center",
			justifyContent: "center",
			cursor: onClick ? "pointer" : "default",
			userSelect: "none",
			...style
		}}>
        <img src="/zapdocs-emblem.png" alt="ZapDocs" style={{
			height: config.iconSize,
			width: "auto",
			objectFit: "contain",
			display: "block"
		}} />
      </div>;
	}
	// Exact image render of the full stacked white-background logo
	if (variant === "full" || variant === "image") {
		return <div className={`zapdocs-logo-wrapper ${className}`} onClick={onClick} style={{
			display: "inline-flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			cursor: onClick ? "pointer" : "default",
			userSelect: "none",
			...style
		}}>
        <img src="/zapdocs-logo.png" alt="ZapDocs - Smart Loop | LegalTech" style={{
			height: config.logoH * 2,
			width: "auto",
			objectFit: "contain",
			display: "block",
			maxWidth: "100%"
		}} />
        {badge && <span style={{
			fontSize: config.badgeSize,
			fontWeight: 700,
			letterSpacing: "0.05em",
			textTransform: "uppercase",
			color: "var(--color-brand, #2563eb)",
			backgroundColor: "rgba(37, 99, 235, 0.08)",
			border: "1px solid rgba(37, 99, 235, 0.2)",
			padding: "1.5px 6px",
			borderRadius: 4,
			marginTop: 6
		}}>
            {badge}
          </span>}
      </div>;
	}
	if (variant === "vertical") {
		return <div className={`zapdocs-logo-wrapper ${className}`} onClick={onClick} style={{
			display: "inline-flex",
			flexDirection: "column",
			alignItems: "center",
			textAlign: "center",
			cursor: onClick ? "pointer" : "default",
			userSelect: "none",
			...style
		}}>
        {/* Logo Icon Container - exact 12-16px gap to wordmark below */}
        <div style={{
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			marginBottom: config.vGap
		}}>
          <img src="/zapdocs-emblem.png" alt="ZapDocs" style={{
			height: config.vIconH,
			width: "auto",
			objectFit: "contain",
			display: "block",
			filter: "drop-shadow(0 4px 14px rgba(37, 99, 235, 0.2))"
		}} />
        </div>

        {/* Wordmark + Badge Row */}
        <div style={{
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			gap: 7,
			lineHeight: 1
		}}>
          <span style={{
			fontSize: config.fontSize,
			fontWeight: 800,
			letterSpacing: "-0.025em",
			color: primaryTextColor,
			lineHeight: 1.15
		}}>
            Zap<span style={{
			background: "linear-gradient(135deg, #0284c7 0%, #6366f1 50%, #9333ea 100%)",
			WebkitBackgroundClip: "text",
			WebkitTextFillColor: "transparent"
		}}>
              Docs
            </span>
          </span>
          {badge && <span style={{
			fontSize: config.badgeSize,
			fontWeight: 700,
			letterSpacing: "0.05em",
			textTransform: "uppercase",
			color: "var(--color-brand, #2563eb)",
			backgroundColor: "rgba(37, 99, 235, 0.08)",
			border: "1px solid rgba(37, 99, 235, 0.2)",
			padding: "2px 7px",
			borderRadius: 4,
			lineHeight: 1.2
		}}>
              {badge}
            </span>}
        </div>

        {/* Tagline Row */}
        {displayTagline && <div style={{
			fontSize: config.taglineSize,
			letterSpacing: "0.075em",
			fontWeight: 500,
			color: "var(--color-text-muted, #64748b)",
			marginTop: 5,
			lineHeight: 1.2
		}}>
            {displayTagline}
          </div>}
      </div>;
	}
	// Default: Horizontal lockup (ideal for navbar & sidebar)
	return <div className={`zapdocs-logo-wrapper ${className}`} onClick={onClick} style={{
		display: "inline-flex",
		alignItems: "center",
		gap: config.gap,
		cursor: onClick ? "pointer" : "default",
		textDecoration: "none",
		userSelect: "none",
		...fullWidth ? { width: "100%" } : {},
		...style
	}}>
      <img src="/zapdocs-emblem.png" alt="ZapDocs" style={{
		height: config.iconSize,
		width: "auto",
		objectFit: "contain",
		display: "block",
		flexShrink: 0
	}} />
      <div style={{
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		...fullWidth ? {
			flex: 1,
			minWidth: 0
		} : {}
	}}>
        <div style={{
		display: "flex",
		alignItems: "center",
		justifyContent: fullWidth ? "space-between" : "flex-start",
		gap: 6
	}}>
          <span style={{
		fontSize: config.fontSize,
		fontWeight: 800,
		letterSpacing: "-0.025em",
		color: primaryTextColor,
		lineHeight: 1.15,
		whiteSpace: "nowrap"
	}}>
            Zap<span style={{
		background: "linear-gradient(135deg, #0284c7 0%, #6366f1 50%, #9333ea 100%)",
		WebkitBackgroundClip: "text",
		WebkitTextFillColor: "transparent"
	}}>
              Docs
            </span>
          </span>
          {badge && <span style={{
		fontSize: config.badgeSize,
		fontWeight: 700,
		letterSpacing: "0.05em",
		textTransform: "uppercase",
		color: "var(--color-brand, #2563eb)",
		backgroundColor: "rgba(37, 99, 235, 0.08)",
		border: "1px solid rgba(37, 99, 235, 0.2)",
		padding: "1px 5px",
		borderRadius: 4,
		lineHeight: 1.3,
		marginLeft: fullWidth ? "auto" : undefined,
		flexShrink: 0
	}}>
              {badge}
            </span>}
        </div>
        {displayTagline && <div style={{
		fontSize: config.taglineSize,
		letterSpacing: "0.07em",
		fontWeight: 500,
		color: "var(--color-text-muted, #64748b)",
		marginTop: 1.5,
		lineHeight: 1,
		whiteSpace: "nowrap"
	}}>
            {displayTagline}
          </div>}
      </div>
    </div>;
};
