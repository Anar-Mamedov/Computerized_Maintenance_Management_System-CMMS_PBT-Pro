// Dashboard V2 ekranının ortak görsel tokenları.
// Tüm widget bileşenleri renk ve kart stillerini buradan alır.

export const COLORS = {
  surface: "#FFFFFF",
  border: "#E4E9F0",
  text: "#172033",
  muted: "#667085",
  zebra: "#FAFBFC",
  track: "#E4E9F0",
  blue: "#1677FF",
  blueSoft: "#E8F1FF",
  blueTint: "#EEF4FF",
  amber: "#F59E0B",
  amberSoft: "#FEF3E2",
  orange: "#F97316",
  orangeSoft: "#FFF1E6",
  red: "#F04438",
  redSoft: "#FEECEB",
  green: "#12B76A",
  greenSoft: "#E6F7EF",
  purple: "#7A5AF8",
  purpleSoft: "#EFEBFE",
  teal: "#13B8B2",
  // Durum dağılımı çubuğunda "Pasif" segmenti: üzerindeki koyu yazının okunabildiği nötr gri.
  neutral: "#C3CAD6",
  averageLine: "#D9E3F1",
};

export const CARD_STYLE = {
  background: COLORS.surface,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 12,
  boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
};

export const CARD_HEADER_STYLE = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 12,
  padding: "14px 16px 10px",
  borderBottom: `1px solid ${COLORS.border}`,
};

export const CARD_TITLE_STYLE = {
  fontSize: 14,
  fontWeight: 600,
  color: COLORS.text,
};

export const CARD_SUBTITLE_STYLE = {
  fontSize: 12,
  color: COLORS.muted,
  marginTop: 2,
};

export const ROW_GUTTER = [12, 12];

// KPI kartları ve aksiyon satırları için renk paleti eşlemesi.
export const TONES = {
  blue: { main: COLORS.blue, soft: COLORS.blueSoft },
  amber: { main: COLORS.amber, soft: COLORS.amberSoft },
  orange: { main: COLORS.orange, soft: COLORS.orangeSoft },
  red: { main: COLORS.red, soft: COLORS.redSoft },
  green: { main: COLORS.green, soft: COLORS.greenSoft },
  purple: { main: COLORS.purple, soft: COLORS.purpleSoft },
};
