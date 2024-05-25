import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import AxiosInstance from "../../../../../../../api/http";
import dayjs from "dayjs";
import SearchField from "../../../../Table/SearchField";
import Filters from "./Machina/filter/Filters";

export default function MasterMakineTablo({ workshopSelectedId, onSubmit }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // reset the cruent page when i search or filtered any thing
  const [filtersKey, setFiltersKey] = useState(0);

  const [table, setTable] = useState({
    data: [],
    page: 1,
  });

  const [body, setBody] = useState({
    keyword: "",
    filters: {},
  });

  const columns = [
    {
      title: "Makine Kodu",
      dataIndex: "code",
      key: "code",
      sorter: (a, b) => {
        const codeA = a.code || "";
        const codeB = b.code || "";
        return codeA.localeCompare(codeB);
      },
      render: (text) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Makine Tanımı",
      dataIndex: "definition",
      key: "definition",
      sorter: (a, b) => {
        const definitionA = a.definition || "";
        const definitionB = b.definition || "";
        return definitionA.localeCompare(definitionB);
      },
      width: "200px",
      render: (text) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Lokasyon",
      dataIndex: "location",
      key: "location",
      sorter: (a, b) => {
        const locationA = a.location || "";
        const locationB = b.location || "";
        return locationA.localeCompare(locationB);
      },
      render: (text) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Makine Tipi",
      dataIndex: "machine_type",
      key: "machine_type",
      sorter: (a, b) => {
        const machineTypeA = a.machine_type || "";
        const machineTypeB = b.machine_type || "";
        return machineTypeA.localeCompare(machineTypeB);
      },
      render: (text) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Kategori",
      dataIndex: "category",
      key: "category",
      sorter: (a, b) => {
        const categoryA = a.category || "";
        const categoryB = b.category || "";
        return categoryA.localeCompare(categoryB);
      },
      render: (text) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Marka",
      dataIndex: "brand",
      key: "brand",
      sorter: (a, b) => {
        const brandA = a.brand || "";
        const brandB = b.brand || "";
        return brandA.localeCompare(brandB);
      },
      render: (text) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      sorter: (a, b) => {
        const modelA = a.model || "";
        const modelB = b.model || "";
        return modelA.localeCompare(modelB);
      },
      render: (text) => (
        <div
          style={{
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
      dataIndex: "serial_no",
      key: "serial_no",
      sorter: (a, b) => {
        const serialNoA = a.serial_no || "";
        const serialNoB = b.serial_no || "";
        return serialNoA.localeCompare(serialNoB);
      },
      render: (text) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
  ];

  const fetch = useCallback(({ keyword, filters, page = 1 }) => {
    setLoading(true);
    AxiosInstance.post(`GetMakineFullList?pagingDeger=${page}&lokasyonId=${""}&parametre=${keyword}`, filters)
      .then((response) => {
        const fetchedData = response.makine_listesi.map((item, index) => {
          return {
            key: item.TB_MAKINE_ID,
            code: item.MKN_KOD,
            definition: item.MKN_TANIM,
            location: item.MKN_LOKASYON,
            machinelocationid: item.MKN_LOKASYON_ID,
            fullLocation: item.MKN_LOKASYON_TUM_YOL,
            machine_type: item.MKN_TIP,
            category: item.MKN_KATEGORI,
            brand: item.MKN_MARKA,
            model: item.MKN_MODEL,
            serial_no: item.MKN_SERI_NO,
            // tb_makine_id: item.TB_MAKINE_ID,
            machine_warranty: dayjs(item.MKN_GARANTI_BITIS).format("DD.MM.YYYY"),
            machine_warranty_status: item.MKN_GARANTI_KAPSAMINDA,
          };
        });
        setCurrentPage(page); //reset the cruent page when i search or filtered any thing
        setTable({
          data: fetchedData,
          page: response.page,
          // page: 1,
        });
        setLoading(false); // Set loading to false when data arrives
      })
      .finally(() => setLoading(false));
  }, []);

  // for search field
  const handleBodyChange = useCallback((type, newBody) => {
    if (type === "search") {
      setBody((state) => ({
        ...state,
        keyword: newBody,
      }));
    } else if (type === "filters") {
      setBody((state) => ({
        ...state,
        filters: newBody,
      }));
    }
  }, []);

  useEffect(() => {
    fetch({ filters: body.filters, keyword: body.keyword, page: 1 });
  }, [body]);

  // for search field end

  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
    if (!isModalVisible) {
      setBody({ keyword: "", filters: {} });
      fetch({ filters: {}, keyword: "", page: 1 });
      setFiltersKey((prevKey) => prevKey + 1); // Increment key to force re-render of Filters
      setSelectedRowKeys([]);
    }
  };

  const handleModalOk = () => {
    const selectedData = table.data.find((item) => item.key === selectedRowKeys[0]);
    if (selectedData) {
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

  return (
    <div>
      <Button onClick={handleModalToggle}> + </Button>
      <Modal
        width="1200px"
        centered
        title="Makine Tanımları"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalToggle}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
          <SearchField onChange={handleBodyChange} />
          <Filters key={filtersKey} onChange={handleBodyChange} value={body.filters} />
        </div>

        <Table
          rowSelection={{
            type: "radio",
            selectedRowKeys,
            onChange: onRowSelectChange,
          }}
          scroll={{
            // x: "auto",
            y: "100vh",
          }}
          columns={columns}
          dataSource={table.data}
          loading={loading}
          pagination={{
            position: ["bottomRight"],
            pageSize: 11,
            showSizeChanger: false,
            current: currentPage,
            // Eger total toplam veri sayisidirsa *10 olmalidir
            total: table.page * 10,
            // Eger total toplam sehife sayisidirsa
            // total: table.page,
            onChange: (page) => fetch({ filters: body.filters, keyword: body.keyword, page }),
            // quick jump for page input field
          }}
        />
      </Modal>
    </div>
  );
}
