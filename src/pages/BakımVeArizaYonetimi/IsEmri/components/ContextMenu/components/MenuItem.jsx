import React, { useState } from "react";

const MenuItem = React.forwardRef(function MenuItem(
  { icon, title, description, danger = false, disabled = false, style, onClick, ...rest },
  ref
) {
  const [hover, setHover] = useState(false);

  const baseBg = danger ? "#FEE2E2" : "#F3F4F6";
  const baseColor = danger ? "#EF4444" : "#6B7280";
  const titleColor = danger ? "#EF4444" : "#111827";

  const handleClick = (e) => {
    if (disabled) return;
    onClick && onClick(e);
  };

  return (
    <div
      ref={ref}
      {...rest}
      onClick={handleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        padding: "10px 12px",
        borderRadius: "10px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "background-color 0.15s ease",
        backgroundColor: hover && !disabled ? (danger ? "#FEF2F2" : "#F9FAFB") : "transparent",
        userSelect: "none",
        ...style,
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          background: baseBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: baseColor,
          fontSize: "18px",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, paddingTop: "2px" }}>
        <span style={{ fontWeight: 600, fontSize: "14px", color: titleColor, lineHeight: 1.3 }}>{title}</span>
        {description && (
          <span style={{ fontSize: "12.5px", color: "#6B7280", lineHeight: 1.35, marginTop: "2px" }}>{description}</span>
        )}
      </div>
    </div>
  );
});

export default MenuItem;
