import { Table as AntdTable, Checkbox, Button, Modal, Row, Input } from "antd";
import { useCallback, useEffect, useState } from "react";
import EditDrawer from "../Update/EditDrawer";
import { useForm, FormProvider } from "react-hook-form";
import { MenuUnfoldOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../api/http";
import ContextMenu from "../components/ContextMenu/ContextMenu";
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
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [data, setData] = useState([]);
  const methods = useForm();

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
    // Sayfa numarasını güncelle ve verileri yeniden çek
    setCurrentPage(pagination.current);

    // Filtre veya anahtar kelime uygulandıysa ve mevcut sayfa 1 değilse,
    // filtreler veya anahtar kelime ile verileri yeniden çek
    if ((filters || body.keyword) && pagination.current !== currentPage) {
      fetch({ filters: body.filters, keyword: body.keyword, page: pagination.current });
    } else {
      // Sadece sayfa numarası değiştiğinde verileri çek
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
        // console.log("Response: ", response);
        const formattedData = response.makine_listesi.map((el, index) => ({
          ...el,
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
          MKN_URETICI: el.MKN_URETICI,
          MKN_URETIM_YILI: el.MKN_URETIM_YILI,
          MKN_GARANTI_BITIS: el.MKN_GARANTI_BITIS,
          MKN_DURUS_MALIYET: el.MKN_DURUS_MALIYET,
          MKN_YILLIK_PLANLANAN_CALISMA_SURESI: el.MKN_YILLIK_PLANLANAN_CALISMA_SURESI,
          MKN_KALIBRASYON_VAR: el.MKN_KALIBRASYON_VAR,
          MKN_KRITIK_MAKINE: el.MKN_KRITIK_MAKINE,
          MKN_GUC_KAYNAGI: el.MKN_GUC_KAYNAGI,
          MKN_IS_TALEP: el.MKN_IS_TALEP,
          MKN_YAKIT_KULLANIM: el.MKN_YAKIT_KULLANIM,
          MKN_OTONOM_BAKIM: el.MKN_OTONOM_BAKIM,
          MKN_MASRAF_MERKEZ_KOD_ID: el.MKN_MASRAF_MERKEZ_KOD_ID,
          MKN_MASRAF_MERKEZ: el.MKN_MASRAF_MERKEZ,
          MKN_ATOLYE_ID: el.MKN_ATOLYE_ID,
          MKN_ATOLYE: el.MKN_ATOLYE,
          MKN_BAKIM_GRUP: el.MKN_BAKIM_GRUP,
          MKN_ARIZA_GRUP: el.MKN_ARIZA_GRUP,
          MKN_SERVIS_SAGLAYICI_KOD_ID: el.MKN_SERVIS_SAGLAYICI_KOD_ID,
          MKN_SERVIS_SAGLAYICI: el.MKN_SERVIS_SAGLAYICI,
          MKN_SERVIS_SEKLI_KOD_ID: el.MKN_SERVIS_SEKLI_KOD_ID,
          MKN_SERVIS_SEKLI: el.MKN_SERVIS_SEKLI,
          MKN_TEKNIK_SERVIS_KOD_ID: el.MKN_TEKNIK_SERVIS_KOD_ID,
          MKN_TEKNIK_SERVIS: el.MKN_TEKNIK_SERVIS,
          MKN_FIZIKSEL_DURUM_KOD_ID: el.MKN_FIZIKSEL_DURUM_KOD_ID,
          MKN_FIZIKSEL_DURUM: el.MKN_FIZIKSEL_DURUM,
          MKN_ONCELIK_ID: el.MKN_ONCELIK_ID,
          MKN_ONCELIK: el.MKN_ONCELIK,
          MKN_RISK_PUAN: el.MKN_RISK_PUAN,
          MKN_KURULUM_TARIH: el.MKN_KURULUM_TARIH,
          MKN_ISLETIM_SISTEMI_KOD_ID: el.MKN_ISLETIM_SISTEMI_KOD_ID,
          MKN_ISLETIM_SISTEMI: el.MKN_ISLETIM_SISTEMI,
          MKN_IP_NO: el.MKN_IP_NO,
          MKN_AGIRLIK: el.MKN_AGIRLIK,
          MKN_AGIRLIK_BIRIM_KOD_ID: el.MKN_AGIRLIK_BIRIM_KOD_ID,
          MKN_AGIRLIK_BIRIM: el.MKN_AGIRLIK_BIRIM,
          MKN_HACIM: el.MKN_HACIM,
          MKN_HACIM_BIRIM_KOD_ID: el.MKN_HACIM_BIRIM_KOD_ID,
          MKN_HACIM_BIRIM: el.MKN_HACIM_BIRIM,
          MKN_KAPASITE: el.MKN_KAPASITE,
          MKN_KAPASITE_BIRIM_KOD_ID: el.MKN_KAPASITE_BIRIM_KOD_ID,
          MKN_KAPASITE_BIRIM: el.MKN_KAPASITE_BIRIM,
          MKN_ELEKTRIK_TUKETIM: el.MKN_ELEKTRIK_TUKETIM,
          MKN_ELEKTRIK_TUKETIM_BIRIM_KOD_ID: el.MKN_ELEKTRIK_TUKETIM_BIRIM_KOD_ID,
          MKN_ELEKTRIK_TUKETIM_BIRIM: el.MKN_ELEKTRIK_TUKETIM_BIRIM,
          MKN_VOLTAJ: el.MKN_VOLTAJ,
          MKN_GUC: el.MKN_GUC,
          MKN_FAZ: el.MKN_FAZ,
          MKN_VALF_TIPI: el.MKN_VALF_TIPI,
          MKN_VALF_TIP_KOD_ID: el.MKN_VALF_TIP_KOD_ID,
          MKN_VALF_BOYUT: el.MKN_VALF_BOYUT,
          MKN_VALF_BOYUT_KOD_ID: el.MKN_VALF_BOYUT_KOD_ID,
          MKN_GIRIS_BOYUT: el.MKN_GIRIS_BOYUT,
          MKN_GIRIS_BOYUT_KOD_ID: el.MKN_GIRIS_BOYUT_KOD_ID,
          MKN_CIKIS_BOYUT: el.MKN_CIKIS_BOYUT,
          MKN_CIKIS_BOYUT_KOD_ID: el.MKN_CIKIS_BOYUT_KOD_ID,
          MKN_KONNEKTOR: el.MKN_KONNEKTOR,
          MKN_KONNEKTOR_KOD_ID: el.MKN_KONNEKTOR_KOD_ID,
          MKN_BASINC: el.MKN_BASINC,
          MKN_BASINC_KOD_ID: el.MKN_BASINC_KOD_ID,
          MKN_BASINC_MIKTAR: el.MKN_BASINC_MIKTAR,
          MKN_BASINC_BIRIM: el.MKN_BASINC_BIRIM,
          MKN_BASINC_BIRIM_KOD_ID: el.MKN_BASINC_BIRIM_KOD_ID,
          MKN_DEVIR: el.MKN_DEVIR,
          MKN_TEKNIK_MOTOR_GUCU: el.MKN_TEKNIK_MOTOR_GUCU,
          MKN_TEKNIK_SILINDIR_SAYISI: el.MKN_TEKNIK_SILINDIR_SAYISI,
          MKN_ALIS_FIRMA_ID: el.MKN_ALIS_FIRMA_ID,
          MKN_ALIS_FIRMA: el.MKN_ALIS_FIRMA,
          MKN_ALIS_TARIH: el.MKN_ALIS_TARIH,
          MKN_ALIS_FIYAT: el.MKN_ALIS_FIYAT,
          MKN_FATURA_NO: el.MKN_FATURA_NO,
          MKN_FATURA_TARIH: el.MKN_FATURA_TARIH,
          MKN_FATURA_TUTAR: el.MKN_FATURA_TUTAR,
          MKN_KREDI_MIKTARI: el.MKN_KREDI_MIKTARI,
          KREDI_ORANI: el.KREDI_ORANI,
          MKN_KREDI_BASLAMA_TARIHI: el.MKN_KREDI_BASLAMA_TARIHI,
          MKN_KREDI_BITIS_TARIHI: el.MKN_KREDI_BITIS_TARIHI,
          MKN_KIRA: el.MKN_KIRA,
          MKN_KIRA_FIRMA_ID: el.MKN_KIRA_FIRMA_ID,
          MKN_KIRA_FIRMA: el.MKN_KIRA_FIRMA,
          MKN_KIRA_BASLANGIC_TARIH: el.MKN_KIRA_BASLANGIC_TARIH,
          MKN_KIRA_BITIS_TARIH: el.MKN_KIRA_BITIS_TARIH,
          MKN_KIRA_SURE: el.MKN_KIRA_SURE,
          MKN_KIRA_PERIYOD: el.MKN_KIRA_PERIYOD,
          MKN_KIRA_TUTAR: el.MKN_KIRA_TUTAR,
          MKN_KIRA_ACIKLAMA: el.MKN_KIRA_ACIKLAMA,
          MKN_SATIS: el.MKN_SATIS,
          MKN_SATIS_NEDEN: el.MKN_SATIS_NEDEN,
          MKN_SATIS_TARIH: el.MKN_SATIS_TARIH,
          MKN_SATIS_YER: el.MKN_SATIS_YER,
          MKN_SATIS_FIYAT: el.MKN_SATIS_FIYAT,
          MKN_SATIS_ACIKLAMA: el.MKN_SATIS_ACIKLAMA,
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
          MKN_OZEL_ALAN_11: el.MKN_OZEL_ALAN_11,
          MKN_OZEL_ALAN_12: el.MKN_OZEL_ALAN_12,
          MKN_OZEL_ALAN_13: el.MKN_OZEL_ALAN_13,
          MKN_OZEL_ALAN_14: el.MKN_OZEL_ALAN_14,
          MKN_OZEL_ALAN_15: el.MKN_OZEL_ALAN_15,
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
          MKN_GENEL_NOT: el.MKN_GENEL_NOT,
          MKN_GUVENLIK_NOT: el.MKN_GUVENLIK_NOT,
          MKN_SERI_NO: el.MKN_SERI_NO,
          MKN_LOKASYON_TUM_YOL: el.MKN_LOKASYON_TUM_YOL,
        }));

        setCurrentPage(page); //reset the cruent page when i search or filtered any thing
        setData(formattedData);

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
    // console.log("Body: ", body);
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

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);

    // Seçilen satırların verisini bul
    const newSelectedRows = data.filter((row) => newSelectedRowKeys.includes(row.key));
    setSelectedRows(newSelectedRows); // Seçilen satırların verilerini state'e ata
  };

  const rowSelection = {
    type: "checkbox",
    selectedRowKeys,
    onChange: onSelectChange,
  };

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
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <FormProvider {...methods}>
            <ContextMenu selectedRows={selectedRows} refreshTableData={refreshTableData} />
          </FormProvider>
          <CreateDrawer onRefresh={refreshTableData} />
        </div>
      </div>
      {/* quick jump for page input field */}

      <AntdTable
        className="custom-table"
        size="small"
        pagination={{
          showQuickJumper: true,
          position: ["bottomRight"],
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
          showTotal: (total, range) => `Toplam ${total}`,
        }}
        loading={loading} // Pass the loading state to the loading prop of AntdTable
        columns={columns.filter((column) => visibleColumns.includes(column.dataIndex))} //columns. after filter will return only columns that are visible
        locale={customLocale}
        onChange={onChange}
        dataSource={table.data}
        rowSelection={rowSelection}
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
      {/* <div
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
      </div> */}
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
