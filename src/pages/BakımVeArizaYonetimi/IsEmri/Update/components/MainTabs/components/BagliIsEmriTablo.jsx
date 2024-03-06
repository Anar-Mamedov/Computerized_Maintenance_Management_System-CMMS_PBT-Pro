import React, { useCallback, useEffect, useState } from "react";
import { Button, Input, Modal, Table, Tag } from "antd";
import AxiosInstance from "../../../../../../../api/http";
import dayjs from "dayjs";

export default function BagliIsEmriTablo({ workshopSelectedId, onSubmit }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  // tablodaki search kısmı için
  const [searchValue, setSearchValue] = useState("");
  // 1. Add a state variable for searchTimeout
  const [searchTimeout, setSearchTimeout] = useState(null);
  // tablodaki search kısmı için son
  // sayfalama için
  const [currentPage, setCurrentPage] = useState(1); // Initial page
  const [totalPages, setTotalPages] = useState(0); // Default to 0
  // sayfalama için son
  // sayfa değiştiğinde apiye istek hemen gitsin filtrelemede bulunan gecikmeden etkilenmesin diye
  const [changeSource, setChangeSource] = useState(null);
  // sayfa değiştiğinde apiye istek hemen gitsin filtrelemede bulunan gecikmeden etkilenmesin diye son

  function hexToRGBA(hex, opacity) {
    // hex veya opacity null ise hata döndür
    if (hex === null || opacity === null) {
      // console.error("hex veya opacity null olamaz!");
      return; // veya uygun bir varsayılan değer döndürebilirsiniz
    }

    let r = 0,
      g = 0,
      b = 0;
    // 3 karakterli hex kodunu kontrol et
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    }
    // 6 karakterli hex kodunu kontrol et
    else if (hex.length === 7) {
      r = parseInt(hex[1] + hex[2], 16);
      g = parseInt(hex[3] + hex[4], 16);
      b = parseInt(hex[5] + hex[6], 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  const columns = [
    {
      title: "İş Emri No",
      dataIndex: "ISEMRI_NO",
      key: "ISEMRI_NO",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Tarih",
      dataIndex: "DUZENLEME_TARIH",
      key: "DUZENLEME_TARIH",
      width: "150px",
      ellipsis: true,
      render: (text) => formatDate(text),
    },
    {
      title: "Konu",
      dataIndex: "KONU",
      key: "KONU",
      width: "250px",
      ellipsis: true,
    },
    {
      title: "İş Emri Tipi",
      dataIndex: "ISEMRI_TIP",
      key: "ISEMRI_TIP",
      width: "200px",
      ellipsis: true,
      visible: true, // Varsayılan olarak açık
      render: (text, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <Tag
            style={{
              backgroundColor: hexToRGBA(record.ISM_TIP_RENK, 0.2),
              border: `1.2px solid ${hexToRGBA(record.ISM_TIP_RENK, 0.7)}`,
              color: record.ISM_TIP_RENK,
            }}>
            {text}
          </Tag>
        </div>
      ),
    },
    {
      title: "İş Süresi (dk.)",
      dataIndex: "IS_SURESI",
      key: "IS_SURESI",
      width: "150px",
      ellipsis: true,
      render: (text) => (text > 0 ? text : null),
    },
    {
      title: "Tamamlama (%)",
      dataIndex: "TAMAMLANMA",
      key: "TAMAMLANMA",
      width: "150px",
      ellipsis: true,
      render: (text) => `${text}%`,
    },
    {
      title: "Durum",
      dataIndex: "DURUM",
      key: "DURUM",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Lokasyon",
      dataIndex: "LOKASYON",
      key: "LOKASYON",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Makine Kodu",
      dataIndex: "MAKINE_KODU",
      key: "MAKINE_KODU",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Makine Tanımı",
      dataIndex: "MAKINE_TANIMI",
      key: "MAKINE_TANIMI",
      width: "250px",
      ellipsis: true,
    },
    {
      title: "İş Süresi (dk.)",
      dataIndex: "IS_SURESI",
      key: "IS_SURESI",
      width: "150px",
      ellipsis: true,
      render: (text) => (text > 0 ? text : null),
    },
    {
      title: "Tamamlama (%)",
      dataIndex: "TAMAMLANMA",
      key: "TAMAMLANMA",
      width: "150px",
      ellipsis: true,
      render: (text) => `${text}%`,
    },
    {
      title: "İş Tipi",
      dataIndex: "IS_TIPI",
      key: "IS_TIPI",
      width: "250px",
      ellipsis: true,
    },
    {
      title: "İş Nedeni",
      dataIndex: "IS_NEDENI",
      key: "IS_NEDENI",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Atölye",
      dataIndex: "ATOLYE",
      key: "ATOLYE",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Kapanış Tarihi",
      dataIndex: "KAPANIS_TARIHI",
      key: "KAPANIS_TARIHI",
      width: "150px",
      ellipsis: true,
      render: (text) => formatDate(text),
    },
    {
      title: "Personel Adı",
      dataIndex: "PERSONEL_ADI",
      key: "PERSONEL_ADI",
      width: "150px",
      ellipsis: true,
    },
  ];

  // tarihleri kullanıcının local ayarlarına bakarak formatlayıp ekrana o şekilde yazdırmak için

  // Intl.DateTimeFormat kullanarak tarih formatlama
  const formatDate = (date) => {
    if (!date) return "";

    // Örnek bir tarih formatla ve ay formatını belirle
    const sampleDate = new Date(2021, 0, 21); // Ocak ayı için örnek bir tarih
    const sampleFormatted = new Intl.DateTimeFormat(navigator.language).format(sampleDate);

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
      if (isNaN(hoursInt) || isNaN(minutesInt) || hoursInt < 0 || hoursInt > 23 || minutesInt < 0 || minutesInt > 59) {
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

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.post(`getIsEmriFullList?id=11&parametre=${searchValue}&pagingDeger=${currentPage}`)
      .then((response) => {
        // sayfalama için
        // Set the total pages based on the pageSize from the API response
        setTotalPages(response.page);

        // sayfalama için son

        const fetchedData = response.list.map((item) => {
          return {
            ...item,
            key: item.TB_ISEMRI_ID,
          };
        });
        setData(fetchedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [searchValue, currentPage]); // Added currentPage as a dependency

  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
    // Bu fonksiyon sadece modalın açılıp kapatılmasını kontrol eder.
  };

  useEffect(() => {
    if (isModalVisible) {
      // Modal açıldığında çalışacak kodlar
      fetch(); // Verileri yeniden yükle
    } else {
      // Modal kapandığında çalışacak kodlar
      setSearchValue(""); // Arama değerini sıfırla
      setCurrentPage(1); // Sayfa numarasını başlangıç değerine sıfırla
      setSelectedRowKeys([]); // Seçili satır anahtarlarını sıfırla
    }
  }, [isModalVisible]); // isModalVisible değiştiğinde useEffect tetiklenir

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

  // tablodaki search kısmı için
  useEffect(() => {
    if (changeSource === "searchValue") {
      if (searchTimeout) {
        clearTimeout(searchTimeout); // Clear any existing timeout
      }
      const timeout = setTimeout(() => {
        fetch();
        setChangeSource(null); // Reset the change source after fetching
      }, 2000); // 2000 milliseconds delay
      setSearchTimeout(timeout); // Store the timeout ID

      // Cleanup function to clear the timeout when the component is unmounted
      return () => {
        clearTimeout(timeout);
      };
    } else if (changeSource === "currentPage") {
      fetch();
      setChangeSource(null); // Reset the change source after fetching
    }
  }, [searchValue, currentPage, fetch]); // Added fetch as a dependency

  // tablodaki search kısmı için son

  return (
    <div>
      <Button onClick={handleModalToggle}> + </Button>
      <Modal
        width="1200px"
        centered
        title="İş Emri Listesi"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalToggle}>
        <Input
          placeholder="Ara..."
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            setCurrentPage(1); // Reset to page 1 when the search value changes
            setChangeSource("searchValue"); // Set the change source
          }}
          style={{ marginBottom: "10px", width: "250px" }}
        />

        <Table
          rowSelection={{
            type: "radio",
            selectedRowKeys,
            onChange: onRowSelectChange,
          }}
          scroll={{ y: "calc(100vh - 380px)" }}
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{
            position: ["bottomRight"],
            current: currentPage,
            total: totalPages * 50,
            pageSize: 50,
            showSizeChanger: false,
            onChange: (page) => {
              setCurrentPage(page);
              setChangeSource("currentPage"); // Set the change source
            },
          }}
        />
      </Modal>
    </div>
  );
}
