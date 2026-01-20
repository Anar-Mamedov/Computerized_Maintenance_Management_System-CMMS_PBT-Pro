import React from "react";
import { Typography, Input } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";

const { Text } = Typography;
const { TextArea } = Input;

export default function IletisimBilgileri() {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  // Ortak stil sabitleri (Daha kolay yönetmek için)
  const labelStyle = { minWidth: "70px", fontWeight: 600, fontSize: "13px" };
  const rowStyle = { display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }; // Satır arası boşluk 5px'e indi

  return (
    <div style={{ padding: "10px", display: "flex", flexDirection: "column", gap: "5px" }}> 
      {/* Container padding ve gap azaltıldı */}

        {/* ROW 1: Telefon ve Fax */}
        <div style={rowStyle}>
            {/* Telefon */}
            <div style={{ display: "flex", alignItems: "center", gap: "5px", flex: 1 }}> {/* Gap 5px yapıldı */}
                <Text style={labelStyle}>{t("Telefon")}</Text>
                <Controller
                    name="TELEFON"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} size="small" style={{ flex: 1 }} />
                    )}
                />
            </div>
            {/* Fax */}
            <div style={{ display: "flex", alignItems: "center", gap: "5px", flex: 1 }}>
                <Text style={{ ...labelStyle, minWidth: "30px" }}>{t("Fax")}</Text>
                <Controller
                    name="FAX"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} size="small" style={{ flex: 1 }} />
                    )}
                />
            </div>
        </div>

        {/* ROW 2: E-Mail */}
        <div style={rowStyle}>
            <Text style={labelStyle}>{t("E-Mail")}</Text>
            <div style={{ flex: 1 }}>
                <Controller
                    name="EMAIL"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} size="small" style={{ width: "100%" }} />
                    )}
                />
            </div>
        </div>

        {/* ROW 3: Adres */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}> {/* Gap 5px yapıldı */}
            <Text style={{ ...labelStyle, marginTop: "4px" }}>{t("Adres")}</Text>
            <div style={{ flex: 1 }}>
                <Controller
                    name="ADRES"
                    control={control}
                    render={({ field }) => (
                        <TextArea 
                            {...field} 
                            rows={3} // Satır sayısı 2'ye düşürüldü (daha ince dursun diye)
                            style={{ width: "100%", resize: "none" }} 
                        />
                    )}
                />
            </div>
        </div>
    </div>
  );
}