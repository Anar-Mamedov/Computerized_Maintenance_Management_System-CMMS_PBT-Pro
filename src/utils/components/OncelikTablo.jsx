import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Table, Input, message } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import AxiosInstance from "../../api/http";

export default function OncelikTablo({ workshopSelectedId, onSubmit, onClear, disabled, oncelikFieldName = "oncelikTanim", oncelikIdFieldName = "oncelikID" }) {
  const { t } = useTranslation();
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  // Full list from API
  const [data, setData] = useState([]);
  // Search term state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  // Filtered data for table
  const [filteredData, setFilteredData] = useState([]);

  const columns = [
    {
      title: t("priority.code", { defaultValue: "Öncelik Kodu" }),
      dataIndex: "code",
      key: "code",
      ellipsis: true,
      width: 300,
    },
    {
      title: t("priority.description", { defaultValue: "Tanım" }),
      dataIndex: "subject",
      key: "subject",
      ellipsis: true,
      width: 300,
    },
    {
      title: t("priority.default", { defaultValue: "Varsayılan" }),
      dataIndex: "status",
      key: "status",
      render: (status) => <input type="checkbox" checked={Boolean(status)} disabled />,
      width: 150,
    },
  ];

  // Fetch priorities
  const fetchData = () => {
    setLoading(true);
    AxiosInstance.get("OncelikList")
      .then((response) => {
        const raw = Array.isArray(response.data) ? response.data : response;
        const list = (raw || []).map((item) => ({
          key: item.TB_SERVIS_ONCELIK_ID,
          code: item.SOC_KOD,
          subject: item.SOC_TANIM,
          status: item.SOC_VARSAYILAN,
        }));
        setData(list);
        setFilteredData(list);
      })
      .catch((error) => {
        // Basic network-aware error message
        if (navigator.onLine) {
          message.error("Hata Mesajı: " + error.message);
        } else {
          message.error("Internet Bağlantısı Mevcut Değil.");
        }
      })
      .finally(() => setLoading(false));
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter when search or data changes
  useEffect(() => {
    const term = debouncedSearchTerm.trim().toLowerCase();
    if (term) {
      const filtered = data.filter((item) => {
        const code = String(item.code || "").toLowerCase();
        const subject = String(item.subject || "").toLowerCase();
        return code.includes(term) || subject.includes(term);
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [debouncedSearchTerm, data]);

  // Open/close modal
  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
    if (!isModalVisible) {
      fetchData();
      setSelectedRowKeys([]);
      setSearchTerm("");
      setDebouncedSearchTerm("");
    }
  };

  // Confirm selection
  const handleModalOk = () => {
    const selectedData = data.find((item) => item.key === selectedRowKeys[0]);
    if (selectedData) {
      setValue(oncelikFieldName, selectedData.code);
      setValue(oncelikIdFieldName, selectedData.key);
      onSubmit?.(selectedData);
    }
    setIsModalVisible(false);
  };

  // Reflect workshopSelectedId changes
  useEffect(() => {
    if (workshopSelectedId) {
      setSelectedRowKeys([workshopSelectedId]);
    } else {
      setSelectedRowKeys([]);
    }
  }, [workshopSelectedId]);

  // Radio selection
  const onRowSelectChange = (newSelectedKeys) => {
    setSelectedRowKeys(newSelectedKeys.length ? [newSelectedKeys[0]] : []);
  };

  const rowSelection = {
    type: "radio",
    selectedRowKeys,
    onChange: onRowSelectChange,
  };

  // Clear selection and form values
  const handleMinusClick = () => {
    setValue(oncelikFieldName, "");
    setValue(oncelikIdFieldName, "");
    onClear && onClear();
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Visible code and hidden ID fields */}
      <div style={{ display: "flex", gap: "5px", width: "100%" }}>
        <Controller
          name={oncelikFieldName}
          control={control}
          render={({ field }) => <Input {...field} status={errors[oncelikFieldName] ? "error" : ""} style={{ width: "100%", maxWidth: "630px" }} disabled />}
        />
        <Controller name={oncelikIdFieldName} control={control} render={({ field }) => <Input {...field} type="text" style={{ display: "none" }} />} />

        <div style={{ display: "flex", gap: "5px" }}>
          <Button disabled={disabled} onClick={handleModalToggle}>
            +
          </Button>
          <Button onClick={handleMinusClick}>-</Button>
        </div>
      </div>

      <Modal width="1200px" title="Öncelik" open={isModalVisible} onOk={handleModalOk} onCancel={handleModalToggle}>
        <Input
          style={{ width: "250px", marginBottom: "10px" }}
          placeholder={t("search.placeholder", { defaultValue: "Arama yap..." })}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          prefix={<SearchOutlined style={{ color: "#0091ff" }} />}
        />

        <Table rowKey="key" rowSelection={rowSelection} columns={columns} dataSource={filteredData} loading={loading} scroll={{ y: "calc(100vh - 400px)" }} />
      </Modal>
    </div>
  );
}

OncelikTablo.propTypes = {
  workshopSelectedId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onSubmit: PropTypes.func,
  onClear: PropTypes.func,
  disabled: PropTypes.bool,
  oncelikFieldName: PropTypes.string,
  oncelikIdFieldName: PropTypes.string,
};
