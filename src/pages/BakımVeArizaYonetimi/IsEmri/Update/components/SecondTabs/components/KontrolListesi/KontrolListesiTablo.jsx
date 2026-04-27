import React, { useCallback, useEffect, useState } from "react";
import { Button, Input, InputNumber, message, Popconfirm, Popover, Select, Table, Typography } from "antd";
import { DeleteOutlined, MoreOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import AxiosInstance from "../../../../../../../../api/http";
import CreateModal from "./Insert/CreateModal";
import EditModal from "./Update/EditModal";

const { Text } = Typography;

const ControlListWrapper = styled.div`
  margin-bottom: 25px;
  padding: 20px;
  border: 1px solid #dbe4f0;
  border-radius: 14px;
  background: #fbfdff;

  .control-list-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 18px;
  }

  .control-list-title {
    margin: 0 0 6px;
    color: #1464ff;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.3;
  }

  .control-list-description {
    margin: 0;
    color: #5f7190;
    font-size: 12px;
    line-height: 1.4;
  }

  .control-list-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .control-list-create-trigger {
    margin: 0 !important;
    width: auto !important;
    justify-content: flex-start !important;
  }

  .control-list-button,
  .control-list-add-button {
    height: 36px;
    border-color: #d8e2ef;
    border-radius: 10px;
    color: #30445f;
    font-weight: 500;
    box-shadow: 0 2px 5px rgba(18, 38, 63, 0.12);
  }

  .control-list-context-button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    padding: 0 8px;
    border-color: #2bc770 !important;
    border-radius: 10px;
    background-color: #2bc770 !important;
    color: #fff !important;
    box-shadow: 0 2px 5px rgba(18, 38, 63, 0.12);
  }

  .control-list-context-button:hover,
  .control-list-context-button:focus,
  .control-list-context-button:active {
    border-color: #2bc770 !important;
    background-color: #2bc770 !important;
    color: #fff !important;
  }

  .control-list-table {
    overflow: hidden;
    border: 1px solid #dbe4f0;
    border-radius: 14px;
    background: #fff;
  }

  .ant-table {
    background: transparent;
  }

  .ant-table-thead > tr > th {
    border-bottom: 1px solid #e2eaf4;
    background: #f8fbff !important;
    color: #8ca0ba;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0;
  }

  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #edf2f7;
    color: #30445f;
    font-size: 14px;
  }

  .ant-table-tbody > tr:last-child > td {
    border-bottom: 0;
  }

  .ant-table-tbody > tr:hover > td {
    background: #f8fbff !important;
  }

  .control-list-step {
    cursor: pointer;
    font-weight: 600;
  }

  .control-list-step:hover {
    color: #1464ff;
    text-decoration: underline;
  }

  .control-list-field {
    min-height: 33px;
    padding: 7px 12px;
    border: 1px solid #dbe4f0;
    border-radius: 8px;
    background: #f9fbfe;
    color: #405574;
    line-height: 1.35;
  }

  .control-list-editable-field {
    width: 100%;
  }

  .control-list-editable-field.ant-input,
  .control-list-editable-field .ant-input-number-input {
    color: #405574;
  }

  .control-list-editable-field.ant-input,
  .control-list-editable-field.ant-input-number {
    min-height: 33px;
    border-color: #dbe4f0;
    border-radius: 8px;
    background: #f9fbfe;
  }

  .control-list-status .ant-select-selector {
    min-height: 33px;
    border-color: #dbe4f0 !important;
    border-radius: 8px !important;
    background: #fff !important;
    box-shadow: 0 2px 5px rgba(18, 38, 63, 0.08);
  }

  .control-result-note {
    margin-top: 16px;
    padding: 16px;
    border: 1px solid #dbe4f0;
    border-radius: 14px;
    background: #fff;
    box-shadow: 0 2px 5px rgba(18, 38, 63, 0.08);
  }

  .control-result-note-label {
    display: block;
    margin-bottom: 8px;
    color: #8ca0ba;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.4px;
    text-transform: uppercase;
  }

  .control-result-note textarea.ant-input {
    min-height: 88px;
    border-color: #dbe4f0;
    border-radius: 10px;
    background: #f9fbfe;
    color: #405574;
    resize: vertical;
  }

  @media (max-width: 768px) {
    padding: 14px;

    .control-list-header {
      flex-direction: column;
    }

    .control-list-actions {
      width: 100%;
      flex-wrap: wrap;
    }
  }
`;

const normalizeChecklistStatus = (value) => {
  if (value === true) return 1;
  if (value === false || value === null || value === undefined || value === "") return 0;
  const status = Number(value);
  return Number.isNaN(status) ? 0 : status;
};

const normalizeChecklistItem = (item) => {
  const id = item.Id ?? item.TB_ISEMRI_KONTROLLIST_ID;
  const no = item.No ?? item.DKN_SIRANO;
  const name = item.Ad ?? item.DKN_TANIM;
  const status = normalizeChecklistStatus(item.Durum ?? item.DKN_YAPILDI);
  const personelId = item.PersonelId ?? item.DKN_YAPILDI_PERSONEL_ID ?? 0;
  const personelName = item.PersonelAd ?? item.DKN_PERSONEL_ISIM;
  const duration = item.Sure ?? item.DKN_YAPILDI_SURE ?? 0;
  const note = item.Not ?? item.DKN_ACIKLAMA ?? "";

  return {
    ...item,
    key: id,
    Id: id,
    No: no,
    Ad: name,
    Durum: status,
    PersonelId: personelId,
    PersonelAd: personelName,
    Sure: duration,
    Not: note,
    TB_ISEMRI_KONTROLLIST_ID: id,
    DKN_SIRANO: no,
    DKN_TANIM: name,
    DKN_YAPILDI: status,
    DKN_PERSONEL_ISIM: personelName,
    DKN_YAPILDI_PERSONEL_ID: personelId,
    DKN_YAPILDI_SURE: duration,
    DKN_ACIKLAMA: note,
  };
};

export default function KontrolListesiTablo({ isActive }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [bulkCompleting, setBulkCompleting] = useState(false);
  const [actionVisible, setActionVisible] = useState(false);
  const { control, setValue, watch } = useFormContext();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const kapali = watch("kapali");
  const secilenIsEmriID = watch("secilenIsEmriID");

  const getEmptyText = (value) => {
    if (value === null || value === undefined || value === "") return "-";
    return value;
  };

  const getStatusOptions = () => [
    { value: 0, label: t("workOrder.controlList.waiting") },
    { value: 1, label: t("workOrder.controlList.completed") },
    { value: 2, label: t("workOrder.controlList.critical") },
  ];

  const buildChecklistPayload = (item, status = item.DKN_YAPILDI) => ({
    TB_ISEMRI_KONTROLLIST_ID: item.TB_ISEMRI_KONTROLLIST_ID,
    DKN_SIRANO: item.DKN_SIRANO,
    DKN_YAPILDI: normalizeChecklistStatus(status),
    DKN_TANIM: item.DKN_TANIM,
    DKN_YAPILDI_PERSONEL_ID: item.DKN_YAPILDI_PERSONEL_ID || 0,
    DKN_YAPILDI_ATOLYE_ID: item.DKN_YAPILDI_ATOLYE_ID || 0,
    DKN_YAPILDI_SURE: item.DKN_YAPILDI_SURE || 0,
    DKN_ACIKLAMA: item.DKN_ACIKLAMA || "",
    DKN_YAPILDI_KOD_ID: item.DKN_YAPILDI_KOD_ID || -1,
    DKN_REF_ID: item.DKN_REF_ID || -1,
    DKN_YAPILDI_TARIH: item.DKN_YAPILDI_TARIH || "",
    DKN_YAPILDI_SAAT: item.DKN_YAPILDI_SAAT || "",
    DKN_BITIS_TARIH: item.DKN_BITIS_TARIH || "",
    DKN_BITIS_SAAT: item.DKN_BITIS_SAAT || "",
    DKN_YAPILDI_MESAI_KOD_ID: item.DKN_YAPILDI_MESAI_KOD_ID || 0,
  });

  const handleStatusChange = async (record, status) => {
    const nextStatus = normalizeChecklistStatus(status);
    const previousData = data;

    setData((currentData) => currentData.map((item) => (item.key === record.key ? { ...item, DKN_YAPILDI: nextStatus, Durum: nextStatus } : item)));

    try {
      const response = await AxiosInstance.post(`AddUpdateIsEmriKontrolList?isEmriId=${secilenIsEmriID}`, buildChecklistPayload(record, nextStatus));

      if (response?.status_code && response.status_code !== 200 && response.status_code !== 201) {
        setData(previousData);
        message.error(t("workOrder.controlList.statusUpdateError"));
      } else {
        message.success(t("workOrder.controlList.statusUpdateSuccess"));
      }
    } catch (error) {
      console.error("Kontrol listesi durum güncelleme hatası:", error);
      setData(previousData);
      message.error(t("workOrder.controlList.statusUpdateError"));
    }
  };

  const updateChecklistInlineField = async (record, fieldName, value) => {
    const nextRecord = {
      ...record,
      [fieldName]: value,
    };

    if (fieldName === "DKN_YAPILDI_SURE") {
      nextRecord.Sure = value;
    }

    if (fieldName === "DKN_ACIKLAMA") {
      nextRecord.Not = value;
    }

    const previousData = data;
    setData((currentData) => currentData.map((item) => (item.key === record.key ? { ...item, ...nextRecord } : item)));

    try {
      const response = await AxiosInstance.post(`AddUpdateIsEmriKontrolList?isEmriId=${secilenIsEmriID}`, buildChecklistPayload(nextRecord));

      if (response?.status_code && response.status_code !== 200 && response.status_code !== 201) {
        setData(previousData);
        message.error(t("workOrder.controlList.statusUpdateError"));
      }
    } catch (error) {
      console.error("Kontrol listesi alan güncelleme hatası:", error);
      setData(previousData);
      message.error(t("workOrder.controlList.statusUpdateError"));
    }
  };

  const handleInlineDurationChange = (record, value) => {
    const nextValue = value ?? 0;
    setData((currentData) => currentData.map((item) => (item.key === record.key ? { ...item, DKN_YAPILDI_SURE: nextValue, Sure: nextValue } : item)));
  };

  const handleInlineNoteChange = (record, event) => {
    const nextValue = event.target.value;
    setData((currentData) => currentData.map((item) => (item.key === record.key ? { ...item, DKN_ACIKLAMA: nextValue, Not: nextValue } : item)));
  };

  const columns = [
    {
      title: t("workOrder.controlList.no"),
      dataIndex: "DKN_SIRANO",
      key: "DKN_SIRANO",
      width: 70,
      ellipsis: true,
    },
    {
      title: t("workOrder.controlList.step"),
      dataIndex: "DKN_TANIM",
      key: "DKN_TANIM",
      width: 360,
      ellipsis: true,
      render: (text, record) => (
        <span className="control-list-step" onClick={() => onRowClick(record)}>
          {getEmptyText(text)}
        </span>
      ),
    },
    {
      title: t("workOrder.controlList.status"),
      dataIndex: "DKN_YAPILDI",
      key: "DKN_YAPILDI",
      width: 170,
      render: (text, record) => (
        <Select
          className="control-list-status"
          value={normalizeChecklistStatus(text)}
          disabled={kapali}
          style={{ width: "100%" }}
          options={getStatusOptions()}
          onClick={(event) => event.stopPropagation()}
          onChange={(value) => handleStatusChange(record, value)}
        />
      ),
    },
    {
      title: t("workOrder.controlList.personnel"),
      dataIndex: "DKN_PERSONEL_ISIM",
      key: "DKN_PERSONEL_ISIM",
      width: 180,
      render: (text) => <div className="control-list-field">{getEmptyText(text)}</div>,
    },
    {
      title: t("workOrder.controlList.duration"),
      dataIndex: "DKN_YAPILDI_SURE",
      key: "DKN_YAPILDI_SURE",
      width: 130,
      render: (text, record) => (
        <InputNumber
          className="control-list-editable-field"
          value={Number(text || 0)}
          min={0}
          disabled={kapali}
          formatter={(value) => `${value ?? 0} ${t("workOrder.controlList.minuteShort")}`}
          parser={(value) => Number(String(value || "0").replace(/\D/g, ""))}
          onClick={(event) => event.stopPropagation()}
          onChange={(value) => handleInlineDurationChange(record, value)}
          onBlur={(event) => updateChecklistInlineField(record, "DKN_YAPILDI_SURE", Number(String(event.target.value || "0").replace(/\D/g, "")))}
        />
      ),
    },
    {
      title: t("workOrder.controlList.note"),
      dataIndex: "DKN_ACIKLAMA",
      key: "DKN_ACIKLAMA",
      render: (text, record) => (
        <Input
          className="control-list-editable-field"
          value={text || ""}
          disabled={kapali}
          placeholder="-"
          onClick={(event) => event.stopPropagation()}
          onChange={(event) => handleInlineNoteChange(record, event)}
          onBlur={(event) => updateChecklistInlineField(record, "DKN_ACIKLAMA", event.target.value)}
        />
      ),
    },
  ];

  const fetch = useCallback(() => {
    if (isActive) {
      setLoading(true);
      AxiosInstance.get(`FetchIsEmriKontrolList?isemriID=${secilenIsEmriID}`)
        .then((response) => {
          const responseData = Array.isArray(response) ? response : Array.isArray(response?.data) ? response.data : Array.isArray(response?.data?.data) ? response.data.data : [];
          const kontrolNot = Array.isArray(response) ? "" : response?.kontrol_not ?? response?.data?.kontrol_not ?? "";
          const fetchedData = responseData.map(normalizeChecklistItem);
          setValue("kontrolSonucNotu", kontrolNot);
          setValue("kapamaAciklama", kontrolNot);
          setData(fetchedData);
          setSelectedRowKeys([]);
          setSelectedRows([]);
        })
        .catch((error) => {
          // Hata işleme
          console.error("API isteği sırasında hata oluştu:", error);
        })
        .finally(() => setLoading(false));
    }
  }, [secilenIsEmriID, isActive, setValue]); // secilenIsEmriID değiştiğinde fetch fonksiyonunu güncelle

  useEffect(() => {
    if (secilenIsEmriID) {
      // secilenIsEmriID'nin varlığını ve geçerliliğini kontrol edin
      fetch(); // fetch fonksiyonunu çağırın
    }
  }, [secilenIsEmriID, fetch]); // secilenIsEmriID veya fetch fonksiyonu değiştiğinde useEffect'i tetikle

  const onRowClick = (record) => {
    setSelectedRow(record);
    setIsModalVisible(true);
  };

  const refreshTable = useCallback(() => {
    fetch(); // fetch fonksiyonu tabloyu yeniler
  }, [fetch]);

  const onRowSelectChange = (selectedKeys, selectedRecords) => {
    setSelectedRowKeys(selectedKeys);
    setSelectedRows(selectedRecords);
  };

  const handleDeleteSelected = async () => {
    let hasError = false;

    for (const row of selectedRows) {
      try {
        const response = await AxiosInstance.post(`DeleteIsEmriKontrolList?id=${row.key}`);

        if (response.status_code === 200 || response.status_code === 201) {
          message.success(t("workOrder.controlList.deleteSuccess"));
        } else if (response.status_code === 401) {
          hasError = true;
          message.error(t("workOrder.controlList.noPermission"));
        } else {
          hasError = true;
          message.error(t("workOrder.controlList.deleteError"));
        }
      } catch (error) {
        hasError = true;
        console.error("Kontrol listesi silme işlemi sırasında hata oluştu:", error);
        message.error(t("workOrder.controlList.deleteError"));
      }
    }

    if (!hasError) {
      setActionVisible(false);
      refreshTable();
    }
  };

  const handleCompleteAll = async () => {
    const waitingRows = data.filter((item) => normalizeChecklistStatus(item.DKN_YAPILDI) !== 1);

    if (!waitingRows.length) {
      message.info(t("workOrder.controlList.allAlreadyCompleted"));
      return;
    }

    setBulkCompleting(true);

    try {
      const responses = await Promise.all(waitingRows.map((item) => AxiosInstance.post(`AddUpdateIsEmriKontrolList?isEmriId=${secilenIsEmriID}`, buildChecklistPayload(item, 1))));

      const hasError = responses.some((response) => response?.status_code && response.status_code !== 200 && response.status_code !== 201);

      if (hasError) {
        message.error(t("workOrder.controlList.completeAllError"));
      } else {
        message.success(t("workOrder.controlList.completeAllSuccess"));
        refreshTable();
      }
    } catch (error) {
      console.error("Kontrol listesi toplu tamamlama hatası:", error);
      message.error(t("workOrder.controlList.completeAllError"));
    } finally {
      setBulkCompleting(false);
    }
  };

  const handleResultNoteBlur = async (value) => {
    if (!secilenIsEmriID || kapali) {
      return;
    }

    const payload = {
      TB_ISEMRI_KONTROLLIST_ID: 0,
      DKN_ISEMRI_ID: secilenIsEmriID,
      DKN_TANIM: "",
      ISM_KONTROL_SONUC_NOT: value || "",
    };

    try {
      const response = await AxiosInstance.post(`AddUpdateIsEmriKontrolList?isEmriId=${secilenIsEmriID}`, payload);

      if (response?.status_code && response.status_code !== 200 && response.status_code !== 201) {
        message.error(t("workOrder.controlList.statusUpdateError"));
      }
    } catch (error) {
      console.error("Kontrol sonuç notu güncelleme hatası:", error);
      message.error(t("workOrder.controlList.statusUpdateError"));
    }
  };

  return (
    <ControlListWrapper>
      <div className="control-list-header">
        <div>
          <h3 className="control-list-title">{t("workOrder.controlList.title")}</h3>
          <p className="control-list-description">{t("workOrder.controlList.description")}</p>
        </div>
        <div className="control-list-actions">
          {selectedRows.length >= 1 && (
            <Popover
              placement="bottom"
              trigger="click"
              open={actionVisible}
              onOpenChange={setActionVisible}
              content={
                <Popconfirm
                  title={t("workOrder.controlList.deleteTitle")}
                  description={t("workOrder.controlList.deleteConfirm")}
                  okText={t("workOrder.controlList.yes")}
                  cancelText={t("workOrder.controlList.noAnswer")}
                  disabled={kapali}
                  icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                  onConfirm={handleDeleteSelected}
                >
                  <Button disabled={kapali} type="link" danger icon={<DeleteOutlined />} style={{ paddingLeft: 0 }}>
                    {t("workOrder.controlList.delete")}
                  </Button>
                </Popconfirm>
              }
            >
              <Button className="control-list-context-button">
                <Text style={{ color: "white", marginLeft: 3 }}>{selectedRows.length}</Text>
                <MoreOutlined style={{ color: "white", fontSize: 20, margin: 0 }} />
              </Button>
            </Popover>
          )}
          <Button className="control-list-button" disabled={kapali || !data.length} loading={bulkCompleting} onClick={handleCompleteAll}>
            {t("workOrder.controlList.completeAll")}
          </Button>
          <CreateModal
            kapali={kapali}
            onRefresh={refreshTable}
            secilenIsEmriID={secilenIsEmriID}
            triggerButtonText={t("workOrder.controlList.addNew")}
            triggerButtonType="default"
            triggerButtonClassName="control-list-add-button"
            triggerContainerClassName="control-list-create-trigger"
          />
        </div>
      </div>
      <div className="control-list-table">
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: onRowSelectChange,
          }}
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={false}
          scroll={{
            x: 940,
            y: "calc(100vh - 420px)",
          }}
        />
      </div>
      <div className="control-result-note">
        <label className="control-result-note-label">{t("workOrder.controlList.resultNote")}</label>
        <Controller
          name="kontrolSonucNotu"
          control={control}
          render={({ field }) => (
            <Input.TextArea
              {...field}
              disabled={kapali}
              rows={4}
              placeholder={t("workOrder.controlList.resultNotePlaceholder")}
              onChange={(event) => {
                field.onChange(event);
                setValue("kapamaAciklama", event.target.value);
              }}
              onBlur={(event) => {
                field.onBlur();
                handleResultNoteBlur(event.target.value);
              }}
            />
          )}
        />
      </div>
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
    </ControlListWrapper>
  );
}
