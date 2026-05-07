import { useMemo } from "react";
import { Checkbox, Tag, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";
import { DatabaseOutlined, BarChartOutlined } from "@ant-design/icons";
import NumberInput from "../../../../../../utils/components/NumberInput";
import KodIDSelectbox from "../../../../../../utils/components/KodIDSelectbox";

const { Text } = Typography;

const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "20px",
  border: "1px solid #e8e8e8",
  borderRadius: "8px",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
  width: "100%",
  minWidth: "320px",
};

const rowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  width: "100%",
  marginBottom: "16px",
};

const labelStyle = {
  minWidth: "140px",
  fontSize: "14px",
  color: "#595959",
};

function YakitBilgileri() {
  const { control, watch } = useFormContext();
  const ongorulenMin = watch("ongorulenMin");
  const ongorulenMax = watch("ongorulenMax");
  const gerceklesen = watch("gerceklesen");

  const ozetDurum = useMemo(() => {
    if (gerceklesen == null || ongorulenMin == null || ongorulenMax == null) {
      return null;
    }
    if (gerceklesen < ongorulenMin) {
      return { label: t("dusukTuketim"), tagColor: "#1d4ed8", tagBg: "#dbeafe", tagBorder: "#93c5fd", bg: "#eff6ff", border: "#93c5fd", titleColor: "#1e40af" };
    }
    if (gerceklesen > ongorulenMax) {
      return { label: t("yuksekTuketim"), tagColor: "#b91c1c", tagBg: "#fee2e2", tagBorder: "#f87171", bg: "#fef2f2", border: "#f87171", titleColor: "#991b1b" };
    }
    return { label: t("normalAralik"), tagColor: "#15803d", tagBg: "#dcfce7", tagBorder: "#86efac", bg: "#f0fdf4", border: "#86efac", titleColor: "#166534" };
  }, [gerceklesen, ongorulenMin, ongorulenMax]);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "10px" }}>
      {/* Sol Kart - Yakıt Tanımı */}
      <div style={{ ...cardStyle, flex: "1 1 calc(50% - 8px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
          <DatabaseOutlined style={{ fontSize: "16px", color: "#8c8c8c" }} />
          <Text style={{ fontSize: "16px", fontWeight: "600" }}>{t("yakitTanimi")}</Text>
        </div>

        {/* Yakıt Tipi */}
        <div style={rowStyle}>
          <Text style={labelStyle}>{t("yakitTipi")}</Text>
          <div style={{ flex: 1 }}>
            <KodIDSelectbox name1="makineYakitTipi" kodID={35600} isRequired={false} placeholder="" showDropdownAdd={false} />
          </div>
        </div>

        {/* Yakıt Depo Hacmi */}
        <div style={rowStyle}>
          <Text style={labelStyle}>{t("yakitDepoHacmi")}</Text>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px" }}>
            <NumberInput name1="YakitDepoHacmi" required={false} minNumber={0} />
            <Text type="secondary" style={{ whiteSpace: "nowrap" }}>
              {t("litre")}
            </Text>
          </div>
        </div>

        {/* Sayaç Takibi Checkbox */}
        <div
          style={{
            backgroundColor: "#fafafa",
            border: "1px solid #e0e0e0",
            borderRadius: "12px",
            padding: "16px 20px",
            marginBottom: "12px",
          }}
        >
          <Controller
            name="makineYakitSayacTakibi"
            control={control}
            render={({ field }) => (
              <div>
                <Checkbox checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)}>
                  <Text strong style={{ fontSize: "14px" }}>{t("yakitSayacTakibiZorunlu")}</Text>
                </Checkbox>
                <div style={{ marginLeft: "24px", marginTop: "4px" }}>
                  <Text type="secondary" style={{ fontSize: "13px" }}>
                    {t("yakitSayacTakibiAciklama")}
                  </Text>
                </div>
              </div>
            )}
          />
        </div>

        {/* Sayaç Güncelleme Checkbox */}
        <div
          style={{
            backgroundColor: "#fafafa",
            border: "1px solid #e0e0e0",
            borderRadius: "12px",
            padding: "16px 20px",
          }}
        >
          <Controller
            name="makineYakitSayacGuncellemesi"
            control={control}
            render={({ field }) => (
              <div>
                <Checkbox checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)}>
                  <Text strong style={{ fontSize: "14px" }}>{t("yakitSayacGuncellemesiYap")}</Text>
                </Checkbox>
                <div style={{ marginLeft: "24px", marginTop: "4px" }}>
                  <Text type="secondary" style={{ fontSize: "13px" }}>
                    {t("yakitSayacGuncellemesiAciklama")}
                  </Text>
                </div>
              </div>
            )}
          />
        </div>
      </div>

      {/* Sağ Kart - Ortalama Tüketim Bilgileri */}
      <div style={{ ...cardStyle, flex: "1 1 calc(50% - 8px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
          <BarChartOutlined style={{ fontSize: "16px", color: "#8c8c8c" }} />
          <Text style={{ fontSize: "16px", fontWeight: "600" }}>{t("ortalamaTuketimBilgileri")}</Text>
        </div>

        {/* Öngörülen Min */}
        <div style={rowStyle}>
          <Text style={labelStyle}>{t("ongorulenMin")}</Text>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px" }}>
            <NumberInput name1="ongorulenMin" required={false} minNumber={0} />
            <Text type="secondary" style={{ whiteSpace: "nowrap" }}>
              {t("ltSaat")}
            </Text>
          </div>
        </div>

        {/* Öngörülen Max */}
        <div style={rowStyle}>
          <Text style={labelStyle}>{t("ongorulenMax")}</Text>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px" }}>
            <NumberInput name1="ongorulenMax" required={false} minNumber={0} />
            <Text type="secondary" style={{ whiteSpace: "nowrap" }}>
              {t("ltSaat")}
            </Text>
          </div>
        </div>

        {/* Gerçekleşen - ReadOnly */}
        <div style={{ ...rowStyle, marginBottom: "24px" }}>
          <Text style={labelStyle}>{t("gerceklesen")}</Text>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                flex: 1,
                border: "1px solid #faad14",
                borderRadius: "6px",
                backgroundColor: "#fffbe6",
              }}
            >
              <NumberInput name1="gerceklesen" required={false} minNumber={0} />
            </div>
            <Text type="secondary" style={{ whiteSpace: "nowrap" }}>
              {t("ltSaat")}
            </Text>
          </div>
        </div>

        {/* Özet Değerlendirme */}
        <div
          style={{
            backgroundColor: ozetDurum ? ozetDurum.bg : "#f9fafb",
            border: `1px solid ${ozetDurum ? ozetDurum.border : "#e5e7eb"}`,
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <Text strong style={{ fontSize: "13px", letterSpacing: "1px", color: ozetDurum ? ozetDurum.titleColor : "#6b7280" }}>
              {t("ozetDegerlendirme")}
            </Text>
            {ozetDurum && (
              <Tag
                style={{
                  color: ozetDurum.tagColor,
                  backgroundColor: ozetDurum.tagBg,
                  border: `1px solid ${ozetDurum.tagBorder}`,
                  borderRadius: "16px",
                  padding: "2px 12px",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                {ozetDurum.label}
              </Tag>
            )}
          </div>
          <Text style={{ fontSize: "14px", color: "#374151", lineHeight: "1.7" }}>
            {t("ozetDegerlendirmeAciklama")}
          </Text>
        </div>
      </div>
    </div>
  );
}

export default YakitBilgileri;
