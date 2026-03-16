import { Table as AntdTable, Dropdown, Menu } from "antd";
import { useState, useRef, useEffect } from "react";

const columns = [
  {
    title: "#",
    dataIndex: "key",
    sorter: (a, b) => a.key - b.key,
    width: 70,
  },
  {
    title: "İmzalayan şəxs",
    dataIndex: "signatory",
    sorter: (a, b) => a.signatory.localeCompare(b.signatory),
  },
  {
    title: "Təşkilatın imza tarixi",
    dataIndex: "dateofcompanysigature",
    sorter: (a, b) => new Date(a.dateofcompanysigature) - new Date(b.dateofcompanysigature),
  },
  {
    title: "Müqavilənin imza tarixi",
    dataIndex: "dateofcontractsigature",
    sorter: (a, b) => new Date(a.dateofcontractsigature) - new Date(b.dateofcontractsigature),
  },
  {
    title: "Elaqeli şəxs 1",
    dataIndex: "person1",
    sorter: (a, b) => a.person1.localeCompare(b.person1),
  },
  {
    title: "Elaqeli şəxs 2",
    dataIndex: "person2",
    sorter: (a, b) => a.person2.localeCompare(b.person2),
  },
  {
    title: "Qeyd",
    dataIndex: "note",
    sorter: (a, b) => a.note.localeCompare(b.note),
  },
];

export default function RequisiteTable() {
  const [data] = useState([
    {
      key: 1,
      signatory: "Vilayət Əmirli",
      dateofcompanysigature: "11.11.2023",
      dateofcontractsigature: "11.11.2023",
      person1: "Vilayət Əmirli",
      person2: "Kamil Əmirli",
      note: "lorem ipsum",
    },
    {
      key: 2,
      signatory: "Anar Mamedov",
      dateofcompanysigature: "11.11.2021",
      dateofcontractsigature: "11.11.2021",
      person1: "Anar Mamedov",
      person2: "Akif Qasımov",
      note: "lorem ipsum",
    },
    {
      key: 3,
      signatory: "Babek Əliyev",
      dateofcompanysigature: "11.11.2022",
      dateofcontractsigature: "11.11.2022",
      person1: "Babek Əliyev",
      person2: "Qabil Camalov",
      note: "lorem ipsum",
    },
  ]);

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  // right click menu

  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ top: 0, left: 0 });
  const contextMenuRef = useRef(null);

  const handleContextMenu = (e, record) => {
    e.preventDefault();

    // Show the context menu at the mouse cursor position
    setContextMenuPosition({ top: e.clientY, left: e.clientX });
    setContextMenuVisible(true);
  };

  const handleCloseContextMenu = () => {
    // Hide the context menu
    setContextMenuVisible(false);
  };

  const handleMenuClick = (key, record) => {
    // Handle menu item click here
    // You can add logic to perform actions based on the clicked item
    if (key === "edit") {
      // Perform edit action
    } else if (key === "delete") {
      // Perform delete action
    } else if (key === "new") {
      // Perform delete action
      // <Add />;
    }

    // Close the context menu
    handleCloseContextMenu();
  };

  // close right click after click anywhere

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
        handleCloseContextMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // end of close right click after click anywhere

  // end of right click menu

  return (
    <div>
      <AntdTable
        size="small"
        pagination={false}
        columns={columns}
        onChange={onChange}
        dataSource={data}
        rowSelection={true}
        onRow={(record) => ({
          onContextMenu: (e) => handleContextMenu(e, record),
        })}
        scroll={{
          x: "100vw",
          y: 500,
        }}
      />
      {contextMenuVisible && (
        <div
          ref={contextMenuRef}
          className="context-menu"
          style={{
            top: contextMenuPosition.top,
            left: contextMenuPosition.left,
            position: "fixed", // Ensure the menu is positioned relative to the viewport
            zIndex: "2000",
            maxHeight: "400px", // Adjust the maximum height as needed
            overflowY: "auto",
          }}>
          <Menu
            style={{ border: "1px solid #91919153", borderRadius: "6px", backgroundColor: "white" }}
            onClick={({ key }) => handleMenuClick(key)}>
            <Menu.Item key="new">Yeni Kayıt</Menu.Item>
            <Menu.Item key="edit">Düzenle</Menu.Item>
            <Menu.Item key="delete">Sil</Menu.Item>
            <Menu.Item key="">İleri Tarihe İş Emri Planla</Menu.Item>
            <Menu.Item key="">Atlye Transferi</Menu.Item>
            <Menu.Item key="">İş Emri Formları...</Menu.Item>
            <Menu.Item key="">Not Ekle</Menu.Item>
            <Menu.Item key="">Seçili İş Emrini Kapat</Menu.Item>
            <Menu.Item key="">İş Emri Tarihçesi</Menu.Item>
            <Menu.Item key="">Makine Tarihçesi</Menu.Item>
            <Menu.Item key="">Malzeme Tarihçesi</Menu.Item>
            <Menu.Item key="">Süreç Analizi</Menu.Item>
            <Menu.Item key="">Maliyet Analizi</Menu.Item>
            <Menu.Item key="">Seçili Kaydı Çoğalt</Menu.Item>
            <Menu.Item key="">Detaylı Arama</Menu.Item>
            <Menu.Item key="">Yenile</Menu.Item>
            <Menu.Item key="">Liste Özellikleri</Menu.Item>
            {/* Add more menu items as needed */}
          </Menu>
        </div>
      )}
    </div>
  );
}
