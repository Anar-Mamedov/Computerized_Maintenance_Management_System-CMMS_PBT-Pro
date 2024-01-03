import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Table } from "antd";
import AxiosInstance from "../../../../../../../api/http";

export default function RequisiteTable() {
  const { watch } = useFormContext();
  const [tableData, setTableData] = useState([]);

  const selectedMakineID = watch("secilenMakineID");

  useEffect(() => {
    fetchEquipmentData();
  }, [selectedMakineID]);

  const fetchEquipmentData = async () => {
    try {
      const response = await AxiosInstance.get(`Ekipman?MakineID=${selectedMakineID}`);
      if (response && response) {
        const formattedData = formatDataForTable(response);
        setTableData(formattedData);
      } else {
        console.error("API yanıtı beklenen formatta değil");
      }
    } catch (error) {
      console.error("API isteğinde hata oluştu:", error);
    }
  };

  const formatDataForTable = (data) => {
    let nodes = {};
    let tree = [];

    // Her bir ekipmanı bir node olarak hazırlayın
    data.forEach((item) => {
      nodes[item.TB_EKIPMAN_ID] = {
        ...item,
        key: item.TB_EKIPMAN_ID,
        // children alanını burada oluşturmayın
      };
    });

    // Ekipmanlar arasındaki ilişkileri kurun
    data.forEach((item) => {
      if (item.EKP_REF_ID && nodes[item.EKP_REF_ID]) {
        // Çocuk düğümleri burada oluşturun
        nodes[item.EKP_REF_ID].children = nodes[item.EKP_REF_ID].children || [];
        nodes[item.EKP_REF_ID].children.push(nodes[item.TB_EKIPMAN_ID]);
      } else {
        // Eğer üst düzey bir ekipman ise, ağacın köküne ekleyin
        tree.push(nodes[item.TB_EKIPMAN_ID]);
      }
    });

    // Çocukları olmayan düğümlerde children alanını silin
    Object.values(nodes).forEach((node) => {
      if (node.children && node.children.length === 0) {
        delete node.children;
      }
    });

    return tree;
  };

  const columns = [
    {
      title: "",
      key: "ekipmanBilgisi",
      render: (text, record) => (
        <div
          style={{
            marginTop: "6px",
          }}>
          {record.EKP_KOD} - {record.EKP_TANIM}
        </div>
      ),
    },
    // Diğer sütunlarınız...
  ];

  return <Table columns={columns} dataSource={tableData} />;
}
