import { useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input, Table, Spin, Button, Modal, Checkbox } from "antd";
import { CheckOutlined, CloseOutlined, SearchOutlined, MenuOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../api/http";
import CreateDrawer from "../Insert/CreateDrawer";
import EditDrawer from "../Update/EditDrawer";
import Filters from "./filter/Filters";

export default function MainTable() {
  const { setValue } = useFormContext();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // edit drawer için
  const [drawer, setDrawer] = useState({
    visible: false,
    data: null,
  });
  // edit drawer için son

  useEffect(() => {
    fetchEquipmentData();
  }, []);

  const fetchEquipmentData = async () => {
    try {
      setLoading(true);
      const response = await AxiosInstance.get("BakimGetir");
      if (response) {
        const formattedData = response.map((item) => {
          return {
            ...item,
            key: item.TB_IS_TANIM_ID,
            IST_KOD: item.IST_KOD,
            IST_TANIM: item.IST_TANIM,
            IST_DURUM: item.IST_DURUM,
            IST_AKTIF: item.IST_AKTIF,
            IST_TIP_KOD_ID: item.IST_TIP_KOD_ID,
            IST_TIP: item.IST_TIP,
            IST_GRUP_KOD_ID: item.IST_GRUP_KOD_ID,
            IST_GRUP: item.IST_GRUP,
            IST_ATOLYE_ID: item.IST_ATOLYE_ID,
            IST_ATOLYE: item.IST_ATOLYE,
            IST_CALISMA_SURE: item.IST_CALISMA_SURE,
            IST_DURUS_SURE: item.IST_DURUS_SURE,
            IST_PERSONEL_SAYI: item.IST_PERSONEL_SAYI,
            IST_ONCELIK_ID: item.IST_ONCELIK_ID,
            IST_ONCELIK: item.IST_ONCELIK,
            IST_TALIMAT_ID: item.IST_TALIMAT_ID,
            IST_TALIMAT: item.IST_TALIMAT,
            IST_ACIKLAMA: item.IST_ACIKLAMA,
            IST_OLUSTURAN_ID: item.IST_OLUSTURAN_ID,
            IST_OLUSTURMA_TARIH: item.IST_OLUSTURMA_TARIH,
            IST_DEGISTIREN_ID: item.IST_DEGISTIREN_ID,
            IST_DEGISTIRME_TARIH: item.IST_DEGISTIRME_TARIH,
            IST_MALZEME_MALIYET: item.IST_MALZEME_MALIYET,
            IST_ISCILIK_MALIYET: item.IST_ISCILIK_MALIYET,
            IST_GENEL_GIDER_MALIYET: item.IST_GENEL_GIDER_MALIYET,
            IST_TOPLAM_MALIYET: item.IST_TOPLAM_MALIYET,
            IST_NEDEN_KOD_ID: item.IST_NEDEN_KOD_ID,
            IST_FIRMA_ID: item.IST_FIRMA_ID,
            IST_IS_TALEPTE_GORUNSUN: item.IST_IS_TALEPTE_GORUNSUN,
            IST_MASRAF_MERKEZ_ID: item.IST_MASRAF_MERKEZ_ID,
            IST_SURE_LOJISTIK: item.IST_SURE_LOJISTIK,
            IST_SURE_SEYAHAT: item.IST_SURE_SEYAHAT,
            IST_SURE_ONAY: item.IST_SURE_ONAY,
            IST_SURE_BEKLEME: item.IST_SURE_BEKLEME,
            IST_SURE_DIGER: item.IST_SURE_DIGER,
            IST_OZEL_ALAN_1: item.IST_OZEL_ALAN_1,
            IST_OZEL_ALAN_2: item.IST_OZEL_ALAN_2,
            IST_OZEL_ALAN_3: item.IST_OZEL_ALAN_3,
            IST_OZEL_ALAN_4: item.IST_OZEL_ALAN_4,
            IST_OZEL_ALAN_5: item.IST_OZEL_ALAN_5,
            IST_OZEL_ALAN_6: item.IST_OZEL_ALAN_6,
            IST_OZEL_ALAN_7: item.IST_OZEL_ALAN_7,
            IST_OZEL_ALAN_8: item.IST_OZEL_ALAN_8,
            IST_OZEL_ALAN_9: item.IST_OZEL_ALAN_9,
            IST_OZEL_ALAN_10: item.IST_OZEL_ALAN_10,
            IST_UYAR: item.IST_UYAR,
            IST_UYARI_SIKLIGI: item.IST_UYARI_SIKLIGI,
            IST_LOKASYON_ID: item.IST_LOKASYON_ID,
            IST_LOKASYON: item.IST_LOKASYON,
            IST_OTONOM_BAKIM: item.IST_OTONOM_BAKIM,
            IST_KONTROL_SAYI: item.IST_KONTROL_SAYI,
          };
        });
        setData(formattedData);
        setLoading(false);
      } else {
        console.error("API response is not in expected format");
      }
    } catch (error) {
      console.error("Error in API request:", error);
      setLoading(false);
    }
  };

  const normalizeString = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  // search filter
  useEffect(() => {
    const filtered = data.filter((item) => normalizeString(item.IST_TANIM).includes(normalizeString(searchTerm)));
    setFilteredData(filtered);
  }, [searchTerm, data]);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    if (newSelectedRowKeys.length > 0) {
      setValue("selectedLokasyonId", newSelectedRowKeys[0]);
    } else {
      setValue("selectedLokasyonId", null);
    }
  };

  const rowSelection = {
    type: "radio",
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onRowClick = (record) => {
    return {
      onClick: () => {
        setDrawer({ visible: true, data: record });
      },
    };
  };

  const refreshTableData = useCallback(() => {
    fetchEquipmentData();
  }, []);

  const columns = [
    {
      title: "Bakım Kod",
      dataIndex: "IST_KOD",
      key: "IST_KOD",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Bakım Tanım",
      dataIndex: "IST_TANIM",
      key: "IST_TANIM",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Aktif",
      dataIndex: "IST_AKTIF",
      key: "IST_AKTIF",
      width: 100,
      ellipsis: true,
      align: "center",
      render: (text) => (
        <div style={{ textAlign: "center" }}>
          {text ? <CheckOutlined style={{ color: "green" }} /> : <CloseOutlined style={{ color: "red" }} />}
        </div>
      ),
    },

    {
      title: "Bakım Tip",
      dataIndex: "IST_TIP",
      key: "IST_TIP",
      width: 250,
      ellipsis: true,
    },
    {
      title: "Bakım Grup",
      dataIndex: "IST_GRUP",
      key: "IST_GRUP",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Tanımlı Makineler",
      dataIndex: "IST_Tanimli_Makineler",
      key: "IST_Tanimli_Makineler",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Kapsadığı Bakımlar",
      dataIndex: "IST_Kapsadigi_Bakim",
      key: "IST_Kapsadigi_Bakim",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Atölye",
      dataIndex: "IST_ATOLYE",
      key: "IST_ATOLYE",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Lokasyon",
      dataIndex: "IST_LOKASYON",
      key: "IST_LOKASYON",
      width: 200,
      ellipsis: true,
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Öncelik",
      dataIndex: "IST_ONCELIK",
      key: "IST_ONCELIK",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Periyot",
      dataIndex: "IST_Periyot",
      key: "IST_Periyot",
      width: 150,
      ellipsis: true,
    },
    {
      title: "İş Süresi (dk.)",
      dataIndex: "IST_CALISMA_SURE",
      key: "IST_CALISMA_SURE",
      width: 150,
      ellipsis: true,
      // render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
    {
      title: "Duruş Süresi (dk.)",
      dataIndex: "IST_DURUS_SURE",
      key: "IST_DURUS_SURE",
      width: 170,
      ellipsis: true,
      // render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
    {
      title: "Personel Sayısı (kişi)",
      dataIndex: "IST_PERSONEL_SAYI",
      key: "IST_PERSONEL_SAYI",
      width: 170,
      ellipsis: true,
      // render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
    {
      title: "Tekrarlanma Adeti",
      dataIndex: "IST_Tekrarlanma_Adet",
      key: "IST_Tekrarlanma_Adet",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Özel Alan 1",
      dataIndex: "IST_OZEL_ALAN_1",
      key: "IST_OZEL_ALAN_1",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Özel Alan 2",
      dataIndex: "IST_OZEL_ALAN_2",
      key: "IST_OZEL_ALAN_2",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Özel Alan 3",
      dataIndex: "IST_OZEL_ALAN_3",
      key: "IST_OZEL_ALAN_3",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Özel Alan 4",
      dataIndex: "IST_OZEL_ALAN_4",
      key: "IST_OZEL_ALAN_4",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Özel Alan 5",
      dataIndex: "IST_OZEL_ALAN_5",
      key: "IST_OZEL_ALAN_5",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Özel Alan 6",
      dataIndex: "IST_OZEL_ALAN_6",
      key: "IST_OZEL_ALAN_6",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Özel Alan 7",
      dataIndex: "IST_OZEL_ALAN_7",
      key: "IST_OZEL_ALAN_7",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Özel Alan 8",
      dataIndex: "IST_OZEL_ALAN_8",
      key: "IST_OZEL_ALAN_8",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Özel Alan 9",
      dataIndex: "IST_OZEL_ALAN_9",
      key: "IST_OZEL_ALAN_9",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Özel Alan 10",
      dataIndex: "IST_OZEL_ALAN_10",
      key: "IST_OZEL_ALAN_10",
      width: 150,
      ellipsis: true,
    },
    // Other columns...
  ];

  const [visibleColumnKeys, setVisibleColumnKeys] = useState(() => {
    const savedVisibleColumns = JSON.parse(localStorage.getItem("visibleColumnsPeriyodikBakimlar"));

    if (savedVisibleColumns) {
      return savedVisibleColumns;
    }

    return columns.filter((col) => col.visible).map((col) => col.key);
  });

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleVisibilityChange = (checkedValues) => {
    setVisibleColumnKeys(checkedValues);
    // Yeni görünürlük durumunu localStorage'a kaydet
    localStorage.setItem("visibleColumnsPeriyodikBakimlar", JSON.stringify(checkedValues));
  };

  useEffect(() => {
    const savedColumns = JSON.parse(localStorage.getItem("visibleColumnsPeriyodikBakimlar"))
    const defaultColumns = ["IST_KOD", "IST_TANIM", "IST_TIP", "IST_GRUP", "IST_Tanimli_Makineler", "IST_ATOLYE","IST_LOKASYON", "IST_ONCELIK"];

    if (!savedColumns) {
      localStorage.setItem("visibleColumnsPeriyodikBakimlar", JSON.stringify(defaultColumns));
      setVisibleColumnKeys(defaultColumns)
    }
  }, [])

  const [body, setBody] = useState({
    keyword: "",
    filters: {},
  });

  const handleBodyChange = useCallback((type, newBody) => {
    setBody((state) => ({
      ...state,
      [type]: newBody,
    }));
    setCurrentPage(1);
  }, []);

  const visibleColumns = columns.filter((col) => visibleColumnKeys.includes(col.key));
  console.log(searchTerm)
  return (
    <div>
      <Modal width={900} title="Kolonları Düzenle" open={isModalVisible} onOk={toggleModal} onCancel={toggleModal}>
        <Checkbox.Group
          style={{ width: "100%", display: "flex", gap: "10px", flexDirection: "column", height: "500px" }}
          value={visibleColumnKeys}
          onChange={handleVisibilityChange}>
          {columns.map((col) => (
            <Checkbox key={col.key} value={col.key}>
              {col.title}
            </Checkbox>
          ))}
        </Checkbox.Group>
      </Modal>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          marginBottom: "20px",
          gap: "10px",
          padding: "0 5px",
        }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            marginBottom: "20px",
            gap: "10px",
            padding: "0 5px",
          }}>
          <Button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0px 8px",
              // width: "32px",
              height: "32px",
            }}
            onClick={toggleModal}>
            <MenuOutlined />
          </Button>
          <Input
            style={{ width: "250px" }}
            type="text"
            placeholder="Arama yap..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<SearchOutlined style={{ color: "#0091ff" }} />}
          />
          <Filters onChange={handleBodyChange} />
        </div>
        <CreateDrawer selectedLokasyonId={selectedRowKeys[0]} onRefresh={refreshTableData} />
      </div>

      <Spin spinning={loading}>
        <Table
          rowSelection={rowSelection}
          columns={visibleColumns}
          dataSource={searchTerm ? filteredData : data}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: false,
            // pageSizeOptions: ["10", "20", "50", "100"],
            position: ["bottomRight"],
          }}
          onRow={onRowClick}
          scroll={{ y: "calc(100vh - 380px)" }}
        />
      </Spin>
      <EditDrawer
        selectedRow={drawer.data}
        onDrawerClose={() => setDrawer({ ...drawer, visible: false })}
        drawerVisible={drawer.visible}
        onRefresh={refreshTableData}
      />
    </div>
  );
}
