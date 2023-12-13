import React, { useCallback, useEffect, useState } from "react";
import { Input, Button, Modal, Typography, Table } from "antd";
import AxiosInstance from "../../../../../../api/http";
import SearchField from "../../../../Table/SearchField";
import Filters from "./LinkedWorkOrder/filter/Filters";
import styled from "styled-components";
import { useFormContext, Controller } from "react-hook-form";
import dayjs from "dayjs";

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

export default function LinkedWorkOrder({}) {
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
      title: "İş Emri No",
      dataIndex: "code",
      key: "code",
      sorter: (a, b) => {
        if (a.code && b.code) {
          return a.code.localeCompare(b.code);
        }
        if (!a.code && !b.code) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.code ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
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
      title: "Tarih",
      dataIndex: "editDate",
      key: "editDate",
      sorter: (a, b) => {
        if (a.editDate && b.editDate) {
          return a.editDate.localeCompare(b.editDate);
        }
        if (!a.editDate && !b.editDate) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.editDate ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
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
      title: "Konu",
      dataIndex: "subject",
      key: "subject",
      sorter: (a, b) => {
        if (a.subject && b.subject) {
          return a.momachine_typedel.localeCompare(b.subject);
        }
        if (!a.subject && !b.subject) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.subject ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
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
      title: "İş Emri Tipi",
      dataIndex: "type",
      key: "type",
      sorter: (a, b) => {
        if (a.type && b.type) {
          return a.type.localeCompare(b.type);
        }
        if (!a.type && !b.type) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.type ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
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
      title: "Durum",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => {
        if (a.status && b.status) {
          return a.status.localeCompare(b.status);
        }
        if (!a.status && !b.status) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.status ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
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
      title: "Makine Kodu",
      dataIndex: "machine",
      key: "machine",
      sorter: (a, b) => {
        if (a.machine && b.machine) {
          return a.machine.localeCompare(b.machine);
        }
        if (!a.machine && !b.machine) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.machine ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
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
      dataIndex: "machineDescription",
      key: "machineDescription",
      sorter: (a, b) => {
        if (a.machineDescription && b.machineDescription) {
          return a.machineDescription.localeCompare(b.machineDescription);
        }
        if (!a.machineDescription && !b.machineDescription) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.machineDescription ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
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
      title: "İş Süresi (dk.)",
      dataIndex: "jobTime",
      key: "jobTime",
      sorter: (a, b) => {
        if (a.jobTime && b.jobTime) {
          return a.jobTime.localeCompare(b.jobTime);
        }
        if (!a.jobTime && !b.jobTime) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.jobTime ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
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
      title: "Tamamlanma(%)",
      dataIndex: "completion",
      key: "completion",
      sorter: (a, b) => {
        if (a.completion && b.completion) {
          return a.completion.localeCompare(b.completion);
        }
        if (!a.completion && !b.completion) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.completion ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
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
      title: "İş Tipi",
      dataIndex: "jobType",
      key: "jobType",
      sorter: (a, b) => {
        if (a.jobType && b.jobType) {
          return a.jobType.localeCompare(b.jobType);
        }
        if (!a.jobType && !b.jobType) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.jobType ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
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
      title: "İş Nedeni",
      dataIndex: "jobReason",
      key: "jobReason",
      sorter: (a, b) => {
        if (a.jobReason && b.jobReason) {
          return a.jobReason.localeCompare(b.jobReason);
        }
        if (!a.jobReason && !b.jobReason) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.jobReason ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
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
      title: "Atölye",
      dataIndex: "workshop",
      key: "workshop",
      sorter: (a, b) => {
        if (a.workshop && b.workshop) {
          return a.workshop.localeCompare(b.workshop);
        }
        if (!a.workshop && !b.workshop) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.workshop ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
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
      title: "Kapanış Tarihi",
      dataIndex: "closingDate",
      key: "closingDate",
      sorter: (a, b) => {
        if (a.closingDate && b.closingDate) {
          return a.closingDate.localeCompare(b.closingDate);
        }
        if (!a.closingDate && !b.closingDate) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.closingDate ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
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
      title: "Kapanış Tarihi",
      dataIndex: "closingTime",
      key: "closingTime",
      sorter: (a, b) => {
        if (a.closingTime && b.closingTime) {
          return a.closingTime.localeCompare(b.closingTime);
        }
        if (!a.closingTime && !b.closingTime) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.closingTime ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
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
      title: "Personel Adı",
      dataIndex: "personelName",
      key: "personelName",
      sorter: (a, b) => {
        if (a.personelName && b.personelName) {
          return a.personelName.localeCompare(b.personelName);
        }
        if (!a.personelName && !b.personelName) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.personelName ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
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
    setLoading(true); // Set loading to true before making the API call
    // Fetch data from the API
    AxiosInstance.post(`getIsEmriFullList?id=11&parametre=${keyword}&pagingDeger=${page}`, filters)
      .then((response) => {
        const fetchedData = response.list.map((item, index) => {
          return {
            key: item.TB_ISEMRI_ID,
            code: item.ISEMRI_NO,
            editDate: dayjs(item.DUZENLEME_TARIH).format("DD-MM-YYYY"),
            subject: item.KONU,
            type: item.ISEMRI_TIP,
            status: item.DURUM,
            location: item.LOKASYON,
            machine: item.MAKINE_KODU,
            machineDescription: item.MAKINE_TANIMI,
            jobTime: item.IS_SURESI,
            completion: item.TAMAMLANMA,
            jobType: item.IS_TIPI,
            jobReason: item.IS_NEDENI,
            workshop: item.ATOLYE,
            closingDate: dayjs(item.KAPANIS_TARIHI).format("DD-MM-YYYY"),
            closingTime: item.KAPANIS_SAATI,
            personelName: item.PERSONEL_ADI,
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
  });

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
        setInputValue(lastSelectedRow.code);
        setDefinitionValue(lastSelectedRow.definition);
        setValue("linked_work_order", lastSelectedKey);
      }
    },
  };

  // end of select checked row on table

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", width: "425px", justifyContent: "space-between" }}>
        <Text style={{ fontSize: "14px" }}>Bağlı İş Emri:</Text>
        <div style={{ display: "flex", alignItems: "center", width: "300px", gap: "5px" }}>
          <Controller
            name="linked_work_order"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input
                {...field}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  field.onChange(e.target.value);
                }}
                disabled
              />
            )}
          />
          <Button onClick={handlePlusClick}> + </Button>
          <Button onClick={handleMinusClick}> - </Button>
          <Modal
            width="1200px"
            title="İş Emri Listesi"
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
                x: "auto",
                y: "500px",
              }}
              pagination={{
                position: ["topRight"],
                pageSize: 50,
                showSizeChanger: false,
                current: currentPage,
                // Eger total toplam veri sayisidirsa *10 olmalidir
                total: table.page * 50,
                // Eger total toplam sehife sayisidirsa
                // total: table.page,
                onChange: (page) => fetch({ filters: body.filters, keyword: body.keyword, page }),
                // quick jump for page input field
              }}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
}
