import tr_TR from "antd/es/locale/tr_TR";
import { Drawer, Typography, Space, Button, ConfigProvider } from "antd";
import styled from "styled-components";
import ContractTabs from "../Tabs/ContractTabs";
import { getColor } from "../../Table/utils";
import { useState } from "react";
import { EnterOutlined, FormOutlined } from "@ant-design/icons";
import MainInformation from "../Toolbar/MainInformation";

import MainTabs from "../MainTabs/MainTabs";
import { useForm, Controller, useFormContext, FormProvider } from "react-hook-form";
import AxiosInstance from "../../../../api/http";

const { Text } = Typography;

const StyledDrawer = styled(Drawer)`
  & .ant-drawer-header {
    border-bottom: none;
  }
  .ant-drawer-close {
    display: none;
  }
`;

export default function EditDrawer({ onDrawerClose, drawerVisible, selectedRow }) {
  const [visible, setVisible] = useState(false);

  const handleClick = () => {
    const values = methods.getValues();
    console.log(onSubmit(values));
  };

  //* export
  const methods = useForm({
    defaultValues: {
      Atölye: "",
      BaslamaZamani: "",
      BitisZamani: "",
      CalismaSuresi: "",
      EvrakNo: "",
      EvrakTarihi: "",
      Firma: "",
      Konu: "",
      Maliyet: "",
      MaliyetKapsaminda: "",
      MasrafMerkezi: "",
      Nedeni: "",
      PlanlananBaslama: "",
      PlanlananBitis: "",
      Proje: "",
      Prosedur: "",
      ReferansNo: "",
      Sozlesme: "",
      Takvim: "",
      TalepEden: "",
      Talimat: "",
      Tanimlama: "",
      Tarih: "",
      Tipi: "",
      bekleme: "",
      calismaSure: "",
      diger: "",
      lojistik: "",
      mudahaleSure: "",
      onay: "",
      seyahet: "",
      toplamIsSure: "",
      Öncelik: "",
      İşTakipKodu: "",
      Açıklama: "",
      brand: "",
      category: "",
      counter_value: "",
      date: "",
      equipment: "",
      image: "",
      location: "",
      machine: "",
      machine_status: "",
      machine_type: "",
      warranty_end: "",
      work_order_no: "",
      plkLocation: "",
      plkMachine: "",
      plkWarranty_end: "",
    },
  });

  //* export
  const onSubmit = (data) => {
    const isEmriBilgileri = {
      work_order_no: data.work_order_no,
      date: data.date,
      machine_type: data.machine_type,
      category: data.category,
      brand: data.brand,
      location: data.location,
      machine: data.machine,
      warranty_end: data.warranty_end,
      machine_status: data.machine_status,
      plkLocation: data.plkLocation,
      plkMachine: data.plkMachine,
      plkWarranty_end: data.plkWarranty_end,
      equipment: data.equipment,
      counter_value: data.counter_value,

      // add more fields as needed
    };
    const detayBilgiler = {
      Prosedur: data.Prosedur,
      Konu: data.Konu,
      Tipi: data.Tipi,
      Nedeni: data.Nedeni,
      Öncelik: data.Öncelik,
      Atölye: data.Atölye,
      Takvim: data.Takvim,
      Talimat: data.Talimat,
      PlanlananBaslama: data.PlanlananBaslama,
      PlanlananBitis: data.PlanlananBitis,
      BaslamaZamani: data.BaslamaZamani,
      BitisZamani: data.BitisZamani,
      CalismaSuresi: data.CalismaSuresi,
      İşTakipKodu: data.İşTakipKodu,
      TalepEden: data.TalepEden,
      Tarih: data.Tarih,
      Açıklama: data.Açıklama,
      MasrafMerkezi: data.MasrafMerkezi,
      Proje: data.Proje,
      ReferansNo: data.ReferansNo,
      Tanimlama: data.Tanimlama,
      Firma: data.Firma,
      Sozlesme: data.Sozlesme,
      EvrakNo: data.EvrakNo,
      EvrakTarihi: data.EvrakTarihi,
      Maliyet: data.Maliyet,
      // add more fields as needed
    };

    const sureBilgileri = {
      lojistik: data.lojistik,
      seyahet: data.seyahet,
      onay: data.onay,
      bekleme: data.bekleme,
      diger: data.diger,
      mudahaleSure: data.bekleme,
      calismaSure: data.calismaSure,
      toplamIsSure: data.toplamIsSure,
      // add more fields as needed
    };
    // AxiosInstance.post("/api/endpoint", { obj1, obj2 }).then((response) => {
    // handle response
    // });
    console.log({ detayBilgiler, sureBilgileri, isEmriBilgileri });
  };

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const inputStyle = {
    height: "15px", // Set the desired height here
  };

  const currencies = [
    {
      value: "1",
      label: "Baski Makinesi",
    },
    {
      value: "2",
      label: "Baski Makinesi",
    },
    {
      value: "3",
      label: "Kagit Makinesi",
    },
    {
      value: "4",
      label: "Axygen",
    },
  ];

  const classes = useStyles();

  return (
    //* export
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <ConfigProvider locale={tr_TR}>
          <StyledDrawer // render Drawer component
            title="İş Emrleri" // set title prop
            placement="right" // set placement prop
            closable={true} // set closable prop
            onClose={onDrawerClose} // pass onClose handler
            open={drawerVisible} // pass visible prop
            width="1660px" // set width prop
          >
            {selectedRow && ( // render selected row data if any
              <div>
                <Space
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}>
                  <Text type="success">Temel bilgiler:</Text>
                  <p>
                    <Text type="secondary">Durum:</Text>{" "}
                    <span
                      style={{
                        backgroundColor: `rgba(${
                          getColor(selectedRow.status) === "grey"
                            ? "128,128,128"
                            : getColor(selectedRow.status) === "green"
                            ? "0,128,0"
                            : getColor(selectedRow.status) === "red"
                            ? "255,0,0"
                            : getColor(selectedRow.status) === "orange"
                            ? "255,165,0"
                            : "128,128,128"
                        }, 0.5)`,
                        padding: "5px 10px",
                        borderRadius: "20px",
                      }}>
                      {selectedRow.status}{" "}
                    </span>
                  </p>
                </Space>

                <MainTabs />

                {/* <ContractTabs /> */}
                {/* <Button
            onClick={onDrawerClose}
            style={{
              color: "#2bc770",
              borderColor: "#2bc770",
              position: "absolute",
              right: 20,
              bottom: 20,
            }}>
            Bağla
          </Button> */}
                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    position: "absolute",
                    right: 20,
                    top: 20,
                  }}>
                  <Button
                    onClick={onDrawerClose}
                    style={{
                      backgroundColor: "#ffffff",
                      borderColor: "#2bc770",
                      color: "#2bc770",
                    }}>
                    {/* <EnterOutlined style={{ rotate: "180deg" }} /> */}
                    İptal
                  </Button>
                  <Button
                    type="submit"
                    style={{
                      backgroundColor: "#2bc770",
                      borderColor: "#2bc770",
                      color: "#ffffff",
                    }}
                    // onClick={showDrawer}
                    onClick={handleClick}>
                    Kaydet
                    {/* <FormOutlined /> */}
                  </Button>
                  {/* <Drawer
              title="Düzəliş et"
              placement="right"
              closable={false}
              onClose={onClose}
              open={visible}
              width={950}
              extra={
                <Space
                  style={{
                    position: "absolute",
                    right: 20,
                    bottom: 20,
                  }}>
                  <Button type="primary" onClick={onClose} style={{ backgroundColor: "#2bc770" }}>
                    Yadda saxla
                  </Button>
                  <Button onClick={onClose} style={{ color: "#2bc770", borderColor: "#2bc770" }}>
                    Ləğv et
                  </Button>
                </Space>
              }>
              <MainInformation />
            </Drawer> */}
                </div>
              </div>
            )}
          </StyledDrawer>
        </ConfigProvider>
      </form>
    </FormProvider>
  );
}
