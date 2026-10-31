import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Input, Modal, Table } from "antd";
import AxiosInstance from "../../../../../../../../../../../api/http";
import AtolyeFilterSelectbox from "../../../../../../../../../../../utils/components/AtolyeFilterSelectbox";

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

export default function PersonelTablo({ workshopSelectedId, selectedPersoneller = [], onSubmit }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm1, setSearchTerm1] = useState("");
  const [atolyeId, setAtolyeId] = useState();
  // Atölye filtresi değişince seçili personeller listeden çıkabilir; seçim sonucunu kurmak için görülen tüm kayıtlar tutulur.
  const gorulenPersoneller = useRef(new Map());
  // Atölye hızlı değiştirilirse yalnızca son isteğin yanıtı listeye yazılır.
  const sonIstekNo = useRef(0);

  const columns = [
    {
      title: "Personel Kodu",
      dataIndex: "code",
      key: "code",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Personel Adı",
      dataIndex: "subject",
      key: "subject",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Ünvan",
      dataIndex: "workdays",
      key: "workdays",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Personel Tipi",
      dataIndex: "description",
      key: "description",
      width: "150px",
      ellipsis: true,
    },

    {
      title: "Departman",
      dataIndex: "fifthcolumn",
      key: "fifthcolumn",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Lokasyon",
      dataIndex: "sixthcolumn",
      key: "sixthcolumn",
      width: "150px",
      ellipsis: true,
    },
  ];

  const fetch = useCallback((secilenAtolyeId) => {
    const istekNo = ++sonIstekNo.current;
    setLoading(true);
    AxiosInstance.get("Personel", { params: { atolyeId: secilenAtolyeId } })
      .then((response) => {
        if (istekNo !== sonIstekNo.current) return;
        const fetchedData = response.map((item) => ({
          key: item.TB_PERSONEL_ID,
          code: item.PRS_PERSONEL_KOD,
          subject: item.PRS_ISIM,
          workdays: item.PRS_UNVAN,
          description: item.PRS_TIP,
          fifthcolumn: item.PRS_DEPARTMAN,
          sixthcolumn: item.PRS_LOKASYON,
        }));
        fetchedData.forEach((item) => gorulenPersoneller.current.set(String(item.key), item));
        setData(fetchedData);
      })
      .finally(() => {
        if (istekNo === sonIstekNo.current) setLoading(false);
      });
  }, []);

  const getInitialSelectedRowKeys = useCallback(() => {
    if (Array.isArray(selectedPersoneller) && selectedPersoneller.length > 0) {
      return selectedPersoneller.map((personel) => personel.key);
    }

    return workshopSelectedId ? [workshopSelectedId] : [];
  }, [selectedPersoneller, workshopSelectedId]);

  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
    if (!isModalVisible) {
      fetch();
      setSearchTerm1("");
      setAtolyeId(undefined);
      setSelectedRowKeys(getInitialSelectedRowKeys());
    }
  };

  const handleAtolyeChange = (secilenAtolyeId) => {
    setAtolyeId(secilenAtolyeId);
    fetch(secilenAtolyeId);
  };

  const handleModalOk = () => {
    const dataByKey = new Map(gorulenPersoneller.current);
    selectedPersoneller.forEach((personel) => {
      if (!dataByKey.has(String(personel.key))) dataByKey.set(String(personel.key), personel);
    });
    const selectedData = selectedRowKeys.map((key) => dataByKey.get(String(key))).filter(Boolean);

    if (selectedData.length > 0) {
      onSubmit && onSubmit(selectedData);
    }
    setIsModalVisible(false);
  };

  useEffect(() => {
    setSelectedRowKeys(getInitialSelectedRowKeys());
  }, [getInitialSelectedRowKeys]);

  const onRowSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys);
  };

  // Arama, atölyeye göre yeniden çekilen listeye de uygulansın diye veriden türetilir.
  const filteredData1 = useMemo(() => {
    if (!searchTerm1) return data;
    const normalizedSearchTerm = normalizeText(searchTerm1).toLowerCase();
    return data.filter((item) =>
      Object.keys(item).some((key) => item[key] && normalizeText(item[key].toString()).toLowerCase().includes(normalizedSearchTerm))
    );
  }, [data, searchTerm1]);

  const handleSearch1 = (e) => {
    setSearchTerm1(e.target.value);
  };

  return (
    <div>
      <Button onClick={handleModalToggle}> + </Button>
      <Modal
        width={1200}
        centered
        title="Personel"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalToggle}
      >
        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          <Input placeholder="Arama..." value={searchTerm1} onChange={handleSearch1} style={{ width: "300px" }} />
          <div style={{ width: "220px" }}>
            <AtolyeFilterSelectbox tekli value={atolyeId} onChange={handleAtolyeChange} />
          </div>
        </div>
        <Table
          rowSelection={{
            type: "checkbox",
            selectedRowKeys,
            onChange: onRowSelectChange,
            preserveSelectedRowKeys: true,
          }}
          columns={columns}
          dataSource={filteredData1}
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
