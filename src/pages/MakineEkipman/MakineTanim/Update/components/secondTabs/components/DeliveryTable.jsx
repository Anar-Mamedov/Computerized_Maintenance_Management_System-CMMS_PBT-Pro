import React from "react";
import { useForm, Controller, useFormContext } from "react-hook-form";
import { InputNumber, Typography } from "antd";

const { Text } = Typography;

export default function DeliveryTable() {
  const { control, watch, setValue } = useFormContext();
  return (
    <div>
      <div style={{ maxWidth: "390px" }}>
        <div style={{ width: "100%", borderBottom: "1px solid #8080805d", marginBottom: "10px" }}>
          <Text style={{ color: "rgb(0, 132, 255)" }}>Maliyetler</Text>
        </div>
        <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
          <div style={{ width: "210px", display: "flex", gap: "10px" }}>
            <Text style={{ width: "100px" }}>Gerçekleşen</Text>
            <Text style={{ width: "100px" }}>Öngörülen</Text>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "10px",
            maxWidth: "380px",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}>
          <Text>Malzeme Maliyeti</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
              justifyContent: "space-between",
              width: "210px",
            }}>
            <Controller
              name="realisedMaterialCost"
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  min={0} // minimum value
                  max={9999.999} // maximum value (example)
                  precision={3} // precision up to 3 decimal places
                  step={0.001} // step size
                  style={{ width: 100 }} // style the input as needed
                />
              )}
            />
            <Controller
              name="predictedMaterialCost"
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  min={0} // minimum value
                  max={9999.999} // maximum value (example)
                  precision={3} // precision up to 3 decimal places
                  step={0.001} // step size
                  style={{ width: 100 }} // style the input as needed
                  disabled
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
            gap: "10px",
            maxWidth: "380px",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}>
          <Text>İşçilik Maliyeti</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
              justifyContent: "space-between",
              width: "210px",
            }}>
            <Controller
              name="realisedLabourCost"
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  min={0} // minimum value
                  max={9999.999} // maximum value (example)
                  precision={3} // precision up to 3 decimal places
                  step={0.001} // step size
                  style={{ width: 100 }} // style the input as needed
                />
              )}
            />
            <Controller
              name="predictedLabourCost"
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  min={0} // minimum value
                  max={9999.999} // maximum value (example)
                  precision={3} // precision up to 3 decimal places
                  step={0.001} // step size
                  style={{ width: 100 }} // style the input as needed
                  disabled
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
            gap: "10px",
            maxWidth: "380px",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}>
          <Text>Dış Servis Maliyeti</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
              justifyContent: "space-between",
              width: "210px",
            }}>
            <Controller
              name="realisedExternalServiceCost"
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  min={0} // minimum value
                  max={9999.999} // maximum value (example)
                  precision={3} // precision up to 3 decimal places
                  step={0.001} // step size
                  style={{ width: 100 }} // style the input as needed
                />
              )}
            />
            <Controller
              name="predictedExternalServiceCost"
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  min={0} // minimum value
                  max={9999.999} // maximum value (example)
                  precision={3} // precision up to 3 decimal places
                  step={0.001} // step size
                  style={{ width: 100 }} // style the input as needed
                  disabled
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
            gap: "10px",
            maxWidth: "380px",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}>
          <Text>Genel Giderler</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
              justifyContent: "space-between",
              width: "210px",
            }}>
            <Controller
              name="realisedGeneralExpenses"
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  min={0} // minimum value
                  max={9999.999} // maximum value (example)
                  precision={3} // precision up to 3 decimal places
                  step={0.001} // step size
                  style={{ width: 100 }} // style the input as needed
                />
              )}
            />
            <Controller
              name="predictedGeneralExpenses"
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  min={0} // minimum value
                  max={9999.999} // maximum value (example)
                  precision={3} // precision up to 3 decimal places
                  step={0.001} // step size
                  style={{ width: 100 }} // style the input as needed
                  disabled
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
            gap: "10px",
            maxWidth: "380px",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}>
          <Text>İndirim</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
              justifyContent: "space-between",
              width: "210px",
            }}>
            <Controller
              name="realisedDiscount"
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  min={0} // minimum value
                  max={9999.999} // maximum value (example)
                  precision={3} // precision up to 3 decimal places
                  step={0.001} // step size
                  style={{ width: 100 }} // style the input as needed
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
            gap: "10px",
            maxWidth: "380px",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}>
          <Text>KDV Tutarı</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
              justifyContent: "space-between",
              width: "210px",
            }}>
            <Controller
              name="realisedKDV"
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  min={0} // minimum value
                  max={9999.999} // maximum value (example)
                  precision={3} // precision up to 3 decimal places
                  step={0.001} // step size
                  style={{ width: 100 }} // style the input as needed
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
            gap: "10px",
            maxWidth: "380px",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}>
          <Text>Toplam Maliyet</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
              justifyContent: "space-between",
              width: "210px",
            }}>
            <Controller
              name="realisedTotalCost"
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  min={0} // minimum value
                  max={9999.999} // maximum value (example)
                  precision={3} // precision up to 3 decimal places
                  step={0.001} // step size
                  style={{ width: 100 }} // style the input as needed
                  disabled
                />
              )}
            />
            <Controller
              name="predictedTotalCost"
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  min={0} // minimum value
                  max={9999.999} // maximum value (example)
                  precision={3} // precision up to 3 decimal places
                  step={0.001} // step size
                  style={{ width: 100 }} // style the input as needed
                  disabled
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
