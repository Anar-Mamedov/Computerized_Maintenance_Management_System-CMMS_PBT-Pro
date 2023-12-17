import { Table as AntdTable, Checkbox, Button, Modal, Row, Input } from "antd";
import { useCallback, useEffect, useState } from "react";
import EditDrawer from "../Update/EditDrawer";
import { MenuUnfoldOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../api/http";
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

function formatValidDate(dateString) {
  const date = dayjs(dateString);
  return date.isValid() ? date.format("DD-MM-YYYY") : "";
}

function formatValidTime(timeString) {
  const time = dayjs(timeString, "HH:mm");
  return time.isValid() ? time.format("HH:mm") : "";
}

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
    AxiosInstance.post(`getIsEmriFullList?id=11&parametre=${keyword}&pagingDeger=${page}`, filters).then((response) => {
      console.log(response);
      // Alborz total page sehifesini qaytarmalidi
      // {
      //   page: number,
      //   list: array of is emri objects
      // }

      // response.list.map(....)
      const formattedData = response.list.map((el, index) => ({
        key: el.TB_ISEMRI_ID,
        open: el.KAPALI,
        ISM_TIP_ID: el.ISM_TIP_ID,
        priorityIcon: el.ONCELIK,
        prioritySelectedId: el.ISM_ONCELIK_ID,
        document: el.BELGE,
        picture: el.RESIM,
        number: el.ISEMRI_NO,
        material: el.MALZEME,
        personnel: el.PERSONEL,
        durus: el.DURUS,
        not: el.OUTER_NOT,
        editDate: formatValidDate(el.DUZENLEME_TARIH),
        editTime: formatValidTime(el.DUZENLEME_SAAT),
        subject: el.KONU,
        type: el.ISEMRI_TIP,
        status: el.DURUM,
        statusID: el.ISM_DURUM_KOD_ID,
        location: el.LOKASYON,
        locationID: el.ISM_LOKASYON_ID,
        equipmentID: el.ISM_EKIPMAN_ID,
        procedure: el.ISM_PROSEDUR_KOD,
        procedureSelectedId: el.ISM_REF_ID,
        linked_work_orderID: el.ISM_BAGLI_ISEMRI_ID,
        linked_work_order: el.ISM_BAGLI_ISEMRI_NO,
        plannedStartDate: formatValidDate(el.PLAN_BASLAMA_TARIH),
        plannedStartTime: formatValidTime(el.PLAN_BASLAMA_SAAT),
        plannedEndDate: formatValidDate(el.PLAN_BITIS_TARIH),
        plannedEndTime: formatValidTime(el.PLAN_BITIS_SAAT),
        startdate: formatValidDate(el.BASLAMA_TARIH),
        startTime: formatValidTime(el.BASLAMA_SAAT),
        enddate: formatValidDate(el.ISM_BITIS_TARIH),
        endTime: formatValidTime(el.ISM_BITIS_SAAT),
        jobTime: el.IS_SURESI,
        completion: el.TAMAMLANMA,
        warranty: el.GARANTI,
        machine: el.MAKINE_KODU,
        machineId: el.ISM_MAKINE_ID,
        machineDescription: el.MAKINE_TANIMI,
        machineStatus: el.MAKINE_DURUM,
        machinePlate: el.MAKINE_PLAKA,
        machineType: el.MAKINE_TIP,
        machineStatusID: el.ISM_MAKINE_DURUM_KOD_ID,
        equipment: el.EKIPMAN,
        jobType: el.IS_TIPI,
        TipiID: el.ISM_TIP_KOD_ID,
        jobReason: el.IS_NEDENI,
        jobReasonId: el.ISM_NEDEN_KOD_ID,
        // workshop: el.ATOLYE,
        workshop: el.ISM_ATOLYE_KOD,
        workshopID: el.ISM_ATOLYE_ID,
        instruction: el.TALIMAT,
        instructionID: el.ISM_TALIMAT_ID,
        priority: el.ONCELIK,
        ISM_TAKVIM_ID: el.ISM_TAKVIM_ID,
        closingDate: formatValidDate(el.KAPANIS_TARIHI),
        closingTime: formatValidTime(el.KAPANIS_SAATI),
        calendar: el.TAKVIM,
        spending: el.MASRAF_MERKEZI,
        ISM_MASRAF_MERKEZ_ID: el.ISM_MASRAF_MERKEZ_ID,
        ISM_PROJE_KOD: el.ISM_PROJE_KOD,
        ISM_PROJE_ID: el.ISM_PROJE_ID,
        ISM_REFERANS_NO: el.ISM_REFERANS_NO,
        company: el.FRIMA,
        companyID: el.ISM_FIRMA_ID,
        ISM_SOZLESME_TANIM: el.ISM_SOZLESME_TANIM,
        ISM_FIRMA_SOZLESME_ID: el.ISM_FIRMA_SOZLESME_ID,
        ISM_EVRAK_NO: el.ISM_EVRAK_NO,
        jobDemandCode: el.IS_TALEP_NO, //yok
        jobDemanding: el.IS_TALEP_EDEN,
        jobDemandDate: formatValidDate(el.IS_TALEP_TARIH),
        ISM_EVRAK_TARIHI: formatValidDate(el.ISM_EVRAK_TARIHI),
        // süre bilgileri tabı
        logisticsDuration: el.ISM_SURE_MUDAHALE_LOJISTIK,
        travellingDuration: el.ISM_SURE_MUDAHALE_SEYAHAT,
        approvalDuration: el.ISM_SURE_MUDAHALE_ONAY,
        waitingDuration: el.ISM_SURE_BEKLEME,
        otherDuration: el.ISM_SURE_MUDAHALE_DIGER,
        interventionDuration: el.ISM_SURE_PLAN_MUDAHALE,
        workingDuration: el.ISM_SURE_PLAN_CALISMA,
        totalWorkTime: el.ISM_SURE_TOPLAM,
        //maliyetler tabı
        realisedMaterialCost: el.ISM_MALIYET_MLZ,
        realisedLabourCost: el.ISM_MALIYET_PERSONEL,
        realisedExternalServiceCost: el.ISM_MALIYET_DISSERVIS,
        realisedGeneralExpenses: el.ISM_MALIYET_DIGER,
        realisedDiscount: el.ISM_MALIYET_INDIRIM,
        realisedKDV: el.ISM_MALIYET_KDV,
        realisedTotalCost: el.ISM_MALIYET_TOPLAM,
        // özel alanlar tabı
        temperature: el.OZEL_ALAN_1,
        weight: el.OZEL_ALAN_2,
        invoiceStatus1: el.OZEL_ALAN_3,
        specialArea4: el.OZEL_ALAN_4,
        specialArea5: el.OZEL_ALAN_5,
        specialArea6: el.OZEL_ALAN_6,
        specialArea7: el.OZEL_ALAN_7,
        specialArea8: el.OZEL_ALAN_8,
        specialArea9: el.OZEL_ALAN_9,
        specialArea10: el.OZEL_ALAN_10,
        invoiceStatus2: el.OZEL_ALAN_11,
        specialArea12: el.OZEL_ALAN_12,
        specialArea13: el.OZEL_ALAN_13,
        specialArea14: el.OZEL_ALAN_14,
        specialArea15: el.OZEL_ALAN_15,
        specialArea16: el.OZEL_ALAN_16,
        specialArea17: el.OZEL_ALAN_17,
        specialArea18: el.OZEL_ALAN_18,
        specialArea19: el.OZEL_ALAN_19,
        specialArea20: el.OZEL_ALAN_20,
        custom_field_11_ID: el.ISM_OZEL_ALAN_11_KOD_ID,
        custom_field_12_ID: el.ISM_OZEL_ALAN_12_KOD_ID,
        custom_field_13_ID: el.ISM_OZEL_ALAN_13_KOD_ID,
        custom_field_14_ID: el.ISM_OZEL_ALAN_14_KOD_ID,
        custom_field_15_ID: el.ISM_OZEL_ALAN_15_KOD_ID,
        personelName: el.PERSONEL_ADI,
        fullLocation: el.TAM_LOKASYON,
        reportedFloor: el.BILDIRILEN_KAT,
        reportedBuilding: el.BILDIRILEN_BINA,
        currentCounterValue: el.GUNCEL_SAYAC_DEGER,
        note: el.ICERDEKI_NOT,
      }));

      setCurrentPage(page); //reset the cruent page when i search or filtered any thing

      setTable({
        data: formattedData,
        page: response.page,
        // page: 1,
      });
      setLoading(false); // Set loading to false when data arrives
    });
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

      <AntdTable
        // className="custom-table"
        size="small"
        pagination={{
          position: ["bottomRight"],
          pageSize: 50,
          showSizeChanger: false,
          current: currentPage,
          // Eger total toplam veri sayisidirsa *10 olmalidir
          total: table.page * 50,
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
          y: "calc(100vh - 360px)",
        }}
        onRow={(record) => ({
          // pass onRow prop to Table
          onClick: (e) => onRowClick(record, e), // call onRowClick handler with record
          // onContextMenu: (e) => handleContextMenu(e, record), // right click handler
        })}
      />
      <div
        style={{
          position: "relative",
          width: "110px",
          display: "flex",
          justifyContent: "space-between",
          marginInlineStart: "auto",
          marginTop: "-44px",
          zIndex: "1",
        }}>
        <Input
          type="text"
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
