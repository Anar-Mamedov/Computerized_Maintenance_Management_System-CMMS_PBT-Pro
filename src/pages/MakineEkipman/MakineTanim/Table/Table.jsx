import { Table as AntdTable, Checkbox, Button, Modal, Row, Input } from "antd";
import { useCallback, useEffect, useState } from "react";
import EditDrawer from "../Update/EditDrawer";
import { MenuUnfoldOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../api/http";
import ContextMenu from "../components/ContextMenu";
import "../components/styled.css";
import dayjs from "dayjs";
import useColumns, { DEFAULT_VISIBLE_COLUMNS } from "./useColumns";
import SearchField from "./SearchField";
import Filters from "./filter/Filters";
import CustomGoButton from "./quickJumperButton";
import CreateDrawer from "../Insert/CreateDrawer";

const customLocale = {
  filterConfirm: "Tamam",
  filterReset: "Sıfırla",
  emptyText: "Kayıt bulunamadı",
  triggerDesc: "Azalan sıralama",
  triggerAsc: "Artan sıralama",
  cancelSort: "Sıralamayı iptal et",
};

export default function Table() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [noteText, setNoteText] = useState("");

  const handleNoteClick = (note) => {
    setNoteText(note);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };
  const handleNoteChange = (e) => {
    // Update the note text when the TextArea value changes
    setNoteText(e.target.value);
  };

  const columns = useColumns({ handleNoteClick });
  const [loading, setLoading] = useState(false); // Add loading state

  const [currentPage, setCurrentPage] = useState(1); // reset the cruent page when i search or filtered any thing

  const [pageNumberInput, setPageNumberInput] = useState(""); // quick jump for page input field

  // end of hide/show columns
  const [table, setTable] = useState({
    data: [],
    page: 1,
  });

  const [drawer, setDrawer] = useState({
    visible: false,
    data: null,
  });

  const [body, setBody] = useState({
    keyword: "",
    filters: {},
  });

  const [columnSelectionVisible, setColumnSelectionVisible] = useState(false);

  // Hide/show columns
  // State for controlling column visibility
  const [visibleColumns, setVisibleColumns] = useState(() => {
    // Load column visibility from local storage or use the default columns
    const savedVisibleColumns = JSON.parse(localStorage.getItem("visibleColumns"));
    if (savedVisibleColumns) {
      return savedVisibleColumns;
    } else {
      return DEFAULT_VISIBLE_COLUMNS;
    }
  });

  const handleColumnVisibilityChange = (columnKey, checked) => {
    if (checked) {
      setVisibleColumns((prevVisibleColumns) => [...prevVisibleColumns, columnKey]);
    } else {
      setVisibleColumns((prevVisibleColumns) => prevVisibleColumns.filter((key) => key !== columnKey));
    }
  };

  const onChange = (pagination, filters, sorter, extra) => {
    // Check if filters or keyword are applied and the current page is not already 1
    if ((filters || body.keyword) && pagination.current !== 1) {
      // If filters or keyword are applied and not on the first page, reset to page 1
      fetch({ filters: body.filters, keyword: body.keyword, page: 1 });
    } else if (pagination.current !== currentPage) {
      // Only fetch data if the page number has changed
      fetch({ filters: body.filters, keyword: body.keyword, page: pagination.current });
    }
  };

  const onRowClick = (record, e) => {
    const targetClassName = e.target.className;

    // Check if the click target corresponds to the "note-emoji" class
    if (targetClassName.includes("note-emoji")) {
      // Clicking on the emoji in the "note" column, do nothing
      return;
    } else if (targetClassName.includes("note")) {
      // Clicking on the "note" column, open the modal
      handleNoteClick(record.not);
    } else {
      // Open the drawer for other columns
      setDrawer({
        visible: true,
        data: record,
      });
    }
  };

  const onDrawerClose = () => {
    // handler for drawer close
    setDrawer({
      visible: false,
      data: null,
    });
  };

  const fetch = useCallback(({ keyword, filters, page = 1 }) => {
    setLoading(true); // Set loading to true before making the API call
    // page = page || 1;
    AxiosInstance.post(`GetMakineFullList?pagingDeger=${page}&lokasyonId=${""}&parametre=${keyword}`, filters).then(
      (response) => {
        // Alborz total page sehifesini qaytarmalidi
        // {
        //   page: number,
        //   list: array of is emri objects
        // }

        // response.list.map(....)
        const formattedData = response.makine_listesi.map((el, index) => ({
          key: el.TB_MAKINE_ID,
          MKN_BELGE: el.MKN_BELGE,
          MKN_BELGE_VAR: el.MKN_BELGE_VAR,
          MKN_RESIM: el.MKN_RESIM,
          MKN_RESIM_VAR: el.MKN_RESIM_VAR,
          MKN_PERIYODIK_BAKIM: el.MKN_PERIYODIK_BAKIM,
          MKN_KOD: el.MKN_KOD,
          MKN_TANIM: el.MKN_TANIM,
          MKN_AKTIF: el.MKN_AKTIF,
          MKN_DURUM_KOD_ID: el.MKN_DURUM_KOD_ID,
          MKN_DURUM: el.MKN_DURUM,
          MKN_ARAC_TIP: el.MKN_ARAC_TIP,
          MKN_LOKASYON_ID: el.MKN_LOKASYON_ID,
          MKN_LOKASYON: el.MKN_LOKASYON,
          MKN_TIP_KOD_ID: el.MKN_TIP_KOD_ID,
          MKN_TIP: el.MKN_TIP,
          MKN_KATEGORI_KOD_ID: el.MKN_KATEGORI_KOD_ID,
          MKN_KATEGORI: el.MKN_KATEGORI,
          MKN_MARKA_KOD_ID: el.MKN_MARKA_KOD_ID,
          MKN_MODEL_KOD_ID: el.MKN_MODEL_KOD_ID,
          MKN_MARKA: el.MKN_MARKA,
          MKN_MODEL: el.MKN_MODEL,
          MKN_MASTER_ID: el.MKN_MASTER_ID,
          MKN_MASTER_MAKINE_KOD: el.MKN_MASTER_MAKINE_KOD,
          MKN_MASTER_MAKINE_TANIM: el.MKN_MASTER_MAKINE_TANIM,
          MKN_TAKVIM_ID: el.MKN_TAKVIM_ID,
          MKN_TAKVIM: el.MKN_TAKVIM,
          MKN_URETIM_YILI: el.MKN_URETIM_YILI,
          MKN_MASRAF_MERKEZ_KOD_ID: el.MKN_MASRAF_MERKEZ_KOD_ID,
          MKN_MASRAF_MERKEZ: el.MKN_MASRAF_MERKEZ,
          MKN_ATOLYE_ID: el.MKN_ATOLYE_ID,
          MKN_ATOLYE: el.MKN_ATOLYE,
          MKN_BAKIM_GRUP: el.MKN_BAKIM_GRUP,
          MKN_ARIZA_GRUP: el.MKN_ARIZA_GRUP,
          MKN_ONCELIK_ID: el.MKN_ONCELIK_ID,
          MKN_ONCELIK: el.MKN_ONCELIK,
          ARIZA_SIKLIGI: el.ARIZA_SIKLIGI,
          ARIZA_SAYISI: el.ARIZA_SAYISI,
          MKN_OZEL_ALAN_1: el.MKN_OZEL_ALAN_1,
          MKN_OZEL_ALAN_2: el.MKN_OZEL_ALAN_2,
          MKN_OZEL_ALAN_3: el.MKN_OZEL_ALAN_3,
          MKN_OZEL_ALAN_4: el.MKN_OZEL_ALAN_4,
          MKN_OZEL_ALAN_5: el.MKN_OZEL_ALAN_5,
          MKN_OZEL_ALAN_6: el.MKN_OZEL_ALAN_6,
          MKN_OZEL_ALAN_7: el.MKN_OZEL_ALAN_7,
          MKN_OZEL_ALAN_8: el.MKN_OZEL_ALAN_8,
          MKN_OZEL_ALAN_9: el.MKN_OZEL_ALAN_9,
          MKN_OZEL_ALAN_10: el.MKN_OZEL_ALAN_10,
          MKN_OZEL_ALAN_11_KOD_ID: el.MKN_OZEL_ALAN_11_KOD_ID,
          MKN_OZEL_ALAN_12_KOD_ID: el.MKN_OZEL_ALAN_12_KOD_ID,
          MKN_OZEL_ALAN_13_KOD_ID: el.MKN_OZEL_ALAN_13_KOD_ID,
          MKN_OZEL_ALAN_14_KOD_ID: el.MKN_OZEL_ALAN_14_KOD_ID,
          MKN_OZEL_ALAN_15_KOD_ID: el.MKN_OZEL_ALAN_15_KOD_ID,
          MKN_OZEL_ALAN_16: el.MKN_OZEL_ALAN_16,
          MKN_OZEL_ALAN_17: el.MKN_OZEL_ALAN_17,
          MKN_OZEL_ALAN_18: el.MKN_OZEL_ALAN_18,
          MKN_OZEL_ALAN_19: el.MKN_OZEL_ALAN_19,
          MKN_OZEL_ALAN_20: el.MKN_OZEL_ALAN_20,
          MKN_SERI_NO: el.MKN_SERI_NO,
          MKN_LOKASYON_TUM_YOL: el.MKN_LOKASYON_TUM_YOL,
        }));

        setCurrentPage(page); //reset the cruent page when i search or filtered any thing

        setTable({
          data: formattedData,
          page: response.page,
          // page: 1,
        });
        setLoading(false); // Set loading to false when data arrives
      }
    );
  }, []);

  // Save column visibility to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("visibleColumns", JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  useEffect(() => {
    fetch({ filters: body.filters, keyword: body.keyword });
  }, [body, fetch]);

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

  // quick jump for page input field
  const handlePageNumberInputChange = (e) => {
    if (e.key === "Enter") {
      // Get the input value
      const pageNumber = parseInt(pageNumberInput, 10);
      if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= table.page) {
        fetch({ filters: body.filters, keyword: body.keyword, page: pageNumber });
        setPageNumberInput(""); // Clear the input field after navigation
      } else {
        // Handle invalid input (e.g., show an error message)
      }
    } else if (/^\d$/.test(e.key)) {
      // Allow only digits to be typed
    } else {
      e.preventDefault();
    }
  };

  const handlePageNumberNavigation = () => {
    const pageNumber = parseInt(pageNumberInput, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= table.page) {
      fetch({ filters: body.filters, keyword: body.keyword, page: pageNumber });
      setPageNumberInput(""); // Clear the input field after navigation
    } else {
      // Handle invalid input (e.g., show an error message)
    }
  };

  // end of quick jump for page input field

  // kaydet düğmesine basıldıktan sonra apiye tekrardan istek atmasını sağlamak
  const refreshTableData = useCallback(() => {
    // Assuming `fetch` is your function to fetch table data
    fetch({ filters: body.filters, keyword: body.keyword, page: currentPage });
  }, [body.filters, body.keyword, currentPage, fetch]);

  // kaydet düğmesine basıldıktan sonra apiye tekrardan istek atmasını sağlamak son

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}>
        <div style={{ display: "flex", gap: "10px" }}>
          {/* hide/show columns */}
          <div>
            <Button
              style={{
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => setColumnSelectionVisible(!columnSelectionVisible)}>
              <MenuUnfoldOutlined />
            </Button>
            {columnSelectionVisible && (
              <Modal
                title="Gösterilecek sütunları seçin"
                open={columnSelectionVisible}
                onCancel={() => setColumnSelectionVisible(false)}
                footer={null}
                width="770px">
                <div
                  style={{
                    backgroundColor: "white",
                    height: "500px",
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "wrap",
                    marginTop: "20px",
                  }}>
                  {columns.map((column) => (
                    <div key={column.dataIndex} style={{ marginRight: "20px", marginBottom: "3px" }}>
                      <Checkbox
                        checked={visibleColumns.includes(column.dataIndex)}
                        onChange={(e) => handleColumnVisibilityChange(column.dataIndex, e.target.checked)}>
                        {column.modalTitle} {/* Use the new property for the modal title */}
                      </Checkbox>
                    </div>
                  ))}
                </div>
              </Modal>
            )}
          </div>

          <SearchField onChange={handleBodyChange} />
          <Filters onChange={handleBodyChange} />
          <ContextMenu />
        </div>

        <CreateDrawer onRefresh={refreshTableData} />
      </div>
      {/* quick jump for page input field */}
      <div
        style={{
          position: "relative",
          width: "110px",
          display: "flex",
          justifyContent: "space-between",
          marginInlineStart: "auto",
          marginBottom: "-44px",
          zIndex: "1",
        }}>
        <Input
          type="number"
          placeholder="Sayfa Gir"
          value={pageNumberInput}
          onChange={(e) => {
            // Remove special characters using a regular expression
            const sanitizedValue = e.target.value.replace(/[^0-9]/g, "");
            setPageNumberInput(sanitizedValue);
          }} // Update the input value directly
          onKeyDown={handlePageNumberInputChange} // Listen for Enter key press
          style={{ width: "44px" }}
        />
        <Button onClick={handlePageNumberNavigation}>Git</Button>
      </div>
      <AntdTable
        className="custom-table"
        size="small"
        pagination={{
          position: ["topRight"],
          pageSize: 10,
          showSizeChanger: false,
          current: currentPage,
          // Eger total toplam veri sayisidirsa *10 olmalidir
          total: table.page * 10,
          // Eger total toplam sehife sayisidirsa
          // total: table.page,
          onChange: (page) => fetch({ filters: body.filters, keyword: body.keyword, page }),
          // quick jump for page input field
          // showQuickJumper: {
          //   goButton: <CustomGoButton />, // Use a custom Go button
          // },
        }}
        loading={loading} // Pass the loading state to the loading prop of AntdTable
        columns={columns.filter((column) => visibleColumns.includes(column.dataIndex))} //columns. after filter will return only columns that are visible
        locale={customLocale}
        onChange={onChange}
        dataSource={table.data}
        rowSelection={true}
        scroll={{
          // x: "auto",
          y: "650px",
        }}
        onRow={(record) => ({
          // pass onRow prop to Table
          onClick: (e) => onRowClick(record, e), // call onRowClick handler with record
          // onContextMenu: (e) => handleContextMenu(e, record), // right click handler
        })}
      />
      <Modal title="Not" open={isModalVisible} onCancel={handleModalClose} footer={null}>
        <Input.TextArea
          value={noteText} // Bind the value to the state variable
          onChange={handleNoteChange} // Update the state when the TextArea value changes
          rows={4}
        />
        <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", gap: "20px", marginTop: "20px" }}>
          <Button type="primary">Kaydet</Button>
          <Button key="cancle" onClick={handleModalClose}>
            İptal
          </Button>
        </div>
      </Modal>
      <EditDrawer
        selectedRow={drawer.data}
        onDrawerClose={onDrawerClose}
        drawerVisible={drawer.visible}
        onRefresh={refreshTableData}
      />
    </>
  );
}
