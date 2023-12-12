import React, { useCallback, useState, useEffect } from "react";
import { Input, Button, Modal, Typography, Table } from "antd";
import AxiosInstance from "../../../../../../../api/http";
import styled from "styled-components";
import { useFormContext, Controller } from "react-hook-form";

const { Text } = Typography;

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

export default function Company({ companySelectedId, companyCurrentValue, onSubmit }) {
  const { control, setValue, watch } = useFormContext();
  const [inputValue, setInputValue] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  // tablodaki search kısmı için
  const [searchValue, setSearchValue] = useState("");
  // 1. Add a state variable for searchTimeout
  const [searchTimeout, setSearchTimeout] = useState(null);
  // tablodaki search kısmı için son
  // sayfalama için
  const [currentPage, setCurrentPage] = useState(1); // Initial page
  const [pageSize, setPageSize] = useState(0); // Default to 0
  // sayfalama için son
  // sayfa değiştiğinde apiye istek hemen gitsin filtrelemede bulunan gecikmeden etkilenmesin diye
  const [changeSource, setChangeSource] = useState(null);
  // sayfa değiştiğinde apiye istek hemen gitsin filtrelemede bulunan gecikmeden etkilenmesin diye son

  const columns = [
    {
      title: "Firma Kodu",
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
      title: "Firma Ünvanı",
      dataIndex: "subject",
      key: "subject",
      width: "350px",

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
      title: "Firma Tipi",
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
      title: "Lokasyon",
      dataIndex: "description",
      key: "description",
      width: "150px",

      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
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
      title: "Şehir",
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

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`GetFirmaList?userId=24&pagingDeger=${currentPage}&search=${searchValue}`)
      .then((response) => {
        // sayfalama için
        // Set the total pages based on the pageSize from the API response
        setPageSize(response.pageSize);

        // sayfalama için son

        const fetchedData = response.Firma_Liste.map((item) => {
          return {
            key: item.TB_CARI_ID,
            code: item.CAR_KOD,
            subject: item.CAR_TANIM,
            workdays: item.CAR_TIP,
            description: item.CAR_LOKASYON,
            fifthcolumn: item.CAR_SEHIR,
          };
        });
        setData(fetchedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [searchValue, currentPage]); // Added currentPage as a dependency

  const handlePlusClick = () => {
    setIsModalVisible(true);
    fetch();
  };

  const handleMinusClick = () => {
    setInputValue("");
    setSelectedRowKeys([]);
    setValue("company", ""); // Set the value in React Hook Form
    setValue("companyID", ""); // Set the value in React Hook Form
  };

  const handleModalOk = () => {
    const selectedData = data.find((item) => item.key === selectedRowKeys[0]);
    if (selectedData) {
      setInputValue(selectedData.subject);
      // setValue("company", selectedData.key); // Set the value in React Hook Form
      setValue("companyID", selectedData.key); // Set the value in React Hook Form
      onSubmit && onSubmit(selectedData);
    }
    setIsModalVisible(false);
  };

  useEffect(() => {
    setInputValue(companyCurrentValue || "");
    setSelectedRowKeys(companySelectedId ? [companySelectedId] : []);
  }, [companyCurrentValue, companySelectedId]);

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSearchValue(""); // Reset the search value when the modal is closed
    setCurrentPage(1); // Reset to page 1 when the modal is closed
  };

  const rowSelection = {
    type: "checkbox",
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys([selectedKeys[selectedKeys.length - 1]]);
    },
  };
  // tabloyu sağa sola kaydıra bilme özelliği eklemek için
  const totalTableWidth = columns.reduce((acc, column) => acc + (parseInt(column.width, 10) || 0), 0);
  // tabloyu sağa sola kaydıra bilme özelliği eklemek için son

  // tablodaki search kısmı için
  useEffect(() => {
    if (changeSource === "searchValue") {
      if (searchTimeout) {
        clearTimeout(searchTimeout); // Clear any existing timeout
      }
      const timeout = setTimeout(() => {
        fetch();
        setChangeSource(null); // Reset the change source after fetching
      }, 2000); // 2000 milliseconds delay
      setSearchTimeout(timeout); // Store the timeout ID

      // Cleanup function to clear the timeout when the component is unmounted
      return () => {
        clearTimeout(timeout);
      };
    } else if (changeSource === "currentPage") {
      fetch();
      setChangeSource(null); // Reset the change source after fetching
    }
  }, [searchValue, currentPage, fetch]); // Added fetch as a dependency

  // tablodaki search kısmı için son

  useEffect(() => {
    setValue("company", inputValue);
  }, [inputValue, setValue]);

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
      <Text style={{ fontSize: "14px" }}>Firma:</Text>
      <div style={{ display: "flex", alignItems: "center", width: "350px", gap: "5px" }}>
        <Controller
          name="company"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input
              {...field}
              // value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                field.onChange(e.target.value);
              }}
              disabled
            />
          )}
        />
        <Controller
          name="companyID"
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
          centered
          width="1200px"
          title="Firmalar"
          visible={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}>
          <Input
            placeholder="Ara..."
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setCurrentPage(1); // Reset to page 1 when the search value changes
              setChangeSource("searchValue"); // Set the change source
            }}
            style={{ marginBottom: "20px", width: "250px" }}
          />
          <StyledTable
            className="custom-table"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data}
            loading={loading}
            scroll={{
              x: totalTableWidth,
              y: "500px",
            }}
            pagination={{
              current: currentPage,
              total: pageSize * 10,
              onChange: (page) => {
                setCurrentPage(page);
                setChangeSource("currentPage"); // Set the change source
              },
            }}
          />
        </Modal>
      </div>
    </div>
  );
}
