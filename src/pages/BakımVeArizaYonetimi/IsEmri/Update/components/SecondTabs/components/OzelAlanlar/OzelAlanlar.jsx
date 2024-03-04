import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input, InputNumber } from "antd";
import AxiosInstance from "../../../../../../../../api/http";
import OzelAlan1 from "./components/OzelAlan1";
import OzelAlan2 from "./components/OzelAlan2";
import OzelAlan3 from "./components/OzelAlan3";
import OzelAlan4 from "./components/OzelAlan4";
import OzelAlan5 from "./components/OzelAlan5";
import OzelAlan6 from "./components/OzelAlan6";
import OzelAlan7 from "./components/OzelAlan7";
import OzelAlan8 from "./components/OzelAlan8";
import OzelAlan9 from "./components/OzelAlan9";
import OzelAlan10 from "./components/OzelAlan10";
import OzelAlan11 from "./components/OzelAlan11";
import OzelAlan12 from "./components/OzelAlan12";
import OzelAlan13 from "./components/OzelAlan13";
import OzelAlan14 from "./components/OzelAlan14";
import OzelAlan15 from "./components/OzelAlan15";
import OzelAlan16 from "./components/OzelAlan16";
import OzelAlan17 from "./components/OzelAlan17";
import OzelAlan18 from "./components/OzelAlan18";
import OzelAlan19 from "./components/OzelAlan19";
import OzelAlan20 from "./components/OzelAlan20";
import OzelAlanSelect11 from "./components/OzelAlanSelect11";
import OzelAlanSelect12 from "./components/OzelAlanSelect12";
import OzelAlanSelect13 from "./components/OzelAlanSelect13";
import OzelAlanSelect14 from "./components/OzelAlanSelect14";
import OzelAlanSelect15 from "./components/OzelAlanSelect15";

export default function OzelAlanlar() {
  const { control, watch, setValue } = useFormContext();
  const [label, setLabel] = useState("Yükleniyor..."); // Başlangıç değeri özel alanlar için
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  useEffect(() => {
    // API'den veri çekme işlemi
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get("OzelAlan?form=ISEMRI"); // API URL'niz
        setLabel(response); // Örneğin, API'den dönen yanıt doğrudan etiket olacak
      } catch (error) {
        console.error("API isteğinde hata oluştu:", error);
        setLabel("Hata! Veri yüklenemedi."); // Hata durumunda kullanıcıya bilgi verme
      }
    };

    fetchData();
  }, [refreshTrigger]); // Depend on refreshTrigger

  // Function to trigger refresh
  const triggerRefresh = () => {
    setRefreshTrigger((prev) => !prev); // Toggle to trigger useEffect
  };

  return (
    <div style={{ display: "flex", marginBottom: "20px" }}>
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "450px",
            marginBottom: "10px",
          }}>
          <OzelAlan1 label={label} onModalClose={triggerRefresh} />
          <Controller
            name="ozelAlan1"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text" // Set the type to "text" for name input
                style={{ width: "250px" }}
              />
            )}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "450px",
            marginBottom: "10px",
          }}>
          <OzelAlan2 label={label} onModalClose={triggerRefresh} />
          <Controller
            name="ozelAlan2"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text" // Set the type to "text" for name input
                style={{ width: "250px" }}
              />
            )}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "450px",
            marginBottom: "10px",
          }}>
          <OzelAlan3 label={label} onModalClose={triggerRefresh} />
          <Controller
            name="ozelAlan3"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text" // Set the type to "text" for name input
                style={{ width: "250px" }}
              />
            )}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "450px",
            marginBottom: "10px",
          }}>
          <OzelAlan4 label={label} onModalClose={triggerRefresh} />
          <Controller
            name="ozelAlan4"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text" // Set the type to "text" for name input
                style={{ width: "250px" }}
              />
            )}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "450px",
            marginBottom: "10px",
          }}>
          <OzelAlan5 label={label} onModalClose={triggerRefresh} />
          <Controller
            name="ozelAlan5"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text" // Set the type to "text" for name input
                style={{ width: "250px" }}
              />
            )}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "450px",
            marginBottom: "10px",
          }}>
          <OzelAlan6 label={label} onModalClose={triggerRefresh} />
          <Controller
            name="ozelAlan6"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text" // Set the type to "text" for name input
                style={{ width: "250px" }}
              />
            )}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "450px",
            marginBottom: "10px",
          }}>
          <OzelAlan7 label={label} onModalClose={triggerRefresh} />
          <Controller
            name="ozelAlan7"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text" // Set the type to "text" for name input
                style={{ width: "250px" }}
              />
            )}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "450px",
            marginBottom: "10px",
          }}>
          <OzelAlan8 label={label} onModalClose={triggerRefresh} />
          <Controller
            name="ozelAlan8"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text" // Set the type to "text" for name input
                style={{ width: "250px" }}
              />
            )}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "450px",
            marginBottom: "10px",
          }}>
          <OzelAlan9 label={label} onModalClose={triggerRefresh} />
          <Controller
            name="ozelAlan9"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text" // Set the type to "text" for name input
                style={{ width: "250px" }}
              />
            )}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "450px",
            marginBottom: "10px",
          }}>
          <OzelAlan10 label={label} onModalClose={triggerRefresh} />
          <Controller
            name="ozelAlan10"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text" // Set the type to "text" for name input
                style={{ width: "250px" }}
              />
            )}
          />
        </div>
      </div>
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "450px",
            marginBottom: "10px",
          }}>
          <OzelAlan11 label={label} onModalClose={triggerRefresh} />
          <OzelAlanSelect11 />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "450px",
            marginBottom: "10px",
          }}>
          <OzelAlan12 label={label} onModalClose={triggerRefresh} />
          <OzelAlanSelect12 />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "450px",
            marginBottom: "10px",
          }}>
          <OzelAlan13 label={label} onModalClose={triggerRefresh} />
          <OzelAlanSelect13 />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "450px",
            marginBottom: "10px",
          }}>
          <OzelAlan14 label={label} onModalClose={triggerRefresh} />
          <OzelAlanSelect14 />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "450px",
            marginBottom: "10px",
          }}>
          <OzelAlan15 label={label} onModalClose={triggerRefresh} />
          <OzelAlanSelect15 />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "450px",
            marginBottom: "10px",
          }}>
          <OzelAlan16 label={label} onModalClose={triggerRefresh} />
          <Controller
            name="ozelAlan16"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                type="text" // Set the type to "text" for name InputNumber
                style={{ width: "250px" }}
              />
            )}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "450px",
            marginBottom: "10px",
          }}>
          <OzelAlan17 label={label} onModalClose={triggerRefresh} />
          <Controller
            name="ozelAlan17"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                type="text" // Set the type to "text" for name InputNumber
                style={{ width: "250px" }}
              />
            )}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "450px",
            marginBottom: "10px",
          }}>
          <OzelAlan18 label={label} onModalClose={triggerRefresh} />
          <Controller
            name="ozelAlan18"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                type="text" // Set the type to "text" for name InputNumber
                style={{ width: "250px" }}
              />
            )}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "450px",
            marginBottom: "10px",
          }}>
          <OzelAlan19 label={label} onModalClose={triggerRefresh} />
          <Controller
            name="ozelAlan19"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                type="text" // Set the type to "text" for name InputNumber
                style={{ width: "250px" }}
              />
            )}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "450px",
            marginBottom: "10px",
          }}>
          <OzelAlan20 label={label} onModalClose={triggerRefresh} />
          <Controller
            name="ozelAlan20"
            control={control}
            render={({ field }) => <InputNumber {...field} changeOnWheel={false} style={{ width: "250px" }} />}
          />
        </div>
      </div>
    </div>
  );
}
