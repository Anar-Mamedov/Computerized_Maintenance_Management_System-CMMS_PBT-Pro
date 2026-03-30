import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Spin, Input } from "antd";
import AxiosInstance from "../../../../../../../../../api/http";
import { Controller, useFormContext } from "react-hook-form";

function EkipmanTablo({ onSubmit, disabled }) {
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const columns = [
    {
      title: "Ekipman",
      dataIndex: "EKP_KOD",
      key: "EKP_KOD",
      width: 200,
      ellipsis: true,
      visible: true,
      sorter: (a, b) => {
        if (a.EKP_KOD === null && b.EKP_KOD === null) return 0;
        if (a.EKP_KOD === null) return 1;
        if (b.EKP_KOD === null) return -1;
        return a.EKP_KOD.localeCompare(b.EKP_KOD);
      },
    },

    {
      title: "Tanımı",
      dataIndex: "EKP_TANIM",
      key: "EKP_TANIM",
      width: 200,
      ellipsis: true,
      visible: true,
      sorter: (a, b) => {
        if (a.EKP_TANIM === null && b.EKP_TANIM === null) return 0;
        if (a.EKP_TANIM === null) return 1;
        if (b.EKP_TANIM === null) return -1;
        return a.EKP_TANIM.localeCompare(b.EKP_TANIM);
      },
    },

    {
      title: "Tipi",
      dataIndex: "EKP_TIP",
      key: "EKP_TIP",
      width: 200,
      ellipsis: true,
      visible: true,
      sorter: (a, b) => {
        if (a.EKP_TIP === null && b.EKP_TIP === null) return 0;
        if (a.EKP_TIP === null) return 1;
        if (b.EKP_TIP === null) return -1;
        return a.EKP_TIP.localeCompare(b.EKP_TIP);
      },
    },
    {
      title: "Birim",
      dataIndex: "EKP_BIRIM",
      key: "EKP_BIRIM",
      width: 200,
      ellipsis: true,
      visible: true,
      sorter: (a, b) => {
        if (a.EKP_BIRIM === null && b.EKP_BIRIM === null) return 0;
        if (a.EKP_BIRIM === null) return 1;
        if (b.EKP_BIRIM === null) return -1;
        return a.EKP_BIRIM.localeCompare(b.EKP_BIRIM);
      },
    },
    {
      title: "Durum",
      dataIndex: "EKP_DURUM",
      key: "EKP_DURUM",
      width: 200,
      ellipsis: true,
      visible: true,
      sorter: (a, b) => {
        if (a.EKP_DURUM === null && b.EKP_DURUM === null) return 0;
        if (a.EKP_DURUM === null) return 1;
        if (b.EKP_DURUM === null) return -1;
        return a.EKP_DURUM.localeCompare(b.EKP_DURUM);
      },
    },
  ];

  const makineID = watch("makineID");

  const fetchData = async (page, pageSize, parametre) => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get(`ekipman?parametre=${parametre}&MakineID=${makineID}&pagingDeger=${page}&pageSize=${pageSize}`);
      const mappedData = response.list.map((item) => ({
        ...item,
        key: item.TB_EKIPMAN_ID,
      }));
      setData(mappedData);
      setTotalRecords(response.kayit_sayisi);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isModalVisible) {
      fetchData(1, pageSize, searchTerm);
    }
  }, [isModalVisible]);

  useEffect(() => {
    if (searchTerm === "") return;

    const delayDebounceFn = setTimeout(() => {
      if (isModalVisible) {
        setCurrentPage(1);
        fetchData(1, pageSize, searchTerm);
      }
    }, 2000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleTableChange = (pagination, filters, sorter) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);

    // Check if pagination changed
    const paginationChanged = pagination.current !== currentPage || pagination.pageSize !== pageSize;

    // Check if filters changed (optional, if you have filters)
    /*const filtersChanged =  your logic here ;*/

    // Only fetch data if pagination changed
    if (paginationChanged && isModalVisible) {
      fetchData(pagination.current, pagination.pageSize, searchTerm);
    }
  };

  const showModal = () => {
    setSelectedData([]);
    setData([]);
    setTotalRecords(0);
    setSearchTerm("");
    setIsModalVisible(true);
    fetchData(currentPage, pageSize, "");
  };

  const handleOk = () => {
    if (selectedData.length > 0) {
      onSubmit && onSubmit(selectedData[0]);
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const rowSelection = {
    selectedRowKeys: selectedData.map((item) => item.key),
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedData(selectedRows);
    },
    type: "radio",
  };

  return (
    <div>
      <Button disabled={disabled} onClick={showModal}>
        +
      </Button>
      <Modal title="Ekipman Tablosu" centered open={isModalVisible} onOk={handleOk} onCancel={handleCancel} width={1200}>
        <Input placeholder="Arama" onChange={handleSearchChange} value={searchTerm} style={{ marginBottom: 10, width: "200px" }} />
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalRecords,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} Kayıt ${total}`,
          }}
          scroll={{ y: "calc(100vh - 370px)" }}
          onChange={handleTableChange}
          rowSelection={rowSelection}
        />
      </Modal>
    </div>
  );
}

export default EkipmanTablo;
