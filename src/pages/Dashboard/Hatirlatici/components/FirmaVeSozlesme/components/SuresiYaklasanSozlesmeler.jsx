import React, { useCallback, useEffect, useState } from "react";
import { Button, Input, Modal, Table } from "antd";
import AxiosInstance from "../../../../../../api/http";
import dayjs from "dayjs";

export default function SuresiYaklasanSozlesmeler({ workshopSelectedId, onSubmit }) {
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
  const [pageSize, setPageSize] = useState(0); // Default to 0
  // sayfalama için son
  // sayfa değiştiğinde apiye istek hemen gitsin filtrelemede bulunan gecikmeden etkilenmesin diye
  const [changeSource, setChangeSource] = useState(null);
  // sayfa değiştiğinde apiye istek hemen gitsin filtrelemede bulunan gecikmeden etkilenmesin diye son

  const columns = [
    {
      title: "Firma Kodu",
      dataIndex: "code",
      key: "code",
      width: "150px",
      elipse: true,
    },
    {
      title: "Firma Ünvanı",
      dataIndex: "subject",
      key: "subject",
      width: "350px",
      elipse: true,
    },
    {
      title: "Firma Tipi",
      dataIndex: "workdays",
      key: "workdays",
      width: "150px",
      elipse: true,
    },
    {
      title: "Lokasyon",
      dataIndex: "description",
      key: "description",
      width: "150px",
      elipse: true,
    },
    {
      title: "Şehir",
      dataIndex: "fifthcolumn",
      key: "fifthcolumn",
      width: "150px",
      elipse: true,
    },
  ];

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`GetFirmaList?userId=24&pagingDeger=${currentPage}&search=${searchValue}`)
      .then((response) => {
        // sayfalama için
        // Set the total pages based on the pageSize from the API response
        setPageSize(response.pageSize);

        // sayfalama için son

        const fetchedData = response.Firma_Liste.map((item) => {
          return {
            key: item.TB_CARI_ID,
            code: item.CAR_KOD,
            subject: item.CAR_TANIM,
            workdays: item.CAR_TIP,
            description: item.CAR_LOKASYON,
            fifthcolumn: item.CAR_SEHIR,
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
      <Button style={{ padding: "0" }} type="text" onClick={handleModalToggle}>
        Suresi Yaklaşan Sözleşmeler
      </Button>
      <Modal
        width="1200px"
        centered
        title="Firma Tanımları"
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
          style={{ marginBottom: "20px", width: "250px" }}
        />

        <Table
          rowSelection={{
            type: "radio",
            selectedRowKeys,
            onChange: onRowSelectChange,
          }}
          scroll={{
            // x: "auto",
            y: "100vh",
          }}
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{
            position: ["bottomRight"],
            current: currentPage,
            total: pageSize * 10,
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
