import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../../../api/http";

export default function SozlesmeTablo({ workshopSelectedId, onSubmit }) {
  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // tarihleri kullanıcının local ayarlarına bakarak formatlayıp ekrana o şekilde yazdırmak için

  // Intl.DateTimeFormat kullanarak tarih formatlama
  const formatDate = (date) => {
    if (!date) return "";

    // Örnek bir tarih formatla ve ay formatını belirle
    const sampleDate = new Date(2021, 0, 21); // Ocak ayı için örnek bir tarih
    const sampleFormatted = new Intl.DateTimeFormat(navigator.language).format(
      sampleDate
    );

    let monthFormat;
    if (sampleFormatted.includes("January")) {
      monthFormat = "long"; // Tam ad ("January")
    } else if (sampleFormatted.includes("Jan")) {
      monthFormat = "short"; // Üç harfli kısaltma ("Jan")
    } else {
      monthFormat = "2-digit"; // Sayısal gösterim ("01")
    }

    // Kullanıcı için tarihi formatla
    const formatter = new Intl.DateTimeFormat(navigator.language, {
      year: "numeric",
      month: monthFormat,
      day: "2-digit",
    });
    return formatter.format(new Date(date));
  };

  const formatTime = (time) => {
    if (!time || time.trim() === "") return ""; // `trim` metodu ile baştaki ve sondaki boşlukları temizle

    try {
      // Saati ve dakikayı parçalara ayır, boşlukları temizle
      const [hours, minutes] = time
        .trim()
        .split(":")
        .map((part) => part.trim());

      // Saat ve dakika değerlerinin geçerliliğini kontrol et
      const hoursInt = parseInt(hours, 10);
      const minutesInt = parseInt(minutes, 10);
      if (
        isNaN(hoursInt) ||
        isNaN(minutesInt) ||
        hoursInt < 0 ||
        hoursInt > 23 ||
        minutesInt < 0 ||
        minutesInt > 59
      ) {
        throw new Error("Invalid time format");
      }

      // Geçerli tarih ile birlikte bir Date nesnesi oluştur ve sadece saat ve dakika bilgilerini ayarla
      const date = new Date();
      date.setHours(hoursInt, minutesInt, 0);

      // Kullanıcının lokal ayarlarına uygun olarak saat ve dakikayı formatla
      // `hour12` seçeneğini belirtmeyerek Intl.DateTimeFormat'ın kullanıcının yerel ayarlarına göre otomatik seçim yapmasına izin ver
      const formatter = new Intl.DateTimeFormat(navigator.language, {
        hour: "numeric",
        minute: "2-digit",
        // hour12 seçeneği burada belirtilmiyor; böylece otomatik olarak kullanıcının sistem ayarlarına göre belirleniyor
      });

      // Formatlanmış saati döndür
      return formatter.format(date);
    } catch (error) {
      console.error("Error formatting time:", error);
      return ""; // Hata durumunda boş bir string döndür
    }
  };

  // tarihleri kullanıcının local ayarlarına bakarak formatlayıp ekrana o şekilde yazdırmak için sonu

  const columns = [
    {
      title: "Sözleşme No",
      dataIndex: "CAS_SOZLESME_NO",
      key: "CAS_SOZLESME_NO",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Sözleşme Tanımı",
      dataIndex: "CAS_TANIM",
      key: "CAS_TANIM",
      width: "250px",
      ellipsis: true,
    },
    {
      title: "Başlama Tarihi",
      dataIndex: "CAS_BASLANGIC_TARIH",
      key: "CAS_BASLANGIC_TARIH",
      width: "150px",
      ellipsis: true,
      render: (text) => formatDate(text),
    },
    {
      title: "Kalan Gün",
      dataIndex: "CAS_KALAN_GUN",
      key: "CAS_KALAN_GUN",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Bitiş Tarihi",
      dataIndex: "CAS_BITIS_TARIH",
      key: "CAS_BITIS_TARIH",
      width: "150px",
      ellipsis: true,
      render: (text) => formatDate(text),
    },
  ];

  const firmaID = watch("firmaID") || 0;

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`GetSozlesmeler?firmaId=${firmaID}`)
      .then((response) => {
        const fetchedData = response.Sozlesme_Liste.map((item) => ({
          ...item,
          key: item.TB_CARI_SOZLESME_ID,
        }));
        setData(fetchedData);
      })
      .finally(() => setLoading(false));
  }, [firmaID]);

  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
    if (!isModalVisible) {
      fetch();
      setSelectedRowKeys([]);
    }
  };

  const handleModalOk = () => {
    const selectedData = data.find((item) => item.key === selectedRowKeys[0]);
    if (selectedData) {
      onSubmit && onSubmit(selectedData);
    }
    setIsModalVisible(false);
  };

  useEffect(() => {
    setSelectedRowKeys(workshopSelectedId ? [workshopSelectedId] : []);
  }, [workshopSelectedId]);

  const onRowSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys.length ? [selectedKeys[0]] : []);
  };
  return (
    <div>
      <Button onClick={handleModalToggle}> + </Button>
      <Modal
        width={1200}
        centered
        title="Sözleşme Tanımları"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalToggle}
      >
        <Table
          rowSelection={{
            type: "radio",
            selectedRowKeys,
            onChange: onRowSelectChange,
          }}
          columns={columns}
          dataSource={data}
          loading={loading}
        />
      </Modal>
    </div>
  );
}
