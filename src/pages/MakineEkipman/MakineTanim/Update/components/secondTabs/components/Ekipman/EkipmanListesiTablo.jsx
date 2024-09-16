import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../../api/http";
import CreateModal from "./Insert/CreateModal";
import ContextMenu from "./components/ContextMenu/ContextMenu.jsx";
import EditDrawer from "../../../../../../EkipmanVeritabani/Update/EditDrawer.jsx";

export default function EkipmanListesiTablo({ isActive }) {
  const [loading, setLoading] = useState(false);
  const { control, watch, setValue } = useFormContext();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]); // Store selected rows data
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  // edit drawer için
  const [drawer, setDrawer] = useState({
    visible: false,
    data: null,
  });
  // edit drawer için son

  const kapali = watch("kapali");

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
      title: "Ekipman No",
      dataIndex: "EKP_KOD",
      key: "EKP_KOD",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık
      render: (text, record) => (
        <a onClick={() => onRowClick(record)}>{text}</a> // Updated this line
      ),
      sorter: (a, b) => {
        if (a.EKP_KOD === null) return -1;
        if (b.EKP_KOD === null) return 1;
        return a.EKP_KOD.localeCompare(b.EKP_KOD);
      },
    },

    {
      title: "Tanım",
      dataIndex: "EKP_TANIM",
      key: "EKP_TANIM",
      width: 250,
      ellipsis: true,
      sorter: (a, b) => {
        if (a.EKP_TANIM === null) return -1;
        if (b.EKP_TANIM === null) return 1;
        return a.EKP_TANIM.localeCompare(b.EKP_TANIM);
      },
      visible: true, // Varsayılan olarak açık
      render: (text, record) => (
        <a onClick={() => onRowClick(record)}>{text}</a> // Updated this line
      ),
    },

    {
      title: "Seri No",
      dataIndex: "EKP_SERI_NO",
      key: "EKP_SERI_NO",
      width: 100,
      ellipsis: true,
      sorter: (a, b) => {
        if (a.EKP_SERI_NO === null) return -1;
        if (b.EKP_SERI_NO === null) return 1;
        return a.EKP_SERI_NO.localeCompare(b.EKP_SERI_NO);
      },
      visible: true, // Varsayılan olarak açık
    },

    {
      title: "Makine",
      dataIndex: "MKN_TANIM",
      key: "MKN_TANIM",
      width: 200,
      ellipsis: true,
      sorter: (a, b) => {
        if (a.MKN_TANIM === null) return -1;
        if (b.MKN_TANIM === null) return 1;
        return a.MKN_TANIM.localeCompare(b.MKN_TANIM);
      },
      visible: true, // Varsayılan olarak açık
    },

    {
      title: "Tipi",
      dataIndex: "EKP_TIP",
      key: "EKP_TIP",
      width: 150,
      ellipsis: true,
      sorter: (a, b) => {
        if (a.EKP_TIP === null) return -1;
        if (b.EKP_TIP === null) return 1;
        return a.EKP_TIP.localeCompare(b.EKP_TIP);
      },
      visible: true, // Varsayılan olarak açık
    },

    {
      title: "Durum",
      dataIndex: "EKP_DURUM",
      key: "EKP_DURUM",
      width: 150,
      ellipsis: true,

      visible: true, // Varsayılan olarak açık
      sorter: (a, b) => {
        if (a.EKP_DURUM === null && b.EKP_DURUM === null) return 0;
        if (a.EKP_DURUM === null) return 1;
        if (b.EKP_DURUM === null) return -1;
        return a.EKP_DURUM.localeCompare(b.EKP_DURUM);
      },
    },

    {
      title: "Marka",
      dataIndex: "EKP_MARKA",
      key: "EKP_MARKA",
      width: 150,
      ellipsis: true,

      visible: true, // Varsayılan olarak açık
      sorter: (a, b) => {
        if (a.EKP_MARKA === null && b.EKP_MARKA === null) return 0;
        if (a.EKP_MARKA === null) return 1;
        if (b.EKP_MARKA === null) return -1;
        return a.EKP_MARKA.localeCompare(b.EKP_MARKA);
      },
    },

    {
      title: "Model",
      dataIndex: "EKP_MODEL",
      key: "EKP_MODEL",
      width: 150,
      ellipsis: true,

      visible: true, // Varsayılan olarak açık
      sorter: (a, b) => {
        if (a.EKP_MODEL === null && b.EKP_MODEL === null) return 0;
        if (a.EKP_MODEL === null) return 1;
        if (b.EKP_MODEL === null) return -1;
        return a.EKP_MODEL.localeCompare(b.EKP_MODEL);
      },
    },

    {
      title: "Revizyon Tarih",
      dataIndex: "EKP_REVIZYON_TARIH",
      key: "EKP_REVIZYON_TARIH",
      width: 110,
      ellipsis: true,
      sorter: (a, b) => {
        if (a.EKP_REVIZYON_TARIH === null) return -1;
        if (b.EKP_REVIZYON_TARIH === null) return 1;
        return a.EKP_REVIZYON_TARIH.localeCompare(b.EKP_REVIZYON_TARIH);
      },

      visible: true, // Varsayılan olarak açık
      render: (text) => formatDate(text),
    },

    {
      title: "Garanti Tarih",
      dataIndex: "EKP_GARANTI_BITIS_TARIH",
      key: "EKP_GARANTI_BITIS_TARIH",
      width: 110,
      ellipsis: true,
      sorter: (a, b) => {
        if (a.EKP_GARANTI_BITIS_TARIH === null) return -1;
        if (b.EKP_GARANTI_BITIS_TARIH === null) return 1;
        return a.EKP_GARANTI_BITIS_TARIH.localeCompare(b.EKP_GARANTI_BITIS_TARIH);
      },

      visible: true, // Varsayılan olarak açık
      render: (text) => formatDate(text),
    },

    {
      title: "Depo",
      dataIndex: "EKP_DEPO",
      key: "EKP_DEPO",
      width: 150,
      ellipsis: true,

      visible: true, // Varsayılan olarak açık
      sorter: (a, b) => {
        if (a.EKP_DEPO === null && b.EKP_DEPO === null) return 0;
        if (a.EKP_DEPO === null) return 1;
        if (b.EKP_DEPO === null) return -1;
        return a.EKP_DEPO.localeCompare(b.EKP_DEPO);
      },
    },
  ];

  const secilenIsEmriID = watch("secilenMakineID");

  const fetch = useCallback(
    (page = 1, pageSize = 10) => {
      if (isActive) {
        setLoading(true);
        AxiosInstance.get(`GetEkipmanMakineListWeb?parametre=&pagingDeger=${page}&pageSize=${pageSize}&MakineID=${secilenIsEmriID}`)
          .then((response) => {
            const fetchedData = response.list.map((item) => ({
              ...item,
              key: item.TB_EKIPMAN_ID,
            }));
            setData(fetchedData);
            setPagination({ current: page, pageSize, total: response.kayit_sayisi });
          })
          .catch((error) => {
            // Hata işleme
            console.error("API isteği sırasında hata oluştu:", error);
          })
          .finally(() => setLoading(false));
      }
    },
    [secilenIsEmriID, isActive]
  ); // secilenIsEmriID değiştiğinde fetch fonksiyonunu güncelle

  useEffect(() => {
    if (secilenIsEmriID || isActive) {
      // secilenIsEmriID'nin varlığını ve geçerliliğini kontrol edin
      fetch(); // fetch fonksiyonunu çağırın
    }
  }, [secilenIsEmriID, fetch, isActive]); // secilenIsEmriID veya fetch fonksiyonu değiştiğinde useEffect'i tetikle

  const onRowSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys);
    const selectedData = selectedKeys.map((key) => data.find((item) => item.key === key));
    setSelectedRows(selectedData);
  };

  const refreshTable = useCallback(() => {
    fetch(pagination.current, pagination.pageSize); // fetch fonksiyonu tabloyu yeniler
  }, [fetch, pagination.current, pagination.pageSize]);

  const handleTableChange = (pagination) => {
    fetch(pagination.current, pagination.pageSize);
  };

  const onRowClick = (record) => {
    setDrawer({ visible: true, data: record });
  };

  const refreshTableData = useCallback(() => {
    fetch();
  }, []); // Bağımlılıkları kaldırdık, çünkü fonksiyon içindeki değerler zaten en güncel halleriyle kullanılıyor.

  return (
    <div style={{ marginBottom: "25px" }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <ContextMenu selectedRows={selectedRows} refreshTableData={refreshTable} />
        <CreateModal kapali={kapali} onRefresh={refreshTable} secilenIsEmriID={secilenIsEmriID} />
      </div>

      <Table
        rowSelection={{
          type: "radio",
          selectedRowKeys,
          onChange: onRowSelectChange,
        }}
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
        }}
        onChange={handleTableChange}
        scroll={{
          // x: "auto",
          y: "calc(100vh - 360px)",
        }}
      />
      <EditDrawer selectedRow={drawer.data} onDrawerClose={() => setDrawer({ ...drawer, visible: false })} drawerVisible={drawer.visible} onRefresh={refreshTableData} />
    </div>
  );
}
