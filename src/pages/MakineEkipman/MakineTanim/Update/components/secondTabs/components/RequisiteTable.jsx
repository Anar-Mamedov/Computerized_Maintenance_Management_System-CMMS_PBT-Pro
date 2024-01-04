import React, { useEffect, useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Table } from "antd";
import AxiosInstance from "../../../../../../../api/http";

export default function RequisiteTable() {
  const { watch, control } = useFormContext();
  const { fields, append, replace } = useFieldArray({
    control,
    name: "equipment", // Name of the field array
  });

  const selectedMakineID = watch("secilenMakineID");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    if (selectedMakineID) {
      fetchEquipmentData();
    }
  }, [selectedMakineID]);

  const fetchEquipmentData = async () => {
    try {
      const response = await AxiosInstance.get(`Ekipman?MakineID=${selectedMakineID}`);
      if (response) {
        const formattedData = formatDataForTable(response);
        replace(formattedData); // Populate the field array
      } else {
        console.error("API response is not in expected format");
      }
    } catch (error) {
      console.error("Error in API request:", error);
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
    // {
    //   title: "",
    //   key: "key",
    //   dataIndex: "key",
    //   width: 150,
    //   render: (text, record) => <div style={{ marginTop: "6px" }}>{record.key}</div>,
    // },
    {
      title: "",
      key: "ekipmanBilgisi",
      render: (text, record) => (
        <div style={{ marginTop: "6px" }}>
          {record.EKP_KOD} - {record.EKP_TANIM}
        </div>
      ),
    },
    // Other columns...
  ];

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    // You can add more configuration here if needed
  };

  return <Table rowSelection={rowSelection} columns={columns} dataSource={fields} />;
}
