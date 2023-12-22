import { Col, Input, Row, Typography } from "antd";
import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import OzelAlan_11 from "./components/OzelAlan_11.jsx";
import OzelAlan_12 from "./components/OzelAlan_12.jsx";
import OzelAlan_13 from "./components/OzelAlan_13.jsx";
import OzelAlan_14 from "./components/OzelAlan_14.jsx";
import OzelAlan_15 from "./components/OzelAlan_15.jsx";
const { Text } = Typography;

export default function CustomFields() {
  const { control, setValue, watch } = useFormContext();

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px"}}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "10px",
            maxWidth: "400px",
            justifyContent: "space-between",
          }}>
          <Text>Özel Alan 1</Text>
          <Controller
            name="ozelAlan_1"
            control={control}
            render={({ field }) => <Input {...field} style={{ width: "300px" }} />}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "10px",
            maxWidth: "400px",
            justifyContent: "space-between",
          }}>
          <Text>Özel Alan 2</Text>
          <Controller
            name="ozelAlan_2"
            control={control}
            render={({ field }) => <Input {...field} style={{ width: "300px" }} />}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "10px",
            maxWidth: "400px",
            justifyContent: "space-between",
          }}>
          <Text>Özel Alan 3</Text>
          <Controller
            name="ozelAlan_3"
            control={control}
            render={({ field }) => <Input {...field} style={{ width: "300px" }} />}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "10px",
            maxWidth: "400px",
            justifyContent: "space-between",
          }}>
          <Text>Özel Alan 4</Text>
          <Controller
            name="ozelAlan_4"
            control={control}
            render={({ field }) => <Input {...field} style={{ width: "300px" }} />}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "10px",
            maxWidth: "400px",
            justifyContent: "space-between",
          }}>
          <Text>Özel Alan 5</Text>
          <Controller
            name="ozelAlan_5"
            control={control}
            render={({ field }) => <Input {...field} style={{ width: "300px" }} />}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "10px",
            maxWidth: "400px",
            justifyContent: "space-between",
          }}>
          <Text>Özel Alan 6</Text>
          <Controller
            name="ozelAlan_6"
            control={control}
            render={({ field }) => <Input {...field} style={{ width: "300px" }} />}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "10px",
            maxWidth: "400px",
            justifyContent: "space-between",
          }}>
          <Text>Özel Alan 7</Text>
          <Controller
            name="ozelAlan_7"
            control={control}
            render={({ field }) => <Input {...field} style={{ width: "300px" }} />}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "10px",
            maxWidth: "400px",
            justifyContent: "space-between",
          }}>
          <Text>Özel Alan 8</Text>
          <Controller
            name="ozelAlan_8"
            control={control}
            render={({ field }) => <Input {...field} style={{ width: "300px" }} />}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "10px",
            maxWidth: "400px",
            justifyContent: "space-between",
          }}>
          <Text>Özel Alan 9</Text>
          <Controller
            name="ozelAlan_9"
            control={control}
            render={({ field }) => <Input {...field} style={{ width: "300px" }} />}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "10px",
            maxWidth: "400px",
            justifyContent: "space-between",
          }}>
          <Text>Özel Alan 10</Text>
          <Controller
            name="ozelAlan_10"
            control={control}
            render={({ field }) => <Input {...field} style={{ width: "300px" }} />}
          />
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "10px",
            maxWidth: "400px",
            justifyContent: "space-between",
          }}>
         <OzelAlan_11 />
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "10px",
            maxWidth: "400px",
            justifyContent: "space-between",
          }}>
          <OzelAlan_12 />
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "10px",
            maxWidth: "400px",
            justifyContent: "space-between",
          }}>
          <OzelAlan_13 />
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "10px",
            maxWidth: "400px",
            justifyContent: "space-between",
          }}>
          <OzelAlan_14 />
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "10px",
            maxWidth: "400px",
            justifyContent: "space-between",
          }}>
          <OzelAlan_15 />
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "10px",
            maxWidth: "400px",
            justifyContent: "space-between",
          }}>
          <Text>Özel Alan 16</Text>
          <Controller
            name="ozelAlan_16"
            control={control}
            render={({ field: { onChange, ...restField } }) => (
              <Input
                {...restField}
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
            gap: "10px",
            maxWidth: "400px",
            justifyContent: "space-between",
          }}>
          <Text>Özel Alan 17</Text>
          <Controller
            name="ozelAlan_17"
            control={control}
            render={({ field: { onChange, ...restField } }) => (
              <Input
                {...restField}
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
            gap: "10px",
            maxWidth: "400px",
            justifyContent: "space-between",
          }}>
          <Text>Özel Alan 18</Text>
          <Controller
            name="ozelAlan_18"
            control={control}
            render={({ field: { onChange, ...restField } }) => (
              <Input
                {...restField}
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
            gap: "10px",
            maxWidth: "400px",
            justifyContent: "space-between",
          }}>
          <Text>Özel Alan 19</Text>
          <Controller
            name="ozelAlan_19"
            control={control}
            render={({ field: { onChange, ...restField } }) => (
              <Input
                {...restField}
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
            gap: "10px",
            maxWidth: "400px",
            justifyContent: "space-between",
          }}>
          <Text>Özel Alan 20</Text>
          <Controller
            name="ozelAlan_20"
            control={control}
            render={({ field: { onChange, ...restField } }) => (
              <Input
                {...restField}
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
      </div>
    </div>
  );
}
