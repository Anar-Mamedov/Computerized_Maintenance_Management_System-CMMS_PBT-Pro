import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import AxiosInstance from "../../../../../../../api/http";
import dayjs from "dayjs";
import SearchField from "../../../../Table/SearchField";
import Filters from "../../../../Table/filter/Filters";
import { useFormContext } from "react-hook-form";

export default function MakineTablo({ workshopSelectedId, onSubmit, refreshKey }) {
  const { control, watch, setValue } = useFormContext();
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
      width: 150,
      ellipsis: true,
      sorter: (a, b) => {
        if (a.code && b.code) {
          return a.code.localeCompare(b.code);
        }
        if (!a.code && !b.code) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.code ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
    },
    {
      title: "Makine Tanımı",
      dataIndex: "definition",
      key: "definition",
      sorter: (a, b) => {
        if (a.definition && b.definition) {
          return a.definition.localeCompare(b.definition);
        }
        if (!a.definition && !b.definition) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.definition ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: 150,
      ellipsis: true,
    },
    {
      title: "Lokasyon",
      dataIndex: "location",
      key: "location",
      sorter: (a, b) => {
        if (a.location && b.location) {
          return a.location.localeCompare(b.location);
        }
        if (!a.location && !b.location) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.location ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: 150,
      ellipsis: true,
    },
    {
      title: "Makine Tipi",
      dataIndex: "machine_type",
      key: "machine_type",
      sorter: (a, b) => {
        if (a.machine_type && b.machine_type) {
          return a.momachine_typedel.localeCompare(b.machine_type);
        }
        if (!a.machine_type && !b.machine_type) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.machine_type ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: 150,
      ellipsis: true,
    },
    {
      title: "Kategori",
      dataIndex: "category",
      key: "category",
      sorter: (a, b) => {
        if (a.category && b.category) {
          return a.category.localeCompare(b.category);
        }
        if (!a.category && !b.category) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.category ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: 150,
      ellipsis: true,
    },
    {
      title: "Marka",
      dataIndex: "brand",
      key: "brand",
      sorter: (a, b) => {
        if (a.brand && b.brand) {
          return a.brand.localeCompare(b.brand);
        }
        if (!a.brand && !b.brand) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.brand ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: 150,
      ellipsis: true,
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      sorter: (a, b) => {
        if (a.model && b.model) {
          return a.model.localeCompare(b.model);
        }
        if (!a.model && !b.model) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.model ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: 150,
      ellipsis: true,
    },
    {
      title: "Seri No",
      dataIndex: "serial_no",
      key: "serial_no",
      sorter: (a, b) => {
        if (a.serial_no && b.serial_no) {
          return a.serial_no.localeCompare(b.serial_no);
        }
        if (!a.serial_no && !b.serial_no) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.serial_no ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      width: 150,
      ellipsis: true,
    },
  ];

  const lokasyonId = watch("selectedLokasyonId");

  const fetch = useCallback(
    ({ keyword, filters, page = 1 }) => {
      setLoading(true);
      AxiosInstance.post(`GetMakineFullList?pagingDeger=${page}&lokasyonId=${lokasyonId}&parametre=${keyword}`, filters)
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
    },
    [lokasyonId]
  );

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
  }, [refreshKey, body]);

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
    </div>
  );
}
