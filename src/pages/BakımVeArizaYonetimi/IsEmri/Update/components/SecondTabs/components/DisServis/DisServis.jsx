import React, { useEffect, useState } from "react";
import { Button, Input, InputNumber, DatePicker, Typography, Checkbox } from "antd";

const { TextArea } = Input;
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import FirmaTablo from "../DetayBilgiler/components/FirmaTablo";
import SozlesmeTablo from "../DetayBilgiler/components/SozlesmeTablo";

const { Text } = Typography;

const StyledDivBottomLine = styled.div`
  @media (min-width: 600px) {
    align-items: center !important;
  }
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export default function DisServis({ fieldRequirements }) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [localeDateFormat, setLocaleDateFormat] = useState("DD/MM/YYYY");

  useEffect(() => {
    const dateFormatter = new Intl.DateTimeFormat(navigator.language);
    const sampleDate = new Date(2021, 10, 21);
    const formattedSampleDate = dateFormatter.format(sampleDate);
    setLocaleDateFormat(formattedSampleDate.replace("2021", "YYYY").replace("21", "DD").replace("11", "MM"));
  }, []);

  const handleFirmaMinusClick = () => {
    setValue("firma", "");
    setValue("firmaID", "");
  };

  const handleSozlesmeMinusClick = () => {
    setValue("sozlesme", "");
    setValue("sozlesmeID", "");
  };

  return (
    <div style={{ paddingBottom: "35px" }}>
      <div
        style={{
          background: "#F3F8FE",
          border: "1px solid #E5EDF7",
          borderRadius: "10px",
          padding: "16px",
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          width: "100%",
          maxWidth: "1050px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: "0 0 460px", maxWidth: "460px" }}>
          <div style={{ marginBottom: "5px", width: "100%" }}>
            <Text style={{ fontSize: "14px", fontWeight: "500", color: "#0062ff" }}>Dış Servis</Text>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <StyledDivBottomLine
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                width: "100%",
                maxWidth: "480px",
              }}
            >
              <Text style={{ fontSize: "14px", fontWeight: fieldRequirements?.firma ? "600" : "normal" }}>Firma:</Text>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", width: "300px" }}>
                <Controller
                  name="firma"
                  control={control}
                  rules={{ required: fieldRequirements?.firma ? "Alan Boş Bırakılamaz!" : false }}
                  render={({ field }) => <Input {...field} status={errors.firma ? "error" : ""} type="text" style={{ width: "215px" }} disabled />}
                />
                <Controller name="firmaID" control={control} render={({ field }) => <Input {...field} type="text" style={{ display: "none" }} />} />
                <FirmaTablo
                  onSubmit={(selectedData) => {
                    setValue("firma", selectedData.subject);
                    setValue("firmaID", selectedData.key);
                  }}
                />
                <Button onClick={handleFirmaMinusClick}> - </Button>
                {errors.firma && <div style={{ color: "red", marginTop: "5px" }}>{errors.firma.message}</div>}
              </div>
            </StyledDivBottomLine>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <StyledDivBottomLine
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                width: "100%",
                maxWidth: "480px",
              }}
            >
              <Text style={{ fontSize: "14px", fontWeight: fieldRequirements?.sozlesme ? "600" : "normal" }}>Sözleşme:</Text>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", width: "300px" }}>
                <Controller
                  name="sozlesme"
                  control={control}
                  rules={{ required: fieldRequirements?.sozlesme ? "Alan Boş Bırakılamaz!" : false }}
                  render={({ field }) => <Input {...field} status={errors.sozlesme ? "error" : ""} type="text" style={{ width: "215px" }} disabled />}
                />
                <Controller name="sozlesmeID" control={control} render={({ field }) => <Input {...field} type="text" style={{ display: "none" }} />} />
                <SozlesmeTablo
                  onSubmit={(selectedData) => {
                    setValue("sozlesme", selectedData.CAS_TANIM);
                    setValue("sozlesmeID", selectedData.key);
                  }}
                />
                <Button onClick={handleSozlesmeMinusClick}> - </Button>
                {errors.sozlesme && <div style={{ color: "red", marginTop: "5px" }}>{errors.sozlesme.message}</div>}
              </div>
            </StyledDivBottomLine>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", maxWidth: "480px", gap: "10px", width: "100%", justifyContent: "space-between" }}>
            <Text style={{ fontSize: "14px", fontWeight: fieldRequirements?.evrakNo ? "600" : "normal" }}>Evrak No/Tarihi:</Text>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", maxWidth: "300px", minWidth: "300px", gap: "10px", width: "100%" }}>
              <Controller
                name="evrakNo"
                control={control}
                rules={{ required: fieldRequirements?.evrakNo ? "Alan Boş Bırakılamaz!" : false }}
                render={({ field }) => <InputNumber {...field} min={0} status={errors.evrakNo ? "error" : ""} style={{ width: "145px" }} />}
              />
              <Controller
                name="evrakTarihi"
                control={control}
                rules={{ required: fieldRequirements?.evrakTarihi ? "Alan Boş Bırakılamaz!" : false }}
                render={({ field }) => (
                  <DatePicker {...field} status={errors.evrakTarihi ? "error" : ""} style={{ width: "145px" }} format={localeDateFormat} placeholder="Tarih seçiniz" />
                )}
              />
              {errors.evrakTarihi && <div style={{ color: "red", marginTop: "5px" }}>{errors.evrakTarihi.message}</div>}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <StyledDivBottomLine
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                width: "100%",
                maxWidth: "480px",
              }}
            >
              <Text style={{ fontSize: "14px", fontWeight: fieldRequirements?.maliyet ? "600" : "normal" }}>Maliyet:</Text>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", width: "300px", gap: "10px" }}>
                <Controller
                  name="maliyet"
                  control={control}
                  rules={{ required: fieldRequirements?.maliyet ? "Alan Boş Bırakılamaz!" : false }}
                  render={({ field }) => <InputNumber {...field} min={0} status={errors.maliyet ? "error" : ""} style={{ width: "125px" }} />}
                />
                <div>
                  <Controller
                    name="garantiKapsami"
                    control={control}
                    render={({ field }) => (
                      <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                        Garanti Kapsamında
                      </Checkbox>
                    )}
                  />
                </div>
                {errors.maliyet && <div style={{ color: "red", marginTop: "5px" }}>{errors.maliyet.message}</div>}
              </div>
            </StyledDivBottomLine>
          </div>
        </div>
        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column" }}>
          <Controller
            name="disServisAciklama"
            control={control}
            render={({ field }) => <TextArea {...field} placeholder="Açıklama" rows={8} style={{ width: "100%", height: "100%" }} />}
          />
        </div>
      </div>
    </div>
  );
}
