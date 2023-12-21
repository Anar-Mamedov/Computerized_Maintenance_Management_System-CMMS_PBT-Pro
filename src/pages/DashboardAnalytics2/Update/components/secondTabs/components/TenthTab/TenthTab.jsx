import React, { useCallback, useEffect, useState } from "react";
import { Button, Input, Modal, Typography, Checkbox, DatePicker, TimePicker, Select, Table } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../../../api/http";
import styled from "styled-components";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import "../../../../../../DashboardAnalytics2/workOrder.css";

const { Text, Link } = Typography;
const { TextArea } = Input;

const StyledTable = styled(Table)`
  .ant-pagination {
    margin-right: 0px !important;
    background-color: #f5f5f5;
    padding: 10px;
    border-radius: 5px;
  }
  &.custom-table .ant-table-thead > tr > th {
    height: 10px; // Adjust this value to your desired height
    line-height: 2px; // Adjust this value to vertically center the text
  }
`;

const onChange = (value) => {};
const onSearch = (value) => {};

// Filter `option.label` match the user type `input`
const filterOption = (input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

export default function TenthTab() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { control, setValue, watch } = useFormContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true); // State to manage the disabled state of the fields

  const { fields, append, replace, remove } = useFieldArray({
    control,
    name: "IsEmriAracGerecList", // This should match the name used in setValue
  });

  const onCheckboxChange = (e) => {
    if (editingRecord) {
      setEditingRecord((prevRecord) => ({
        ...prevRecord,
        overtime: e.target.checked,
      }));
      setIsDisabled(!e.target.checked);
    }
  };

  const columns = [
    {
      title: "Kodu",
      dataIndex: "code",
      key: "code",
      width: "150px",
      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Tanımı",
      dataIndex: "subject",
      key: "subject",
      width: "150px",

      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Tipi",
      dataIndex: "workdays",
      key: "workdays",
      width: "150px",
      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Bulunduğu Yer",
      dataIndex: "description",
      key: "description",
      width: "150px",
      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },

    {
      title: "Seri No",
      dataIndex: "fifthcolumn",
      key: "fifthcolumn",
      width: "150px",
      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
  ];

  const selectedColumns = [
    {
      title: "Kodu",
      dataIndex: "code",
      key: "uniqueKey", // use the uniqueKey for the key property
      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Tanımı",
      dataIndex: "subject",
      key: "subject",
      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Tipi",
      dataIndex: "workdays",
      key: "workdays",
      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Bulunduğu Yer",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },

    {
      title: "",
      key: "action",
      render: (_, field, index) => (
        <Button
          danger
          onClick={(e) => {
            e.stopPropagation(); // Stop event propagation
            handleDelete(index);
          }}
          icon={<DeleteOutlined />}>
          Sil
        </Button>
      ),
    },

    // Add more columns as needed
  ];

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`GetAracGerec`)
      .then((response) => {
        const fetchedData = response.ARAC_GEREC_LISTE.map((item) => {
          return {
            key: item.TB_ARAC_GEREC_ID,
            code: item.ARG_KOD,
            subject: item.ARG_TANIM,
            workdays: item.ARG_TIP_TANIM, //?
            description: item.ARG_YER_TANIM, //?
            fifthcolumn: item.ARG_SERI_NO,
            // sixthcolumn: item.PRS_LOKASYON,
          };
        });
        setData(fetchedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
    fetch();
  };

  const handleOk = () => {
    // Seçili kayıtları alıp `fields` listesine ekleyin
    selectedRowKeys.forEach((key) => {
      const record = data.find((item) => item.key === key);
      // Eğer bu kayıt zaten eklenmemişse, listeye ekle
      if (!fields.some((field) => field.id === record.key)) {
        append({ ...record, id: record.key });
      }
    });

    // Modalı kapat
    setIsModalOpen(false);

    // Seçili kayıtları temizle
    setSelectedRowKeys([]);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDelete = (index) => {
    remove(index); // Belirtilen index'teki öğeyi kaldır
  };

  const rowSelection = {
    selectedRowKeys,
    getCheckboxProps: (record) => ({
      disabled: selectedRecords.some((r) => r.key === record.key), // Disable checkbox if record is already added
    }),
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  const rowClassName = (record) => {
    return selectedRecords.some((r) => r.key === record.key) ? "added-record" : "";
  };

  const handleEditOk = () => {
    setSelectedRecords((prevRecords) =>
      prevRecords.map((record) => (record.uniqueKey === editingRecord.uniqueKey ? editingRecord : record))
    );
    setEditingRecord(null);
    setIsEditModalOpen(false);
  };

  // tabloyu sağa sola kaydıra bilme özelliği eklemek için
  const totalTableWidth = columns.reduce((acc, column) => acc + (parseInt(column.width, 10) || 0), 0);
  // tabloyu sağa sola kaydıra bilme özelliği eklemek için son

  const isEmriId = watch("isEmriSelectedId");

  useEffect(() => {
    if (isEmriId) {
      setLoading(true);
      AxiosInstance.get(`FetchIsEmriAracGerec?isemriID=${isEmriId}`)
        .then((response) => {
          console.log("response", response.ARAC_GEREC_LISTE);
          const fetchedData = response.ARAC_GEREC_LISTE.map((item, index) => ({
            key: item.TB_ARAC_GEREC_ID,
            sequence: index + 1,
            code: item.ARG_KOD,
            subject: item.ARG_TANIM,
            workdays: item.ARG_TIP_TANIM, //?
            description: item.ARG_YER_TANIM, //?
          }));
          replace(fetchedData);
        })
        .catch((error) => console.error("Error fetching data:", error))
        .finally(() => setLoading(false));
    }
  }, [isEmriId, append, setLoading, AxiosInstance]);

  return (
    <>
      <Button
        type="link"
        onClick={showModal}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: "auto",
          marginTop: "-10px",
          marginBottom: "10px",
        }}>
        <PlusOutlined />
        Yeni Kayıt
      </Button>
      <Modal
        centered
        width="1200px"
        title="Personel Listesi"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}>
        <StyledTable
          rowClassName={rowClassName}
          className="custom-table"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          loading={loading}
          scroll={{
            x: totalTableWidth,
            y: "500px",
          }}
        />
      </Modal>
      <div style={{ marginTop: "20px" }}>
        <StyledTable
          columns={selectedColumns}
          dataSource={fields}
          pagination={false}
          onRow={(record) => {
            return {
              onClick: () => {
                setEditingRecord(record);
                setIsDisabled(!record.overtime);
                setIsEditModalOpen(true);
              },
            };
          }}
        />
      </div>
    </>
  );
}
