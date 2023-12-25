import React from "react";
import { Button, Checkbox, DatePicker, Input, Typography } from "antd";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import AxiosInstance from "../../../../../../../../api/http";
import YakitTipi from "../TenthTab/components/YakitTipi";
import Firma from "./components/Firma";
import KiraSuresi from "./components/KiraSuresi";

const { Text, Link } = Typography;

export default function FourthTab() {
  const { control, setValue, watch, handleSubmit, getValues } = useFormContext();

  const handleFirmaMinusClick = () => {
    setValue("makineFirma", "");
    setValue("makineFirmaID", "");
  };

  const makineKiralik = watch("makineKiralik");

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        columnGap: "10px",
        marginBottom: "20px",
      }}>
      <div>
        <div
          style={{
            width: "fit-content",
            position: "relative",
            marginBottom: "-11px",
            marginLeft: "10px",
            backgroundColor: "white",
            zIndex: "1",
          }}>
          <Controller
            name="makineKiralik"
            control={control}
            defaultValue={false} // or true if you want it checked by default
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Kiralık
              </Checkbox>
            )}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            border: "1px solid #80808068",
            width: "430px",
            padding: "15px 5px 5px 5px",
            justifyContent: "center",
            gap: "5px",
            alignContent: "flex-start",
            height: "fit-content",
          }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}>
            <Text style={{ fontSize: "14px" }}>Firma:</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                width: "300px",
              }}>
              <Controller
                name="makineFirma"
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
                name="makineFirmaID"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text" // Set the type to "text" for name input
                    style={{ display: "none" }}
                  />
                )}
              />
              <Firma
                onSubmit={(selectedData) => {
                  setValue("makineFirma", selectedData.subject);
                  setValue("makineFirmaID", selectedData.key);
                }}
              />
              <Button onClick={handleFirmaMinusClick}> - </Button>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}>
            <Text style={{ fontSize: "14px" }}>Baş. Tarihi:</Text>
            <Controller
              name="makineKiraBaslangicTarihi"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  disabled={!makineKiralik}
                  style={{ width: "300px" }}
                  format="DD-MM-YYYY"
                  placeholder="Tarih seçiniz"
                />
              )}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}>
            <Text style={{ fontSize: "14px" }}>Bitiş Tarihi:</Text>
            <Controller
              name="makineKiraBitisTarihi"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  disabled={!makineKiralik}
                  style={{ width: "300px" }}
                  format="DD-MM-YYYY"
                  placeholder="Tarih seçiniz"
                />
              )}
            />
          </div>
          <KiraSuresi />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}>
            <Text style={{ fontSize: "14px" }}>Kira Tutarı:</Text>
            <Controller
              name="kiraTutari"
              control={control}
              render={({ field: { onChange, ...restField } }) => (
                <Input
                  {...restField}
                  disabled={!makineKiralik}
                  style={{ width: "300px" }}
                  onChange={(e) => {
                    // Allow only numeric input
                    const numericValue = e.target.value.replace(/[^0-9]/g, "");
                    onChange(numericValue);
                  }}
                />
              )}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}>
            <Text style={{ fontSize: "14px" }}>Açıklama:</Text>
            <Controller
              name="kiraAciklama"
              control={control}
              render={({ field }) => <Input {...field} disabled={!makineKiralik} style={{ width: "300px" }} />}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          border: "1px solid #80808068",
          width: "430px",
          padding: "5px",
          justifyContent: "center",
          gap: "5px",
          alignContent: "flex-start",
          height: "fit-content",
        }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <Text style={{ fontSize: "14px" }}>Öngörülen (min):</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              width: "300px",
            }}>
            <Controller
              name="ongorulenMin"
              control={control}
              render={({ field: { onChange, ...restField } }) => (
                <Input
                  {...restField}
                  style={{ width: "255px" }}
                  onChange={(e) => {
                    // Allow only numeric input
                    const numericValue = e.target.value.replace(/[^0-9]/g, "");
                    onChange(numericValue);
                  }}
                />
              )}
            />
            <Text style={{ fontSize: "14px" }}>lt/100</Text>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <Text style={{ fontSize: "14px" }}>Öngörülen (max):</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              width: "300px",
            }}>
            <Controller
              name="ongorulenMax"
              control={control}
              render={({ field: { onChange, ...restField } }) => (
                <Input
                  {...restField}
                  style={{ width: "255px" }}
                  onChange={(e) => {
                    // Allow only numeric input
                    const numericValue = e.target.value.replace(/[^0-9]/g, "");
                    onChange(numericValue);
                  }}
                />
              )}
            />
            <Text style={{ fontSize: "14px" }}>lt/1</Text>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <Text style={{ fontSize: "14px" }}>Gerçekleşen:</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              width: "300px",
            }}>
            <Controller
              name="gerceklesen"
              control={control}
              render={({ field: { onChange, ...restField } }) => (
                <Input
                  {...restField}
                  style={{ width: "255px" }}
                  onChange={(e) => {
                    // Allow only numeric input
                    const numericValue = e.target.value.replace(/[^0-9]/g, "");
                    onChange(numericValue);
                  }}
                />
              )}
            />
            <Text style={{ fontSize: "14px" }}>lt/1</Text>
          </div>
        </div>
      </div>
    </div>
  );
}
