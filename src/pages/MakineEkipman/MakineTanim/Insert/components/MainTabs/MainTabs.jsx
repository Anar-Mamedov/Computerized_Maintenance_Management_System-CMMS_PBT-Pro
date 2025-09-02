import React, { useState } from "react";
import { CiImageOn } from "react-icons/ci";
import { Typography, Button, Input, Select, DatePicker, TimePicker, Row, Col, Checkbox } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";
import TextInput from "../../../../../../utils/components/Form/TextInput";
import KodIDSelectbox from "../../../../../../utils/components/KodIDSelectbox";
import LokasyonTablo from "../../../../../../utils/components/LokasyonTablo";
import MarkaEkleSelect from "../../../../../../utils/components/MarkaEkleSelect";
import ModelEkleSelect from "../../../../../../utils/components/ModelEkleSelect";
import OperatorSelectBox from "../../../../../../utils/components/OperatorSelectBox";
import MasrafMerkeziTablo from "../../../../../../utils/components/MasrafMerkeziTablo";
import MakineTakvimTablo from "../../../../../../utils/components/MakineTakvimTablo";
import FullDatePicker from "../../../../../../utils/components/FullDatePicker";
import NumberInput from "../../../../../../utils/components/NumberInput";
import MakineTablo from "../../../../../../utils/components/Machina/MakineTablo";
import StatusButtons from "./components/StatusButtons";

const { Text, Link } = Typography;

export default function MainTabs() {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [isLokasyonModalOpen, setIsLokasyonModalOpen] = useState(false);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "10px" /* alignItems: "flex-start" */ }}>
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
          maxWidth: "610px",
        }}
      >
        <div style={{ paddingBottom: "10px", display: "inline-flex", flexDirection: "column", alignItems: "flex-start" }}>
          <Text style={{ fontSize: "16px", fontWeight: "600" }}>{t("temelBilgiler")}</Text>
          <Text type="secondary">{t("makineKimlikVeKonumBilgileri")}</Text>
        </div>
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", width: "100%", gap: "10px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">
              {t("makineKodu")}
              <span style={{ color: "#c90000ff" }}>*</span>
            </Text>
            <TextInput name="makineKodu" required={true} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">
              {t("makineTanimi")}
              <span style={{ color: "#c90000ff" }}>*</span>
            </Text>
            <TextInput name="makineTanimi" required={true} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">
              {t("lokasyon")}
              <span style={{ color: "#c90000ff" }}>*</span>
            </Text>
            <LokasyonTablo
              lokasyonFieldName="lokasyon"
              lokasyonIdFieldName="lokasyonID"
              isModalVisible={isLokasyonModalOpen}
              setIsModalVisible={setIsLokasyonModalOpen}
              isRequired={true}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">
              {t("makineTipi")}
              <span style={{ color: "#c90000ff" }}>*</span>
            </Text>
            <KodIDSelectbox name1="makineTipi" kodID={32501} isRequired={true} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("kategori")}</Text>
            <KodIDSelectbox name1="kategori" kodID={32502} isRequired={false} />
          </div>
          <div style={{ display: "flex", flexDirection: "row", gap: "10px", width: "100%", maxWidth: "300px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "150px" }}>
              <Text type="secondary">{t("marka")}</Text>
              <MarkaEkleSelect markaFieldName="marka" markaIdFieldName="markaID" style={{ maxWidth: "100px" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
              <Text type="secondary">{t("model")}</Text>
              <ModelEkleSelect modelFieldName="model" modelIdFieldName="modelID" markaIdFieldName="markaID" style={{ maxWidth: "100px" }} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("operator")}</Text>
            <OperatorSelectBox name1="operator" isRequired={false} />
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
          maxWidth: "488px",
        }}
      >
        <div style={{ paddingBottom: "10px", display: "inline-flex", flexDirection: "column", alignItems: "flex-start" }}>
          <Text style={{ fontSize: "16px", fontWeight: "600" }}>{t("makineGorseli")}</Text>
          <Text type="secondary">{t("buMakineyeOzelFotograflariInceleyin")}</Text>
        </div>
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", width: "100%", gap: "10px" }}>
          <div
            style={{
              width: "100%",
              minHeight: "180px",
              border: "2px dashed #d9d9d9",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fafafa",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <CiImageOn style={{ fontSize: "28px", color: "#bfbfbf" }} />
              <Text type="secondary">{t("resimBulunamadi")}</Text>
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
          maxWidth: "610px",
        }}
      >
        <div style={{ paddingBottom: "10px", display: "inline-flex", flexDirection: "column", alignItems: "flex-start" }}>
          <Text style={{ fontSize: "16px", fontWeight: "600" }}>{t("operasyon&Maliyet")}</Text>
          <Text type="secondary">{t("durumSeriNoVeMaliyetParametreleri")}</Text>
        </div>
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", width: "100%", gap: "10px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("durum")}</Text>
            <KodIDSelectbox name1="operasyonDurumu" kodID={32505} isRequired={false} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("seriNo")}</Text>
            <TextInput name="seriNo" required={false} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("masterMakine")}</Text>
            <MakineTablo makineFieldName="masterMakine" makineIdFieldName="masterMakineID" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("takvim")}</Text>
            <MakineTakvimTablo fieldName="takvim" fieldNameID="takvimID" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("uretici")}</Text>
            <TextInput name="uretici" required={false} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("uretimYili")}</Text>
            <FullDatePicker name1="uretimYili" isRequired={false} pickType="year" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("garantiBitisTarihi")}</Text>
            <FullDatePicker name1="garantiBitisTarihi" isRequired={false} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("durusBirimMaliyeti(ucret/saat)")}</Text>
            <NumberInput name1="durusBirimMaliyeti" required={false} minNumber={0} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("planCalismaSuresi(saat/yil)")}</Text>
            <NumberInput name1="planCalismaSuresi" required={false} minNumber={0} />
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
          maxWidth: "488px",
        }}
      >
        <div style={{ paddingBottom: "10px", display: "inline-flex", flexDirection: "column", alignItems: "flex-start" }}>
          <Text style={{ fontSize: "16px", fontWeight: "600" }}>{t("durum&Ozellikler")}</Text>
          <Text type="secondary">{t("isaretlenebilirNitelikler")}</Text>
        </div>
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", width: "100%", gap: "10px" }}>
          <StatusButtons />
        </div>
      </div>
    </div>
  );
}
