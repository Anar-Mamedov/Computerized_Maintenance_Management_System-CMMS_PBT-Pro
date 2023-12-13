import React, { useCallback, useState } from "react";
import { Input, Button, Modal, Typography, Table } from "antd";
import AxiosInstance from "../../../../../../../../api/http";
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
    line-height: 10px; // Adjust this value to vertically center the text
  }
`;

export default function Project() {
  const { control, setValue } = useFormContext();
  const [inputValue, setInputValue] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "Proje Kodu",
      dataIndex: "code",
      key: "code",
      width: 200,
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
      title: "Proje Tanımı",
      dataIndex: "subject",
      key: "subject",
      width: 300,
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
      title: "Proje Tipi",
      dataIndex: "type",
      key: "type",
      width: 200,
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
      title: "Başlama Tarihi",
      dataIndex: "startDate",
      key: "startDate",
      width: 200,
      render: (text) => {
        if (text === "01-01-0001") {
          return null; // or return ""; to return an empty string
        }
        return (
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
            {text}
          </div>
        );
      },
    },
    {
      title: "Bitiş Tarihi",
      dataIndex: "endDate",
      key: "endDate",
      width: 200,
      render: (text) => {
        if (text === "01-01-0001") {
          return null; // or return ""; to return an empty string
        }
        return (
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
            {text}
          </div>
        );
      },
    },
    // {
    //   title: "Proje Durum",
    //   dataIndex: "status",
    //   key: "status",
    //   width: 200,
    //   render: (text) => (
    //     <div
    //       style={{
    //         whiteSpace: "nowrap",
    //         overflow: "hidden",
    //         textOverflow: "ellipsis",
    //         color: text === "Aktif" ? "#52c41a" : "#f5222d",
    //       }}>
    //       {text}
    //     </div>
    //   ),
    // },
    // {
    //   title: "Tamamlama (%)",
    //   dataIndex: "completion",
    //   key: "completion",
    //   width: 200,
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
    // {
    //   title: "Proje Maliyeti",
    //   dataIndex: "projectCost",
    //   key: "projectCost",
    //   width: 200,
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
    // {
    //   title: "Bütçe(%)",
    //   dataIndex: "budget",
    //   key: "budget",
    //   width: 200,
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
    // {
    //   title: "Toplam Çalışma Süresi",
    //   dataIndex: "totalWorkingTime",
    //   key: "totalWorkingTime",
    //   width: 200,
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
    // {
    //   title: "Toplam Maliyet",
    //   dataIndex: "totalCost",
    //   key: "totalCost",
    //   width: 200,
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
    // {
    //   title: "Çalışan Makine Sayısı",
    //   dataIndex: "workingMachineCount",
    //   key: "workingMachineCount",
    //   width: 200,
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
    // {
    //   title: "Çalışan Personel Sayısı",
    //   dataIndex: "workingPersonnelCount",
    //   key: "workingPersonnelCount",
    //   width: 200,
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
    // {
    //   title: "Proje Yöneticisi",
    //   dataIndex: "projectManager",
    //   key: "projectManager",
    //   width: 200,
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
    // {
    //   title: "Lokasyon",
    //   dataIndex: "location",
    //   key: "location",
    //   width: 200,
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
    // {
    //   title: "Firma",
    //   dataIndex: "company",
    //   key: "company",
    //   width: 200,
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
    // {
    //   title: "Masraf Merkezi",
    //   dataIndex: "costCenter",
    //   key: "costCenter",
    //   width: 200,
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
    // {
    //   title: "Bağlı Proje",
    //   dataIndex: "connectedProject",
    //   key: "connectedProject",
    //   width: 200,
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
    // {
    //   title: "Öncelik",
    //   dataIndex: "priority",
    //   key: "priority",
    //   width: 200,
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
  ];

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`GetProjeList`)
      .then((response) => {
        const fetchedData = response.Proje_Liste.map((item) => {
          return {
            key: item.TB_PROJE_ID,
            code: item.PRJ_KOD,
            subject: item.PRJ_TANIM,
            type: item.PRJ_TIP,
            startDate: dayjs(item.PRJ_BASLAMA_TARIH).format("DD-MM-YYYY"),
            endDate: dayjs(item.PRJ_BITIS_TARIH).format("DD-MM-YYYY"),
            status: item.PRJ_DURUM, // ?
            completion: item.PRJ_TAMAMLANMA_ORAN,
            projectCost: item.PRJ_TAHMINI_MALIYET,
            budget: item.PRJ_BUTCE, // ?
            totalWorkingTime: item.PRJ_CALISMA_SURE, // ? boş olması lazım ama veri geliyor
            totalCost: item.PRJ_TOP_MALIYET, // ?
            workingMachineCount: item.PRJ_CAL_MAK_SAY, // ?
            workingPersonnelCount: item.PRJ_CAL_PER_SAY, // ?
            projectManager: item.PRJ_YONETICI, // ?
            location: item.PRJ_LOKASYON, // ? id geliyor tanım lazım
            company: item.PRJ_FIRMA, // ? id geliyor tanım lazım
            costCenter: item.PRJ_MASRAF_MERKEZI, // ? id geliyor tanım lazım
            connectedProject: item.PRJ_BAGLI_PROJE_ID, // ? id geliyor ne gelmesi lazım bilmiyorum
            priority: item.PRJ_ONCELIK, // ? id geliyor tanım gelmesi lazım
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
      setValue("project", selectedData.key); // Set the value in React Hook Form
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
        <Text style={{ fontSize: "14px" }}>Proje:</Text>
        <div style={{ display: "flex", alignItems: "center", width: "300px", gap: "5px" }}>
          <Controller
            name="project"
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
            title="Proje Tanımları"
            open={isModalVisible}
            onOk={handleModalOk}
            onCancel={handleModalCancel}>
            <StyledTable
              className="custom-table"
              rowSelection={rowSelection}
              columns={columns}
              dataSource={data}
              loading={loading}
              scroll={{ x: totalTableWidth, y: "500px" }}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
}
