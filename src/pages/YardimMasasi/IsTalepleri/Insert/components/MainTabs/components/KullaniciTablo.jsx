import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table, Input } from "antd";
import AxiosInstance from "../../../../../../../api/http";

export default function KullaniciTablo({ workshopSelectedId, onSubmit }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]); // Filtrelenmiş veri için yeni state
  const [searchTerm, setSearchTerm] = useState(""); // Arama terimi için state

  const columns = [
    {
      title: "Kullanıcı Kodu",
      dataIndex: "ISK_KOD",
      key: "ISK_KOD",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Kullanıcı Adı",
      dataIndex: "ISK_ISIM",
      key: "ISK_ISIM",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Ünvan",
      dataIndex: "ISK_UNVAN",
      key: "ISK_UNVAN",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Kullanıcı Tipi",
      dataIndex: "ISK_KULLANICI_TIP",
      key: "ISK_KULLANICI_TIP",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Departman",
      dataIndex: "ISK_DEPARTMAN",
      key: "ISK_DEPARTMAN",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Lokasyon",
      dataIndex: "ISK_LOKASYON",
      key: "ISK_LOKASYON",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Telefon",
      dataIndex: "ISK_TELEFON_1",
      key: "ISK_TELEFON_1",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Dahili",
      dataIndex: "ISK_DAHILI",
      key: "ISK_DAHILI",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "GSM",
      dataIndex: "ISK_GSM",
      key: "ISK_GSM",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "E-Mail",
      dataIndex: "ISK_MAIL",
      key: "ISK_MAIL",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Personel Adı",
      dataIndex: "ISK_PERSONEL_ISIM",
      key: "ISK_PERSONEL_ISIM",
      width: "150px",
      ellipsis: true,
    },
  ];

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`GetIsTalepKullaniciList`)
      .then((response) => {
        const fetchedData = response.map((item) => ({
          ...item,
          key: item.TB_IS_TALEBI_KULLANICI_ID,
          ISK_KOD: item.ISK_KOD,
          ISK_ISIM: item.ISK_ISIM,
          ISK_DEPARTMAN_ID: item.ISK_DEPARTMAN_ID,
          ISK_DEPARTMAN: item.ISK_DEPARTMAN,
          ISK_KULLANICI_TIP_KOD_ID: item.ISK_KULLANICI_TIP_KOD_ID,
          ISK_UNVAN: item.ISK_UNVAN,
          ISK_LOKASYON_ID: item.ISK_LOKASYON_ID,
          ISK_LOKASYON: item.ISK_LOKASYON,
          ISK_ADRES: item.ISK_ADRES,
          ISK_IL: item.ISK_IL,
          ISK_ILCE: item.ISK_ILCE,
          ISK_TELEFON_1: item.ISK_TELEFON_1,
          ISK_TELEFON_2: item.ISK_TELEFON_2,
          ISK_FAX: item.ISK_FAX,
          ISK_GSM: item.ISK_GSM,
          ISK_DAHILI: item.ISK_DAHILI,
          ISK_MAIL: item.ISK_MAIL,
          ISK_AKTIF: item.ISK_AKTIF,
          ISK_ACIKLAMA: item.ISK_ACIKLAMA,
          ISK_SIFRE: item.ISK_SIFRE,
          ISK_KAYIT_SAYISI: item.ISK_KAYIT_SAYISI,
          ISK_ACILIS_DURUM: item.ISK_ACILIS_DURUM,
          ISK_MAIL_SIFRE: item.ISK_MAIL_SIFRE,
          ISK_YENILEME_SURESI: item.ISK_YENILEME_SURESI,
          ISK_OLUSTURAN_ID: item.ISK_OLUSTURAN_ID,
          ISK_DEGISTIREN_ID: item.ISK_DEGISTIREN_ID,
          ISK_OLUSTURMA_TARIH: item.ISK_OLUSTURMA_TARIH,
          ISK_DEGISTIRME_TARIH: item.ISK_DEGISTIRME_TARIH,
          ISK_PERSONEL_ID: item.ISK_PERSONEL_ID,
          ISK_KULLANICI_TIP: item.ISK_KULLANICI_TIP,
          ISK_PERSONEL_ISIM: item.ISK_PERSONEL_ISIM,
        }));
        setData(fetchedData);
        setFilteredData(fetchedData); // filteredData'yı da aynı veriyle güncelle
      })
      .finally(() => setLoading(false));
  }, []);

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

  // Arama terimindeki değişiklikleri işleyen fonksiyon
  // Türkçe karakterleri İngilizce karşılıkları ile değiştiren fonksiyon
  const normalizeText = (text) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ğ/g, "g")
      .replace(/Ğ/g, "G")
      .replace(/ü/g, "u")
      .replace(/Ü/g, "U")
      .replace(/ş/g, "s")
      .replace(/Ş/g, "S")
      .replace(/ı/g, "i")
      .replace(/İ/g, "I")
      .replace(/ö/g, "o")
      .replace(/Ö/g, "O")
      .replace(/ç/g, "c")
      .replace(/Ç/g, "C");
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value) {
      const normalizedSearchTerm = normalizeText(value); // Arama terimini normalize et
      const filtered = data.filter((item) =>
        Object.keys(item).some(
          (key) =>
            item[key] && normalizeText(item[key].toString()).toLowerCase().includes(normalizedSearchTerm.toLowerCase())
        )
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };
  return (
    <div>
      <Button onClick={handleModalToggle}> + </Button>
      <Modal
        width={1200}
        centered
        title="Kullanıcı Listesi"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalToggle}>
        <Input
          placeholder="Ara..."
          value={searchTerm}
          onChange={handleSearch}
          style={{ marginBottom: "15px", width: "300px" }} // Arama kutusunun altındaki boşluk
        />
        <Table
          rowSelection={{
            type: "radio",
            selectedRowKeys,
            onChange: onRowSelectChange,
          }}
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          scroll={{
            // x: "auto",
            y: "calc(100vh - 360px)",
          }}
        />
      </Modal>
    </div>
  );
}
