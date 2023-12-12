import React, { createRef, useCallback, useEffect, useState } from "react";
import {
  Input,
  Button,
  Modal,
  Typography,
  Table,
  Divider,
  Spin,
  Space,
  Select,
  message,
  Row,
  Col,
  Tabs,
  Menu,
  Checkbox,
  ColorPicker,
} from "antd";
import AxiosInstance from "../../../../../../api/http";
import styled from "styled-components";
import { PlusOutlined } from "@ant-design/icons";
import { useForm, Controller, FormProvider, useFormContext } from "react-hook-form";
import WorkOrderTypeInsert from "./WorkOrderTypeInsert";

const { Text, Link } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

const onChange = (value) => {};
const onSearch = (value) => {};

// Filter `option.label` match the user type `input`
const filterOption = (input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

const options = [];
for (let i = 10; i < 36; i++) {
  options.push({
    label: i.toString(36) + i,
    value: i.toString(36) + i,
  });
}
const handleChange = (value) => {};

export default function WorkOrderType() {
  const { control, setValue, getValues, watch } = useFormContext();
  const [inputValue, setInputValue] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMakineDropdownOpen, setIsMakineDropdownOpen] = useState(false);
  const [items, setItems] = useState([]);
  const inputRef = createRef();
  const [name, setName] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [defaultItem, setDefaultItem] = useState(null);
  // message
  const [messageApi, contextHolder] = message.useMessage();

  // message end

  const [isVarsayilan, setIsVarsayilan] = useState(false); // Table for type list
  const [aktif, setAktif] = useState(false);

  // Table for type list
  const [selectedData, setSelectedData] = useState(null); // tablodakı satıra tıklandığında yan tarafta bir divin içerisinde tablo içeriğini göstermek için
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch data when component mounts
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    AxiosInstance.get("IsEmriTip")
      .then((response) => {
        // Assuming the data structure is an array of objects
        const tableData = response.map((item) => ({
          key: item.TB_ISEMRI_TIP_ID,
          IMT_TANIM: item.IMT_TANIM,
          LOKASYON: item.IMT_LOKASYON,
          MAKINE: item.IMT_MAKINE,
          EKIPMAN: item.IMT_EKIPMAN,
          PROSEDUR: item.IMT_PROSEDUR,
          IS_TIP: item.IMT_IS_TIP,
          IS_NEDEN: item.IMT_IS_NEDEN,
          ATOLYE: item.IMT_ATOLYE,
          TAKVIM: item.IMT_TAKVIM,
          TALIMAT: item.IMT_TALIMAT,
          PLAN_TARIH: item.IMT_PLAN_TARIH,
          MASRAF_MERKEZ: item.IMT_MASRAF_MERKEZ,
          PROJE: item.IMT_PROJE,
          OLUSTURAN_ID: item.IMT_OLUSTURAN_ID,
          OLUSTURMA_TARIH: item.IMT_OLUSTURMA_TARIH,
          DEGISTIREN_ID: item.IMT_DEGISTIREN_ID,
          DEGISTIRME_TARIH: item.IMT_DEGISTIRME_TARIH,
          VARSAYILAN: item.IMT_VARSAYILAN,
          CAGRILACAK_PROSEDUR: item.IMT_CAGRILACAK_PROSEDUR,
          DETAY_TAB: item.IMT_DETAY_TAB,
          KONTROL_TAB: item.IMT_KONTROL_TAB,
          PERSONEL_TAB: item.IMT_PERSONEL_TAB,
          MALZEME_TAB: item.IMT_MALZEME_TAB,
          DURUS_TAB: item.IMT_DURUS_TAB,
          SURE_TAB: item.IMT_SURE_TAB,
          MALIYET_TAB: item.IMT_MALIYET_TAB,
          EKIPMAN_TAB: item.IMT_EKIPMAN_TAB,
          OLCUM_TAB: item.IMT_OLCUM_TAB,
          ARAC_GEREC_TAB: item.IMT_ARAC_GEREC_TAB,
          OZEL_ALAN_TAB: item.IMT_OZEL_ALAN_TAB,
          RENK: item.IMT_RENK.replace("$", "#"),
          KAPANMA_ZAMANI: item.IMT_KAPANMA_ZAMANI,
          SONUC: item.IMT_SONUC,
          BAKIM_PUAN: item.IMT_BAKIM_PUAN,
          MAKINE_DURUM: item.IMT_MAKINE_DURUM,
          SON_UYGULANAN_SAYAC: item.IMT_SON_UYGULANAN_SAYAC,
          OKUNAN_SAYAC: item.IMT_OKUNAN_SAYAC,
          YAZI_RENGI: item.IMT_YAZI_RENGI,
          YAZI_TIPI: item.IMT_YAZI_TIPI,
          TIP_ARIZA: item.IMT_TIP_ARIZA,
          DETAY_TAB_ZORUNLU: item.IMT_DETAY_TAB_ZORUNLU,
          KONTROL_TAB_ZORUNLU: item.IMT_KONTROL_TAB_ZORUNLU,
          PERSONEL_TAB_ZORUNLU: item.IMT_PERSONEL_TAB_ZORUNLU,
          DURUS_TAB_ZORUNLU: item.IMT_DURUS_TAB_ZORUNLU,
          MALZEME_TAB_ZORUNLU: item.IMT_MALZEME_TAB_ZORUNLU,
          EKIPMAN_TAB_ZORUNLU: item.IMT_EKIPMAN_TAB_ZORUNLU,
          OLCUM_TAB_ZORUNLU: item.IMT_OLCUM_TAB_ZORUNLU,
          ARAC_GEREC_TAB_ZORUNLU: item.IMT_ARAC_GEREC_TAB_ZORUNLU,
          MALZEME_FIYAT_TIP: item.IMT_MALZEME_FIYAT_TIP,
          VARSAYILAN_MALZEME_MIKTAR: item.IMT_VARSAYILAN_MALZEME_MIKTAR,
          AKTIF: item.IMT_AKTIF,
          ONCELIK: item.IMT_ONCELIK,
          FIRMA: item.IMT_FIRMA,
          MAKINE_DURUM_DETAY: item.IMT_MAKINE_DURUM_DETAY,
          SOZLESME: item.IMT_SOZLESME,
          SAYAC_DEGERI: item.IMT_SAYAC_DEGERI,
          KONU: item.IMT_KONU,
          PLAN_BITIS: item.IMT_PLAN_BITIS,
          PERSONEL_SURE: item.IMT_PERSONEL_SURE,
          REFERANS_NO: item.IMT_REFERANS_NO,
          EVRAK_NO: item.IMT_EVRAK_NO,
          EVRAK_TARIHI: item.IMT_EVRAK_TARIHI,
          MALIYET: item.IMT_MALIYET,
          ACIKLAMA_USTTAB: item.IMT_ACIKLAMA_USTTAB,
          OZEL_ALAN_1: item.IMT_OZEL_ALAN_1,
          OZEL_ALAN_2: item.IMT_OZEL_ALAN_2,
          OZEL_ALAN_3: item.IMT_OZEL_ALAN_3,
          OZEL_ALAN_4: item.IMT_OZEL_ALAN_4,
          OZEL_ALAN_5: item.IMT_OZEL_ALAN_5,
          OZEL_ALAN_6: item.IMT_OZEL_ALAN_6,
          OZEL_ALAN_7: item.IMT_OZEL_ALAN_7,
          OZEL_ALAN_8: item.IMT_OZEL_ALAN_8,
          OZEL_ALAN_9: item.IMT_OZEL_ALAN_9,
          OZEL_ALAN_10: item.IMT_OZEL_ALAN_10,
          OZEL_ALAN_11: item.IMT_OZEL_ALAN_11,
          OZEL_ALAN_12: item.IMT_OZEL_ALAN_12,
          OZEL_ALAN_13: item.IMT_OZEL_ALAN_13,
          OZEL_ALAN_14: item.IMT_OZEL_ALAN_14,
          OZEL_ALAN_15: item.IMT_OZEL_ALAN_15,
          OZEL_ALAN_16: item.IMT_OZEL_ALAN_16,
          OZEL_ALAN_17: item.IMT_OZEL_ALAN_17,
          OZEL_ALAN_18: item.IMT_OZEL_ALAN_18,
          OZEL_ALAN_19: item.IMT_OZEL_ALAN_19,
          OZEL_ALAN_20: item.IMT_OZEL_ALAN_20,
          MAKINE_KAPAT: item.IMT_MAKINE_KAPAT,
          EKIPMAN_KAPAT: item.IMT_EKIPMAN_KAPAT,
          MAKINE_DURUM_KAPAT: item.IMT_MAKINE_DURUM_KAPAT,
          SAYAC_DEGER_KAPAT: item.IMT_SAYAC_DEGER_KAPAT,
          PROSEDUR_KAPAT: item.IMT_PROSEDUR_KAPAT,
          IS_TIPI_KAPAT: item.IMT_IS_TIPI_KAPAT,
          IS_NEDENI_KAPAT: item.IMT_IS_NEDENI_KAPAT,
          KONU_KAPAT: item.IMT_KONU_KAPAT,
          ONCELIK_KAPAT: item.IMT_ONCELIK_KAPAT,
          ATOLYE_KAPAT: item.IMT_ATOLYE_KAPAT,
          PROJE_KAPAT: item.IMT_PROJE_KAPAT,
          REFNO_KAPAT: item.IMT_REFNO_KAPAT,
          FIRMA_KAPAT: item.IMT_FIRMA_KAPAT,
          SOZLESME_KAPAT: item.IMT_SOZLESME_KAPAT,
          TOPLAM_MALIYET_ZORUNLU: item.IMT_TOPLAM_MALIYET_ZORUNLU,
        }));
        setData(tableData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const columns = [
    {
      title: "İş Emri Tipi",
      dataIndex: "IMT_TANIM",
      key: "IMT_TANIM",

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
  ];

  // Table for type list end

  // type from api for selectbox
  const fetchItemsFromApiforSelectbox = () => {
    setIsLoading(true);
    AxiosInstance.get("IsEmriTip")
      .then((response) => {
        const TypeList = response || [];
        setItems(TypeList);

        // Find the item with IMT_VARSAYILAN set to true
        const defaultItem = TypeList.find((item) => item.IMT_VARSAYILAN);

        // If we find such an item, set its TB_ISEMRI_TIP_ID as the default value for the Select
        if (defaultItem) {
          const defaultValue = {
            value: defaultItem.TB_ISEMRI_TIP_ID,
            label: defaultItem.IMT_TANIM,
          };
          setValue("work_order_type", defaultValue); // Assuming you have access to the setValue function from react-hook-form
        }
      })
      .catch((error) => {
        console.error("Error fetching data from API:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchItemsFromApiforSelectbox();
  }, []);

  const handleDropdownVisibleChange = (open) => {
    if (open) {
      // Fetch data from the API only when the dropdown is opened and the items are empty
      fetchItemsFromApiforSelectbox();
    }
    setIsMakineDropdownOpen(open);
  };
  // type from api for selectbox end

  const handlePlusClick = () => {
    setIsModalVisible(true);
    onRowClick(data[0], 0); // Simulate a click on the first row
  };

  const handleModalOk = () => {
    setInputValue(selectedValue);
    setIsModalVisible(false);

    const formData = getValues(); // Get the form data

    // Structure the data for the API request
    const structuredData = {
      [formData.IMT_TANIM]: {
        ...formData, // This will spread all the properties of formData into the structuredData object
      },
    };

    // Send a POST request to update the content
    AxiosInstance.post("UpdateIsEmriTipi", structuredData)
      .then((response) => {
        message.success("Content updated successfully!");
        setIsModalVisible(false); // Close the modal after successful update
      })
      .catch((error) => {
        console.error("Error updating content:", error);
        message.error("Error updating content. Please try again.");
      });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const onRowClick = (record, rowIndex) => {
    setSelectedData(record);
    setValue("IMT_TANIM", record.IMT_TANIM);
    setValue("varsayilan", !!record.VARSAYILAN);
    setValue("aktif", !!record.AKTIF);
    setValue("lokasyon", !!record.LOKASYON);
    setValue("makine", !!record.MAKINE);
    setValue("ekipman", !!record.EKIPMAN);
    setValue("prosedur", !!record.PROSEDUR);
    setValue("is_tip", !!record.IS_TIP);
    setValue("is_neden", !!record.IS_NEDEN);
    setValue("atolye", !!record.ATOLYE);
    setValue("takvim", !!record.TAKVIM);
    setValue("talimat", !!record.TALIMAT);
    setValue("plan_tarihi", !!record.PLAN_TARIH);
    setValue("masraf_merkez", !!record.MASRAF_MERKEZ);
    setValue("proje", !!record.PROJE);
    setValue("olusturan_id", !!record.OLUSTURAN_ID);
    setValue("olusturma_tarih", !!record.OLUSTURMA_TARIH);
    setValue("degistiren_id", !!record.DEGISTIREN_ID);
    setValue("degistirme_tarih", !!record.DEGISTIRME_TARIH);
    setValue("cagrilacak_prosedur", !!record.CAGRILACAK_PROSEDUR);
    setValue("detay_tab", !!record.DETAY_TAB);
    setValue("kontrol_tab", !!record.KONTROL_TAB);
    setValue("personel_tab", !!record.PERSONEL_TAB);
    setValue("malzeme_tab", !!record.MALZEME_TAB);
    setValue("durus_tab", !!record.DURUS_TAB);
    setValue("sure_tab", !!record.SURE_TAB);
    setValue("maliyet_tab", !!record.MALIYET_TAB);
    setValue("ekipman_tab", !!record.EKIPMAN_TAB);
    setValue("olcum_tab", !!record.OLCUM_TAB);
    setValue("arac_gerec_tab", !!record.ARAC_GEREC_TAB);
    setValue("ozel_alan_tab", !!record.OZEL_ALAN_TAB);
    setValue("renk", !!record.RENK);
    setValue("kapanma_zamani", !!record.KAPANMA_ZAMANI);
    setValue("sonuc", !!record.SONUC);
    setValue("bakim_puan", !!record.BAKIM_PUAN);
    setValue("makine_durum", !!record.MAKINE_DURUM);
    setValue("son_uygulanan_sayac", !!record.SON_UYGULANAN_SAYAC);
    setValue("okunan_sayac", !!record.OKUNAN_SAYAC);
    setValue("yazi_rengi", !!record.YAZI_RENGI);
    setValue("yazi_tipi", !!record.YAZI_TIPI);
    setValue("tip_ariza", !!record.TIP_ARIZA);
    setValue("detay_tab_zorunlu", !!record.DETAY_TAB_ZORUNLU);
    setValue("kontrol_tab_zorunlu", !!record.KONTROL_TAB_ZORUNLU);
    setValue("personel_tab_zorunlu", !!record.PERSONEL_TAB_ZORUNLU);
    setValue("durus_tab_zorunlu", !!record.DURUS_TAB_ZORUNLU);
    setValue("malzeme_tab_zorunlu", !!record.MALZEME_TAB_ZORUNLU);
    setValue("ekipman_tab_zorunlu", !!record.EKIPMAN_TAB_ZORUNLU);
    setValue("olcum_tab_zorunlu", !!record.OLCUM_TAB_ZORUNLU);
    setValue("arac_gerec_tab_zorunlu", !!record.ARAC_GEREC_TAB_ZORUNLU);
    setValue("malzeme_fiyat_tip", !!record.MALZEME_FIYAT_TIP);
    setValue("varsayilan_malzeme_miktar", !!record.VARSAYILAN_MALZEME_MIKTAR);
    setValue("oncelik", !!record.ONCELIK);
    setValue("firma", !!record.FIRMA);
    setValue("makine_durum_detay", !!record.MAKINE_DURUM_DETAY);
    setValue("sozlesme", !!record.SOZLESME);
    setValue("sayac_degeri", !!record.SAYAC_DEGERI);
    setValue("konu", !!record.KONU);
    setValue("plan_bitis", !!record.PLAN_BITIS);
    setValue("personel_sure", !!record.PERSONEL_SURE);
    setValue("referans_no", !!record.REFERANS_NO);
    setValue("evrak_no", !!record.EVRAK_NO);
    setValue("evrak_tarihi", !!record.EVRAK_TARIHI);
    setValue("maliyet", !!record.MALIYET);
    setValue("aciklama_usttab", !!record.ACIKLAMA_USTTAB);
    setValue("ozel_alan_1", !!record.OZEL_ALAN_1);
    setValue("ozel_alan_2", !!record.OZEL_ALAN_2);
    setValue("ozel_alan_3", !!record.OZEL_ALAN_3);
    setValue("ozel_alan_4", !!record.OZEL_ALAN_4);
    setValue("ozel_alan_5", !!record.OZEL_ALAN_5);
    setValue("ozel_alan_6", !!record.OZEL_ALAN_6);
    setValue("ozel_alan_7", !!record.OZEL_ALAN_7);
    setValue("ozel_alan_8", !!record.OZEL_ALAN_8);
    setValue("ozel_alan_9", !!record.OZEL_ALAN_9);
    setValue("ozel_alan_10", !!record.OZEL_ALAN_10);
    setValue("ozel_alan_11", !!record.OZEL_ALAN_11);
    setValue("ozel_alan_12", !!record.OZEL_ALAN_12);
    setValue("ozel_alan_13", !!record.OZEL_ALAN_13);
    setValue("ozel_alan_14", !!record.OZEL_ALAN_14);
    setValue("ozel_alan_15", !!record.OZEL_ALAN_15);
    setValue("ozel_alan_16", !!record.OZEL_ALAN_16);
    setValue("ozel_alan_17", !!record.OZEL_ALAN_17);
    setValue("ozel_alan_18", !!record.OZEL_ALAN_18);
    setValue("ozel_alan_19", !!record.OZEL_ALAN_19);
    setValue("ozel_alan_20", !!record.OZEL_ALAN_20);
    setValue("makine_kapat", !!record.MAKINE_KAPAT);
    setValue("ekipman_kapat", !!record.EKIPMAN_KAPAT);
    setValue("makine_durum_kapat", !!record.MAKINE_DURUM_KAPAT);
    setValue("sayac_deger_kapat", !!record.SAYAC_DEGER_KAPAT);
    setValue("prosedur_kapat", !!record.PROSEDUR_KAPAT);
    setValue("is_tipi_kapat", !!record.IS_TIPI_KAPAT);
    setValue("is_nedeni_kapat", !!record.IS_NEDENI_KAPAT);
    setValue("konu_kapat", !!record.KONU_KAPAT);
    setValue("oncelik_kapat", !!record.ONCELIK_KAPAT);
    setValue("atolye_kapat", !!record.ATOLYE_KAPAT);
    setValue("proje_kapat", !!record.PROJE_KAPAT);
    setValue("refno_kapat", !!record.REFNO_KAPAT);
    setValue("firma_kapat", !!record.FIRMA_KAPAT);
    setValue("sozlesme_kapat", !!record.SOZLESME_KAPAT);
    setValue("toplam_maliyet_zorunlu", !!record.TOPLAM_MALIYET_ZORUNLU);
  };

  const methods = useForm();

  const onSubmit = (data) => {
    console.log(data); // Do something with the form data
  };

  const handleChange = (value) => {};

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", width: "425px", justifyContent: "space-between" }}>
            <Text style={{ fontSize: "14px" }}>İş Emri Tipi:</Text>
            <div style={{ display: "flex", alignItems: "center", width: "300px", gap: "5px" }}>
              <Controller
                name="work_order_type"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    onChange={(value) => {
                      const selectedItem = items.find((item) => item.TB_ISEMRI_TIP_ID === value);
                      const label = selectedItem ? selectedItem.IMT_TANIM : null;
                      field.onChange({ value, label });
                    }}
                    showSearch
                    allowClear
                    labelInValue // label ve value değerlerini aynı anda almak için
                    style={{
                      width: 300,
                    }}
                    placeholder=""
                    onDropdownVisibleChange={handleDropdownVisibleChange}
                    options={items.map((item) => ({
                      label: item.IMT_TANIM,
                      value: item.TB_ISEMRI_TIP_ID,
                    }))}
                    open={isMakineDropdownOpen}
                    loading={isLoading}
                    dropdownRender={(menu) => <Spin spinning={isLoading}>{menu}</Spin>}
                  />
                )}
              />
              <Button onClick={handlePlusClick}> + </Button>
              {/* <Button onClick={handleMinusClick}> - </Button> */}
              <Modal
                width="1200px"
                title="İş Emri Tipi"
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}>
                <div style={{ display: "flex", padding: "10px", gap: "10px" }}>
                  <div style={{ width: "200px" }}>
                    <Table
                      dataSource={data}
                      columns={columns}
                      loading={loading}
                      rowKey="key"
                      pagination={false}
                      onRow={(record, rowIndex) => ({
                        onClick: () => onRowClick(record, rowIndex),
                      })}
                    />
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: "20px",
                      }}>
                      <WorkOrderTypeInsert />
                    </div>
                  </div>
                  <div style={{ width: "100%" }}>
                    {selectedData && (
                      <div style={{ flex: 1, marginLeft: 20, padding: 20, border: "1px solid #ccc" }}>
                        <div style={{ display: "flex" }}>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                              <Text>İş Emri Tipi</Text>
                              <Controller
                                name="IMT_TANIM"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <Input style={{ width: "200px" }} {...field} />}
                              />
                              <Controller
                                name="varsayilan"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Varsayılan
                                  </Checkbox>
                                )}
                              />
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <Text>Satir / Yazi Rengi</Text>

                              {/* <Controller
                                name="renk"
                                control={control}
                                defaultValue="#ffffff" // default color value
                                render={({ field }) => (
                                  <ColorPicker
                                    {...field}
                                    showText
                                    color={field.value}
                                    onChange={(color) => field.onChange(color)}
                                  />
                                )}
                              />
                              <ColorPicker showText /> */}
                              <Controller
                                name="aktif"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Aktif
                                  </Checkbox>
                                )}
                              />
                            </div>
                          </div>

                          <div style={{ width: "250px" }}>
                            <Select
                              mode="multiple"
                              allowClear
                              style={{
                                width: "100%",
                              }}
                              placeholder="Kategori seçiniz"
                              defaultValue={["a10", "c12"]}
                              onChange={handleChange}
                              options={options}
                            />
                          </div>
                        </div>

                        <Tabs defaultActiveKey="1">
                          <TabPane tab="Zorunlu Alanlar" key="1">
                            <div
                              style={{ display: "flex", flexDirection: "column", flexWrap: "wrap", height: "200px" }}>
                              <Controller
                                name="lokasyon"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    disabled
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Lokasyon
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="makine"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Makine
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="ekipman"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Ekipman
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="makine_durum"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Makine Durum
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="sayac_degeri"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Sayaç Değeri
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="prosedur"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Prosedür
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="is_tip"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    İş Tipi
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="is_nedeni"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    İş Nedeni
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="konu"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Konu
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="oncelik"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Öncelik
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="atolye"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Atölye
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="takvim"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Takvim
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="talimat"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Talimat
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="plan_tarihi"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Plan. Başl. Tarihi
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="plan_bitis"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Plan. Bitiş Tarihi
                                  </Checkbox>
                                )}
                              />

                              <Controller
                                name="masraf_merkez"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Masraf Merkezi
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="proje"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Proje
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="referans_no"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Referans No
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="firma"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Firma
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="sozlesme"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Sözleşme
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="evrak_no"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Evrak No
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="evrak_tarihi"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Evrak Tarihi
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="maliyet"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Maliye
                                  </Checkbox>
                                )}
                              />
                            </div>
                          </TabPane>
                          <TabPane tab="Görüntülenecek Sayfalar" key="2">
                            <div style={{ display: "flex", flexDirection: "column", flexWrap: "wrap" }}>
                              <Controller
                                name="detay_tab"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    disabled
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Detay Bilgiler
                                  </Checkbox>
                                )}
                              />
                              <div style={{ display: "flex", width: "300px", justifyContent: "space-between" }}>
                                <Controller
                                  name="kontrol_tab"
                                  control={control}
                                  defaultValue={false}
                                  render={({ field }) => (
                                    <Checkbox
                                      {...field}
                                      checked={field.value}
                                      onChange={(e) => {
                                        field.onChange(e.target.checked);
                                      }}>
                                      Kontrol Listesi
                                    </Checkbox>
                                  )}
                                />
                                <Controller
                                  name="kontrol_tab_zorunlu"
                                  control={control}
                                  defaultValue={false}
                                  render={({ field }) => (
                                    <Checkbox
                                      {...field}
                                      checked={field.value}
                                      onChange={(e) => {
                                        field.onChange(e.target.checked);
                                      }}>
                                      Zorunlu
                                    </Checkbox>
                                  )}
                                />
                              </div>
                              <div style={{ display: "flex", width: "300px", justifyContent: "space-between" }}>
                                <Controller
                                  name="personel_tab"
                                  control={control}
                                  defaultValue={false}
                                  render={({ field }) => (
                                    <Checkbox
                                      {...field}
                                      checked={field.value}
                                      onChange={(e) => {
                                        field.onChange(e.target.checked);
                                      }}>
                                      Personel
                                    </Checkbox>
                                  )}
                                />
                                <Controller
                                  name="personel_tab_zorunlu"
                                  control={control}
                                  defaultValue={false}
                                  render={({ field }) => (
                                    <Checkbox
                                      {...field}
                                      checked={field.value}
                                      onChange={(e) => {
                                        field.onChange(e.target.checked);
                                      }}>
                                      Zorunlu
                                    </Checkbox>
                                  )}
                                />
                              </div>
                              <div style={{ display: "flex", width: "300px", justifyContent: "space-between" }}>
                                <Controller
                                  name="malzeme_tab"
                                  control={control}
                                  defaultValue={false}
                                  render={({ field }) => (
                                    <Checkbox
                                      {...field}
                                      checked={field.value}
                                      onChange={(e) => {
                                        field.onChange(e.target.checked);
                                      }}>
                                      Malzemeler
                                    </Checkbox>
                                  )}
                                />
                                <Controller
                                  name="malzeme_tab_zorunlu"
                                  control={control}
                                  defaultValue={false}
                                  render={({ field }) => (
                                    <Checkbox
                                      {...field}
                                      checked={field.value}
                                      onChange={(e) => {
                                        field.onChange(e.target.checked);
                                      }}>
                                      Zorunlu
                                    </Checkbox>
                                  )}
                                />
                              </div>
                              <div style={{ display: "flex", width: "300px", justifyContent: "space-between" }}>
                                <Controller
                                  name="durus_tab"
                                  control={control}
                                  defaultValue={false}
                                  render={({ field }) => (
                                    <Checkbox
                                      {...field}
                                      checked={field.value}
                                      onChange={(e) => {
                                        field.onChange(e.target.checked);
                                      }}>
                                      Duruşlar
                                    </Checkbox>
                                  )}
                                />
                                <Controller
                                  name="durus_tab_zorunlu"
                                  control={control}
                                  defaultValue={false}
                                  render={({ field }) => (
                                    <Checkbox
                                      {...field}
                                      checked={field.value}
                                      onChange={(e) => {
                                        field.onChange(e.target.checked);
                                      }}>
                                      Zorunlu
                                    </Checkbox>
                                  )}
                                />
                              </div>

                              <div style={{ display: "flex", width: "300px", justifyContent: "space-between" }}>
                                <Controller
                                  name="sure_tab"
                                  control={control}
                                  defaultValue={false}
                                  render={({ field }) => (
                                    <Checkbox
                                      {...field}
                                      checked={field.value}
                                      onChange={(e) => {
                                        field.onChange(e.target.checked);
                                      }}>
                                      Süre Bilgileri
                                    </Checkbox>
                                  )}
                                />
                              </div>
                              <div style={{ display: "flex", width: "300px", justifyContent: "space-between" }}>
                                <Controller
                                  name="maliyet_tab"
                                  control={control}
                                  defaultValue={false}
                                  render={({ field }) => (
                                    <Checkbox
                                      {...field}
                                      checked={field.value}
                                      onChange={(e) => {
                                        field.onChange(e.target.checked);
                                      }}>
                                      Maliyetler
                                    </Checkbox>
                                  )}
                                />
                                <Controller
                                  name="toplam_maliyet_zorunlu"
                                  control={control}
                                  defaultValue={false}
                                  render={({ field }) => (
                                    <Checkbox
                                      {...field}
                                      checked={field.value}
                                      onChange={(e) => {
                                        field.onChange(e.target.checked);
                                      }}>
                                      Zorunlu
                                    </Checkbox>
                                  )}
                                />
                              </div>
                              <div style={{ display: "flex", width: "300px", justifyContent: "space-between" }}>
                                <Controller
                                  name="ekipman_tab"
                                  control={control}
                                  defaultValue={false}
                                  render={({ field }) => (
                                    <Checkbox
                                      {...field}
                                      checked={field.value}
                                      onChange={(e) => {
                                        field.onChange(e.target.checked);
                                      }}>
                                      Ekipman İşlemleri
                                    </Checkbox>
                                  )}
                                />
                                <Controller
                                  name="ekipman_tab_zorunlu"
                                  control={control}
                                  defaultValue={false}
                                  render={({ field }) => (
                                    <Checkbox
                                      {...field}
                                      checked={field.value}
                                      onChange={(e) => {
                                        field.onChange(e.target.checked);
                                      }}>
                                      Zorunlu
                                    </Checkbox>
                                  )}
                                />
                              </div>
                              <div style={{ display: "flex", width: "300px", justifyContent: "space-between" }}>
                                <Controller
                                  name="olcum_tab"
                                  control={control}
                                  defaultValue={false}
                                  render={({ field }) => (
                                    <Checkbox
                                      {...field}
                                      checked={field.value}
                                      onChange={(e) => {
                                        field.onChange(e.target.checked);
                                      }}>
                                      Ölçüm Değerleri
                                    </Checkbox>
                                  )}
                                />
                                <Controller
                                  name="olcum_tab_zorunlu"
                                  control={control}
                                  defaultValue={false}
                                  render={({ field }) => (
                                    <Checkbox
                                      {...field}
                                      disabled
                                      checked={field.value}
                                      onChange={(e) => {
                                        field.onChange(e.target.checked);
                                      }}>
                                      Zorunlu
                                    </Checkbox>
                                  )}
                                />
                              </div>
                              <div style={{ display: "flex", width: "300px", justifyContent: "space-between" }}>
                                <Controller
                                  name="ozel_alan_tab"
                                  control={control}
                                  defaultValue={false}
                                  render={({ field }) => (
                                    <Checkbox
                                      {...field}
                                      checked={field.value}
                                      onChange={(e) => {
                                        field.onChange(e.target.checked);
                                      }}>
                                      Özel Alanlar
                                    </Checkbox>
                                  )}
                                />
                              </div>
                              <div style={{ display: "flex", width: "300px", justifyContent: "space-between" }}>
                                <Controller
                                  name="arac_gerec_tab"
                                  control={control}
                                  defaultValue={false}
                                  render={({ field }) => (
                                    <Checkbox
                                      {...field}
                                      checked={field.value}
                                      onChange={(e) => {
                                        field.onChange(e.target.checked);
                                      }}>
                                      Araç Gereçler
                                    </Checkbox>
                                  )}
                                />
                                <Controller
                                  name="arac_gerec_tab_zorunlu"
                                  control={control}
                                  defaultValue={false}
                                  render={({ field }) => (
                                    <Checkbox
                                      {...field}
                                      disabled
                                      checked={field.value}
                                      onChange={(e) => {
                                        field.onChange(e.target.checked);
                                      }}>
                                      Zorunlu
                                    </Checkbox>
                                  )}
                                />
                              </div>
                            </div>
                          </TabPane>
                          <TabPane tab="İş Emri Kapama" key="3">
                            <div
                              style={{ display: "flex", flexDirection: "column", flexWrap: "wrap", height: "200px" }}>
                              <Controller
                                name="kapanma_zamani"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Kapanma Zamanı
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="makine_durum"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Makine Durum
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="bakim_puan"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Bakım Puanı
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="personel_sure"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Personel Çalışma Süresi
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="makine"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Makine
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="ekipman"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Ekipman
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="sayac_degeri"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Sayaç Değer
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="prosedur"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Prosedür
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="is_tip"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    İş Tipi
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="okunan_sayac"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Okunan Sayaç
                                  </Checkbox>
                                )}
                              />

                              <Controller
                                name="is_neden"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    İş Nedenleri
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="konu"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Konu
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="oncelik"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Öncelik
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="atolye"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Atölye
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="firma"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Firma
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="sozlesme"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Sözleşme
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="proje"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Proje
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="referans_no"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Referans No
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="ozel_alan_1"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Sıcaklık
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="ozel_alan_2"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Ağırlık
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="ozel_alan_3"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Farura Durumu
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="ozel_alan_11"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Fatura Durumu
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="ozel_alan_12"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Aydınlatma Tanımı
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="ozel_alan_13"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Özel Alan 13
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="ozel_alan_16"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Özel Alan 16
                                  </Checkbox>
                                )}
                              />
                              <Controller
                                name="ozel_alan_17"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}>
                                    Özel Alan 17
                                  </Checkbox>
                                )}
                              />
                            </div>
                          </TabPane>
                        </Tabs>
                      </div>
                    )}
                  </div>
                </div>
              </Modal>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
