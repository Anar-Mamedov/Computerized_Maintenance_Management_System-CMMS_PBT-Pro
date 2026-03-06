import React, { useCallback, useEffect, useState } from "react";
import { Table } from "antd";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import AxiosInstance from "../../../../../../../api/http";
import EkleButton from "./Insert/EkleButton";
import ContextMenu from "./components/ContextMenu/ContextMenu.jsx";
import EditDrawer from "../../../../../EkipmanVeritabani/Update/EditDrawer.jsx";

export default function EkipmanListesiTablo({ isActive = false }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { watch } = useFormContext();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]); // Store selected rows data
  // edit drawer için
  const [drawer, setDrawer] = useState({
    visible: false,
    data: null,
  });
  // edit drawer için son

  const kapali = watch("kapali");

  const formatDataForTable = useCallback((items) => {
    const list = Array.isArray(items) ? items : [];

    return list.map((item, index) => {
      const treeNodeId = Number(item.TB_EKIPMAN_ID ?? item.id ?? item.RowIndex ?? index + 1);
      return {
        ...item,
        KOD: item.EKP_KOD ?? item.kod ?? item.KOD ?? null,
        TANIM: item.EKP_TANIM ?? item.tanim ?? item.TANIM ?? null,
        TIP: item.EKP_TIP ?? item.tipi ?? item.TIP ?? null,
        IMAGE: item.IMAGE ?? null, // Assuming IMAGE stays the same
        key: item.TB_EKIPMAN_ID ?? item.id ?? treeNodeId,
        children: item.hasChild ? [] : undefined,
      };
    });
  }, []);

  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const onTableRowExpand = (expanded, record) => {
    setExpandedRowKeys((prevKeys) => {
      if (expanded) {
        return [...prevKeys, record.key];
      } else {
        return prevKeys.filter((key) => key !== record.key);
      }
    });

    if (expanded && record.hasChild && record.children && record.children.length === 0) {
      setLoading(true);

      AxiosInstance.post(`GetEkipmanVeritabaniListe`, {
        ItemIndex: 3,
        DepoId: -1,
        Parametre: "",
        parentID: record.key,
      })
        .then((response) => {
          if (response) {
            const childrenDataList = Array.isArray(response) ? response : response.list || [];
            const childrenData = formatDataForTable(childrenDataList);

            const updateTreeData = (dataList) => {
              return dataList.map((item) => {
                if (item.key === record.key) {
                  return { ...item, children: childrenData };
                } else if (item.children) {
                  return { ...item, children: updateTreeData(item.children) };
                } else {
                  return item;
                }
              });
            };

            setData((prevData) => updateTreeData(prevData));
          }
        })
        .catch((error) => {
          console.error("API Error:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const findItemInTree = (key, tree) => {
    for (const item of tree) {
      if (item.key === key) return item;
      if (item.children) {
        const found = findItemInTree(key, item.children);
        if (found) return found;
      }
    }
    return null;
  };

  const columns = [
    {
      title: t("ekipmanKodu"),
      dataIndex: "KOD",
      key: "KOD",
      width: 160,
      ellipsis: true,
      render: (text, record) => <a onClick={() => onRowClick(record)}>{text || "-"}</a>,
      sorter: (a, b) => {
        if (!a.KOD && !b.KOD) return 0;
        if (!a.KOD) return -1;
        if (!b.KOD) return 1;
        return a.KOD.localeCompare(b.KOD);
      },
    },

    {
      title: t("ekipmanTanimi"),
      dataIndex: "TANIM",
      key: "TANIM",
      width: 320,
      ellipsis: true,
      sorter: (a, b) => {
        if (!a.TANIM && !b.TANIM) return 0;
        if (!a.TANIM) return -1;
        if (!b.TANIM) return 1;
        return a.TANIM.localeCompare(b.TANIM);
      },
      render: (text, record) => <a onClick={() => onRowClick(record)}>{text}</a>,
    },

    {
      title: t("ekipmanTipi"),
      dataIndex: "TIP",
      key: "TIP",
      width: 140,
      ellipsis: true,
      sorter: (a, b) => {
        if (!a.TIP && !b.TIP) return 0;
        if (!a.TIP) return -1;
        if (!b.TIP) return 1;
        return a.TIP.localeCompare(b.TIP);
      },
    },

    {
      title: t("ekipmanGorseli"),
      dataIndex: "IMAGE",
      key: "IMAGE",
      width: 120,
      ellipsis: true,
      sorter: (a, b) => {
        const aValue = Number(a.IMAGE || 0);
        const bValue = Number(b.IMAGE || 0);
        return aValue - bValue;
      },
    },
  ];

  const secilenIsEmriID = watch("secilenMakineID");

  const fetch = useCallback(() => {
    if (isActive && secilenIsEmriID) {
      setLoading(true);
      setExpandedRowKeys([]); // Reset expanded rows on root fetch
      AxiosInstance.post(`GetEkipmanVeritabaniListe`, {
        ItemIndex: 3,
        DepoId: -1,
        Parametre: "",
        parentID: secilenIsEmriID,
      })
        .then((response) => {
          if (response) {
            const list = Array.isArray(response) ? response : response.list || [];
            const tree = formatDataForTable(list);
            setData(tree);
          }
        })
        .catch((error) => {
          // Hata işleme
          console.error("API isteği sırasında hata oluştu:", error);
        })
        .finally(() => setLoading(false));
    }
  }, [formatDataForTable, secilenIsEmriID, isActive]); // secilenIsEmriID değiştiğinde fetch fonksiyonunu güncelle

  useEffect(() => {
    if (secilenIsEmriID || isActive) {
      // secilenIsEmriID'nin varlığını ve geçerliliğini kontrol edin
      fetch(); // fetch fonksiyonunu çağırın
    }
  }, [secilenIsEmriID, fetch, isActive]); // secilenIsEmriID veya fetch fonksiyonu değiştiğinde useEffect'i tetikle

  const onRowSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys);
    const selectedData = selectedKeys.map((key) => findItemInTree(key, data)).filter(Boolean);
    setSelectedRows(selectedData);
  };

  const refreshTable = useCallback(() => {
    fetch(); // fetch fonksiyonu tabloyu yeniler
  }, [fetch]);

  const onRowClick = (record) => {
    setDrawer({ visible: true, data: record });
  };

  const refreshTableData = useCallback(() => {
    fetch();
  }, [fetch]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <ContextMenu selectedRows={selectedRows} refreshTableData={refreshTable} />
        <EkleButton kapali={kapali} onRefresh={refreshTable} secilenIsEmriID={secilenIsEmriID} />
      </div>

      <Table
        rowSelection={{
          type: "radio",
          selectedRowKeys,
          onChange: onRowSelectChange,
        }}
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
        expandedRowKeys={expandedRowKeys}
        onExpand={onTableRowExpand}
        scroll={{
          // x: "auto",
          y: "calc(100vh - 360px)",
        }}
      />
      <EditDrawer selectedRow={drawer.data} onDrawerClose={() => setDrawer({ ...drawer, visible: false })} drawerVisible={drawer.visible} onRefresh={refreshTableData} />
    </div>
  );
}
