import React, { useCallback, useState } from "react";
import { Input, Button, Modal, Typography, Table } from "antd";
import AxiosInstance from "../../../../../../../api/http";
import styled from "styled-components";
import { useFormContext, Controller } from "react-hook-form";
import dayjs from "dayjs";

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

export default function Instruction() {
  const { control, setValue } = useFormContext();
  const [inputValue, setInputValue] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "Talimat Kodu",
      dataIndex: "code",
      key: "code",
      width: "150px",
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
      title: "Talımat Tanım",
      dataIndex: "subject",
      key: "subject",
      width: "350px",

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
      title: "Talimat Tipi",
      dataIndex: "workdays",
      key: "workdays",
      width: "150px",
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
    // {
    //   title: "Hazırlayan",
    //   dataIndex: "description",
    //   key: "description",
    //   width: "150px",

    //   render: (text) => (
    //     <div
    //       style={{
    //         whiteSpace: "nowrap",
    //         overflow: "hidden",
    //         textOverflow: "ellipsis",
    //       }}>
    //       {text}
    //     </div>
    //   ),
    // },
    {
      title: "Sorumlu",
      dataIndex: "fifthcolumn",
      key: "fifthcolumn",
      width: "150px",
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
    //   {
    //     title: "Yürürlük Tarihi",
    //     dataIndex: "sixthcolumn",
    //     key: "sixthcolumn",
    //     render: (text) => {
    //       if (text === "01-01-0001") {
    //         return null; // or return ""; to return an empty string
    //       }
    //       return (
    //         <div
    //           style={{
    //             whiteSpace: "nowrap",
    //             overflow: "hidden",
    //             textOverflow: "ellipsis",
    //           }}>
    //           {text}
    //         </div>
    //       );
    //     },
    //   },
    //   {
    //     title: "Referans",
    //     dataIndex: "seventhcolumn",
    //     key: "seventhcolumn",
    //     width: "150px",
    //     render: (text) => (
    //       <div
    //         style={{
    //           whiteSpace: "nowrap",
    //           overflow: "hidden",
    //           textOverflow: "ellipsis",
    //         }}>
    //         {text}
    //       </div>
    //     ),
    //   },
    //   {
    //     title: "Dağıtım",
    //     dataIndex: "eighthcolumn",
    //     key: "eighthcolumn",
    //     width: "150px",

    //     render: (text) => (
    //       <div
    //         style={{
    //           whiteSpace: "nowrap",
    //           overflow: "hidden",
    //           textOverflow: "ellipsis",
    //         }}>
    //         {text}
    //       </div>
    //     ),
    //   },
    //   {
    //     title: "Revizyon Tarihi",
    //     dataIndex: "ninthcolumn",
    //     key: "ninthcolumn",
    //     width: "150px",

    //     render: (text) => {
    //       if (text === "01-01-0001") {
    //         return null; // or return ""; to return an empty string
    //       }
    //       return (
    //         <div
    //           style={{
    //             whiteSpace: "nowrap",
    //             overflow: "hidden",
    //             textOverflow: "ellipsis",
    //           }}>
    //           {text}
    //         </div>
    //       );
    //     },
    //   },
    //   {
    //     title: "Revizyon No",
    //     dataIndex: "tenthcolumn",
    //     key: "tenthcolumn",
    //     width: "150px",

    //     render: (text) => (
    //       <div
    //         style={{
    //           whiteSpace: "nowrap",
    //           overflow: "hidden",
    //           textOverflow: "ellipsis",
    //         }}>
    //         {text}
    //       </div>
    //     ),
    //   },
    //   {
    //     title: "Revizyon Nedeni",
    //     dataIndex: "eleventhcolumn",
    //     key: "eleventhcolumn",
    //     width: "150px",

    //     render: (text) => (
    //       <div
    //         style={{
    //           whiteSpace: "nowrap",
    //           overflow: "hidden",
    //           textOverflow: "ellipsis",
    //         }}>
    //         {text}
    //       </div>
    //     ),
    //   },
    //   {
    //     title: "Revize Eden",
    //     dataIndex: "twelfthcolumn",
    //     key: "twelfthcolumn",
    //     width: "150px",

    //     render: (text) => (
    //       <div
    //         style={{
    //           whiteSpace: "nowrap",
    //           overflow: "hidden",
    //           textOverflow: "ellipsis",
    //         }}>
    //         {text}
    //       </div>
    //     ),
    //   },
  ];

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`GetTalimatList`)
      .then((response) => {
        const fetchedData = response.Talimat_Liste.map((item) => {
          return {
            key: item.TB_TALIMAT_ID,
            code: item.TLM_KOD,
            subject: item.TLM_TANIM,
            workdays: item.TLM_TIP,
            description: item.TLM_ACIKLAMA, // ?
            fifthcolumn: item.TLM_SORUMLU, // ?
            sixthcolumn: dayjs(item.TLM_YURURLUK_TARIH).format("DD-MM-YYYY"),
            seventhcolumn: item.TLM_REFERANS,
            eighthcolumn: item.TLM_DAGITIM,
            ninthcolumn: dayjs(item.TLM_REV_TARIH).format("DD-MM-YYYY"),
            tenthcolumn: item.TLM_REV_NO,
            eleventhcolumn: item.TLM_REV_NEDEN,
            twelfthcolumn: item.TLM_REVIZE_EDEN, // ?
          };
        });
        setData(fetchedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handlePlusClick = () => {
    setIsModalVisible(true);
    fetch();
  };

  const handleMinusClick = () => {
    setInputValue("");
    setSelectedRowKeys([]);
  };

  const handleModalOk = () => {
    const selectedData = data.find((item) => item.key === selectedRowKeys[0]);
    if (selectedData) {
      setInputValue(selectedData.subject);
      setValue("instruction", selectedData.subject); // Set the value in React Hook Form
      setValue("instructionSelectedId", selectedData.key); // Set the value in React Hook Form
    }
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
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
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", width: "425px", justifyContent: "space-between" }}>
        <Text style={{ fontSize: "14px" }}>Talimat:</Text>
        <div style={{ display: "flex", alignItems: "center", width: "300px", gap: "5px" }}>
          <Controller
            name="instruction"
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
            centered
            width="1200px"
            title="Talimat Tanımları"
            open={isModalVisible}
            onOk={handleModalOk}
            onCancel={handleModalCancel}>
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
            />
          </Modal>
        </div>
      </div>
    </div>
  );
}
