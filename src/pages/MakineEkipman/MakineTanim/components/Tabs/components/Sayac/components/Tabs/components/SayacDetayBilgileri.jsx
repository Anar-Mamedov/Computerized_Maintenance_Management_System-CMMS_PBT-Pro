import React from "react";
import PropTypes from "prop-types";
import { Typography } from "antd";
import { t } from "i18next";
import KodIDSelectbox from "../../../../../../../../../../utils/components/KodIDSelectbox";
import TextInput from "../../../../../../../../../../utils/components/Form/TextInput";
import MasrafMerkeziTablo from "../../../../../../../../../../utils/components/MasrafMerkeziTablo";
import FullDatePicker from "../../../../../../../../../../utils/components/FullDatePicker";
import NumberInput from "../../../../../../../../../../utils/components/NumberInput";
import AtolyeTablo from "../../../../../../../../../../utils/components/AtolyeTablo";
import OncelikTablo from "../../../../../../../../../../utils/components/OncelikTablo";
import SwitchForm from "../../../../../../../../../../utils/components/Form/SwitchForm";
import StatusButtons from "./StatusButtons";
import { width } from "dom-helpers";
import { useFormContext } from "react-hook-form";

const { Text } = Typography;

export function SayacDetayBilgileri(props) {
  const { control, watch } = useFormContext();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
      <div
        style={{
          backgroundColor: "#ffffffff",
          padding: "10px",
          border: "1px solid #80808068",
          borderRadius: "5px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          width: "100%",
          maxWidth: "300px",
        }}
      >
        <div style={{ paddingBottom: "10px", display: "inline-flex", flexDirection: "column", alignItems: "flex-start", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <Text style={{ fontSize: "14px", fontWeight: "600" }}>{t("sanalSayac")}</Text>
            <SwitchForm name="sanalSayac" checked={false} />
          </div>
          <Text type="secondary">{t("sayacTarihiVeDegerleri")}</Text>
        </div>
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", width: "100%", gap: "10px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("baslangicTarihi")}</Text>
            <FullDatePicker name1="baslangicTarihi" isRequired={false} disabled={!watch("sanalSayac")} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("baslangicDegeri")}</Text>
            <NumberInput name1="baslangicDegeri" required={false} minNumber={0} disabled={!watch("sanalSayac")} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("artisDegeri(birim/gun)")}</Text>
            <NumberInput name1="artisDegeri" required={false} minNumber={0} disabled={!watch("sanalSayac")} />
          </div>
        </div>
      </div>
      <div
        style={{
          backgroundColor: "#ffffffff",
          padding: "10px",
          border: "1px solid #80808068",
          borderRadius: "5px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          width: "100%",
          maxWidth: "300px",
        }}
      >
        <div style={{ paddingBottom: "10px", display: "inline-flex", flexDirection: "column", alignItems: "flex-start", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <Text style={{ fontSize: "14px", fontWeight: "600" }}>{t("sayacGuncellemeSekli")}</Text>
          </div>
          <Text type="secondary">{t("sayacGuncellemeSekliSecimi")}</Text>
        </div>
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", width: "100%", gap: "10px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <StatusButtons />
          </div>
        </div>
      </div>
    </div>
  );
}

SayacDetayBilgileri.propTypes = {};
