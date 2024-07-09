import React, { useEffect, useState } from "react";
import {
  Table,
  Typography,
  Spin,
  Button,
  Popover,
  Modal,
  DatePicker,
} from "antd";
import { MoreOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../api/http.jsx";
import { Controller, useFormContext } from "react-hook-form";
import jsPDF from "jspdf";
import "jspdf-autotable";
import dayjs from "dayjs";
import customFontBase64 from "./RobotoBase64.js";

const { Text } = Typography;

function MakineTiplerineGore(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [isExpandedModalVisible, setIsExpandedModalVisible] = useState(false); // Expanded modal visibility state
  const {
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useFormContext();

  const downloadPDF = () => {
    const doc = new jsPDF();

    // jsPDF içinde kullanım
    doc.addFileToVFS("Roboto-Regular.ttf", customFontBase64);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");

    doc.setFont("Roboto");

    const columns = ["Makine Tipi", "Adet", "Yüzde"];
    const tableData = data.map((item) => {
      const Yuzde = item.MAKINE_SAYISI + "%";
      return [item.MAKINE_TIPI, item.MAKINE_SAYISI, Yuzde];
    });

    doc.autoTable({
      head: [columns],
      body: tableData,
    });

    doc.save("makine_envanter_dagilimi.pdf");
  };

  const columns = [
    {
      title: "Makine Tipi",
      dataIndex: "MAKINE_TIPI",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Adet",
      dataIndex: "MAKINE_SAYISI",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Yüzde",
      dataIndex: "MAKINE_SAYISI",
      width: 100,
      ellipsis: true,
      render: (text, record) => {
        return <div>{record.MAKINE_SAYISI}%</div>;
      },
    },
  ];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await AxiosInstance.get(`GetMakineTipEnvanter?ID=2`);
      const formattedData = response.map((item) => {
        return {
          ...item,
          key: item.TB_KOD_ID,
        };
      });
      setData(formattedData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const content = (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div
        style={{ cursor: "pointer" }}
        onClick={() => setIsExpandedModalVisible(true)}
      >
        Büyüt
      </div>

      <div style={{ cursor: "pointer" }} onClick={downloadPDF}>
        İndir
      </div>
    </div>
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "5px",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        border: "1px solid #f0f0f0",
      }}
    >
      <div
        style={{
          padding: "10px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontWeight: "500", fontSize: "17px" }}>
          Makine Tiplerine Göre Envanter Dağılımı
        </Text>
        <Popover placement="bottom" content={content} trigger="click">
          <Button
            type="text"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0px 5px",
              height: "32px",
              zIndex: 3,
            }}
          >
            <MoreOutlined
              style={{ cursor: "pointer", fontWeight: "500", fontSize: "16px" }}
            />
          </Button>
        </Popover>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "7px",
          overflow: "auto",
          height: "100vh",
          padding: "0px 10px 0 10px",
        }}
      >
        <Spin spinning={isLoading}>
          <Table
            columns={columns}
            dataSource={data}
            size="small"
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
              position: ["bottomRight"],
              showTotal: (total, range) => `Toplam ${total}`,
              showQuickJumper: true,
            }}
          />
        </Spin>
      </div>

      {/* Expanded Modal */}
      <Modal
        title={
          <div>
            <Text style={{ fontWeight: "500", fontSize: "17px" }}>
              Makine Tiplerine Göre Envanter Dağılımı
            </Text>
          </div>
        }
        centered
        open={isExpandedModalVisible}
        onOk={() => setIsExpandedModalVisible(false)}
        onCancel={() => setIsExpandedModalVisible(false)}
        width="90%"
        destroyOnClose
      >
        <div>
          <Spin spinning={isLoading}>
            <Table
              columns={columns}
              dataSource={data}
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],
                position: ["bottomRight"],
                showTotal: (total, range) => `Toplam ${total}`,
                showQuickJumper: true,
              }}
              scroll={{ y: "calc(100vh - 380px)" }}
            />
          </Spin>
        </div>
      </Modal>
    </div>
  );
}

export default MakineTiplerineGore;
