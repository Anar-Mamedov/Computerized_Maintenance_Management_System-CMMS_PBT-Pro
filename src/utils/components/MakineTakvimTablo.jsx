import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Table, Input, message } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { SearchOutlined } from "@ant-design/icons";
import AxiosInstance from "../../api/http";

export default function MakineTakvimtablo({ workshopSelectedId, onSubmit, onClear, disabled, fieldName = "takvimTanim", fieldNameID = "takvimID" }) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const columns = [
    {
      title: "Yıl",
      dataIndex: "code",
      key: "code",
      width: 100,
      render: (text) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Takvim Tanım",
      dataIndex: "subject",
      key: "subject",
      render: (text) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Çalışma Günleri",
      dataIndex: "workdays",
      key: "workdays",
      render: (text) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Açıklama",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {text}
        </div>
      ),
    },
  ];

  const toLowerTurkish = (str) => {
    if (!str) return "";
    return str.replace(/İ/g, "i").replace(/I/g, "ı").toLowerCase();
  };

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get("GetTakvimList")
      .then((response) => {
        const payload = response?.data ?? response;
        const list = Array.isArray(payload) ? payload : payload?.Takvim_Liste || payload?.data?.Takvim_Liste || [];

        const fetchedData = (list || []).map((item) => ({
          key: item.TB_TAKVIM_ID,
          code: item.TKV_YIL,
          subject: item.TKV_TANIM,
          workdays: item.TKV_HAFTA_CALISMA_GUN,
          description: item.TKV_ACIKLAMA,
        }));
        setData(fetchedData);
        setFilteredData(fetchedData);
      })
      .catch((error) => {
        console.error("API Error:", error);
        if (navigator.onLine) {
          message.error("Hata Mesajı: " + error.message);
        } else {
          message.error("Internet Bağlantısı Mevcut Değil.");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setFilteredData(data);
      return;
    }
    const lower = toLowerTurkish(debouncedSearchTerm.trim());
    const filtered = data.filter((row) => {
      const values = [row.code, row.subject, row.workdays, row.description].filter(Boolean).map((v) => String(v));
      return values.some((v) => toLowerTurkish(v).includes(lower));
    });
    setFilteredData(filtered);
  }, [debouncedSearchTerm, data]);

  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
    if (!isModalVisible) {
      fetch();
      setSelectedRowKeys([]);
      setSearchTerm("");
      setDebouncedSearchTerm("");
    }
  };

  const handleModalOk = () => {
    const selectedData = data.find((item) => item.key === selectedRowKeys[0]);
    if (selectedData) {
      setValue(fieldName, selectedData.subject);
      setValue(fieldNameID, selectedData.key);
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

  const handleMinusClick = () => {
    setValue(fieldName, "");
    setValue(fieldNameID, "");
    onClear && onClear();
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", gap: "5px", width: "100%" }}>
        <Controller
          name={fieldName}
          control={control}
          render={({ field }) => <Input {...field} status={errors[fieldName] ? "error" : ""} style={{ width: "100%", maxWidth: "630px" }} disabled />}
        />
        <Controller name={fieldNameID} control={control} render={({ field }) => <Input {...field} type="text" style={{ display: "none" }} />} />
        <div style={{ display: "flex", gap: "5px" }}>
          <Button disabled={disabled} onClick={handleModalToggle}>
            +
          </Button>
          <Button onClick={handleMinusClick}>-</Button>
        </div>
      </div>

      <Modal width="1200px" title="Takvim" open={isModalVisible} onOk={handleModalOk} onCancel={handleModalToggle}>
        <Input
          style={{ width: "250px", marginBottom: "10px" }}
          placeholder="Arama yap..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          prefix={<SearchOutlined style={{ color: "#0091ff" }} />}
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
          scroll={{ y: "calc(100vh - 400px)" }}
        />
      </Modal>
    </div>
  );
}

MakineTakvimtablo.propTypes = {
  workshopSelectedId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSubmit: PropTypes.func,
  onClear: PropTypes.func,
  disabled: PropTypes.bool,
  fieldName: PropTypes.string,
  fieldNameID: PropTypes.string,
};
