import { Col, Input, Row, Typography } from "antd";
import React from "react";
import { useFormContext, Controller } from "react-hook-form";
const { Text } = Typography;

export default function CustomFields() {
  const { control, setValue, watch } = useFormContext();

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
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
            name="custom_field_1"
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
            name="custom_field_2"
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
            name="custom_field_3"
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
            name="custom_field_4"
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
            name="custom_field_5"
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
            name="custom_field_6"
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
            name="custom_field_7"
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
            name="custom_field_8"
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
            name="custom_field_9"
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
            name="custom_field_10"
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
          <Text>Özel Alan 11</Text>
          <Controller
            name="custom_field_11"
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
          <Text>Özel Alan 12</Text>
          <Controller
            name="custom_field_12"
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
          <Text>Özel Alan 13</Text>
          <Controller
            name="custom_field_13"
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
          <Text>Özel Alan 14</Text>
          <Controller
            name="custom_field_14"
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
          <Text>Özel Alan 15</Text>
          <Controller
            name="custom_field_15"
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
          <Text>Özel Alan 16</Text>
          <Controller
            name="custom_field_16"
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
            name="custom_field_17"
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
            name="custom_field_18"
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
            name="custom_field_19"
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
            name="custom_field_20"
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
