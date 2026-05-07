import React, { useCallback, useEffect, useState } from "react";
import { Modal, Table, Input, message, Button } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { SearchOutlined, PlusOutlined, CloseOutlined } from "@ant-design/icons";
import AxiosInstance from "../../api/http";
import PropTypes from "prop-types";
import { t } from "i18next";

export default function EkipmanTablo({
  workshopSelectedId,
  onSubmit,
  onClear,
  disabled,
  ekipmanFieldName = "anaEkipmanTanim",
  ekipmanIdFieldName = "anaEkipmanID",
  isRequired = false,
  requireMakineSelection = false,
  makineIdFieldName = "makineID",
}) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const selectedMakineId = watch(makineIdFieldName);

  const columns = [
    {
      title: "Ekipman Bilgisi",
      key: "ekipmanBilgisi",
      render: (text, record) => <div>{record.EKP_TANIM || record.tanim}</div>,
    },
    {
      title: "Ekipman Kodu",
      key: "ekipmanKodu",
      render: (text, record) => <div>{record.EKP_KOD || record.kod}</div>,
    },
  ];

  const formatDataForTable = useCallback((items) => {
    const list = Array.isArray(items) ? items : [];

    return list.map((item, index) => {
      const treeNodeId = Number(item.TB_EKIPMAN_ID ?? item.id ?? item.RowIndex ?? index + 1);
      return {
        ...item,
        key: item.TB_EKIPMAN_ID ?? item.id ?? treeNodeId,
        children: item.hasChild ? [] : undefined,
      };
    });
  }, []);

  const fetchRootData = async (customSearchTerm) => {
    const parameter = typeof customSearchTerm === "string" ? customSearchTerm : searchTerm;
    setLoading(true);
    setExpandedRowKeys([]);
    try {
      const response = await AxiosInstance.post(`GetEkipmanVeritabaniListe`, {
        ItemIndex: 3,
        DepoId: -1,
        Parametre: parameter,
        parentID: 0,
        MakineId: Number(selectedMakineId) || -1,
      });
      if (response) {
        const dataList = Array.isArray(response) ? response : response.list || [];
        setData(formatDataForTable(dataList));
      }
    } catch (error) {
      console.error("Error fetching root data:", error);
      if (navigator.onLine) {
        message.error("Hata Mesajı: " + error.message);
      } else {
        message.error("Internet Bağlantısı Mevcut Değil.");
      }
    } finally {
      setLoading(false);
    }
  };

  const onTableRowExpand = (expanded, record) => {
    setExpandedRowKeys((prevKeys) => {
      if (expanded) {
        return [...prevKeys, record.key];
      } else {
        return prevKeys.filter((key) => key !== record.key);
      }
    });

    if (expanded && record.hasChild && record.children && record.children.length === 0) {
      setLoading(true);

      AxiosInstance.post(`GetEkipmanVeritabaniListe`, {
        ItemIndex: 3,
        DepoId: -1,
        Parametre: searchTerm, // Current search filter context
        parentID: record.key,
        MakineId: Number(selectedMakineId) || -1,
      })
        .then((response) => {
          if (response) {
            const childrenDataList = Array.isArray(response) ? response : response.list || [];
            const childrenData = formatDataForTable(childrenDataList);

            const updateTreeData = (dataList) => {
              return dataList.map((item) => {
                if (item.key === record.key) {
                  return { ...item, children: childrenData };
                } else if (item.children) {
                  return { ...item, children: updateTreeData(item.children) };
                } else {
                  return item;
                }
              });
            };

            setData((prevData) => updateTreeData(prevData));
          }
        })
        .catch((error) => {
          console.error("API Error fetching children:", error);
          if (navigator.onLine) {
            message.error("Hata Mesajı: " + error.message);
          } else {
            message.error("Internet Bağlantısı Mevcut Değil.");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const findItemInTree = (key, treeData) => {
    for (const item of treeData) {
      if (item.key === key) return item;
      if (item.children) {
        const found = findItemInTree(key, item.children);
        if (found) return found;
      }
    }
    return null;
  };

  const handleModalToggle = () => {
    if (!isModalVisible && requireMakineSelection && !selectedMakineId) {
      message.warning(t("onceMakineSeciniz"));
      return;
    }

    setIsModalVisible((prev) => !prev);
    if (!isModalVisible) {
      // Opening
      setSelectedRowKeys([]);
      setSearchTerm("");
      fetchRootData("");
    }
  };

  const handleModalOk = () => {
    const selectedData = findItemInTree(selectedRowKeys[0], data);
    if (selectedData) {
      setValue(ekipmanFieldName, selectedData.EKP_TANIM || selectedData.tanim);
      setValue(ekipmanIdFieldName, selectedData.key);
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

  const rowSelection = {
    type: "radio",
    selectedRowKeys,
    onChange: onRowSelectChange,
  };

  const handleLokasyonMinusClick = () => {
    setValue(ekipmanFieldName, "");
    setValue(ekipmanIdFieldName, "");
    onClear && onClear();
  };

  const ekipmanValue = watch(ekipmanFieldName);
  const isSelectionDisabled = disabled || (requireMakineSelection && !selectedMakineId);

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", gap: "5px", width: "100%" }}>
        <Controller
          name={ekipmanFieldName}
          control={control}
          rules={{ required: isRequired ? t("alanBosBirakilamaz") : false }}
          render={({ field }) => (
            <Input
              {...field}
              status={errors[ekipmanFieldName] ? "error" : ""}
              type="text"
              style={{ width: "100%" }}
              readOnly
              suffix={
                ekipmanValue ? (
                  <CloseOutlined style={{ color: "#8c8c8c", cursor: "pointer", fontSize: "12px" }} onClick={handleLokasyonMinusClick} />
                ) : (
                  <PlusOutlined
                    style={{ color: isSelectionDisabled ? "#d9d9d9" : "#0091ff", cursor: isSelectionDisabled ? "not-allowed" : "pointer", fontSize: "12px" }}
                    onClick={isSelectionDisabled ? undefined : handleModalToggle}
                  />
                )
              }
            />
          )}
        />

        <Controller name={ekipmanIdFieldName} control={control} render={({ field }) => <Input {...field} type="text" style={{ display: "none" }} />} />
      </div>
      {errors[ekipmanFieldName] && <div style={{ color: "red", marginTop: "5px" }}>{errors[ekipmanFieldName].message}</div>}

      <Modal width="1200px" title="Ana Ekipman" open={isModalVisible} onOk={handleModalOk} onCancel={handleModalToggle}>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <Input
            style={{ width: "250px" }}
            type="text"
            placeholder="Arama yap..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onPressEnter={fetchRootData}
            prefix={<SearchOutlined style={{ color: "#0091ff" }} />}
            allowClear
          />
          <Button type="primary" onClick={fetchRootData}>
            Ara
          </Button>
        </div>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={false}
          scroll={{
            y: "calc(100vh - 400px)",
          }}
          expandedRowKeys={expandedRowKeys}
          onExpand={onTableRowExpand}
        />
      </Modal>
    </div>
  );
}

EkipmanTablo.propTypes = {
  workshopSelectedId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onSubmit: PropTypes.func,
  onClear: PropTypes.func,
  disabled: PropTypes.bool,
  ekipmanFieldName: PropTypes.string,
  ekipmanIdFieldName: PropTypes.string,
  isRequired: PropTypes.bool,
  requireMakineSelection: PropTypes.bool,
  makineIdFieldName: PropTypes.string,
};
