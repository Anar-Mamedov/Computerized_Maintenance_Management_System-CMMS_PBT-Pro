import React from "react";
import { Button, Modal, Input, Typography, Tabs, message } from "antd";
import AxiosInstance from "../../../../../../../../../../api/http";

const { Text } = Typography;

import {
  Controller,
  useForm,
  FormProvider,
  useFormContext,
} from "react-hook-form";

function PeryotBakimBilgileriEkle(props) {
  const { control, watch, setValue } = useFormContext();

  return (
    <div>
      <div>
        <Text style={{ color: "#1677ff" }}>Makine Bilgileri</Text>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            borderTop: "1px solid #80808030",
            paddingTop: "10px",
            gap: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: "14px" }}>Makine Kodu:</Text>
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
                name="makineKodu"
                control={control}
                render={({ field }) => (
                  <Input {...field} disabled style={{ flex: 1 }} />
                )}
              />
              <Controller
                name="makineID"
                control={control}
                render={({ field }) => (
                  <Input {...field} style={{ flex: 1, display: "none" }} />
                )}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: "14px" }}>Makine Tanımı:</Text>
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
                render={({ field }) => (
                  <Input {...field} disabled style={{ flex: 1 }} />
                )}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: "14px" }}>Makine Lokasyon:</Text>
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
                name="makineLokasyon"
                control={control}
                render={({ field }) => (
                  <Input {...field} disabled style={{ flex: 1 }} />
                )}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: "14px" }}>Makine Tipi:</Text>
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
                name="makineTipi"
                control={control}
                render={({ field }) => (
                  <Input {...field} disabled style={{ flex: 1 }} />
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <div>Tarih Bilgileri</div>
      <div>Sayaç Bilgileri</div>
    </div>
  );
}

export default PeryotBakimBilgileriEkle;
