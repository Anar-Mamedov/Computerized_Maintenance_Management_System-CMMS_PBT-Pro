import React, { useCallback, useEffect } from "react";
import { Button, Modal, Input, Typography, Tabs, InputNumber, Select } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import dayjs from "dayjs";
import SertifikaTipi from "./components/SertifikaTipi";
import AtolyeTablo from "./components/AtolyeTablo";
import PersonelTablo from "./components/PersonelTablo";
import VardiyaSelect from "./components/VardiyaSelect";
import FullDatePicker from "../../../../../../../../../../utils/components/FullDatePicker.jsx";
import FullTimePicker from "../../../../../../../../../../utils/components/FullTimePicker.jsx";

const { Text, Link } = Typography;
const { TextArea } = Input;

const StyledDivBottomLine = styled.div`
  @media (min-width: 600px) {
    align-items: center !important;
  }
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const onChange = (key) => {
  // console.log(key);
};

//styled components
const StyledTabs = styled(Tabs)`
  .ant-tabs-tab {
    margin: 0 !important;
    width: fit-content;
    padding: 10px 15px;
    justify-content: center;
    background-color: rgba(230, 230, 230, 0.3);
  }

  .ant-tabs-tab-active {
    background-color: #2bc77135;
  }

  .ant-tabs-nav .ant-tabs-tab-active .ant-tabs-tab-btn {
    color: rgba(0, 0, 0, 0.88) !important;
  }

  .ant-tabs-tab:hover .ant-tabs-tab-btn {
    color: rgba(0, 0, 0, 0.88) !important;
  }

  .ant-tabs-tab:not(:first-child) {
    border-left: 1px solid #80808024;
  }

  .ant-tabs-ink-bar {
    background: #2bc770;
  }
`;

//styled components end
export default function MainTabs() {
  const { t } = useTranslation();
  const { control, watch, setValue } = useFormContext();

  const yapildi = Number(watch("yapildi") || 0);
  const isStatusActive = yapildi !== 0;

  const handleAtolyeMinusClick = () => {
    setValue("atolyeTanim", "");
    setValue("atolyeID", "");
  };

  const handlePersonelMinusClick = () => {
    setValue("personelTanim", "");
    setValue("personelID", "");
  };

  const clearYapildi = useCallback(() => {
    setValue("atolyeTanim", "");
    setValue("atolyeID", "");
    setValue("personelTanim", "");
    setValue("personelID", "");
    setValue("baslangicTarihi", null);
    setValue("baslangicSaati", null);
    setValue("vardiya", null);
    setValue("vardiyaID", "");
    setValue("bitisTarihi", null);
    setValue("bitisSaati", null);
    setValue("sure", 0);
  }, [setValue]);

  useEffect(() => {
    if (!isStatusActive) {
      clearYapildi();
    }
  }, [isStatusActive, clearYapildi]);

  const items = [
    {
      key: "1",
      label: "Açıklama",
      children: <Controller name="aciklama" control={control} render={({ field }) => <TextArea {...field} rows={4} />} />,
    },
  ];

  // iki tarih ve saat arasında geçen süreyi hesaplamak için

  const watchFields = watch(["baslangicTarihi", "baslangicSaati", "bitisTarihi", "bitisSaati"]);

  useEffect(() => {
    const [baslangicTarihi, baslangicSaati, bitisTarihi, bitisSaati] = watchFields;
    if (baslangicTarihi && baslangicSaati && bitisTarihi && bitisSaati) {
      const baslangicZamani = dayjs(baslangicTarihi).hour(baslangicSaati.hour()).minute(baslangicSaati.minute());
      const bitisZamani = dayjs(bitisTarihi).hour(bitisSaati.hour()).minute(bitisSaati.minute());

      const sure = bitisZamani.diff(baslangicZamani, "minute");
      setValue("sure", sure > 0 ? sure : 0);
    }
  }, [watchFields, setValue]);

  // iki tarih ve saat arasında geçen süreyi hesaplamak için sonu

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "450px",
          gap: "10px",
          rowGap: "0px",
          marginBottom: "10px",
        }}
      >
        <Text style={{ fontSize: "14px" }}>Sıra no:</Text>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            maxWidth: "300px",
            minWidth: "300px",
            gap: "10px",
            width: "100%",
          }}
        >
          <Controller
            name="siraNo"
            control={control}
            render={({ field }) => (
              <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                <InputNumber {...field} min={1} style={{ flex: 1 }} />
              </div>
            )}
          />
          <Controller
            name="secilenID"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text" // Set the type to "text" for name input
                style={{ display: "none" }}
              />
            )}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "450px",
          gap: "10px",
          rowGap: "0px",
          marginBottom: "10px",
        }}
      >
        <Text style={{ fontSize: "14px", fontWeight: "600" }}>İş Tanımı:</Text>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            maxWidth: "300px",
            minWidth: "300px",
            gap: "10px",
            width: "100%",
          }}
        >
          <Controller
            name="isTanimi"
            control={control}
            rules={{ required: "Alan Boş Bırakılamaz!" }}
            render={({ field, fieldState: { error } }) => (
              <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                <Input {...field} status={error ? "error" : ""} style={{ flex: 1 }} />
                {error && <div style={{ color: "red" }}>{error.message}</div>}
              </div>
            )}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "450px",
          gap: "10px",
          rowGap: "0px",
          marginBottom: "10px",
        }}
      >
        <Text style={{ fontSize: "14px" }}>Durum:</Text>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            maxWidth: "300px",
            minWidth: "300px",
            gap: "10px",
            width: "100%",
          }}
        >
          <Controller
            name="yapildi"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                value={Number(field.value || 0)}
                style={{ width: 150 }}
                options={[
                  { value: 0, label: t("workOrder.controlList.waiting") },
                  { value: 1, label: t("workOrder.controlList.completed") },
                  { value: 2, label: t("workOrder.controlList.critical") },
                ]}
                onChange={(value) => field.onChange(value)}
              />
            )}
          />
        </div>
      </div>
      <div style={{ border: "1px solid #ececec", padding: "12px 15px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
          <StyledDivBottomLine
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: "435px",
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
              {isStatusActive ? (
                <AtolyeTablo
                  onSubmit={(selectedData) => {
                    setValue("atolyeTanim", selectedData.subject);
                    setValue("atolyeID", selectedData.key);
                  }}
                />
              ) : (
                <Button disabled={!isStatusActive}>+</Button>
              )}
              <Button disabled={!isStatusActive} onClick={handleAtolyeMinusClick}>
                -
              </Button>
            </div>
          </StyledDivBottomLine>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
          <StyledDivBottomLine
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: "435px",
            }}
          >
            <Text style={{ fontSize: "14px" }}>Personel:</Text>
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
                name="personelTanim"
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
                name="personelID"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text" // Set the type to "text" for name input
                    style={{ display: "none" }}
                  />
                )}
              />

              {isStatusActive ? (
                <PersonelTablo
                  onSubmit={(selectedData) => {
                    setValue("personelTanim", selectedData.subject);
                    setValue("personelID", selectedData.key);
                  }}
                />
              ) : (
                <Button disabled={!isStatusActive}>+</Button>
              )}

              <Button disabled={!isStatusActive} onClick={handlePersonelMinusClick}>
                {" "}
                -{" "}
              </Button>
            </div>
          </StyledDivBottomLine>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            maxWidth: "720px",
            gap: "10px",
            width: "100%",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <Text style={{ fontSize: "14px" }}>{t("workOrder.detail.startTime")}:</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "300px",
              minWidth: "300px",
              gap: "10px",
              width: "100%",
            }}
          >
            <FullDatePicker name1="baslangicTarihi" disabled={!isStatusActive} style={{ flex: "none", width: "180px" }} placeholder={t("workOrder.detail.selectDate")} />
            <FullTimePicker
              name1="baslangicSaati"
              changeOnScroll
              disabled={!isStatusActive}
              style={{ flex: "none", width: "110px" }}
              placeholder={t("workOrder.detail.selectTime")}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
            <Text style={{ fontSize: "14px" }}>Vardiya:</Text>
            <VardiyaSelect />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            maxWidth: "720px",
            gap: "10px",
            width: "100%",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              maxWidth: "435px",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: "14px" }}>{t("workOrder.detail.endTime")}:</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "300px",
                minWidth: "300px",
                gap: "10px",
                width: "100%",
              }}
            >
              <FullDatePicker name1="bitisTarihi" disabled={!isStatusActive} style={{ flex: "none", width: "180px" }} placeholder={t("workOrder.detail.selectDate")} />
              <FullTimePicker
                name1="bitisSaati"
                changeOnScroll
                disabled={!isStatusActive}
                style={{ flex: "none", width: "110px" }}
                placeholder={t("workOrder.detail.selectTime")}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
            <Text style={{ fontSize: "14px" }}>Süre (dk):</Text>
            <Controller name="sure" control={control} render={({ field }) => <InputNumber {...field} disabled={!isStatusActive} min={0} style={{ width: "200px" }} />} />
          </div>
        </div>
        <StyledTabs defaultActiveKey="1" items={items} onChange={onChange} />
      </div>
    </div>
  );
}
