import { CloseOutlined, FilterOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Drawer, Row, Typography, Select, Space, Input, DatePicker, Switch } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "./style.css";
import { Controller, useFormContext, useForm, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import "dayjs/locale/tr"; // For Turkish locale
import weekOfYear from "dayjs/plugin/weekOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";
import LokasyonTablo from "./components/LokasyonTablo";
import ZamanAraligi from "./components/ZamanAraligi";
import MakineTablo from "./components/MakineTablo";
import BakimTipi from "./components/BakimTipi";
import BakimGrubu from "./components/BakimGrubu";
import MakineTipi from "./components/MakineTipi";
import AtolyeTablo from "./components/AtolyeTablo";
import BakimTablo from "./components/BakimTablo";
import { t } from "i18next";

dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);

dayjs.locale("tr"); // use Turkish locale

const { Text, Link } = Typography;

const StyledCloseOutlined = styled(CloseOutlined)`
  svg {
    width: 10px;
    height: 10px;
  }
`;

const CloseButton = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #80808048;
  cursor: pointer;
`;

const StyledDivMedia = styled.div`
  .anar {
    @media (min-width: 600px) {
      max-width: 300px;
      width: 100%;
    }
    @media (max-width: 600px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }
`;

const StyledDivBottomLine = styled.div`
  @media (min-width: 600px) {
    align-items: center !important;
  }
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export default function CustomFilter({ onSubmit1, isEmpty }) {
  // const {
  //   control,
  //   watch,
  //   setValue,
  //   formState: { errors },
  // } = useFormContext();
  const [open, setOpen] = useState(false);

  const defaultValues = {
    lokasyonTanim: "",
    lokasyonID: "",
    makine: "",
    makineID: "",
    makineTipiID: "",
    makineTipi: null,
    bakimGrubuID: "",
    bakimGrubu: null,
    bakimTipiID: "",
    bakimTipi: null,
    atolyeTanim: "",
    atolyeID: "",
    bakimTanim: "",
    bakimID: "",
    timeRange: "all",
    startDate: null,
    endDate: null,
    donemOncesiSuresiGecmisler: false,
    devamEdenler: false,
  };

  const methods = useForm({ defaultValues });

  // Tarih seçimi yapıldığında veya filtreler eklenip kaldırıldığında düğmenin stilini değiştirmek için bir durum
  const currentValues = methods.watch();
  const isFilterApplied = !Object.keys(defaultValues).every((key) => defaultValues[key] === currentValues[key]);

  const {
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = methods;

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  const onCancle = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (data) => {
    // Get values from watch
    const { startDate, endDate, lokasyonID, makineID, makineTipiID, bakimGrubuID, bakimTipiID, atolyeID, bakimID, devamEdenler, donemOncesiSuresiGecmisler } = watch();

    // Combine selected values, input values for each row, and date range
    const filterData = {
      ...(startDate && { TARIH1: startDate.format("YYYY-MM-DD") }),
      ...(endDate && { TARIH2: endDate.format("YYYY-MM-DD") }),
      FILTRE_LOKASYON_ID: lokasyonID ? lokasyonID : -1,
      FILTRE_ATOLYE_ID: atolyeID ? atolyeID : -1,
      FILTRE_MAKINE_ID: makineID ? makineID : -1,
      FILTRE_MAKINE_TIP_ID: makineTipiID ? makineTipiID : -1,
      FILTRE_PBAKIM_ID: bakimID ? bakimID : -1,
      FILTRE_PBAKIM_TIP_ID: bakimTipiID ? bakimTipiID : -1,
      FILTRE_PBAKIM_GRUP_ID: bakimGrubuID ? bakimGrubuID : -1,
      CHB_DEVAM_EDEN: donemOncesiSuresiGecmisler ? donemOncesiSuresiGecmisler : false,
      CHB_SURE_GECMIS: devamEdenler ? devamEdenler : false,
    };

    console.log(filterData);
    // You can now submit or process the filterData object as needed.
    onSubmit1(filterData);
    setOpen(false);
  };

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value) => {
    console.log("search:", value);
  };

  const handleLokasyonMinusClick = () => {
    setValue("lokasyonTanim", "");
    setValue("lokasyonID", "");
  };

  const handleMakineMinusClick = () => {
    setValue("makine", "");
    setValue("makineID", "");
  };
  const handleAtolyeMinusClick = () => {
    setValue("atolyeTanim", "");
    setValue("atolyeID", "");
  };
  const handleBakimMinusClick = () => {
    setValue("bakimTanim", "");
    setValue("bakimID", "");
  };

  return (
    <>
      <Button
        onClick={showDrawer}
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: isFilterApplied ? "#EBF6FE" : "#ffffffff",
        }}
        className={isFilterApplied ? "#ff0000-dot-button" : ""}
      >
        <FilterOutlined />
        <span style={{ marginRight: "5px" }}>Filtreler</span>
        {isFilterApplied && <span className="blue-dot"></span>}
      </Button>
      <FormProvider {...methods}>
        <Drawer
          extra={
            <Space>
              <Button onClick={onCancle}>İptal</Button>
              <Button type="primary" onClick={methods.handleSubmit(onSubmit)}>
                Uygula
              </Button>
            </Space>
          }
          title={
            <span>
              <FilterOutlined style={{ marginRight: "8px" }} /> Filtreler
            </span>
          }
          width={450}
          placement="right"
          onClose={onClose}
          onCancel={onCancle}
          open={open}
        >
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
              <StyledDivMedia
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  maxWidth: "755px",
                }}
              >
                <Text style={{ fontSize: "14px" }}>Lokasyon:</Text>
                <div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                    <div
                      className="anar"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        minWidth: "300px",
                        gap: "3px",
                      }}
                    >
                      <Controller
                        name="lokasyonTanim"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="text" // Set the type to "text" for name input
                            style={{ width: "100%", maxWidth: "630px" }}
                            disabled
                          />
                        )}
                      />
                      <Controller
                        name="lokasyonID"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="text" // Set the type to "text" for name input
                            style={{ display: "none" }}
                          />
                        )}
                      />
                      <LokasyonTablo
                        onSubmit={(selectedData) => {
                          setValue("lokasyonTanim", selectedData.LOK_TANIM);
                          setValue("lokasyonID", selectedData.key);
                        }}
                      />
                      <Button onClick={handleLokasyonMinusClick}> - </Button>
                    </div>
                  </div>
                </div>
              </StyledDivMedia>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <StyledDivBottomLine
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    width: "100%",
                    maxWidth: "755px",
                  }}
                >
                  <Text style={{ fontSize: "14px" }}>Makine:</Text>
                  <div style={{ display: "flex", flexWrap: "wrap", flexDirection: "column" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "300px",
                        }}
                      >
                        <Controller
                          name="makine"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type="text" // Set the type to "text" for name input
                              style={{ width: "215px" }}
                              disabled
                            />
                          )}
                        />
                        <Controller
                          name="makineID"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type="text" // Set the type to "text" for name input
                              style={{ display: "none" }}
                            />
                          )}
                        />
                        <MakineTablo
                          onSubmit={(selectedData) => {
                            setValue("makine", selectedData.MKN_KOD);
                            setValue("makineID", selectedData.key);
                          }}
                        />
                        <Button onClick={handleMakineMinusClick}> - </Button>
                      </div>
                    </div>
                    {errors.makine && <div style={{ color: "red", marginTop: "5px" }}>{errors.makine.message}</div>}
                  </div>
                </StyledDivBottomLine>
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  maxWidth: "450px",
                  gap: "10px",
                  width: "100%",
                }}
              >
                <MakineTipi />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <StyledDivBottomLine
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    width: "100%",
                    maxWidth: "450px",
                  }}
                >
                  <Text style={{ fontSize: "14px" }}>Bakım:</Text>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "300px",
                    }}
                  >
                    <Controller
                      name="bakimTanim"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text" // Set the type to "text" for name input
                          style={{ width: "215px" }}
                          disabled
                        />
                      )}
                    />
                    <Controller
                      name="bakimID"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text" // Set the type to "text" for name input
                          style={{ display: "none" }}
                        />
                      )}
                    />
                    <BakimTablo
                      onSubmit={(selectedData) => {
                        setValue("bakimTanim", selectedData.subject);
                        setValue("bakimID", selectedData.key);
                      }}
                    />
                    <Button onClick={handleBakimMinusClick}> - </Button>
                  </div>
                </StyledDivBottomLine>
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  maxWidth: "450px",
                  gap: "10px",
                  width: "100%",
                }}
              >
                <BakimTipi />
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  maxWidth: "450px",
                  gap: "10px",
                  width: "100%",
                }}
              >
                <BakimGrubu />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <StyledDivBottomLine
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    width: "100%",
                    maxWidth: "450px",
                  }}
                >
                  <Text style={{ fontSize: "14px" }}>Atölye:</Text>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "300px",
                    }}
                  >
                    <Controller
                      name="atolyeTanim"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          status={errors.atolyeTanim ? "error" : ""}
                          type="text" // Set the type to "text" for name input
                          style={{ width: "215px" }}
                          disabled
                        />
                      )}
                    />
                    <Controller
                      name="atolyeID"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text" // Set the type to "text" for name input
                          style={{ display: "none" }}
                        />
                      )}
                    />
                    <AtolyeTablo
                      onSubmit={(selectedData) => {
                        setValue("atolyeTanim", selectedData.subject);
                        setValue("atolyeID", selectedData.key);
                      }}
                    />
                    <Button onClick={handleAtolyeMinusClick}> - </Button>
                  </div>
                </StyledDivBottomLine>
              </div>
              <ZamanAraligi />
              <div
                style={{
                  marginBottom: "0px",
                  border: "1px solid #80808048",
                  padding: "15px 10px",
                  borderRadius: "8px",
                }}
              >
                <div style={{ marginBottom: "10px" }}>
                  <Text style={{ fontSize: "14px" }}>Tarih Aralığı</Text>
                </div>

                <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                  <Controller
                    name="startDate"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Alan Boş Bırakılamaz!" }}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        {...field}
                        status={error ? "error" : ""}
                        style={{ width: "100%" }}
                        placeholder="Başlangıç Tarihi"
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        locale={dayjs.locale("tr")}
                      />
                    )}
                  />
                  <Text style={{ fontSize: "14px" }}>-</Text>
                  <Controller
                    name="endDate"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Alan Boş Bırakılamaz!" }}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        {...field}
                        status={error ? "error" : ""}
                        style={{ width: "100%" }}
                        placeholder="Bitiş Tarihi"
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        locale={dayjs.locale("tr")}
                      />
                    )}
                  />
                </div>
                {errors.startDate && <div style={{ color: "red", marginTop: "10px" }}>{errors.startDate.message}</div>}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("donemOncesiSuresiGecmisler")}</Text>
                <Controller name="donemOncesiSuresiGecmisler" control={control} render={({ field }) => <Switch {...field} />} />
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <Text style={{ fontSize: "14px", color: "#000000a4" }}>{t("devamEdenler")}</Text>
                <Controller name="devamEdenler" control={control} render={({ field }) => <Switch {...field} />} />
              </div>
            </div>
          </form>
        </Drawer>
      </FormProvider>
    </>
  );
}
