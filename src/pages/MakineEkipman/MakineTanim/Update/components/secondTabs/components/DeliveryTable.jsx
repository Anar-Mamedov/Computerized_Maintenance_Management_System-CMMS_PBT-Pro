import React, { useEffect, useCallback } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Checkbox, Table } from "antd";
import AxiosInstance from "../../../../../../../api/http";

export default function DeliveryTable() {
  const { control, watch } = useFormContext();
  const { fields, append, replace } = useFieldArray({
    control,
    name: "SayacListesi",
  });

  const selectedMakineID = watch("secilenMakineID");

  const fetchSayacData = useCallback(async () => {
    try {
      const response = await AxiosInstance.get(`makinebakim/GetByMakine?MakineID=${selectedMakineID}`);
      const apiData = response; // Assuming 'data' contains the array
      replace(
        apiData.map((item) => {
          // Extracting the nested MAB_IS_TANIM object
          const isTanim = item.MAB_IS_TANIM;
          return {
            key: isTanim ? isTanim.TB_IS_TANIM_ID : undefined,
            bakimKodu: isTanim ? isTanim.IST_KOD : "",
            bakimTanim: isTanim ? isTanim.IST_TANIM : "",
            bakimTipi: isTanim ? isTanim.IST_TIP : "",
            bakimGrubu: isTanim ? isTanim.IST_GRUP : "",
            sonUygulamaTarihi: item.TB_IS_TANIM_SON_UYGULAMA_TARIHI, // ? name bulamadim
            maddeSayisi: isTanim ? isTanim.IST_KONTROL_SAYI : 0,
            sonUygulayan: item.TB_IS_TANIM_SON_UYGULAYAN, // ? name bulamadim
            // Diğer alanlar
          };
        })
      );
    } catch (error) {
      console.error("API isteği sırasında bir hata oluştu:", error);
      // Hata işleme stratejileri burada yer alabilir
    }
  }, [selectedMakineID, replace]);

  useEffect(() => {
    if (selectedMakineID) {
      fetchSayacData();
    }
  }, [selectedMakineID, fetchSayacData]);

  const columns = [
    {
      title: <div style={{ textAlign: "center" }}>Bakım Kodu</div>,
      dataIndex: "bakimKodu",
      key: "bakimKodu",
      ellipsis: true,
      width: 250,
    },
    {
      title: <div style={{ textAlign: "center" }}>Bakım Tanım</div>,
      dataIndex: "bakimTanim",
      key: "bakimTanim",
      ellipsis: true,
      width: 150,
    },
    {
      title: <div style={{ textAlign: "center" }}>Bakım Tipi</div>,
      dataIndex: "bakimTipi",
      key: "bakimTipi",
      ellipsis: true,
      width: 150,
    },
    {
      title: <div style={{ textAlign: "center" }}>Bakım Grubu</div>,
      dataIndex: "bakimGrubu",
      key: "bakimGrubu",
      ellipsis: true,
      width: 150,
    },
    {
      title: <div style={{ textAlign: "center" }}>Son Uygulama Tarihi</div>,
      dataIndex: "sonUygulamaTarihi",
      key: "sonUygulamaTarihi",
      align: "center",
      ellipsis: true,
      width: 150,
    },
    {
      title: <div style={{ textAlign: "center" }}>Madde Sayısı</div>,
      dataIndex: "maddeSayisi",
      key: "maddeSayisi",
      align: "center",
      ellipsis: true,
      width: 110,
    },
    {
      title: <div style={{ textAlign: "center" }}>Son Uygulayan</div>,
      dataIndex: "sonUygulayan",
      key: "sonUygulayan",
      align: "right",
      ellipsis: true,
      width: 120,
    },
    // Diğer sütunlar
  ];

  return (
    <Table
      dataSource={fields}
      columns={columns}
      rowKey="key"
      scroll={{
        // x: "auto",
        y: "calc(100vh - 60px)",
      }}
    />
  );
}
