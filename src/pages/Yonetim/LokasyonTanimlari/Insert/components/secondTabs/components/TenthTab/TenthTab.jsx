import React from "react";
import { Button, Checkbox, Input, Typography } from "antd";

import AxiosInstance from "../../../../../../../../api/http";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import YakitTipi from "./components/YakitTipi";
const { Text } = Typography;

export default function TenthTab() {
  const { control, setValue, watch } = useFormContext();

  const handleYakitMinusClick = () => {
    setValue("makineYakitTipi", "");
    setValue("makineYakitTipiID", "");
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        columnGap: "10px",
        marginBottom: "20px",
      }}>
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
          <Text style={{ fontSize: "14px" }}>Yakıt Tipi:</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              width: "300px",
            }}>
            <Controller
              name="makineYakitTipi"
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
              name="makineYakitTipiID"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text" // Set the type to "text" for name input
                  style={{ display: "none" }}
                />
              )}
            />
            <YakitTipi
              onSubmit={(selectedData) => {
                setValue("makineYakitTipi", selectedData.subject);
                setValue("makineYakitTipiID", selectedData.key);
              }}
            />
            <Button onClick={handleYakitMinusClick}> - </Button>
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
          <Text style={{ fontSize: "14px" }}>Yakıt Depo Hacmi:</Text>
          <Controller
            name="YakitDepoHacmi"
            control={control}
            render={({ field }) => <Input {...field} style={{ width: "300px" }} />}
          />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", width: "100%" }}>
          <div style={{ width: "300px" }}>
            <Controller
              name="makineYakitSayacTakibi"
              control={control}
              defaultValue={false} // or true if you want it checked by default
              render={({ field }) => (
                <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                  Yakıt girişinde sayaç takibi zorunlu
                </Checkbox>
              )}
            />
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", width: "100%" }}>
          <div style={{ width: "300px" }}>
            <Controller
              name="makineYakitSayacGuncellemesi"
              control={control}
              defaultValue={false} // or true if you want it checked by default
              render={({ field }) => (
                <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                  Yakıt girişinde sayaç güncellemesi yap
                </Checkbox>
              )}
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
