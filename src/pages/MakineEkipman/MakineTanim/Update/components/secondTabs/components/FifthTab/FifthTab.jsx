import React, { useEffect, useCallback } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Checkbox, Table } from "antd";
import AxiosInstance from "../../../../../../../../api/http";

export default function FifthTab() {
  const { control, watch } = useFormContext();
  const { fields, append, replace } = useFieldArray({
    control,
    name: "SayacListesi",
  });

  const selectedMakineID = watch("secilenMakineID");

  const fetchSayacData = useCallback(async () => {
    try {
      const response = await AxiosInstance.get(`Sayac?MakineID=${selectedMakineID}`);
      const apiData = response;
      replace(
        apiData.map((item) => ({
          key: item.TB_SAYAC_ID,
          sayacTanim: item.MES_TANIM,
          sayacBirimi: item.MES_SAYAC_BIRIM,
          sayacTipi: item.MES_SAYAC_TIP,
          baslangicTarihi: item.TB_SAYAC_BASLANGIC_TARIHI,
          sanalSayac: item.MES_SANAL_SAYAC,
          sayacDeger: item.MES_GUNCEL_DEGER,
          artisDeger: item.MES_TAHMINI_ARTIS_DEGER,
          aciklama: item.MES_ACIKLAMA,
          sayacBaslangicDeger: item.MES_BASLANGIC_DEGER,
          ekipmanKodu: item.TB_SAYAC_EKIPMAN_KODU,
          ekipmanTanim: item.TB_SAYAC_EKIPMAN_TANIM,
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
      title: <div style={{ textAlign: "center" }}>Sayaç Tanım </div>,
      dataIndex: "sayacTanim",
      key: "sayacTanim",
      ellipsis: true,
      width: 250,
    },
    {
      title: <div style={{ textAlign: "center" }}>Sayaç Birimi </div>,
      dataIndex: "sayacBirimi",
      key: "sayacBirimi",
      ellipsis: true,
      width: 150,
    },
    {
      title: <div style={{ textAlign: "center" }}>Sayaç Tipi </div>,
      dataIndex: "sayacTipi",
      key: "sayacTipi",
      ellipsis: true,
      width: 150,
    },
    {
      title: <div style={{ textAlign: "center" }}>Başlangıç Tarihi </div>,
      dataIndex: "baslangicTarihi",
      key: "baslangicTarihi",
      align: "center",
      ellipsis: true,
      width: 150,
    },
    {
      title: <div style={{ textAlign: "center" }}>Sanal Sayaç </div>,
      dataIndex: "sanalSayac",
      key: "sanalSayac",
      align: "center",
      ellipsis: true,
      width: 110,
      render: (text, record) => <Checkbox checked={record.sanalSayac} disabled />,
    },
    {
      title: <div style={{ textAlign: "center" }}>Sayaç Değeri </div>,
      dataIndex: "sayacDeger",
      key: "sayacDeger",
      align: "right",
      ellipsis: true,
      width: 120,
    },

    {
      title: <div style={{ textAlign: "center" }}>Artış Değer </div>,
      dataIndex: "artisDeger",
      key: "artisDeger",
      align: "right",
      ellipsis: true,
      width: 120,
    },
    {
      title: <div style={{ textAlign: "center" }}>Açıklama </div>,
      dataIndex: "aciklama",
      key: "aciklama",
      ellipsis: true,
      width: 300,
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          Sayaç <br />
          Başlangıç <br />
          Değeri
        </div>
      ),
      dataIndex: "sayacBaslangicDeger",
      key: "sayacBaslangicDeger",
      align: "right",
      ellipsis: true,
      width: 120,
    },
    {
      title: <div style={{ textAlign: "center" }}>Ekipman Kodu</div>,
      dataIndex: "ekipmanKodu",
      key: "ekipmanKodu",
      align: "right",
      ellipsis: true,
      width: 120,
    },
    {
      title: (
        <div style={{ textAlign: "center" }}>
          Ekipman <br /> Tanımı
        </div>
      ),
      dataIndex: "ekipmanTanim",
      key: "ekipmanTanim",
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
