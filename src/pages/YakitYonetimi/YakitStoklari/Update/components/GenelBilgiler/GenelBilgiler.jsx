import React, { useEffect, useState } from "react";
import { Typography, InputNumber, Checkbox, Row, Col } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";
import PersonelTablo from "../../../../../../utils/components/PersonelTablo";

const { Text } = Typography;

// --- AYRILMIŞ TANK GÖRSELİ BİLEŞENİ ---
const TankLevelVisual = ({ percent = 0, criticalThreshold = 20 }) => {
  const [animatedLevel, setAnimatedLevel] = useState(0);
  const [isSloshing, setIsSloshing] = useState(false);

  const fill = Math.max(0, Math.min(percent, 100));
  const critical = Math.max(0, Math.min(criticalThreshold, 100));

  useEffect(() => {
    setAnimatedLevel(0);
    setIsSloshing(true);
    const t1 = setTimeout(() => setAnimatedLevel(fill), 150);
    const t2 = setTimeout(() => setIsSloshing(false), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [fill]);

  const bubbles = [18, 34, 52, 68, 81];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
      <div style={{
        position: "relative", display: "flex", height: "260px", width: "150px",
        alignItems: "end", overflow: "hidden", borderRadius: "18px",
        border: "2px solid #d9d9d9", backgroundColor: "#fafafa", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)"
      }}>
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 0,
          background: "linear-gradient(to top, #52c41a, #73d13d, #b7eb8f)",
          transition: "all 1s ease-out", height: `${animatedLevel}%`,
          backgroundColor: fill <= critical ? "#ff4d4f" : undefined // Kritik durumda renk değişimi
        }}>
          <div style={{
            position: "absolute", left: "-12%", right: "-12%", top: "-12px", height: "32px",
            borderRadius: "100%", backgroundColor: "rgba(255, 255, 255, 0.35)", filter: "blur(1px)",
            animation: isSloshing ? "tankSlosh 1.1s ease-in-out infinite alternate" : "none"
          }} />
          {bubbles.map((left, i) => (
            <span key={i} style={{
              position: "absolute", bottom: "8px", left: `${left}%`,
              width: `${6 + (i % 3) * 2}px`, height: `${6 + (i % 3) * 2}px`,
              borderRadius: "50%", backgroundColor: "rgba(255, 255, 255, 0.45)",
              animation: `tankBubble ${2 + i * 0.2}s ease-in-out ${i * 0.2}s infinite`
            }} />
          ))}
        </div>
        {/* Kırmızı kesik çizgi buradan kaldırıldı */}
        <div style={{ position: "relative", zIndex: 10, width: "100%", textAlign: "center", marginBottom: "auto", marginTop: "40%" }}>
          <div style={{ fontSize: "28px", fontWeight: "700", color: animatedLevel > 50 ? "#fff" : "#262626" }}>
            %{Math.round(fill)}
          </div>
          <div style={{ fontSize: "12px", fontWeight: "500", color: animatedLevel > 50 ? "#f0f0f0" : "#8c8c8c" }}>{t("Doluluk")}</div>
        </div>
      </div>
      <style>{`
        @keyframes tankSlosh { 0% { transform: rotate(-5deg) translateX(-5px); } 100% { transform: rotate(5deg) translateX(5px); } }
        @keyframes tankBubble { 0% { transform: translateY(0) scale(0.8); opacity: 0; } 20% { opacity: 0.9; } 100% { transform: translateY(-120px) scale(1.2); opacity: 0; } }
      `}</style>
    </div>
  );
};

// --- ANA BİLEŞEN ---
function GenelBilgiler({ selectedRowID }) {
  const { control, watch } = useFormContext();

  const kapasite = watch("kapasite") || 0;
  const mevcutMiktar = watch("mevcutMiktar") || 0;
  const kritikMiktar = watch("kritikMiktar") || 0;
  const sonHareket = watch("sonHareket") || "-";

  const durumText = watch("durum");
  const durumClass = watch("DURUM_CLASS") || "default";

  // Hesaplamalar
  const dolulukOrani = kapasite > 0 ? (mevcutMiktar / kapasite) * 100 : 0;
  const kritikOrani = kapasite > 0 ? (kritikMiktar / kapasite) * 100 : 0;
  const kalanKapasite = Math.max(0, kapasite - mevcutMiktar);
  const isKritik = mevcutMiktar <= kritikMiktar && kapasite > 0;

  const cardStyle = {
    padding: "12px 16px", borderRadius: "10px", border: "1px solid #d9e2ec",
    backgroundColor: "#fff", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center",
  };

  const labelStyle = { color: "#627d98", fontSize: "13px", display: "block", marginBottom: "8px" };
  const valueStyle = { fontSize: "18px", fontWeight: "600", color: "#102a43" };

  const statusColors = {
    Kritik: { back: "#fff1f0", border: "#ffa39e", text: "#cf1322" },
    Düşük: { back: "#fff7e6", border: "#ffd591", text: "#d46b08" },
    Normal: { back: "#f6ffed", border: "#b7eb8f", text: "#389e0d" },
    default: { back: "#f5f5f5", border: "#d9d9d9", text: "#595959" }
  };
  const colors = statusColors[durumText] || statusColors.default;

  return (
    <div style={{ padding: "20px" }}>
      {/* Container div'e alignItems: "center" eklenerek dikey ortalama sağlandı */}
      <div style={{ display: "flex", gap: "40px", flexWrap: "wrap", alignItems: "center" }}>
        
        {/* SOL TARAF: YENİ HAREKETLİ TANK GÖRSELİ */}
        <div style={{ width: "150px" }}>
          <TankLevelVisual percent={dolulukOrani} criticalThreshold={kritikOrani} />
        </div>

        {/* SAĞ TARAF: FORM VE KARTLAR */}
        <div style={{ flex: 1, minWidth: "450px" }}>
          <div style={{ marginBottom: "20px" }}>
            <Text style={{ fontWeight: "600", display: "block", marginBottom: "8px" }}>{t("Sorumlu Personel")}</Text>
            <PersonelTablo name1="PERSONEL" workshopSelectedId={watch("PERSONELID")} isRequired={false} />
          </div>

          <Row gutter={16} style={{ marginBottom: "20px" }}>
            <Col span={12}>
              <Text style={{ fontWeight: "600", display: "block", marginBottom: "8px" }}>{t("Tank Kapasitesi")}</Text>
              <Controller
                name="kapasite"
                control={control}
                render={({ field }) => (
                  <InputNumber {...field} style={{ width: "100%" }} min={0}
                    formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    parser={(val) => val.replace(/\./g, "")}
                  />
                )}
              />
            </Col>
            <Col span={12}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text style={{ fontWeight: "600", display: "block", marginBottom: "8px" }}>{t("Kritik Miktar")}</Text>
                <Controller
                  name="kritikUyar"
                  control={control}
                  render={({ field }) => (
                    <Checkbox checked={field.value} {...field}>{t("Uyar")}</Checkbox>
                  )}
                />
              </div>
              <Controller
                name="kritikMiktar"
                control={control}
                render={({ field }) => (
                  <InputNumber {...field} style={{ width: "100%" }} min={0}
                    formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    parser={(val) => val.replace(/\./g, "")}
                  />
                )}
              />
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div style={cardStyle}>
                <Text style={labelStyle}>{t("Doluluk")}</Text>
                <Text style={valueStyle}>
                  {Number(mevcutMiktar).toLocaleString("tr-TR")} Lt / %{Math.round(dolulukOrani)}
                </Text>
              </div>
            </Col>
            <Col span={12}>
              <div style={cardStyle}>
                <Text style={labelStyle}>{t("Kalan Kapasite")}</Text>
                <Text style={valueStyle}>{Number(kalanKapasite).toLocaleString("tr-TR")} Lt</Text>
              </div>
            </Col>
            <Col span={12}>
              <div style={cardStyle}>
                <Text style={labelStyle}>{t("Son Hareket")}</Text>
                <Text style={valueStyle}>{sonHareket}</Text>
              </div>
            </Col>
            <Col span={12}>
  <div style={{ 
    ...cardStyle, 
    backgroundColor: colors.back,
    borderColor: colors.border 
  }}>
    <Text style={{ ...labelStyle, color: colors.text }}>
      {t("Durum")}
    </Text>
    <Text style={{ ...valueStyle, color: colors.text, fontWeight: "bold" }}>
      {durumText}
    </Text>
  </div>
</Col>
          </Row>
        </div>
      </div>
    </div>
  );
}

export default GenelBilgiler;