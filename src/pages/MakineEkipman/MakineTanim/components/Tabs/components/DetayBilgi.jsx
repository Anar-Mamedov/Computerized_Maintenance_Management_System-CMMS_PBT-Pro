import React from "react";
import PropTypes from "prop-types";
import { Typography } from "antd";
import { t } from "i18next";
import KodIDSelectbox from "../../../../../../utils/components/KodIDSelectbox";
import TextInput from "../../../../../../utils/components/Form/TextInput";
import MasrafMerkeziTablo from "../../../../../../utils/components/MasrafMerkeziTablo";
import FullDatePicker from "../../../../../../utils/components/FullDatePicker";
import NumberInput from "../../../../../../utils/components/NumberInput";
import AtolyeTablo from "../../../../../../utils/components/AtolyeTablo";
import OncelikTablo from "../../../../../../utils/components/OncelikTablo";
import { width } from "dom-helpers";

const { Text } = Typography;

export function DetayBilgi(props) {
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
        <div style={{ paddingBottom: "10px", display: "inline-flex", flexDirection: "column", alignItems: "flex-start" }}>
          <Text style={{ fontSize: "16px", fontWeight: "600" }}>{t("siniflandirma")}</Text>
          <Text type="secondary">{t("masrafVeBakimSinirlari")}</Text>
        </div>
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", width: "100%", gap: "10px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("masrafMerkezi")}</Text>
            <MasrafMerkeziTablo masrafMerkeziFieldName="masrafMerkeziDetay" masrafMerkeziIdFieldName="masrafMerkeziIDDetay" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("atolye")}</Text>
            <AtolyeTablo nameFields={{ tanim: "atolyeTanim", id: "atolyeID" }} isRequired={false} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("bakimGrubu")}</Text>
            <KodIDSelectbox name1="bakimGrubu" kodID={32441} isRequired={false} style={{ width: "100%", maxWidth: "300px" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("arizaGrubu")}</Text>
            <KodIDSelectbox name1="arizaGrubu" kodID={32402} isRequired={false} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("servisSaglayici")}</Text>
            <KodIDSelectbox name1="servisSaglayici" kodID={32508} isRequired={false} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("servisSekli")}</Text>
            <KodIDSelectbox name1="servisSekli" kodID={32509} isRequired={false} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("teknikSeviyesi")}</Text>
            <KodIDSelectbox name1="teknikSeviyesi" kodID={32510} isRequired={false} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("fizikselDurumu")}</Text>
            <KodIDSelectbox name1="fizikselDurumu" kodID={32511} isRequired={false} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("oncelik")}</Text>
            <OncelikTablo oncelikFieldName="oncelikDetay" oncelikIdFieldName="oncelikIDDetay" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("riskPuani")}</Text>
            <NumberInput name1="riskPuani" required={false} minNumber={0} />
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
        <div style={{ paddingBottom: "10px", display: "inline-flex", flexDirection: "column", alignItems: "flex-start" }}>
          <Text style={{ fontSize: "16px", fontWeight: "600" }}>{t("teknikKurulum")}</Text>
          <Text type="secondary">{t("kurulumVeElektrikselParametreler")}</Text>
        </div>
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", width: "100%", gap: "10px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("kurulumTarihi")}</Text>
            <FullDatePicker name1="kurulumTarihi" isRequired={false} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("isletimSistemi")}</Text>
            <KodIDSelectbox name1="isletimSistemi" kodID={32513} isRequired={false} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("ipNo")}</Text>
            <TextInput name="ipNo" required={false} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("agirlik")}</Text>
            <div style={{ display: "flex", gap: "5px", width: "100%" }}>
              <div style={{ width: "90px" }}>
                <NumberInput name1="agirlik" required={false} minNumber={0} />
              </div>
              <div style={{ width: "205px" }}>
                <KodIDSelectbox name1="agirlikBirim" kodID={32001} isRequired={false} />
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("hacim")}</Text>
            <div style={{ display: "flex", gap: "5px", width: "100%" }}>
              <div style={{ width: "90px" }}>
                <NumberInput name1="hacim" required={false} minNumber={0} />
              </div>
              <div style={{ width: "205px" }}>
                <KodIDSelectbox name1="hacimBirim" kodID={32001} isRequired={false} />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("kapasite")}</Text>
            <div style={{ display: "flex", gap: "5px", width: "100%" }}>
              <div style={{ width: "90px" }}>
                <NumberInput name1="kapasite" required={false} minNumber={0} />
              </div>
              <div style={{ width: "205px" }}>
                <KodIDSelectbox name1="kapasiteBirim" kodID={32001} isRequired={false} />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("elektrikTuketimi")}</Text>
            <div style={{ display: "flex", gap: "5px", width: "100%" }}>
              <div style={{ width: "90px" }}>
                <NumberInput name1="elektrikTuketimi" required={false} minNumber={0} />
              </div>
              <div style={{ width: "205px" }}>
                <KodIDSelectbox name1="elektrikTuketimiBirim" kodID={32001} isRequired={false} />
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("voltaj/guc(amper)")}</Text>
            <div style={{ display: "flex", gap: "6px", width: "100%" }}>
              <div style={{ width: "147px" }}>
                <NumberInput name1="voltaj" required={false} minNumber={0} />
              </div>
              <div style={{ width: "147px" }}>
                <NumberInput name1="guc" required={false} minNumber={0} />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("faz")}</Text>
            <NumberInput name1="faz" required={false} minNumber={0} />
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
        <div style={{ paddingBottom: "10px", display: "inline-flex", flexDirection: "column", alignItems: "flex-start" }}>
          <Text style={{ fontSize: "16px", fontWeight: "600" }}>{t("valf&Motor")}</Text>
          <Text type="secondary">{t("akisVeTahrikOzellikleri")}</Text>
        </div>
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", width: "100%", gap: "10px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("valfTipi")}</Text>
            <KodIDSelectbox name1="valfTipi" kodID={32514} isRequired={false} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("valfBoyutu")}</Text>
            <KodIDSelectbox name1="valfBoyutu" kodID={32515} isRequired={false} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("girisBoyutu")}</Text>
            <KodIDSelectbox name1="girisBoyutu" kodID={32516} isRequired={false} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("cikisBoyutu")}</Text>
            <KodIDSelectbox name1="cikisBoyutu" kodID={32517} isRequired={false} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("konnektor")}</Text>
            <KodIDSelectbox name1="konnektor" kodID={32518} isRequired={false} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("makineBasinc")}</Text>
            <KodIDSelectbox name1="makineBasinc" kodID={32519} isRequired={false} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("basincMiktar")}</Text>
            <div style={{ display: "flex", gap: "5px", width: "100%" }}>
              <div style={{ width: "90px" }}>
                <NumberInput name1="basincMiktar" required={false} minNumber={0} />
              </div>
              <div style={{ width: "205px" }}>
                <KodIDSelectbox name1="basincMiktarBirim" kodID={32001} isRequired={false} />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("devirSayisi")}</Text>
            <NumberInput name1="devirSayisi" required={false} minNumber={0} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("motorGucu(bg)")}</Text>
            <NumberInput name1="motorGucu" required={false} minNumber={0} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
            <Text type="secondary">{t("silindirSayisi")}</Text>
            <NumberInput name1="silindirSayisi" required={false} minNumber={0} />
          </div>
        </div>
      </div>
    </div>
  );
}

DetayBilgi.propTypes = {};
