import React, { useState, useEffect } from "react";
import { Modal, Table, Input, Button } from "antd";
import { SearchOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Controller, useFormContext, get } from "react-hook-form";
import AxiosInstance from "../../../../api/http";

export default function MakineSecim({
  control,
  setValue, // bunu al
  errors,
  disabled = false,
  makineFieldName = "MKN_KOD",
  makineIdFieldName = "TB_MAKINE_ID",
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  const handleModalToggle = () => setIsModalVisible(!isModalVisible);

  useEffect(() => {
    if (isModalVisible) {
      setLoading(true);

      const payload = {
        lokasyonlar: {},
        isemritipleri: {},
        durumlar: {},
        customfilter: {},
      };

      AxiosInstance.post(
        `GetMakineFullList?parametre=${searchTerm}&pagingDeger=1&pageSize=10`,
        payload
      )
        .then((res) => {
          const items = res?.makine_listesi || [];
          setData(items);
          setFilteredData(items);
          setTotalCount(res?.totalCount || 0);
        })
        .catch(() => {
          setData([]);
          setFilteredData([]);
          setTotalCount(0);
        })
        .finally(() => setLoading(false));
    }
  }, [isModalVisible, searchTerm]);

  const rowSelection = {
    type: "radio",
    selectedRowKeys: selectedRow ? [selectedRow.TB_MAKINE_ID] : [],
    onChange: (keys, rows) => setSelectedRow(rows[0]),
  };

  const handleModalOk = () => {
    if (selectedRow) {
      setValue(makineFieldName, selectedRow.MKN_KOD);
      setValue(makineIdFieldName, selectedRow.TB_MAKINE_ID);
    }
    setIsModalVisible(false);
  };

  const handleClear = () => {
    setValue(makineFieldName, "");
    setValue(makineIdFieldName, "");
  };

  const columns = [
    {
      title: "Makine Kodu",
      dataIndex: "MKN_KOD",
      key: "MKN_KOD",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Makine Tanımı",
      dataIndex: "MKN_TANIM",
      key: "MKN_TANIM",
      width: 250,
      ellipsis: true,
    },
    {
      title: "Aktif",
      dataIndex: "MKN_AKTIF",
      key: "MKN_AKTIF",
      width: 100,
      render: (text) => (
        <div style={{ textAlign: "center" }}>
          {text ? <CheckOutlined style={{ color: "green" }} /> : <CloseOutlined style={{ color: "red" }} />}
        </div>
      ),
    },
    {
      title: "Makine Durumu",
      dataIndex: "MKN_DURUM",
      key: "MKN_DURUM",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Lokasyon",
      dataIndex: "MKN_LOKASYON",
      key: "MKN_LOKASYON",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Makine Tipi",
      dataIndex: "MKN_TIP",
      key: "MKN_TIP",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Kategori",
      dataIndex: "MKN_KATEGORI",
      key: "MKN_KATEGORI",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Marka",
      dataIndex: "MKN_MARKA",
      key: "MKN_MARKA",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Model",
      dataIndex: "MKN_MODEL",
      key: "MKN_MODEL",
      width: 150,
      ellipsis: true,
    },
  ];

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", gap: "5px", width: "100%" }}>
        <Controller
  name={makineFieldName}
  control={control}
  render={({ field }) => (
    <Input
      {...field}
      value={field.value || ""} // undefined değilse kullan, yoksa boş string
      status={get(errors, makineFieldName) ? "error" : ""}
      style={{ width: "100%", maxWidth: "630px" }}
      disabled
    />
  )}
/>

        <Controller
          name={makineIdFieldName}
          control={control}
          render={({ field }) => <Input {...field} type="hidden" />}
        />

        <div style={{ display: "flex", gap: "5px" }}>
          <Button disabled={disabled} onClick={handleModalToggle}>
            +
          </Button>
          <Button onClick={handleClear}>-</Button>
        </div>
      </div>

      <Modal
        width="1200px"
        title="Makine Seçimi"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalToggle}
        destroyOnClose
      >
        <Input
          style={{ width: "250px", marginBottom: "10px" }}
          placeholder="Makine ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          prefix={<SearchOutlined style={{ color: "#0091ff" }} />}
        />

        <Table
          rowKey="TB_MAKINE_ID"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          pagination={false}
          scroll={{ y: "calc(100vh - 400px)" }}
        />
      </Modal>
    </div>
  );
}