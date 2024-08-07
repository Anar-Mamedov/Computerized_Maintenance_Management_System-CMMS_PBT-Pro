import React, { useCallback, useEffect, useState } from "react";
import { Input, Button, Modal, Typography, Table } from "antd";
import AxiosInstance from "../../../../../../api/http";
import SearchField from "../../../../Table/SearchField";
import Filters from "./Machina/filter/Filters";
import styled from "styled-components";
import dayjs from "dayjs";
import { useFormContext, Controller } from "react-hook-form";

const { Text, Link } = Typography;

const StyledTable = styled(Table)`
  .ant-pagination {
    /* Add your styles here */
    margin-right: 0px !important;
    background-color: #f5f5f5;
    padding: 10px;
    border-radius: 5px;
    /* ... other styles */
  }
`;

export default function Machine({
  locationId,
  setSelectedMachineId,
  setLocationValue,
  setMachineLocationId,
  setFullLocationValue,
  onMachineWarrantyChange,
  setMachineWarranty,
  setMachineWarrantyStatus,
}) {
  const { control, setValue } = useFormContext();

  const [inputValue, setInputValue] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
  const [definitionValue, setDefinitionValue] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state
  const [currentPage, setCurrentPage] = useState(1); // reset the cruent page when i search or filtered any thing

  const [table, setTable] = useState({
    data: [],
    page: 1,
  });

  const [body, setBody] = useState({
    keyword: "",
    filters: {},
  });

  const onChange = (pagination, filters, sorter, extra) => {
    // Only fetch data if the page number has changed
    if (pagination.current !== currentPage) {
      fetch({ filters: body.filters, keyword: body.keyword, page: pagination.current });
    }
  };

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

  const fetch = useCallback(
    ({ keyword, filters, page = 1 }) => {
      setLoading(true); // Set loading to true before making the API call
      // Fetch data from the API
      AxiosInstance.post(`GetMakineFullList?pagingDeger=${page}&lokasyonId=${locationId}&parametre=${keyword}`, filters)
        .then((response) => {
          const fetchedData = response.makine_listesi.map((item, index) => {
            return {
              key: index.toString(),
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
              tb_makine_id: item.TB_MAKINE_ID,
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
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },
    [locationId]
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

  // useEffect(() => {
  //   if (locationId) {
  //     setInputValue(""); // Reset the input value
  //     setDefinitionValue(""); // Reset the definition value
  //     // Similarly, reset other values as needed...
  //   }
  // }, [locationId]);

  useEffect(() => {
    setInputValue(""); // Reset the input value
    setDefinitionValue(""); // Reset the definition value
    setSelectedRowKeys([]); // Uncheck all rows by setting an empty array
    setSelectedRowIndex(-1); // Reset the selected row index
    setLocationValue(null);
    setMachineLocationId(null);
    setFullLocationValue(null);
    setSelectedMachineId(null);
    setMachineWarranty("");
    setMachineWarrantyStatus("");
  }, [locationId]);

  useEffect(() => {
    fetch({ filters: body.filters, keyword: body.keyword, page: 1 });
  }, [body]);

  // end of search field

  const handlePlusClick = () => {
    setIsModalVisible(true);
    fetch({ filters: body.filters, keyword: body.keyword, page: 1 });
  };

  const handleMinusClick = () => {
    setInputValue("");
    setSelectedRowKeys([]); // Clear the selected rows
    setSelectedRowIndex(-1); // Reset the selected row index
    setDefinitionValue(""); // Clear the value for the new input
    setSelectedMachineId(null); // Clear the selected machine's ID
    setLocationValue("");
    setMachineLocationId("");
    setFullLocationValue("");
    setMachineWarranty("");
    setMachineWarrantyStatus("");
    setValue("machineId", "");
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleArrowKeyPress = useCallback(
    (e) => {
      if (selectedRowKeys.length === 0) return;

      if (e.key === "ArrowUp" && selectedRowIndex > 0) {
        setSelectedRowIndex(selectedRowIndex - 1);
        setInputValue(data[selectedRowIndex - 1].code);
        setDefinitionValue(data[selectedRowIndex - 1].definition);
      } else if (e.key === "ArrowDown" && selectedRowIndex < selectedRowKeys.length - 1) {
        setSelectedRowIndex(selectedRowIndex + 1);
        setInputValue(data[selectedRowIndex + 1].code);
        setDefinitionValue(data[selectedRowIndex + 1].definition);
      }
    },
    [selectedRowKeys, selectedRowIndex, data]
  ); // Add dependencies

  // select checked row on table

  useEffect(() => {
    if (isModalVisible) {
      window.addEventListener("keydown", handleArrowKeyPress);
    } else {
      window.removeEventListener("keydown", handleArrowKeyPress);
    }

    return () => {
      window.removeEventListener("keydown", handleArrowKeyPress);
    };
  }, [isModalVisible, selectedRowIndex, handleArrowKeyPress]); // Add handleArrowKeyPress to the dependency array

  const rowSelection = {
    type: "checkbox",
    selectedRowKeys,
    onChange: (selectedKeys, selectedRows) => {
      // If multiple keys are selected, only keep the last one
      const lastSelectedKey = selectedKeys[selectedKeys.length - 1];
      setSelectedRowKeys([lastSelectedKey]);

      const lastSelectedRow = selectedRows.find((row) => row.key === lastSelectedKey);
      if (lastSelectedRow) {
        setSelectedRowIndex(data.findIndex((item) => item.key === lastSelectedKey));
        setInputValue(lastSelectedRow.code);
        setDefinitionValue(lastSelectedRow.definition); // Set the value for the new input
        setSelectedMachineId(lastSelectedRow.tb_makine_id); // Store the selected machine's ID
        setLocationValue(lastSelectedRow.location);
        setMachineLocationId(lastSelectedRow.machinelocationid);
        setFullLocationValue(lastSelectedRow.fullLocation);
        setMachineWarranty(lastSelectedRow.machine_warranty);
        setMachineWarrantyStatus(lastSelectedRow.machine_warranty_status);
        setValue("machineId", lastSelectedRow.tb_makine_id);
      } else {
        setSelectedRowIndex(-1);
        setDefinitionValue(""); // Clear the value for the new input
        setSelectedMachineId(null);
        setLocationValue("");
        setMachineLocationId("");
        setFullLocationValue("");
      }
    },
  };

  // end of select checked row on table

  useEffect(() => {
    // Set the value of the field managed by TreeSelect when lastSelectedForTreeSelect changes
    setValue("machine", inputValue);
  }, [inputValue, setValue]);

  useEffect(() => {
    // Set the value of the field managed by TreeSelect when lastSelectedForTreeSelect changes
    setValue("machineDefinition", definitionValue);
  }, [definitionValue, setValue]);

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", width: "415px", justifyContent: "space-between" }}>
        <Text style={{ fontSize: "14px" }}>Makine:</Text>
        <div style={{ display: "flex", alignItems: "center", width: "300px", gap: "5px" }}>
          <Controller
            name="machine"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input
                {...field}
                // value={inputValue}
                onChange={(e) => {
                  console.log(e.target.value);
                  setInputValue(e.target.value);
                  field.onChange(e.target.value);
                }}
                disabled
              />
            )}
          />
          <Controller
            name="machineId"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text" // Set the type to "text" for name input
                style={{ display: "none" }}
              />
            )}
          />

          <Button onClick={handlePlusClick}> + </Button>
          <Button onClick={handleMinusClick}> - </Button>
          <Modal
            width="1200px"
            title="Makine Listesi"
            open={isModalVisible}
            onOk={handleModalOk}
            onCancel={handleModalCancel}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                width: "318px",
                position: "relative",
                zIndex: "1",
                marginBottom: "-58px",
              }}>
              <SearchField onChange={handleBodyChange} />
              <Filters onChange={handleBodyChange} />
            </div>

            <StyledTable
              // style={{ marginTop: "10px" }}
              rowSelection={rowSelection}
              columns={columns}
              dataSource={table.data}
              loading={loading} // Pass the loading state to the loading prop of AntdTable
              onChange={onChange}
              scroll={{
                // x: "auto",
                y: "100vh",
              }}
              pagination={{
                position: ["topRight"],
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
      </div>
      <Controller
        name="machineDefinition"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            type="text" // Set the type to "text" for name input
            variant="outlined"
            style={{ width: "350px" }}
            // value={definitionValue}
            disabled
          />
        )}
      />
      {/* <Input style={{ width: "350px" }} value={definitionValue} disabled />  */}
    </div>
  );
}
