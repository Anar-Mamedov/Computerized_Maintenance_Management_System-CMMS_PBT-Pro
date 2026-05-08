import React, { useEffect } from "react";
import { Button, Modal, Input, Typography, Tabs, InputNumber, Checkbox } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import dayjs from "dayjs";
import { t } from "i18next";
import DurusNedeniSelect from "./components/DurusNedeniSelect";
import ProjeTablo from "./components/ProjeTablo";
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
  const { control, watch, setValue, setError, clearErrors } = useFormContext();

  const handleProjeMinusClick = () => {
    setValue("proje", "");
    setValue("projeID", "");
  };

  const items = [
    {
      key: "1",
      label: "Açıklama",
      children: <Controller name="aciklama" control={control} render={({ field }) => <TextArea {...field} rows={4} />} />,
    },
  ];

  // iki tarih ve saat arasında geçen süreyi hesaplamak için

  const watchFields = watch(["baslangicTarihi", "baslangicSaati", "bitisTarihi", "bitisSaati"]);
  const [baslangicTarihi, baslangicSaati, bitisTarihi, bitisSaati] = watchFields;

  const disableDatesAfter = (limitDate) => (current) => {
    if (!limitDate || !current) {
      return false;
    }

    return current.startOf("day").isAfter(dayjs(limitDate).startOf("day"));
  };

  const disableDatesBefore = (limitDate) => (current) => {
    if (!limitDate || !current) {
      return false;
    }

    return current.startOf("day").isBefore(dayjs(limitDate).startOf("day"));
  };

  const buildDisabledTimeBefore = (limitTime) => {
    if (!limitTime) {
      return {};
    }

    const limitHour = limitTime.hour();
    const limitMinute = limitTime.minute();

    return {
      disabledHours: () => Array.from({ length: limitHour }, (_, index) => index),
      disabledMinutes: (selectedHour) => {
        if (selectedHour !== limitHour) {
          return [];
        }

        return Array.from({ length: limitMinute }, (_, index) => index);
      },
    };
  };

  const buildDisabledTimeAfter = (limitTime) => {
    if (!limitTime) {
      return {};
    }

    const limitHour = limitTime.hour();
    const limitMinute = limitTime.minute();

    return {
      disabledHours: () => Array.from({ length: 23 - limitHour }, (_, index) => limitHour + index + 1),
      disabledMinutes: (selectedHour) => {
        if (selectedHour !== limitHour) {
          return [];
        }

        return Array.from({ length: 59 - limitMinute }, (_, index) => limitMinute + index + 1);
      },
    };
  };

  const getDisabledBaslangicTime = () => {
    if (!baslangicTarihi || !bitisTarihi || !bitisSaati || !dayjs(baslangicTarihi).isSame(dayjs(bitisTarihi), "day")) {
      return {};
    }

    return buildDisabledTimeAfter(bitisSaati);
  };

  const getDisabledBitisTime = () => {
    if (!baslangicTarihi || !bitisTarihi || !baslangicSaati || !dayjs(baslangicTarihi).isSame(dayjs(bitisTarihi), "day")) {
      return {};
    }

    return buildDisabledTimeBefore(baslangicSaati);
  };

  useEffect(() => {
    if (baslangicTarihi && baslangicSaati && bitisTarihi && bitisSaati) {
      const baslangicZamani = dayjs(baslangicTarihi).hour(baslangicSaati.hour()).minute(baslangicSaati.minute());
      const bitisZamani = dayjs(bitisTarihi).hour(bitisSaati.hour()).minute(bitisSaati.minute());

      if (bitisZamani.isBefore(baslangicZamani)) {
        setError("bitisTarihi", {
          type: "validate",
          message: t("workOrder.downtime.endTimeCannotBeBeforeStartTime"),
        });
        setValue("sure", 0);
        return;
      }

      clearErrors("bitisTarihi");
      const sure = bitisZamani.diff(baslangicZamani, "minute");
      setValue("sure", sure >= 0 ? sure : 0);
      return;
    }

    clearErrors("bitisTarihi");
  }, [baslangicSaati, baslangicTarihi, bitisSaati, bitisTarihi, clearErrors, setError, setValue]);

  // iki tarih ve saat arasında geçen süreyi hesaplamak için sonu

  return (
    <div>
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
        <Text style={{ fontSize: "14px", fontWeight: "600" }}>Makine Tanımı:</Text>
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
            name="makineTanimi"
            control={control}
            rules={{ required: "Alan Boş Bırakılamaz!" }}
            render={({ field, fieldState: { error } }) => (
              <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                <Input {...field} status={error ? "error" : ""} disabled style={{ flex: 1 }} />
                {error && <div style={{ color: "red" }}>{error.message}</div>}
              </div>
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
        <Text style={{ fontSize: "14px" }}>Lokasyon:</Text>
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
            name="lokasyon"
            control={control}
            render={({ field }) => (
              <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                <Input {...field} disabled style={{ flex: 1 }} />
              </div>
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
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
        <StyledDivBottomLine
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "450px",
          }}
        >
          <Text style={{ fontSize: "14px" }}>Proje:</Text>
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
              name="proje"
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
              name="projeID"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text" // Set the type to "text" for name input
                  style={{ display: "none" }}
                />
              )}
            />
            <ProjeTablo
              onSubmit={(selectedData) => {
                setValue("proje", selectedData.subject);
                setValue("projeID", selectedData.key);
              }}
            />
            <Button onClick={handleProjeMinusClick}>-</Button>
          </div>
        </StyledDivBottomLine>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
          width: "100%",
          maxWidth: "450px",
          marginBottom: "10px",
        }}
      >
        <Text style={{ fontSize: "14px", fontWeight: "600" }}>Duruş Nedeni:</Text>
        <DurusNedeniSelect />
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ border: "1px solid #ececec", padding: "15px", marginBottom: "10px", maxWidth: "435px" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "435px",
              gap: "10px",
              width: "100%",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <Text style={{ fontSize: "14px" }}>Başlangıç Zamanı:</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "270px",
                gap: "10px",
                width: "100%",
              }}
            >
              <div style={{ width: "150px" }}>
                <FullDatePicker name1="baslangicTarihi" placeholder="" disabledDate={disableDatesAfter(bitisTarihi)} inputReadOnly />
              </div>
              <div style={{ width: "110px" }}>
                <FullTimePicker name1="baslangicSaati" disabledTime={getDisabledBaslangicTime} inputReadOnly changeOnScroll />
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "435px",
              gap: "10px",
              width: "100%",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <Text style={{ fontSize: "14px" }}>Bitiş Zamanı:</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "270px",
                gap: "10px",
                width: "100%",
              }}
            >
              <div style={{ width: "150px" }}>
                <FullDatePicker name1="bitisTarihi" placeholder="" disabledDate={disableDatesBefore(baslangicTarihi)} inputReadOnly />
              </div>
              <div style={{ width: "110px" }}>
                <FullTimePicker name1="bitisSaati" disabledTime={getDisabledBitisTime} inputReadOnly changeOnScroll />
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
              maxWidth: "435px",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: "14px", fontWeight: "600" }}>Duruş Süresi (dk):</Text>
            <Controller
              name="sure"
              control={control}
              rules={{ required: t("alanBosBirakilamaz") }}
              render={({ field, fieldState: { error } }) => (
                <div style={{ width: "270px", display: "flex", flexDirection: "column", gap: "5px" }}>
                  <InputNumber {...field} min={0} status={error ? "error" : ""} style={{ width: "100%" }} />
                  {error && <div style={{ color: "red" }}>{error.message}</div>}
                </div>
              )}
            />
          </div>
        </div>
        <div style={{ border: "1px solid #ececec", padding: "15px", marginBottom: "10px", maxWidth: "350px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
              maxWidth: "435px",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <Text style={{ fontSize: "14px" }}>Duruş Maliyeti (Saat):</Text>
            <Controller name="DurusMaliyeti" control={control} render={({ field }) => <InputNumber {...field} min={0} style={{ width: "130px" }} />} />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
              maxWidth: "435px",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: "14px" }}>Toplam Maliyet:</Text>
            <Controller name="toplamMaliyet" control={control} render={({ field }) => <InputNumber {...field} min={0} style={{ width: "130px" }} />} />
          </div>
        </div>
      </div>

      <StyledTabs style={{ marginBottom: "10px" }} defaultActiveKey="1" items={items} onChange={onChange} />
      <div>
        <Controller
          name="planliDurus"
          control={control}
          render={({ field }) => (
            <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
              Planlı Duruş
            </Checkbox>
          )}
        />
      </div>
    </div>
  );
}
