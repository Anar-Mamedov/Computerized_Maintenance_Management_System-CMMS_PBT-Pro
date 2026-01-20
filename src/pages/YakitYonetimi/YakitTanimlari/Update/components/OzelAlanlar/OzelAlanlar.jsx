import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Drawer, Typography, Button, Input, Select, DatePicker, TimePicker, Row, Col, Checkbox, InputNumber, Radio, ColorPicker, Switch, Modal } from "antd";
import AxiosInstance from "../../../../../../api/http";
import FreeTextInput from "../../../../../../utils/components/FreeTextInput";
import OzelAlanIsimDuzenle from "../../../../../../utils/components/OzelAlanIsimDuzenle";
import KodIDSelectbox from "../../../../../../utils/components/KodIDSelectbox";
import NumberInput from "../../../../../../utils/components/NumberInput";
import { t } from "i18next";

const { Text, Link } = Typography;
const { TextArea } = Input;

function OzelAlanlar() {
  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  const [label, setLabel] = useState("Yükleniyor..."); // Başlangıç değeri özel alanlar için
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [selectedFieldNumber, setSelectedFieldNumber] = useState("");

  const fetchData = async () => {
    try {
      const response = await AxiosInstance.get("OzelAlan?form=STOK"); // API URL'niz
      setLabel(response); // Örneğin, API'den dönen yanıt doğrudan etiket olacak
    } catch (error) {
      console.error("API isteğinde hata oluştu:", error);
      setLabel("Hata! Veri yüklenemedi."); // Hata durumunda kullanıcıya bilgi verme
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const handleModalToggle = (labelValue, fieldNumber) => {
    setSelectedLabel(labelValue);
    setSelectedFieldNumber(fieldNumber);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedLabel("");
    setSelectedFieldNumber("");
  };

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "380px" }}>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "center",
              width: "100%",
              maxWidth: "380px",
              justifyContent: "space-between",
              gap: "8px",
              flexDirection: "row",
            }}
          >
            <Text style={{ fontSize: "14px", color: "#000000a4", display: "flex", cursor: "pointer" }} onClick={() => handleModalToggle(label.OZL_OZEL_ALAN_1, "1")}>
              {label.OZL_OZEL_ALAN_1}
            </Text>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                width: "100%",
                maxWidth: "250px",
                flexDirection: "column",
              }}
            >
              <FreeTextInput name1="ozelAlan1" isRequired={false} />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "center",
              width: "100%",
              maxWidth: "380px",
              justifyContent: "space-between",
              gap: "8px",
              flexDirection: "row",
            }}
          >
            <Text style={{ fontSize: "14px", color: "#000000a4", display: "flex", cursor: "pointer" }} onClick={() => handleModalToggle(label.OZL_OZEL_ALAN_2, "2")}>
              {label.OZL_OZEL_ALAN_2}
            </Text>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                width: "100%",
                maxWidth: "250px",
                flexDirection: "column",
              }}
            >
              <FreeTextInput name1="ozelAlan2" isRequired={false} />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "center",
              width: "100%",
              maxWidth: "380px",
              justifyContent: "space-between",
              gap: "8px",
              flexDirection: "row",
            }}
          >
            <Text style={{ fontSize: "14px", color: "#000000a4", display: "flex", cursor: "pointer" }} onClick={() => handleModalToggle(label.OZL_OZEL_ALAN_3, "3")}>
              {label.OZL_OZEL_ALAN_3}
            </Text>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                width: "100%",
                maxWidth: "250px",
                flexDirection: "column",
              }}
            >
              <FreeTextInput name1="ozelAlan3" isRequired={false} />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "center",
              width: "100%",
              maxWidth: "380px",
              justifyContent: "space-between",
              gap: "8px",
              flexDirection: "row",
            }}
          >
            <Text style={{ fontSize: "14px", color: "#000000a4", display: "flex", cursor: "pointer" }} onClick={() => handleModalToggle(label.OZL_OZEL_ALAN_4, "4")}>
              {label.OZL_OZEL_ALAN_4}
            </Text>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                width: "100%",
                maxWidth: "250px",
                flexDirection: "column",
              }}
            >
              <FreeTextInput name1="ozelAlan4" isRequired={false} />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "center",
              width: "100%",
              maxWidth: "380px",
              justifyContent: "space-between",
              gap: "8px",
              flexDirection: "row",
            }}
          >
            <Text style={{ fontSize: "14px", color: "#000000a4", display: "flex", cursor: "pointer" }} onClick={() => handleModalToggle(label.OZL_OZEL_ALAN_5, "5")}>
              {label.OZL_OZEL_ALAN_5}
            </Text>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                width: "100%",
                maxWidth: "250px",
                flexDirection: "column",
              }}
            >
              <FreeTextInput name1="ozelAlan5" isRequired={false} />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "center",
              width: "100%",
              maxWidth: "380px",
              justifyContent: "space-between",
              gap: "8px",
              flexDirection: "row",
            }}
          >
            <Text style={{ fontSize: "14px", color: "#000000a4", display: "flex", cursor: "pointer" }} onClick={() => handleModalToggle(label.OZL_OZEL_ALAN_6, "6")}>
              {label.OZL_OZEL_ALAN_6}
            </Text>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                width: "100%",
                maxWidth: "250px",
                flexDirection: "column",
              }}
            >
              <FreeTextInput name1="ozelAlan6" isRequired={false} />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "center",
              width: "100%",
              maxWidth: "380px",
              justifyContent: "space-between",
              gap: "8px",
              flexDirection: "row",
            }}
          >
            <Text style={{ fontSize: "14px", color: "#000000a4", display: "flex", cursor: "pointer" }} onClick={() => handleModalToggle(label.OZL_OZEL_ALAN_7, "7")}>
              {label.OZL_OZEL_ALAN_7}
            </Text>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                width: "100%",
                maxWidth: "250px",
                flexDirection: "column",
              }}
            >
              <FreeTextInput name1="ozelAlan7" isRequired={false} />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "center",
              width: "100%",
              maxWidth: "380px",
              justifyContent: "space-between",
              gap: "8px",
              flexDirection: "row",
            }}
          >
            <Text style={{ fontSize: "14px", color: "#000000a4", display: "flex", cursor: "pointer" }} onClick={() => handleModalToggle(label.OZL_OZEL_ALAN_8, "8")}>
              {label.OZL_OZEL_ALAN_8}
            </Text>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                width: "100%",
                maxWidth: "250px",
                flexDirection: "column",
              }}
            >
              <FreeTextInput name1="ozelAlan8" isRequired={false} />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "center",
              width: "100%",
              maxWidth: "380px",
              justifyContent: "space-between",
              gap: "8px",
              flexDirection: "row",
            }}
          >
            <Text style={{ fontSize: "14px", color: "#000000a4", display: "flex", cursor: "pointer" }} onClick={() => handleModalToggle(label.OZL_OZEL_ALAN_9, "9")}>
              {label.OZL_OZEL_ALAN_9}
            </Text>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                width: "100%",
                maxWidth: "250px",
                flexDirection: "column",
              }}
            >
              <FreeTextInput name1="ozelAlan9" isRequired={false} />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "center",
              width: "100%",
              maxWidth: "380px",
              justifyContent: "space-between",
              gap: "8px",
              flexDirection: "row",
            }}
          >
            <Text style={{ fontSize: "14px", color: "#000000a4", display: "flex", cursor: "pointer" }} onClick={() => handleModalToggle(label.OZL_OZEL_ALAN_10, "10")}>
              {label.OZL_OZEL_ALAN_10}
            </Text>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                width: "100%",
                maxWidth: "250px",
                flexDirection: "column",
              }}
            >
              <FreeTextInput name1="ozelAlan10" isRequired={false} />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "380px" }}>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "center",
              width: "100%",
              maxWidth: "380px",
              justifyContent: "space-between",
              gap: "8px",
              flexDirection: "row",
            }}
          >
            <Text style={{ fontSize: "14px", color: "#000000a4", display: "flex", cursor: "pointer" }} onClick={() => handleModalToggle(label.OZL_OZEL_ALAN_11, "11")}>
              {label.OZL_OZEL_ALAN_11}
            </Text>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                width: "100%",
                maxWidth: "250px",
                flexDirection: "column",
              }}
            >
              <KodIDSelectbox name1="ozelAlan11" isRequired={false} kodID="50005" />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "center",
              width: "100%",
              maxWidth: "380px",
              justifyContent: "space-between",
              gap: "8px",
              flexDirection: "row",
            }}
          >
            <Text style={{ fontSize: "14px", color: "#000000a4", display: "flex", cursor: "pointer" }} onClick={() => handleModalToggle(label.OZL_OZEL_ALAN_12, "12")}>
              {label.OZL_OZEL_ALAN_12}
            </Text>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                width: "100%",
                maxWidth: "250px",
                flexDirection: "column",
              }}
            >
              <KodIDSelectbox name1="ozelAlan12" isRequired={false} kodID="50006" />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "center",
              width: "100%",
              maxWidth: "380px",
              justifyContent: "space-between",
              gap: "8px",
              flexDirection: "row",
            }}
          >
            <Text style={{ fontSize: "14px", color: "#000000a4", display: "flex", cursor: "pointer" }} onClick={() => handleModalToggle(label.OZL_OZEL_ALAN_13, "13")}>
              {label.OZL_OZEL_ALAN_13}
            </Text>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                width: "100%",
                maxWidth: "250px",
                flexDirection: "column",
              }}
            >
              <KodIDSelectbox name1="ozelAlan13" isRequired={false} kodID="50007" />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "center",
              width: "100%",
              maxWidth: "380px",
              justifyContent: "space-between",
              gap: "8px",
              flexDirection: "row",
            }}
          >
            <Text style={{ fontSize: "14px", color: "#000000a4", display: "flex", cursor: "pointer" }} onClick={() => handleModalToggle(label.OZL_OZEL_ALAN_14, "14")}>
              {label.OZL_OZEL_ALAN_14}
            </Text>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                width: "100%",
                maxWidth: "250px",
                flexDirection: "column",
              }}
            >
              <KodIDSelectbox name1="ozelAlan14" isRequired={false} kodID="50008" />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "center",
              width: "100%",
              maxWidth: "380px",
              justifyContent: "space-between",
              gap: "8px",
              flexDirection: "row",
            }}
          >
            <Text style={{ fontSize: "14px", color: "#000000a4", display: "flex", cursor: "pointer" }} onClick={() => handleModalToggle(label.OZL_OZEL_ALAN_15, "15")}>
              {label.OZL_OZEL_ALAN_15}
            </Text>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                width: "100%",
                maxWidth: "250px",
                flexDirection: "column",
              }}
            >
              <KodIDSelectbox name1="ozelAlan15" isRequired={false} kodID="50009" />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "center",
              width: "100%",
              maxWidth: "380px",
              justifyContent: "space-between",
              gap: "8px",
              flexDirection: "row",
            }}
          >
            <Text style={{ fontSize: "14px", color: "#000000a4", display: "flex", cursor: "pointer" }} onClick={() => handleModalToggle(label.OZL_OZEL_ALAN_16, "16")}>
              {label.OZL_OZEL_ALAN_16}
            </Text>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                width: "100%",
                maxWidth: "250px",
                flexDirection: "column",
              }}
            >
              <NumberInput name1="ozelAlan16" isRequired={false} minNumber={0} />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "center",
              width: "100%",
              maxWidth: "380px",
              justifyContent: "space-between",
              gap: "8px",
              flexDirection: "row",
            }}
          >
            <Text style={{ fontSize: "14px", color: "#000000a4", display: "flex", cursor: "pointer" }} onClick={() => handleModalToggle(label.OZL_OZEL_ALAN_17, "17")}>
              {label.OZL_OZEL_ALAN_17}
            </Text>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                width: "100%",
                maxWidth: "250px",
                flexDirection: "column",
              }}
            >
              <NumberInput name1="ozelAlan17" isRequired={false} minNumber={0} />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "center",
              width: "100%",
              maxWidth: "380px",
              justifyContent: "space-between",
              gap: "8px",
              flexDirection: "row",
            }}
          >
            <Text style={{ fontSize: "14px", color: "#000000a4", display: "flex", cursor: "pointer" }} onClick={() => handleModalToggle(label.OZL_OZEL_ALAN_18, "18")}>
              {label.OZL_OZEL_ALAN_18}
            </Text>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                width: "100%",
                maxWidth: "250px",
                flexDirection: "column",
              }}
            >
              <NumberInput name1="ozelAlan18" isRequired={false} minNumber={0} />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "center",
              width: "100%",
              maxWidth: "380px",
              justifyContent: "space-between",
              gap: "8px",
              flexDirection: "row",
            }}
          >
            <Text style={{ fontSize: "14px", color: "#000000a4", display: "flex", cursor: "pointer" }} onClick={() => handleModalToggle(label.OZL_OZEL_ALAN_19, "19")}>
              {label.OZL_OZEL_ALAN_19}
            </Text>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                width: "100%",
                maxWidth: "250px",
                flexDirection: "column",
              }}
            >
              <NumberInput name1="ozelAlan19" isRequired={false} minNumber={0} />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "center",
              width: "100%",
              maxWidth: "380px",
              justifyContent: "space-between",
              gap: "8px",
              flexDirection: "row",
            }}
          >
            <Text style={{ fontSize: "14px", color: "#000000a4", display: "flex", cursor: "pointer" }} onClick={() => handleModalToggle(label.OZL_OZEL_ALAN_20, "20")}>
              {label.OZL_OZEL_ALAN_20}
            </Text>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                width: "100%",
                maxWidth: "250px",
                flexDirection: "column",
              }}
            >
              <NumberInput name1="ozelAlan20" isRequired={false} minNumber={0} />
            </div>
          </div>
        </div>
      </div>

      <Modal title={t("ozelAlanDuzenle")} open={isModalOpen} onCancel={handleModalClose} footer={null}>
        <OzelAlanIsimDuzenle
          labelValue={selectedLabel}
          fieldNumber={selectedFieldNumber}
          OzelForm="STOK"
          onClose={handleModalClose}
          onSuccess={() => {
            handleModalClose();
            setRefreshTrigger((prev) => !prev);
          }}
        />
      </Modal>
    </div>
  );
}

export default OzelAlanlar;
