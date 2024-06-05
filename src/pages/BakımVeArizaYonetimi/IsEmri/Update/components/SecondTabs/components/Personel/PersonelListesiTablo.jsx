import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../../api/http";
import CreateModal from "./Insert/CreateModal";
import EditModal from "./Update/EditModal";

export default function PersonelListesiTablo({ isActive }) {
  const [loading, setLoading] = useState(false);
  const { control, watch, setValue } = useFormContext();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

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
        // throw new Error("Invalid time format"); // hata fırlatır ve uygulamanın çalışmasını durdurur
        console.error("Invalid time format:", time);
        // return time; // Hatalı formatı olduğu gibi döndür
        return ""; // Hata durumunda boş bir string döndür
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
      // return time; // Hatalı formatı olduğu gibi döndür
    }
  };

  // tarihleri kullanıcının local ayarlarına bakarak formatlayıp ekrana o şekilde yazdırmak için sonu

  const columns = [
    {
      title: "Personel Adı",
      dataIndex: "IDK_ISIM",
      key: "IDK_ISIM",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Vardiya",
      dataIndex: "IDK_VARDIYA_TANIM",
      key: "IDK_VARDIYA_TANIM",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Çalışma Süresi (dk.)",
      dataIndex: "IDK_SURE",
      key: "IDK_SURE",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Saat Ücreti",
      dataIndex: "IDK_SAAT_UCRETI",
      key: "IDK_SAAT_UCRETI",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Fazla Mesai",
      dataIndex: "IDK_FAZLA_MESAI_VAR",
      key: "IDK_FAZLA_MESAI_VAR",
      width: 200,
      ellipsis: true,
      render: (text, record) => {
        return record.IDK_FAZLA_MESAI_VAR ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckOutlined style={{ color: "green" }} />
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CloseOutlined style={{ color: "red" }} />
          </div>
        );
      },
    },
    {
      title: "Mesai Süresi (dk.)",
      dataIndex: "IDK_FAZLA_MESAI_SURE",
      key: "IDK_FAZLA_MESAI_SURE",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Mesai Ücreti",
      dataIndex: "IDK_FAZLA_MESAI_SAAT_UCRETI",
      key: "IDK_FAZLA_MESAI_SAAT_UCRETI",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Çalışma Zamanı",
      dataIndex: "", // dataIndex'i boş bırakıyoruz çünkü render fonksiyonunu kullanacağız
      key: "IDK_TARIH",
      width: 200,
      ellipsis: true,
      render: (text, record) => {
        // IDK_TARIH ve IDK_SAAT alanlarını birleştir
        const tarih = formatDate(record.IDK_TARIH);
        const saat = formatTime(record.IDK_SAAT);
        return `${tarih} - ${saat}`;
      },
    },
    {
      title: "Maliyet",
      dataIndex: "IDK_MALIYET",
      key: "IDK_MALIYET",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Masraf Merkezi",
      dataIndex: "IDK_MASRAF_MERKEZI",
      key: "IDK_MASRAF_MERKEZI",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Açıklama",
      dataIndex: "IDK_ACIKLAMA",
      key: "IDK_ACIKLAMA",
      width: 300,
      ellipsis: true,
    },
  ];

  const secilenIsEmriID = watch("secilenIsEmriID");

  const fetch = useCallback(() => {
    if (isActive) {
      setLoading(true);
      AxiosInstance.get(`IsEmriPersonelList?isemriID=${secilenIsEmriID}`)
        .then((response) => {
          const fetchedData = response.map((item) => ({
            ...item,
            key: item.TB_ISEMRI_KAYNAK_ID,
          }));
          setData(fetchedData);
        })
        .catch((error) => {
          // Hata işleme
          console.error("API isteği sırasında hata oluştu:", error);
        })
        .finally(() => setLoading(false));
    }
  }, [secilenIsEmriID, isActive]); // secilenIsEmriID değiştiğinde fetch fonksiyonunu güncelle

  useEffect(() => {
    if (secilenIsEmriID) {
      // secilenIsEmriID'nin varlığını ve geçerliliğini kontrol edin
      fetch(); // fetch fonksiyonunu çağırın
    }
  }, [secilenIsEmriID, fetch]); // secilenIsEmriID veya fetch fonksiyonu değiştiğinde useEffect'i tetikle

  const onRowSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys.length ? [selectedKeys[0]] : []);
  };

  const onRowClick = (record) => {
    setSelectedRow(record);
    setIsModalVisible(true);
  };

  const refreshTable = useCallback(() => {
    fetch(); // fetch fonksiyonu tabloyu yeniler
  }, [fetch]);

  return (
    <div style={{ marginBottom: "25px" }}>
      <CreateModal onRefresh={refreshTable} secilenIsEmriID={secilenIsEmriID} />
      <Table
        rowSelection={{
          type: "radio",
          selectedRowKeys,
          onChange: onRowSelectChange,
        }}
        onRow={(record) => ({
          onClick: () => onRowClick(record),
        })}
        columns={columns}
        dataSource={data}
        loading={loading}
        scroll={{
          // x: "auto",
          y: "calc(100vh - 360px)",
        }}
      />
      {isModalVisible && (
        <EditModal
          selectedRow={selectedRow}
          isModalVisible={isModalVisible}
          onModalClose={() => {
            setIsModalVisible(false);
            setSelectedRow(null);
          }}
          onRefresh={refreshTable}
          secilenIsEmriID={secilenIsEmriID}
        />
      )}
    </div>
  );
}
