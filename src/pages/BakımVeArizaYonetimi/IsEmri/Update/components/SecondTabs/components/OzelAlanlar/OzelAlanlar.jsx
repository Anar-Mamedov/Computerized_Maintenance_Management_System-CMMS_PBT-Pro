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
  const layoutStyle = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "20px",
  };
  const columnStyle = {
    flex: "1 1 420px",
    maxWidth: "450px",
  };
  const rowStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: "450px",
    marginBottom: "10px",
  };

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

  const renderFieldRow = (key, LabelComponent, inputNode) => (
    <div key={key} style={rowStyle}>
      <LabelComponent label={label} onModalClose={triggerRefresh} />
      {inputNode}
    </div>
  );

  const renderTextInput = (name) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Input
          {...field}
          type="text"
          style={{ width: "250px" }}
        />
      )}
    />
  );

  const renderNumberInput = (name, extraProps = {}) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => <InputNumber {...field} style={{ width: "250px" }} {...extraProps} />}
    />
  );

  return (
    <div style={layoutStyle}>
      <div style={columnStyle}>
        {renderFieldRow("ozelAlan1", OzelAlan1, renderTextInput("ozelAlan1"))}
        {renderFieldRow("ozelAlan2", OzelAlan2, renderTextInput("ozelAlan2"))}
        {renderFieldRow("ozelAlan3", OzelAlan3, renderTextInput("ozelAlan3"))}
        {renderFieldRow("ozelAlan4", OzelAlan4, renderTextInput("ozelAlan4"))}
        {renderFieldRow("ozelAlan5", OzelAlan5, renderTextInput("ozelAlan5"))}
        {renderFieldRow("ozelAlan6", OzelAlan6, renderTextInput("ozelAlan6"))}
        {renderFieldRow("ozelAlan7", OzelAlan7, renderTextInput("ozelAlan7"))}
      </div>

      <div style={columnStyle}>
        {renderFieldRow("ozelAlan8", OzelAlan8, renderTextInput("ozelAlan8"))}
        {renderFieldRow("ozelAlan9", OzelAlan9, renderTextInput("ozelAlan9"))}
        {renderFieldRow("ozelAlan10", OzelAlan10, renderTextInput("ozelAlan10"))}
        {renderFieldRow("ozelAlan11", OzelAlan11, <OzelAlanSelect11 />)}
        {renderFieldRow("ozelAlan12", OzelAlan12, <OzelAlanSelect12 />)}
        {renderFieldRow("ozelAlan13", OzelAlan13, <OzelAlanSelect13 />)}
        {renderFieldRow("ozelAlan14", OzelAlan14, <OzelAlanSelect14 />)}
      </div>

      <div style={columnStyle}>
        {renderFieldRow("ozelAlan15", OzelAlan15, <OzelAlanSelect15 />)}
        {renderFieldRow("ozelAlan16", OzelAlan16, renderNumberInput("ozelAlan16"))}
        {renderFieldRow("ozelAlan17", OzelAlan17, renderNumberInput("ozelAlan17"))}
        {renderFieldRow("ozelAlan18", OzelAlan18, renderNumberInput("ozelAlan18"))}
        {renderFieldRow("ozelAlan19", OzelAlan19, renderNumberInput("ozelAlan19"))}
        {renderFieldRow("ozelAlan20", OzelAlan20, renderNumberInput("ozelAlan20", { changeOnWheel: false }))}
      </div>
    </div>
  );
}
