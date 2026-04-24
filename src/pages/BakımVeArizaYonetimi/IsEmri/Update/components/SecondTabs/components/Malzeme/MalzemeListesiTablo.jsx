import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Checkbox, message, Popconfirm, Popover, Table, Typography } from "antd";
import { DeleteOutlined, MoreOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import AxiosInstance from "../../../../../../../../api/http";
import CreateModal from "./Insert/CreateModal";
import MalzemeTablo from "./Insert/Stoklu/MalzemeTablo";
import EditModal from "./Update/EditModal";

const { Text } = Typography;

const MaterialListWrapper = styled.div`
  margin-bottom: 25px;
  padding: 20px;
  border: 1px solid #dbe4f0;
  border-radius: 14px;
  background: #fbfdff;

  .material-list-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 18px;
  }

  .material-list-title {
    margin: 0 0 6px;
    color: #1464ff;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.3;
  }

  .material-list-description {
    margin: 0;
    color: #5f7190;
    font-size: 12px;
    line-height: 1.4;
  }

  .material-list-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .material-list-create-trigger,
  .material-stock-trigger {
    margin: 0 !important;
    width: auto !important;
    justify-content: flex-start !important;
  }

  .material-list-add-button,
  .material-stock-button {
    height: 36px;
    border-color: #d8e2ef;
    border-radius: 10px;
    color: #30445f;
    font-weight: 500;
    box-shadow: 0 2px 5px rgba(18, 38, 63, 0.12);
  }

  .material-list-context-button {
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

  .material-list-context-button:hover,
  .material-list-context-button:focus,
  .material-list-context-button:active {
    border-color: #2bc770 !important;
    background-color: #2bc770 !important;
    color: #fff !important;
  }

  .material-list-table {
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

  .material-list-name {
    font-weight: 600;
  }

  .material-list-field {
    min-height: 33px;
    padding: 7px 12px;
    border: 1px solid #dbe4f0;
    border-radius: 8px;
    background: #f9fbfe;
    color: #405574;
    line-height: 1.35;
    box-shadow: 0 2px 5px rgba(18, 38, 63, 0.08);
  }

  .material-list-total {
    color: #006fbd;
    font-weight: 600;
  }

  .material-list-stock {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 768px) {
    padding: 14px;

    .material-list-header {
      flex-direction: column;
    }

    .material-list-actions {
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

const normalizeNumber = (value) => {
  const number = Number(value);
  return Number.isNaN(number) ? 0 : number;
};

const getResponseData = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  return [];
};

const normalizeMaterialItem = (item, index) => {
  const quantity = normalizeNumber(item.Miktar ?? item.IDM_MIKTAR);
  const unitPrice = normalizeNumber(item.BirimFiyat ?? item.IDM_BIRIM_FIYAT);
  const total = item.Tutar ?? item.IDM_TUTAR ?? quantity * unitPrice;
  const id = item.Id ?? item.TB_ISEMRI_MLZ_ID;

  return {
    ...item,
    key: id,
    rowNo: index + 1,
    TB_ISEMRI_MLZ_ID: id,
    Kod: item.Kod ?? item.IDM_STOK_KOD ?? item.STK_KOD ?? "",
    MalzemeAdi: item.MalzemeAdi ?? item.IDM_STOK_TANIM ?? item.STK_TANIM ?? "",
    Miktar: quantity,
    Birim: item.Birim ?? item.IDM_BIRIM ?? item.STK_BIRIM ?? "",
    Depo: item.Depo ?? item.IDM_DEPO ?? "",
    BirimFiyat: unitPrice,
    Tutar: normalizeNumber(total),
    StoktanDusen: normalizeBoolean(item.StoktanDusen ?? item.IDM_STOK_DUS),
  };
};

export default function MalzemeListesiTablo({ isActive }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [actionVisible, setActionVisible] = useState(false);
  const { watch } = useFormContext();
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

  const formatMoney = (value) => {
    const amount = normalizeNumber(value);
    const formattedAmount = new Intl.NumberFormat(navigator.language || "tr-TR", {
      minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return `${formattedAmount} TL`;
  };

  const columns = [
    {
      title: t("workOrder.materialList.no"),
      dataIndex: "rowNo",
      key: "rowNo",
      width: 60,
      ellipsis: true,
    },
    {
      title: t("workOrder.materialList.code"),
      dataIndex: "Kod",
      key: "Kod",
      width: 140,
      ellipsis: true,
    },
    {
      title: t("workOrder.materialList.materialName"),
      dataIndex: "MalzemeAdi",
      key: "MalzemeAdi",
      width: 420,
      ellipsis: true,
      render: (text) => <span className="material-list-name">{getEmptyText(text)}</span>,
    },
    {
      title: t("workOrder.materialList.quantity"),
      dataIndex: "Miktar",
      key: "Miktar",
      width: 120,
      render: (text) => <div className="material-list-field">{getEmptyText(text)}</div>,
    },
    {
      title: t("workOrder.materialList.unit"),
      dataIndex: "Birim",
      key: "Birim",
      width: 120,
      render: (text) => <div className="material-list-field">{getEmptyText(text)}</div>,
    },
    {
      title: t("workOrder.materialList.warehouse"),
      dataIndex: "Depo",
      key: "Depo",
      width: 160,
      render: (text) => <div className="material-list-field">{getEmptyText(text)}</div>,
    },
    {
      title: t("workOrder.materialList.stock"),
      dataIndex: "StoktanDusen",
      key: "StoktanDusen",
      width: 120,
      render: (text) => (
        <div className="material-list-field material-list-stock">
          <Checkbox checked={normalizeBoolean(text)} disabled />
        </div>
      ),
    },
    {
      title: t("workOrder.materialList.total"),
      dataIndex: "Tutar",
      key: "Tutar",
      width: 150,
      render: (text) => <div className="material-list-field material-list-total">{formatMoney(text)}</div>,
    },
  ];

  const fetch = useCallback(() => {
    if (isActive) {
      setLoading(true);
      AxiosInstance.get(`GetIsEmriMalzemeler?isEmriId=${secilenIsEmriID}`)
        .then((response) => {
          const fetchedData = getResponseData(response).map(normalizeMaterialItem);
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

  const handleDeleteSelected = async () => {
    let hasError = false;

    for (const row of selectedRows) {
      try {
        const response = await AxiosInstance.post(`DeleteIsEmriMalzeme?malzemeId=${row.key}`);

        if (response.status_code === 200 || response.status_code === 201) {
          message.success(t("workOrder.materialList.deleteSuccess"));
        } else if (response.status_code === 401) {
          hasError = true;
          message.error(t("workOrder.materialList.noPermission"));
        } else {
          hasError = true;
          message.error(t("workOrder.materialList.deleteError"));
        }
      } catch (error) {
        hasError = true;
        console.error("Malzeme silme işlemi sırasında hata oluştu:", error);
        message.error(t("workOrder.materialList.deleteError"));
      }
    }

    if (!hasError) {
      setActionVisible(false);
      refreshTable();
    }
  };

  return (
    <MaterialListWrapper>
      <div className="material-list-header">
        <div>
          <h3 className="material-list-title">{t("workOrder.materialList.title")}</h3>
          <p className="material-list-description">{t("workOrder.materialList.description")}</p>
        </div>
        <div className="material-list-actions">
          {selectedRows.length >= 1 && (
            <Popover
              placement="bottom"
              trigger="click"
              open={actionVisible}
              onOpenChange={setActionVisible}
              content={
                <Popconfirm
                  title={t("workOrder.materialList.deleteTitle")}
                  description={t("workOrder.materialList.deleteConfirm")}
                  okText={t("workOrder.materialList.yes")}
                  cancelText={t("workOrder.materialList.noAnswer")}
                  disabled={kapali}
                  icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                  onConfirm={handleDeleteSelected}
                >
                  <Button disabled={kapali} type="link" danger icon={<DeleteOutlined />} style={{ paddingLeft: 0 }}>
                    {t("workOrder.materialList.delete")}
                  </Button>
                </Popconfirm>
              }
            >
              <Button className="material-list-context-button">
                <Text style={{ color: "white", marginLeft: 3 }}>{selectedRows.length}</Text>
                <MoreOutlined style={{ color: "white", fontSize: 20, margin: 0 }} />
              </Button>
            </Popover>
          )}
          <CreateModal
            kapali={kapali}
            onRefresh={refreshTable}
            secilenIsEmriID={secilenIsEmriID}
            triggerButtonText={t("workOrder.materialList.addMaterial")}
            triggerButtonType="default"
            triggerButtonClassName="material-list-add-button"
            triggerContainerClassName="material-list-create-trigger"
          />
          <MalzemeTablo
            kapali={kapali}
            onRefresh={refreshTable}
            secilenIsEmriID={secilenIsEmriID}
            triggerButtonText={t("workOrder.materialList.selectFromStock")}
            triggerButtonClassName="material-stock-button"
            triggerContainerClassName="material-stock-trigger"
          />
        </div>
      </div>

      <div className="material-list-table">
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: onRowSelectChange,
          }}
          onRow={(record) => ({
            onClick: (event) => {
              if (event.target.closest(".ant-table-selection-column, .ant-checkbox-wrapper, .ant-checkbox, .ant-select, button, input, textarea")) {
                return;
              }

              onRowClick(record);
            },
          })}
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={false}
          scroll={{
            x: 1290,
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
    </MaterialListWrapper>
  );
}

MalzemeListesiTablo.propTypes = {
  isActive: PropTypes.bool,
};
