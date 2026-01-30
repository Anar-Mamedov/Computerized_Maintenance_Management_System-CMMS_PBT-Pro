import React from "react";
import PropTypes from "prop-types";
import { Typography } from "antd";
import { t } from "i18next";
import KodIDSelectbox from "../../../../../../utils/components/KodIDSelectbox";
import TextInput from "../../../../../../utils/components/Form/TextInput";
import MasrafMerkeziTablo from "../../../../../../utils/components/MasrafMerkeziTablo";
import FirmaTablo from "../../../../../../utils/components/FirmaTablo";
import FullDatePicker from "../../../../../../utils/components/FullDatePicker";
import NumberInput from "../../../../../../utils/components/NumberInput";
import AtolyeTablo from "../../../../../../utils/components/AtolyeTablo";
import OncelikTablo from "../../../../../../utils/components/OncelikTablo";
import SwitchForm from "../../../../../../utils/components/Form/SwitchForm";
import { useFormContext } from "react-hook-form";

const { Text } = Typography;

export function FinansalBilgiler(props) {
  const { control, watch } = useFormContext();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "10px", alignItems: "flex-start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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
            maxWidth: "667px",
          }}
        >
          <div style={{ paddingBottom: "10px", display: "inline-flex", flexDirection: "column", alignItems: "flex-start" }}>
            <Text style={{ fontSize: "16px", fontWeight: "600" }}>{t("satinalmaBilgileri")}</Text>
            <Text type="secondary">{t("satinalinanFirmaVeFaturaBilgileri")}</Text>
          </div>
          <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", width: "100%", gap: "10px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "calc(50% - 5px)" }}>
              <Text type="secondary">{t("firma")}</Text>
              <FirmaTablo firmaFieldName="satinalmaFirma" firmaIdFieldName="satinalmaFirmaID" />
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "calc(50% - 5px)" }}>
              <Text type="secondary">{t("faturaNo")}</Text>
              <TextInput name="faturaNo" required={false} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "calc(50% - 5px)" }}>
              <Text type="secondary">{t("satinalmaTarihi")}</Text>
              <FullDatePicker name1="satinalmaTarihi" isRequired={false} placeholder="" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "calc(50% - 5px)" }}>
              <Text type="secondary">{t("faturaTarihi")}</Text>
              <FullDatePicker name1="faturaTarihi" isRequired={false} placeholder="" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "calc(50% - 5px)" }}>
              <Text type="secondary">{t("satinalmaFiyati")}</Text>
              <NumberInput name1="satinalmaFiyati" required={false} minNumber={0} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "calc(50% - 5px)" }}>
              <Text type="secondary">{t("faturaTutari")}</Text>
              <NumberInput name1="faturaTutari" required={false} minNumber={0} />
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
            maxWidth: "667px",
          }}
        >
          <div style={{ paddingBottom: "10px", display: "inline-flex", flexDirection: "column", alignItems: "flex-start" }}>
            <Text style={{ fontSize: "16px", fontWeight: "600" }}>{t("krediBilgileri")}</Text>
            <Text type="secondary">{t("krediMiktariBaslamaVeBitisTarihiBilgileri")}</Text>
          </div>
          <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", width: "100%", gap: "10px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "calc(50% - 5px)" }}>
              <Text type="secondary">{t("krediMiktari")}</Text>
              <NumberInput name1="krediMiktari" required={false} minNumber={0} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "calc(50% - 5px)" }}>
              <Text type="secondary">{t("baslamaTarihi")}</Text>
              <FullDatePicker name1="krediBaslamaTarihi" isRequired={false} placeholder="" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "calc(50% - 5px)" }}>
              <Text type="secondary">{t("krediOrani(%Ay)")}</Text>
              <NumberInput name1="krediOrani" required={false} minNumber={0} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "calc(50% - 5px)" }}>
              <Text type="secondary">{t("bitisTarihi")}</Text>
              <FullDatePicker name1="krediBitisTarihi" isRequired={false} placeholder="" />
            </div>
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
            <Text style={{ fontSize: "16px", fontWeight: "600" }}>{t("kiralik")}</Text>
            <SwitchForm name="kiralik" checked={false} />
          </div>
          <Text type="secondary">{t("firmaVeKiraSuresiBilgileri")}</Text>
        </div>
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", width: "100%", gap: "10px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("firma")}</Text>
            <FirmaTablo firmaFieldName="kiralikFirma" firmaIdFieldName="kiralikFirmaID" disabled={!watch("kiralik")} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("baslamaTarihi")}</Text>
            <FullDatePicker name1="kiraBaslangicTarihi" isRequired={false} disabled={!watch("kiralik")} placeholder="" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("bitisTarihi")}</Text>
            <FullDatePicker name1="kiraBitisTarihi" isRequired={false} disabled={!watch("kiralik")} placeholder="" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("kiraSuresi")}</Text>
            <div style={{ display: "flex", gap: "5px", width: "100%" }}>
              <div style={{ width: "90px" }}>
                <NumberInput name1="kiraSuresi" required={false} minNumber={0} disabled={!watch("kiralik")} />
              </div>
              <div style={{ width: "205px" }}>
                <KodIDSelectbox name1="kiraSuresiBirim" kodID={32001} isRequired={false} disabled={!watch("kiralik")} placeholder="" />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("kiraTutari")}</Text>
            <NumberInput name1="kiraTutari" required={false} minNumber={0} disabled={!watch("kiralik")} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("aciklama")}</Text>
            <TextInput name="kiraAciklama" required={false} disabled={!watch("kiralik")} />
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
            <Text style={{ fontSize: "16px", fontWeight: "600" }}>{t("satildi")}</Text>
            <SwitchForm name="satildi" checked={false} />
          </div>
          <Text type="secondary">{t("satisNedeniTarihiVeSatisTutariBilgileri")}</Text>
        </div>
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", width: "100%", gap: "10px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("satisNedeni")}</Text>
            <TextInput name="satisNedeni" required={false} disabled={!watch("satildi")} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("satisTarihi")}</Text>
            <FullDatePicker name1="satisTarihi" isRequired={false} disabled={!watch("satildi")} placeholder="" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("satisYeri")}</Text>
            <TextInput name="satisYeri" required={false} disabled={!watch("satildi")} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("satisTutari")}</Text>
            <NumberInput name1="satisTutari" required={false} minNumber={0} disabled={!watch("satildi")} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("aciklama")}</Text>
            <TextInput name="satisAciklama" required={false} disabled={!watch("satildi")} />
          </div>
        </div>
      </div>
    </div>
  );
}

FinansalBilgiler.propTypes = {};
