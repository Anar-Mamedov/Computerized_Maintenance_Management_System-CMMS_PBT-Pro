import React, { useCallback, useEffect } from "react";
import {
  Button,
  Modal,
  Input,
  Typography,
  Tabs,
  InputNumber,
  Checkbox,
  Image,
} from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import PersonelTablo from "./components/PersonelTablo";
import VardiyaSelect from "./components/VardiyaSelect";
import MasrafMerkeziTablo from "./components/MasrafMerkeziTablo";
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
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const fazlaMesai = watch("fazlaMesai");

  const handleMasrafMerkeziMinusClick = () => {
    setValue("masrafMerkezi", "");
    setValue("masrafMerkeziID", "");
  };

  const handlePersonelMinusClick = () => {
    setValue("personelTanim", "");
    setValue("personelID", "");
  };

  const clearfazlaMesai = useCallback(() => {
    setValue("mesaiSuresi", "");
    setValue("mesaiUcreti", "");
  }, [setValue]);

  useEffect(() => {
    if (!fazlaMesai) {
      clearfazlaMesai();
    }
  }, [fazlaMesai, clearfazlaMesai]);

  const items = [
    {
      key: "1",
      label: "Açıklama",
      children: (
        <Controller
          name="aciklama"
          control={control}
          render={({ field }) => <TextArea {...field} rows={4} />}
        />
      ),
    },
  ];

  const calismaSuresi = watch("calismaSuresi");
  const saatUcreti = watch("saatUcreti");
  const mesaiSuresi = watch("mesaiSuresi");
  const mesaiUcreti = watch("mesaiUcreti");

  useEffect(() => {
    const maliyet =
      calismaSuresi * (saatUcreti / 60) + mesaiSuresi * (mesaiUcreti / 60);
    setValue("maliyet", maliyet > 0 ? maliyet : 0);
  }, [calismaSuresi, saatUcreti, mesaiSuresi, mesaiUcreti, setValue]);

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
      <div style={{ display: "flex", gap: "20px" }}>
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >
            <StyledDivBottomLine
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                width: "100%",
                maxWidth: "435px",
              }}
            >
              <Text style={{ fontSize: "14px", fontWeight: "600" }}>
                Personel:
              </Text>
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
                  rules={{ required: "Alan Boş Bırakılamaz!" }}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      {...field}
                      status={errors.personelTanim ? "error" : ""}
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
                <PersonelTablo
                  onSubmit={(selectedData) => {
                    setValue("personelTanim", selectedData.subject);
                    setValue("personelID", selectedData.key);
                  }}
                />
                <Button onClick={handlePersonelMinusClick}> - </Button>
                {errors.personelTanim && (
                  <div style={{ color: "red", marginTop: "10px" }}>
                    {errors.personelTanim.message}
                  </div>
                )}
              </div>
            </StyledDivBottomLine>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <div
              style={{
                border: "1px solid #ececec",
                padding: "15px",
                width: "360px",
                marginBottom: "10px",
              }}
            >
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
                <Text style={{ fontSize: "14px" }}>Çalışma Süresi (dk.):</Text>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    maxWidth: "180px",
                    minWidth: "180px",
                    gap: "10px",
                    width: "100%",
                  }}
                >
                  <Controller
                    name="calismaSuresi"
                    control={control}
                    render={({ field }) => (
                      <InputNumber {...field} style={{ width: "180px" }} />
                    )}
                  />
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
                <Text style={{ fontSize: "14px" }}>Saat Ücreti:</Text>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    maxWidth: "180px",
                    minWidth: "180px",
                    gap: "10px",
                    width: "100%",
                  }}
                >
                  <Controller
                    name="saatUcreti"
                    control={control}
                    render={({ field }) => (
                      <InputNumber {...field} style={{ width: "180px" }} />
                    )}
                  />
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
                }}
              >
                <Text style={{ fontSize: "14px" }}>Maliyet:</Text>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    maxWidth: "180px",
                    minWidth: "180px",
                    gap: "10px",
                    width: "100%",
                  }}
                >
                  <Controller
                    name="maliyet"
                    control={control}
                    render={({ field }) => (
                      <InputNumber
                        {...field}
                        min={0}
                        style={{ width: "180px" }}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
            <div>
              <div
                style={{
                  position: "relative",
                  top: "10px",
                  left: "10px",
                  background: "white",
                  width: "110px",
                }}
              >
                <Controller
                  name="fazlaMesai"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    >
                      Fazla Mesai
                    </Checkbox>
                  )}
                />
              </div>
              <div
                style={{
                  border: "1px solid #ececec",
                  padding: "15px",
                  width: "360px",
                  marginBottom: "10px",
                }}
              >
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
                  <Text style={{ fontSize: "14px" }}>Mesai Süresi (dk.):</Text>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      maxWidth: "180px",
                      minWidth: "180px",
                      gap: "10px",
                      width: "100%",
                    }}
                  >
                    <Controller
                      name="mesaiSuresi"
                      control={control}
                      render={({ field }) => (
                        <InputNumber
                          {...field}
                          disabled={!fazlaMesai}
                          style={{ width: "180px" }}
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
                    maxWidth: "720px",
                    gap: "10px",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ fontSize: "14px" }}>Mesai Ücreti (Saat):</Text>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      maxWidth: "180px",
                      minWidth: "180px",
                      gap: "10px",
                      width: "100%",
                    }}
                  >
                    <Controller
                      name="mesaiUcreti"
                      control={control}
                      render={({ field }) => (
                        <InputNumber
                          {...field}
                          disabled={!fazlaMesai}
                          min={0}
                          style={{ width: "180px" }}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            border: "1px solid #ececec",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* <Image width={200} src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" /> */}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "10px",
        }}
      >
        <StyledDivBottomLine
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "435px",
          }}
        >
          <Text style={{ fontSize: "14px" }}>Masraf Merkezi:</Text>
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
              name="masrafMerkezi"
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
              name="masrafMerkeziID"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text" // Set the type to "text" for name input
                  style={{ display: "none" }}
                />
              )}
            />

            <MasrafMerkeziTablo
              onSubmit={(selectedData) => {
                setValue("masrafMerkezi", selectedData.age);
                setValue("masrafMerkeziID", selectedData.key);
              }}
            />
            <Button onClick={handleMasrafMerkeziMinusClick}>-</Button>
          </div>
        </StyledDivBottomLine>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "85px",
          marginBottom: "10px",
        }}
      >
        <Text style={{ fontSize: "14px" }}>Vardiya:</Text>
        <VardiyaSelect />
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          maxWidth: "436px",
          gap: "10px",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: "14px" }}>{t("workOrder.personnel.workTime")}:</Text>
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
          <FullDatePicker name1="personelBaslamaZamani" style={{ flex: "none", width: "180px" }} placeholder={t("workOrder.detail.selectDate")} />
          <FullTimePicker
            name1="personelBaslamaSaati"
            changeOnScroll
            style={{ flex: "none", width: "110px" }}
            placeholder={t("workOrder.detail.selectTime")}
          />
          {errors.baslamaZamaniSaati && (
            <div style={{ color: "red", marginTop: "5px" }}>
              {errors.baslamaZamaniSaati.message}
            </div>
          )}
        </div>
      </div>
      <StyledTabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
}
