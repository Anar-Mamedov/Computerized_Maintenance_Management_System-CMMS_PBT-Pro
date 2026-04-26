import React, { useCallback, useEffect, useState } from "react";
import { Checkbox, Table } from "antd";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import AxiosInstance from "../../../../../../../../api/http";
import CreateModal from "./Insert/CreateModal";
import EditModal from "./Update/EditModal";
import ContextMenu from "./components/ContextMenu/ContextMenu.jsx";

const PersonnelListWrapper = styled.div`
  margin-bottom: 25px;
  padding: 20px;
  border: 1px solid #dbe4f0;
  border-radius: 14px;
  background: #fbfdff;

  .personnel-list-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 18px;
  }

  .personnel-list-title {
    margin: 0 0 6px;
    color: #1464ff;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.3;
  }

  .personnel-list-description {
    margin: 0;
    color: #5f7190;
    font-size: 12px;
    line-height: 1.4;
  }

  .personnel-list-create-trigger {
    margin: 0 !important;
    width: auto !important;
    justify-content: flex-start !important;
  }

  .personnel-list-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .personnel-list-add-button {
    height: 36px;
    border-color: #d8e2ef;
    border-radius: 10px;
    color: #30445f;
    font-weight: 500;
    box-shadow: 0 2px 5px rgba(18, 38, 63, 0.12);
  }

  .personnel-list-table {
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

  .personnel-list-name {
    font-weight: 600;
  }

  .personnel-list-field {
    min-height: 33px;
    padding: 7px 12px;
    border: 1px solid #dbe4f0;
    border-radius: 8px;
    background: #f9fbfe;
    color: #405574;
    line-height: 1.35;
    box-shadow: 0 2px 5px rgba(18, 38, 63, 0.08);
  }

  .personnel-list-cost {
    color: #006fbd;
    font-weight: 600;
  }

  .personnel-list-checkbox {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 768px) {
    padding: 14px;

    .personnel-list-header {
      flex-direction: column;
    }

    .personnel-list-actions {
      width: 100%;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
  }
`;

const normalizeBoolean = (value) => {
  if (typeof value === "boolean") return value;
  return value === 1 || value === "1" || value === "true";
};

const normalizePersonnelItem = (item, index) => ({
  ...item,
  key: item.TB_ISEMRI_KAYNAK_ID,
  rowNo: index + 1,
  IDK_FAZLA_MESAI_VAR: normalizeBoolean(item.IDK_FAZLA_MESAI_VAR),
});

export default function PersonelListesiTablo({ isActive, assignmentRequestKey }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { watch } = useFormContext();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const kapali = watch("kapali");
  const calismaSaat = Number(watch("calismaSaat") || 0);
  const calismaDakika = Number(watch("calismaDakika") || 0);
  const defaultCalismaSuresiDakika = calismaSaat * 60 + calismaDakika;
  const secilenIsEmriID = watch("secilenIsEmriID");

  const getEmptyText = (value) => {
    if (value === null || value === undefined || value === "") return "-";
    return value;
  };

  const formatDuration = (value) => {
    if (value === null || value === undefined || value === "") return "-";
    return `${value} ${t("workOrder.personnelList.minuteShort")}`;
  };

  const formatOvertimeDuration = (value) => {
    const duration = Number(value || 0);

    if (duration === 0) {
      return `0 ${t("workOrder.personnelList.minuteShort")}`;
    }

    if (duration % 60 === 0) {
      return `${duration / 60} ${t("workOrder.personnelList.hourShort")}`;
    }

    return `${duration} ${t("workOrder.personnelList.minuteShort")}`;
  };

  const formatCost = (value) => {
    const amount = Number(value || 0);
    const formattedAmount = new Intl.NumberFormat(navigator.language || "tr-TR", {
      maximumFractionDigits: 0,
    }).format(amount);

    return `${formattedAmount} TL`;
  };

  const columns = [
    {
      title: t("workOrder.personnelList.no"),
      dataIndex: "rowNo",
      key: "rowNo",
      width: 60,
      ellipsis: true,
    },
    {
      title: t("workOrder.personnelList.personnel"),
      dataIndex: "IDK_ISIM",
      key: "IDK_ISIM",
      width: 300,
      ellipsis: true,
      render: (text) => <span className="personnel-list-name">{getEmptyText(text)}</span>,
    },
    {
      title: t("workOrder.personnelList.role"),
      dataIndex: "PRS_GOREV",
      key: "PRS_GOREV",
      width: 140,
      render: (text) => <div className="personnel-list-field">{getEmptyText(text)}</div>,
    },
    {
      title: t("workOrder.personnelList.shift"),
      dataIndex: "IDK_VARDIYA_TANIM",
      key: "IDK_VARDIYA_TANIM",
      width: 170,
      render: (text) => <div className="personnel-list-field">{getEmptyText(text)}</div>,
    },
    {
      title: t("workOrder.personnelList.duration"),
      dataIndex: "IDK_SURE",
      key: "IDK_SURE",
      width: 120,
      render: (text) => <div className="personnel-list-field">{formatDuration(text)}</div>,
    },
    {
      title: t("workOrder.personnelList.overtime"),
      dataIndex: "IDK_FAZLA_MESAI_VAR",
      key: "IDK_FAZLA_MESAI_VAR",
      width: 135,
      render: (text) => (
        <div className="personnel-list-field personnel-list-checkbox">
          <Checkbox checked={normalizeBoolean(text)} disabled />
        </div>
      ),
    },
    {
      title: t("workOrder.personnelList.overtimeDuration"),
      dataIndex: "IDK_FAZLA_MESAI_SURE",
      key: "IDK_FAZLA_MESAI_SURE",
      width: 130,
      render: (text) => <div className="personnel-list-field">{formatOvertimeDuration(text)}</div>,
    },
    {
      title: t("workOrder.personnelList.cost"),
      dataIndex: "IDK_MALIYET",
      key: "IDK_MALIYET",
      width: 150,
      render: (text) => <div className="personnel-list-field personnel-list-cost">{formatCost(text)}</div>,
    },
  ];

  const fetch = useCallback(() => {
    if (isActive) {
      setLoading(true);
      AxiosInstance.get(`IsEmriPersonelList?isemriID=${secilenIsEmriID}`)
        .then((response) => {
          const responseData = Array.isArray(response) ? response : response?.data || [];
          const fetchedData = responseData.map(normalizePersonnelItem);
          setData(fetchedData);
          setSelectedRowKeys([]);
          setSelectedRows([]);
        })
        .catch((error) => {
          console.error("API isteği sırasında hata oluştu:", error);
        })
        .finally(() => setLoading(false));
    }
  }, [secilenIsEmriID, isActive]);

  const refreshTable = useCallback(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (secilenIsEmriID) {
      fetch();
    }
  }, [secilenIsEmriID, fetch]);

  const onRowClick = (record) => {
    setSelectedRow(record);
    setIsModalVisible(true);
  };

  const onRowSelectChange = (selectedKeys, selectedRecords) => {
    setSelectedRowKeys(selectedKeys);
    setSelectedRows(selectedRecords);
  };

  return (
    <PersonnelListWrapper>
      <div className="personnel-list-header">
        <div>
          <h3 className="personnel-list-title">{t("workOrder.personnelList.title")}</h3>
          <p className="personnel-list-description">{t("workOrder.personnelList.description")}</p>
        </div>
        <div className="personnel-list-actions">
          {selectedRows.length >= 1 && <ContextMenu selectedRows={selectedRows} refreshTableData={refreshTable} />}
          <CreateModal
            kapali={kapali}
            onRefresh={refreshTable}
            secilenIsEmriID={secilenIsEmriID}
            defaultCalismaSuresiDakika={defaultCalismaSuresiDakika}
            openRequestKey={assignmentRequestKey}
            triggerButtonText={t("workOrder.personnelList.addPersonnel")}
            triggerButtonType="default"
            triggerButtonClassName="personnel-list-add-button"
            triggerContainerClassName="personnel-list-create-trigger"
          />
        </div>
      </div>

      <div className="personnel-list-table">
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: onRowSelectChange,
          }}
          onRow={(record) => ({
            onClick: () => onRowClick(record),
          })}
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={false}
          scroll={{
            x: 1160,
            y: "calc(100vh - 420px)",
          }}
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
    </PersonnelListWrapper>
  );
}
