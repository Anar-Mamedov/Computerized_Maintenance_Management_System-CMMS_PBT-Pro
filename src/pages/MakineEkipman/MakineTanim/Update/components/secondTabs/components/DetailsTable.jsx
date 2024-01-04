import React, { useEffect, useCallback } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Checkbox, Table } from "antd";
import AxiosInstance from "../../../../../../../api/http";
import dayjs from "dayjs";

export default function DetailsTable() {
  const { control, watch } = useFormContext();
  const { fields, append, replace } = useFieldArray({
    control,
    name: "SayacListesi",
  });

  const selectedMakineID = watch("secilenMakineID");

  const calculateRemainingTime = (targetDate) => {
    const now = dayjs();
    const target = dayjs(targetDate);
    const difference = target.diff(now, "minute"); // Difference in minutes

    // Check if the difference is negative
    if (difference < 0) {
      return ""; // Return an empty string for past dates
    }

    const hours = Math.floor(difference / 60);
    const minutes = difference % 60;

    return `${hours}h ${minutes}m`;
  };

  const fetchSayacData = useCallback(async () => {
    try {
      const response = await AxiosInstance.get(`PeriyodikBakimByMakine?MakineID=${selectedMakineID}`);
      const apiData = response;
      console.log("apiData", apiData);
      replace(
        apiData.map((item) => ({
          key: item.TB_PERIYODIK_BAKIM_ID,
          peryodikBakimKodu: item.PBK_KOD,
          peryodikBakim: item.PBK_TANIM,
          isEmriNo: item.PBK_ISEMRI_NO,
          sonUygulama: item.PBK_SON_UYGULAMA_TARIH,
          hedefTarih: item.PBK_HEDEF_UYGULAMA_TARIH,
          kalanSure: calculateRemainingTime(item.PBK_HEDEF_UYGULAMA_TARIH),
          sayac: item.TB_PERIYODIK_BAKIM_SAYAC, //? name bulamadim
          guncelSayac: item.PBK_GUNCEL_SAYAC_DEGERI,
          sonUygulanan: item.PBK_SON_UYGULAMA_TARIH, //? name bulamadim
          hedefSayac: item.PBK_HEDEF_SAYAC,
          kalanSayac: item.PBK_HEDEF_SAYAC - item.PBK_GUNCEL_SAYAC_DEGERI, // yukarıdaki iki alanın farkı
          kalanSayacYuzde: item.PBK_HEDEF_SAYAC - item.PBK_GUNCEL_SAYAC_DEGERI, // yukarıdaki iki alanın farkı yüzde olarak
          hatirlatmaSure: item.TB_PERIYODIK_BAKIM_HATIRLATMA_SURE, //? name bulamadim
          // Diğer alanlar
        }))
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
      title: <div style={{ textAlign: "center" }}>Periyodik Bakım Kodu</div>,
      dataIndex: "peryodikBakimKodu",
      key: "peryodikBakimKodu",
      ellipsis: true,
      width: 250,
    },
    {
      title: <div style={{ textAlign: "center" }}>Periyodik Bakım</div>,
      dataIndex: "peryodikBakim",
      key: "peryodikBakim",
      ellipsis: true,
      width: 150,
    },
    {
      title: <div style={{ textAlign: "center" }}>İş Emri No</div>,
      dataIndex: "isEmriNo",
      key: "isEmriNo",
      ellipsis: true,
      width: 150,
    },
    {
      title: <div style={{ textAlign: "center" }}>Son Uygulama</div>,
      dataIndex: "sonUygulama",
      key: "sonUygulama",
      align: "center",
      ellipsis: true,
      width: 150,
      render: (text) => {
        return dayjs(text).format("DD-MM-YYYY"); // Formats the date as "Day/Month/Year"
      },
    },
    {
      title: <div style={{ textAlign: "center" }}>Hedef Tarih</div>,
      dataIndex: "hedefTarih",
      key: "hedefTarih",
      align: "center",
      ellipsis: true,
      width: 120,
      render: (text) => {
        return dayjs(text).format("DD-MM-YYYY"); // Formats the date as "Day/Month/Year"
      },
    },
    {
      title: <div style={{ textAlign: "center" }}>Kalan Süre</div>,
      dataIndex: "kalanSure",
      key: "kalanSure",
      align: "right",
      ellipsis: true,
      width: 120,
    },

    {
      title: <div style={{ textAlign: "center" }}>Kalan Süre %</div>,
      dataIndex: "kalanSureYuzde",
      key: "kalanSureYuzde",
      align: "right",
      ellipsis: true,
      width: 120,
    },
    {
      title: <div style={{ textAlign: "center" }}>Sayaç</div>,
      dataIndex: "sayac",
      key: "sayac",
      ellipsis: true,
      width: 300,
    },
    {
      title: <div style={{ textAlign: "center" }}>Güncel Sayaç</div>,
      dataIndex: "guncelSayac",
      key: "guncelSayac",
      align: "right",
      ellipsis: true,
      width: 120,
    },
    {
      title: <div style={{ textAlign: "center" }}>Son Uygulanan</div>,
      dataIndex: "sonUygulanan",
      key: "sonUygulanan",
      align: "right",
      ellipsis: true,
      width: 120,
    },
    {
      title: <div style={{ textAlign: "center" }}>Hedef Sayaç</div>,
      dataIndex: "hedefSayac",
      key: "hedefSayac",
      ellipsis: true,
      width: 120,
    },
    {
      title: <div style={{ textAlign: "center" }}>Kalan Sayaç</div>,
      dataIndex: "kalanSayac",
      key: "kalanSayac",
      ellipsis: true,
      width: 120,
    },
    {
      title: <div style={{ textAlign: "center" }}>Kalan Sayaç %</div>,
      dataIndex: "kalanSayacYuzde",
      key: "kalanSayacYuzde",
      ellipsis: true,
      width: 120,
    },
    {
      title: <div style={{ textAlign: "center" }}>Hatırlatma Süre</div>,
      dataIndex: "hatirlatmaSure",
      key: "hatirlatmaSure",
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
