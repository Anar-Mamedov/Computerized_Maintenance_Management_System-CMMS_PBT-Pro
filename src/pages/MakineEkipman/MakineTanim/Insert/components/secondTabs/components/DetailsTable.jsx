import React from "react";
import { useForm, Controller, useFormContext } from "react-hook-form";
import { InputNumber, Typography } from "antd";

const { Text } = Typography;

export default function DetailsTable() {
  const { control, watch, setValue } = useFormContext();
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
      }}>
      <div style={{ maxWidth: "280px" }}>
        <div style={{ width: "100%", borderBottom: "1px solid #8080805d", marginBottom: "10px" }}>
          <Text style={{ color: "rgb(0, 132, 255)" }}>Müdahele Süresi</Text>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "10px",
            maxWidth: "280px",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}>
          <Text>Lojistik Süresi (dk.)</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
              justifyContent: "space-between",
            }}>
            <Controller
              name="logisticsDuration"
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
            maxWidth: "280px",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}>
          <Text>Seyahat Süresi (dk.)</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
              justifyContent: "space-between",
            }}>
            <Controller
              name="travellingDuration"
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
            maxWidth: "280px",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}>
          <Text>Onay Süresi (dk.)</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
              justifyContent: "space-between",
            }}>
            <Controller
              name="approvalDuration"
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
            maxWidth: "280px",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}>
          <Text>Bekleme Süresi (dk.)</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
              justifyContent: "space-between",
            }}>
            <Controller
              name="waitingDuration"
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
            maxWidth: "280px",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}>
          <Text>Diğer (dk.)</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
              justifyContent: "space-between",
            }}>
            <Controller
              name="otherDuration"
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
      </div>

      <div style={{ maxWidth: "280px" }}>
        <div style={{ width: "100%", borderBottom: "1px solid #8080805d", marginBottom: "10px" }}>
          <Text style={{ color: "rgb(0, 132, 255)" }}>Toplam İş Süresi</Text>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "10px",
            maxWidth: "280px",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}>
          <Text>Müdahele Süresi (dk.)</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
              justifyContent: "space-between",
            }}>
            <Controller
              name="interventionDuration"
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
            maxWidth: "280px",
            justifyContent: "space-between",
            marginBottom: "52px",
          }}>
          <Text>Çalışma Süresi (dk.)</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
              justifyContent: "space-between",
            }}>
            <Controller
              name="workingDuration"
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
            maxWidth: "280px",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}>
          <Text>Toplam İş Süresi</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "10px",
              justifyContent: "space-between",
            }}>
            <Controller
              name="totalWorkTime"
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
