import React, { useCallback, useEffect, useState } from "react";
import { Button, Input, Modal, Spin, Switch, Table, Typography, message } from "antd";
import { PlusOutlined, SearchOutlined, ExclamationCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import AxiosInstance from "../../../api/http";

const { Text } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

const PageWrapper = styled.div`
  display: flex;
  height: calc(100vh - 160px);
  gap: 0;
`;

const Sidebar = styled.div`
  width: 280px;
  min-width: 280px;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden;
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 16px 12px 16px;
`;

const SidebarSearch = styled.div`
  padding: 0 16px 12px 16px;
`;

const SidebarList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const SidebarItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  border-left: 3px solid ${(props) => (props.$active ? "#1890ff" : "transparent")};
  background: ${(props) => (props.$active ? "#f0f7ff" : "transparent")};
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.$active ? "#f0f7ff" : "#fafafa")};
  }
`;

const SidebarItemTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #262626;
`;

const SidebarItemDesc = styled.div`
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 2px;
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px 24px;
  background: #fff;
  overflow: hidden;
`;

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ContentTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
`;

export default function KodYonetimi() {
  const { t } = useTranslation();

  // State
  const [kodGruplari, setKodGruplari] = useState([]);
  const [kodlar, setKodlar] = useState([]);
  const [selectedGrup, setSelectedGrup] = useState(null);
  const [grupLoading, setGrupLoading] = useState(false);
  const [kodLoading, setKodLoading] = useState(false);
  const [grupSearchTerm, setGrupSearchTerm] = useState("");
  const [kodSearchTerm, setKodSearchTerm] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingKod, setEditingKod] = useState(null);
  const [formData, setFormData] = useState({
    KOD_TANIM: "",
    KOD_ACIKLAMA: "",
    KOD_AKTIF: true,
  });

  // Fetch kod gruplari
  const fetchKodGruplari = useCallback(async () => {
    try {
      setGrupLoading(true);
      const response = await AxiosInstance.get("GetKodGruplari");
      if (response && response.data) {
        setKodGruplari(response.data);
      } else if (Array.isArray(response)) {
        setKodGruplari(response);
      }
    } catch (error) {
      console.error("Error fetching kod gruplari:", error);
      message.error(t("islemBasarisiz"));
    } finally {
      setGrupLoading(false);
    }
  }, [t]);

  // Fetch kodlar by grup
  const fetchKodlar = useCallback(
    async (kodGrupId) => {
      try {
        setKodLoading(true);
        const response = await AxiosInstance.get(`GetKodlarByGrup?kodGrupId=${kodGrupId}`);
        if (response && response.data) {
          setKodlar(response.data.map((item) => ({ ...item, key: item.TB_KOD_ID })));
        } else if (Array.isArray(response)) {
          setKodlar(response.map((item) => ({ ...item, key: item.TB_KOD_ID })));
        } else {
          setKodlar([]);
        }
      } catch (error) {
        console.error("Error fetching kodlar:", error);
        message.error(t("islemBasarisiz"));
        setKodlar([]);
      } finally {
        setKodLoading(false);
      }
    },
    [t]
  );

  useEffect(() => {
    fetchKodGruplari();
  }, [fetchKodGruplari]);

  useEffect(() => {
    if (selectedGrup) {
      fetchKodlar(selectedGrup.KGP_GRUP);
    }
  }, [selectedGrup, fetchKodlar]);

  // Grup seçimi
  const handleGrupSelect = (grup) => {
    setSelectedGrup(grup);
    setKodSearchTerm("");
  };

  // Modal aç - yeni kayıt
  const handleOpenNew = () => {
    setEditingKod(null);
    setFormData({
      KOD_TANIM: "",
      KOD_ACIKLAMA: "",
      KOD_AKTIF: true,
    });
    setModalOpen(true);
  };

  // Modal aç - düzenleme
  const handleOpenEdit = (record) => {
    setEditingKod(record);
    setFormData({
      KOD_TANIM: record.KOD_TANIM || "",
      KOD_ACIKLAMA: record.KOD_ACIKLAMA || "",
      KOD_AKTIF: record.KOD_AKTIF !== undefined ? record.KOD_AKTIF : true,
    });
    setModalOpen(true);
  };

  // Kaydet
  const handleSave = async () => {
    if (!formData.KOD_TANIM.trim()) {
      message.warning(t("kodYonetimi.tanimZorunlu"));
      return;
    }

    try {
      setModalLoading(true);
      const body = {
        TB_KOD_ID: editingKod ? editingKod.TB_KOD_ID : 0,
        KOD_GRUP: selectedGrup.KGP_GRUP,
        KOD_TANIM: formData.KOD_TANIM,
        KOD_ACIKLAMA: formData.KOD_ACIKLAMA,
        KOD_AKTIF: formData.KOD_AKTIF,
        KOD_GOR: true,
        KOD_DEGISTIR: true,
        KOD_SIL: true,
      };

      const response = await AxiosInstance.post("UpsertKod", body);
      if (response && (response.status_code === 200 || !response.has_error)) {
        message.success(response.status || t("islemBasarili"));
        setModalOpen(false);
        fetchKodlar(selectedGrup.KGP_GRUP);
      } else {
        message.error(response?.status || t("islemBasarisiz"));
      }
    } catch (error) {
      console.error("Error saving kod:", error);
      message.error(t("islemBasarisiz"));
    } finally {
      setModalLoading(false);
    }
  };

  // Sil
  const handleDelete = (record) => {
    confirm({
      title: t("kodYonetimi.silBaslik"),
      icon: <ExclamationCircleOutlined />,
      content: t("kodYonetimi.silOnay"),
      okText: t("kodYonetimi.sil"),
      cancelText: t("kodYonetimi.vazgec"),
      okType: "danger",
      async onOk() {
        try {
          const response = await AxiosInstance.post(`DeleteKod?kodId=${record.TB_KOD_ID}`);
          if (response && (response.status_code === 200 || !response.has_error)) {
            message.success(response.status || t("islemBasarili"));
            fetchKodlar(selectedGrup.KGP_GRUP);
          } else {
            message.error(response?.status || t("islemBasarisiz"));
          }
        } catch (error) {
          const errorMsg = error?.response?.data?.status || t("islemBasarisiz");
          message.error(errorMsg);
        }
      },
    });
  };

  // Normalize string for search
  const normalizeString = (str) => {
    if (!str) return "";
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/ğ/gim, "g")
      .replace(/ü/gim, "u")
      .replace(/ş/gim, "s")
      .replace(/ı/gim, "i")
      .replace(/ö/gim, "o")
      .replace(/ç/gim, "c");
  };

  // Filtrelenmiş gruplar
  const filteredGruplar = kodGruplari.filter(
    (grup) =>
      normalizeString(grup.KGP_TANIM).includes(normalizeString(grupSearchTerm)) || normalizeString(grup.KGP_KOD).includes(normalizeString(grupSearchTerm))
  );

  // Filtrelenmiş kodlar
  const filteredKodlar = kodlar.filter(
    (kod) =>
      normalizeString(kod.KOD_TANIM).includes(normalizeString(kodSearchTerm)) ||
      normalizeString(kod.KOD_ACIKLAMA).includes(normalizeString(kodSearchTerm)) ||
      normalizeString(kod.KOD_TANIM_ENG).includes(normalizeString(kodSearchTerm))
  );

  // Tablo kolonları
  const columns = [
    {
      title: t("kodYonetimi.tanim"),
      dataIndex: "KOD_TANIM",
      key: "KOD_TANIM",
      ellipsis: true,
      sorter: (a, b) => (a.KOD_TANIM || "").localeCompare(b.KOD_TANIM || ""),
      render: (text, record) => (
        <div>
          <a onClick={() => handleOpenEdit(record)} style={{ fontWeight: 500 }}>
            {text}
          </a>
          {record.KOD_ACIKLAMA && <div style={{ fontSize: 12, color: "#8c8c8c" }}>{record.KOD_ACIKLAMA}</div>}
        </div>
      ),
    },
    {
      title: t("kodYonetimi.kullanim"),
      dataIndex: "KOD_KULLANIM",
      key: "KOD_KULLANIM",
      width: 100,
      align: "right",
      sorter: (a, b) => (a.KOD_KULLANIM || 0) - (b.KOD_KULLANIM || 0),
    },
    {
      title: "",
      key: "actions",
      width: 50,
      align: "center",
      render: (_, record) => (
        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
      ),
    },
  ];

  return (
    <PageWrapper>
      {/* Sol Menü */}
      <Sidebar>
        <SidebarHeader>
          <Text strong style={{ fontSize: 16 }}>
            {t("kodYonetimi.kodlar")}
          </Text>
          <Text type="secondary" style={{ fontSize: 13 }}>
            {t("kodYonetimi.kayit", { count: filteredGruplar.length })}
          </Text>
        </SidebarHeader>
        <SidebarSearch>
          <Input
            placeholder={t("kodYonetimi.kodAdiAra")}
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            value={grupSearchTerm}
            onChange={(e) => setGrupSearchTerm(e.target.value)}
            allowClear
            size="small"
          />
        </SidebarSearch>
        <SidebarList>
          <Spin spinning={grupLoading}>
            {filteredGruplar.map((grup) => (
              <SidebarItem key={grup.TB_KOD_GRUP_ID} $active={selectedGrup?.TB_KOD_GRUP_ID === grup.TB_KOD_GRUP_ID} onClick={() => handleGrupSelect(grup)}>
                <SidebarItemTitle>{grup.KGP_TANIM}</SidebarItemTitle>
                {grup.MDL_TANIM && <SidebarItemDesc>{grup.MDL_TANIM}</SidebarItemDesc>}
              </SidebarItem>
            ))}
          </Spin>
        </SidebarList>
      </Sidebar>

      {/* Sağ İçerik */}
      <ContentArea>
        {selectedGrup ? (
          <>
            <ContentHeader>
              <ContentTitle>{selectedGrup.KGP_TANIM}</ContentTitle>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenNew}>
                {t("kodYonetimi.yeni")}
              </Button>
            </ContentHeader>
            <Input
              placeholder={t("kodYonetimi.itemAra", { grup: selectedGrup.KGP_TANIM })}
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              value={kodSearchTerm}
              onChange={(e) => setKodSearchTerm(e.target.value)}
              allowClear
              style={{ marginBottom: 16 }}
            />
            <Spin spinning={kodLoading}>
              <Table
                columns={columns}
                dataSource={filteredKodlar}
                pagination={{
                  defaultPageSize: 10,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "50", "100"],
                  position: ["bottomRight"],
                  showTotal: (total) => t("kodYonetimi.kayit", { count: total }),
                }}
                scroll={{ y: "calc(100vh - 370px)" }}
                size="middle"
              />
            </Spin>
          </>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#8c8c8c" }}>
            <Text type="secondary" style={{ fontSize: 16 }}>
              {t("kodYonetimi.grupSecin")}
            </Text>
          </div>
        )}
      </ContentArea>

      {/* Yeni/Düzenle Modal */}
      <Modal
        title={editingKod ? t("kodYonetimi.itemGuncelle") : t("kodYonetimi.yeniItem")}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalOpen(false)}>
            {t("kodYonetimi.vazgec")}
          </Button>,
          <Button key="save" type="primary" loading={modalLoading} onClick={handleSave}>
            {t("kodYonetimi.kaydet")}
          </Button>,
        ]}
        destroyOnClose
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 8 }}>
          <div>
            <Text strong>
              <span style={{ color: "#ff4d4f" }}>* </span>
              {t("kodYonetimi.tanim")}
            </Text>
            <Input
              placeholder={t("kodYonetimi.tanimPlaceholder")}
              value={formData.KOD_TANIM}
              onChange={(e) => setFormData({ ...formData, KOD_TANIM: e.target.value })}
              style={{ marginTop: 4 }}
            />
          </div>
          <div>
            <Text strong>{t("kodYonetimi.aciklama")}</Text>
            <TextArea
              placeholder={t("kodYonetimi.aciklamaPlaceholder")}
              value={formData.KOD_ACIKLAMA}
              onChange={(e) => setFormData({ ...formData, KOD_ACIKLAMA: e.target.value })}
              rows={3}
              style={{ marginTop: 4 }}
            />
          </div>
          <div>
            <Text strong>{t("kodYonetimi.aktif")}</Text>
            <div style={{ marginTop: 4 }}>
              <Switch checked={formData.KOD_AKTIF} onChange={(checked) => setFormData({ ...formData, KOD_AKTIF: checked })} />
            </div>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
}
