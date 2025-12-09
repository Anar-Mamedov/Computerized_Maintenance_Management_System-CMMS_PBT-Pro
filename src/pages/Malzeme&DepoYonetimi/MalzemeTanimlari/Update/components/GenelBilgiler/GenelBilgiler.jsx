import React from "react";
import { Select, Input, Typography, Divider, InputNumber, Switch } from "antd";
import GirisFiyatiSelect from "./components/GirisFiyatiSelect";
import CikisiyatiSelect from "./components/CikisiyatiSelect";
import FiyatGirisleri from "./components/FiyatGirisleri/FiyatGirisleri";
import NumberInput from "../../../../../../utils/components/NumberInput";
import KdvSelect from "./components/KdvSelect";
import PeriyotSelect from "../../../../../../utils/components/PeriyotSelect";
import MasrafMerkeziTablo from "../../../../../../utils/components/MasrafMerkeziTablo";
import FifoTablo from "../../../../../../utils/components/FifoTablo";
import MalzemeTalepTablo from "../../../../../../utils/components/MalzemeTalepTablo";
import StokMıktarTablo from "../../../../../../utils/components/StokMıktarTablo";
import DepoTablo from "../../../../../../utils/components/DepoTablo";
import LokasyonTablo from "../../../../../../utils/components/LokasyonTablo";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";

const { Text } = Typography;

function GenelBilgiler({ selectedRowID }) {
  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ width: "550px" }}>
          <div>
            <Text style={{ color: "#0062ff", fontWeight: "500", fontSize: "14px" }}>{t("fiyatBilgileri")}</Text>
            <Divider style={{ margin: "8px 0" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "420px", justifyContent: "space-between" }}>
                <Text>{t("girisFiyati")}</Text>
                <div style={{ display: "flex", alignItems: "center", width: "300px", gap: "10px" }}>
                  <div style={{ width: "200px" }}>
                    <GirisFiyatiSelect />
                  </div>
                  <Controller
                    name="girisFiyati"
                    control={control}
                    render={({ field }) => <InputNumber {...field} disabled={watch("girisFiyatTuru") !== 6} status={errors.girisFiyati ? "error" : ""} />}
                  />
                </div>
              </div>
              <FiyatGirisleri selectedRowID={selectedRowID} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "420px" }}>
              <Text>{t("cikisFiyati")}</Text>
              <div style={{ display: "flex", alignItems: "center", width: "300px", gap: "10px" }}>
                <div style={{ width: "200px" }}>
                  <CikisiyatiSelect />
                </div>
                <Controller
                  name="cikisFiyati"
                  control={control}
                  render={({ field }) => <InputNumber {...field} disabled={watch("cikisFiyatTuru") !== 6} status={errors.cikisFiyati ? "error" : ""} />}
                />
              </div>
            </div>
          </div>
        </div>
        <div style={{ width: "550px" }}>
          <div>
            <Text style={{ color: "#0062ff", fontWeight: "500", fontSize: "14px" }}>{t("detayBilgileri")}</Text>
            <Divider style={{ margin: "8px 0" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", width: "100%", gap: "10px", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "290px", minWidth: "290px", justifyContent: "space-between" }}>
                <Text>{t("KDV")} (%)</Text>
                <div style={{ display: "flex", alignItems: "center", width: "170px", gap: "10px" }}>
                  <div style={{ width: "80px" }}>
                    <NumberInput name1="kdv" isRequired={false} minNumber={0} maxNumber={100} />
                  </div>
                  <div style={{ width: "80px" }}>
                    <KdvSelect />
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "250px", justifyContent: "space-between" }}>
                <Text>{t("garanti")}</Text>
                <div style={{ display: "flex", alignItems: "center", width: "170px", gap: "10px" }}>
                  <div style={{ width: "80px" }}>
                    <NumberInput name1="garantiDeger" isRequired={false} minNumber={0} />
                  </div>
                  <div style={{ width: "80px" }}>
                    <PeriyotSelect name1="garantiPeriyot" />
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", width: "100%", gap: "10px", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "290px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "200px", justifyContent: "space-between" }}>
                  <Text>{t("OTV")} (%)</Text>
                  <div style={{ display: "flex", alignItems: "center", width: "80px", gap: "10px" }}>
                    <NumberInput name1="otv" isRequired={false} minNumber={0} maxNumber={100} />
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "250px", justifyContent: "space-between" }}>
                <Text>{t("rafOmru")}</Text>
                <div style={{ display: "flex", alignItems: "center", width: "170px", gap: "10px" }}>
                  <div style={{ width: "80px" }}>
                    <NumberInput name1="rafOmruDeger" isRequired={false} minNumber={0} />
                  </div>
                  <div style={{ width: "80px" }}>
                    <PeriyotSelect name1="rafOmruPeriyot" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ width: "550px" }}>
          <div>
            <Text style={{ color: "#0062ff", fontWeight: "500", fontSize: "14px" }}>{t("depolamaBilgileri")}</Text>
            <Divider style={{ margin: "8px 0" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", width: "100%", gap: "10px", justifyContent: "space-between" }}>
              <Text>{t("bulunduguDepo")}</Text>
              <div style={{ width: "350px" }}>
                <DepoTablo name1="stkDepo" isRequired={false} />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", width: "100%", gap: "10px", justifyContent: "space-between" }}>
              <Text>{t("depoLokasyonu")}</Text>
              <div style={{ width: "350px" }}>
                <LokasyonTablo lokasyonFieldName="stkDepoLokasyon" lokasyonIdFieldName="stkDepoLokasyonID" isRequired={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ width: "360px" }}>
          <div>
            <Text style={{ color: "#0062ff", fontWeight: "500", fontSize: "14px" }}>{t("parametreler")}</Text>
            <Divider style={{ margin: "8px 0" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div
              style={{
                display: "flex",
                flexFlow: "column wrap",
                alignItems: "center",
                width: "100%",
                maxWidth: "360px",
                justifyContent: "space-between",
                gap: "8px",
                flexDirection: "row",
              }}
            >
              <Text style={{ fontSize: "14px", color: "#000000a4", display: "flex" }}>{t("masrafMerkezi")}</Text>
              <div
                className="anar"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  width: "100%",
                  maxWidth: "250px",
                  flexDirection: "column",
                }}
              >
                <MasrafMerkeziTablo />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("tehlikeliMalzeme")}</Text>
              <Controller name="tehlikeliMalzeme" control={control} render={({ field }) => <Switch {...field} />} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("envanterdeGosterme")}</Text>
              <Controller name="envanterdeGosterme" control={control} render={({ field }) => <Switch {...field} />} />
            </div>
          </div>
        </div>
        <div style={{ width: "360px" }}>
          <div>
            <Text style={{ color: "#0062ff", fontWeight: "500", fontSize: "14px" }}>{t("finansBilgileri")}</Text>
            <Divider style={{ margin: "8px 0" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "250px" }}>
              <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("seriNumaralaiTakip")}</Text>
              <Controller name="seriNumaralaiTakip" control={control} render={({ field }) => <Switch {...field} />} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "250px" }}>
                <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("fifoUygula")}</Text>
                <Controller name="fifoUygula" control={control} render={({ field }) => <Switch {...field} />} />
              </div>
              <FifoTablo selectedRowID={selectedRowID} />
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ width: "300px" }}>
          <div>
            <Text style={{ color: "#0062ff", fontWeight: "500", fontSize: "14px" }}>{t("kritikMiktarSeviyeleri")}</Text>
            <Divider style={{ margin: "8px 0" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "300px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "space-between", width: "250px" }}>
                <Text>{t("minStokMiktari")}</Text>
                <div style={{ display: "flex", alignItems: "center", width: "120px", gap: "10px" }}>
                  <NumberInput name1="minStokMiktari" isRequired={false} minNumber={-1} />
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "300px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "space-between", width: "250px" }}>
                <Text>{t("maxStokMiktari")}</Text>
                <div style={{ display: "flex", alignItems: "center", width: "120px", gap: "10px" }}>
                  <NumberInput name1="maxStokMiktari" isRequired={false} minNumber={-1} />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "300px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "space-between", width: "250px" }}>
                <Text>{t("siparisMiktari")}</Text>
                <div style={{ display: "flex", alignItems: "center", width: "120px", gap: "10px" }}>
                  <NumberInput name1="siparisMiktari" isRequired={false} minNumber={-1} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ width: "300px" }}>
          <div>
            <Text style={{ color: "#0062ff", fontWeight: "500", fontSize: "14px" }}>{t("malzemeDurumBilgileri")}</Text>
            <Divider style={{ margin: "8px 0" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "300px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "space-between", width: "250px" }}>
                <Text>{t("girenMiktar")}</Text>
                <div style={{ display: "flex", alignItems: "center", width: "120px", gap: "10px" }}>
                  <NumberInput name1="girenMiktar" isRequired={false} minNumber={-1} readOnly={true} />
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "300px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "space-between", width: "250px" }}>
                <Text>{t("cikanMiktar")}</Text>
                <div style={{ display: "flex", alignItems: "center", width: "120px", gap: "10px" }}>
                  <NumberInput name1="cikanMiktar" isRequired={false} minNumber={-1} readOnly={true} />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "300px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "space-between", width: "250px" }}>
                <Text>{t("stokMiktar")}</Text>
                <div style={{ display: "flex", alignItems: "center", width: "120px", gap: "10px" }}>
                  <NumberInput name1="stokMiktar" isRequired={false} minNumber={-1} readOnly={true} />
                </div>
              </div>
              <StokMıktarTablo selectedRowID={selectedRowID} />
            </div>

            <Divider style={{ margin: "8px 0" }} />

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "300px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "space-between", width: "250px" }}>
                <Text>{t("talepMiktar")}</Text>
                <div style={{ display: "flex", alignItems: "center", width: "120px", gap: "10px" }}>
                  <NumberInput name1="talepMiktar" isRequired={false} minNumber={-1} readOnly={true} />
                </div>
              </div>
              <MalzemeTalepTablo selectedRowID={selectedRowID} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GenelBilgiler;
