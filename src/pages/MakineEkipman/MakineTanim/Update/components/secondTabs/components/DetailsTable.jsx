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
    if (!dayjs(targetDate).isValid()) {
      return ""; // Eğer geçerli bir tarih değilse, boş bir string döndür
    }

    const now = dayjs();
    const target = dayjs(targetDate);
    const difference = target.diff(now, "day"); // Difference in days

    // Check if the difference is negative
    if (difference < 0) {
      return ""; // Return an empty string for past dates or invalid dates
    }

    return `${difference} gün`; // Return the difference in days
  };

  const fetchSayacData = useCallback(async () => {
    try {
      const response = await AxiosInstance.get(`PeriyodikBakimByMakine?MakineID=${selectedMakineID}`);
      const apiData = response;
      replace(
        apiData.map((item) => ({
          key: item.TB_PERIYODIK_BAKIM_ID,
          peryodikBakimKodu: item.PBK_KOD,
          peryodikBakim: item.PBK_TANIM,
          isEmriNo: item.PBK_ISEMRI_NO,
          sonUygulama: item.PBK_SON_UYGULAMA_TARIH,
          hedefTarih: item.PBK_HEDEF_UYGULAMA_TARIH,
          kalanSure: calculateRemainingTime(item.PBK_HEDEF_UYGULAMA_TARIH),
          sayac: item.PBK_SAYAC_TANIM,
          guncelSayac: item.PBK_GUNCEL_SAYAC,
          sonUygulanan: item.PBK_SON_UYGULAMA_SAYAC,
          hedefSayac: item.PBK_HEDEF_SAYAC,
          kalanSayac:
            item.PBK_HEDEF_SAYAC - item.PBK_GUNCEL_SAYAC >= 0 ? item.PBK_HEDEF_SAYAC - item.PBK_GUNCEL_SAYAC : "", // yukarıdaki iki alanın farkı
          kalanSayacYuzde:
            item.PBK_HEDEF_SAYAC > 0 ? Math.round((item.PBK_GUNCEL_SAYAC / item.PBK_HEDEF_SAYAC) * 100) : "", // Hedef sayaç sıfırdan büyükse yüzde hesapla, değilse boş string döndür

          hatirlatmaSure: item.PBM_HATIRLAT_SAYAC, //? name bulamadim
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
        // Eğer text null veya boş değilse formatla, aksi takdirde boş bir string dön
        return text ? dayjs(text).format("DD-MM-YYYY") : "";
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
        // Eğer text null veya boş değilse formatla, aksi takdirde boş bir string dön
        return text ? dayjs(text).format("DD-MM-YYYY") : "";
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
      render: (value) => {
        // Eğer value null, undefined veya boş string ise "0 %", değilse değeri yüzde formatında göster
        return value || value === 0 ? `${value} %` : "0 %";
      },
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
