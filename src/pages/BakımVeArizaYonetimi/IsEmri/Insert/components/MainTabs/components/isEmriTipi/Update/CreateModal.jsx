import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../../../../../api/http";
import { Controller, useForm, FormProvider } from "react-hook-form";
import MainTabs from "./MainTabs/MainTabs";
import EditTabs from "./SecondTabs/EditTabs";
import dayjs from "dayjs";

export default function CreateModal({ workshopSelectedId, onSubmit, onRefresh, secilenPersonelID, selectedRow }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const methods = useForm({
    defaultValues: {
      isEmriTipiTanim: "",
      secilenID: "",
      varsayilanIsEmriTipi: false,
      isEmriTipiRenk: "#1677ff",
      aktifIsEmriTipi: false,
      tipGroup: "",
      lokasyon: true,
      makine: false,
      ekipman: false,
      makineDurum: false,
      sayacDegeri: false,
      prosedur: false,
      isTipi: false,
      isNedeni: false,
      konu: false,
      oncelik: false,
      atolye: false,
      takvim: false,
      talimat: false,
      planlananBaslangicTarihi: false,
      planlananBitisTarihi: false,
      masrafMerkezi: false,
      proje: false,
      referansNo: false,
      firma: false,
      sozlesme: false,
      evrakNo: false,
      evrakTarihi: false,
      maliyet: false,
      detayBilgiler: false,
      kontrolListesi: false,
      kontrolListesiZorunlu: false,
      // Add other default values here
    },
  });

  const { setValue, reset, handleSubmit } = methods;

  useEffect(() => {
    if (isModalVisible && selectedRow) {
      setValue("secilenID", selectedRow.key);
      setValue("belgeNo", selectedRow.PSE_BELGE_NO);
      setValue("sertifikaTipi", selectedRow.PSE_SERTIFIKA_TIP);
      setValue("sertifikaTipiID", selectedRow.PSE_SERTIFIKA_TIP_KOD_ID);
      setValue("verilisTarihi", dayjs(selectedRow.PSE_VERILIS_TARIH));
      setValue("bitisTarihi", dayjs(selectedRow.PSE_BITIS_TARIH));
      setValue("aciklama", selectedRow.PSE_ACIKLAMA);
    }
  }, [selectedRow, isModalVisible, setValue]);

  useEffect(() => {
    if (!isModalVisible) {
      reset();
    }
  }, [isModalVisible, reset]);

  const formatDateWithDayjs = (dateString) => {
    const formattedDate = dayjs(dateString);
    return formattedDate.isValid() ? formattedDate.format("YYYY-MM-DD") : "";
  };

  const formatTimeWithDayjs = (timeObj) => {
    const formattedTime = dayjs(timeObj);
    return formattedTime.isValid() ? formattedTime.format("HH:mm:ss") : "";
  };

  // Aşğaıdaki form elemanlarını eklemek üçün API ye gönderilme işlemi

  const onSubmited = (data) => {
    const Body = {
      IMT_TANIM: data.isEmriTipiTanim,
      TB_ISEMRI_TIP_ID: data.secilenID,
      IMT_VARSAYILAN: data.varsayilanIsEmriTipi,
      IMT_RENK_WEB_VERSION: data.isEmriTipiRenk,
      IMT_AKTIF: data.aktifIsEmriTipi,
      IMT_TIP_GRUP: data.tipGroup,
      IMT_LOKASYON: true,
      IMT_MAKINE: data.makine,
      IMT_EKIPMAN: data.ekipman,
      IMT_MAKINE_DURUM: data.makineDurum,
      IMT_SAYAC_DEGERI: data.sayacDegeri,
      IMT_PROSEDUR: data.prosedur,
      IMT_IS_TIP: data.isTipi,
      IMT_IS_NEDEN: data.isNedeni,
      IMT_KONU: data.konu,
      IMT_ONCELIK: data.oncelik,
      IMT_ATOLYE: data.atolye,
      IMT_TAKVIM: data.takvim,
      IMT_TALIMAT: data.talimat,
      IMT_PLAN_TARIH: data.planlananBaslangicTarihi,
      IMT_PLAN_BITIS: data.planlananBitisTarihi,
      IMT_MASRAF_MERKEZ: data.masrafMerkezi,
      IMT_PROJE: data.proje,
      IMT_REFERANS_NO: data.referansNo,
      IMT_FIRMA: data.firma,
      IMT_SOZLESME: data.sozlesme,
      IMT_EVRAK_NO: data.evrakNo,
      IMT_EVRAK_TARIHI: data.evrakTarihi,
      IMT_MALIYET: data.maliyet,
    };

    AxiosInstance.post("UpdateIsEmriTipi", Body)
      .then((response) => {
        console.log("Data sent successfully:", response);
        reset();
        setIsModalVisible(false); // Sadece başarılı olursa modalı kapat
        onRefresh();
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });

    console.log({ Body });
  };

  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
    if (!isModalVisible) {
      reset();
    }
  };

  // Aşğaıdaki form elemanlarını eklemek üçün API ye gönderilme işlemi sonu

  const handleSelectedRow = (selectedRowData) => {
    // Burada, tıklanan satırın verisini işleyebilirsiniz.
    // Örneğin, form alanlarını doldurmak veya başka bir işlem yapmak için kullanabilirsiniz.
    console.log("Seçilen satır:", selectedRowData);
    setValue("secilenID", selectedRowData.key);
    setValue("isEmriTipiTanim", selectedRowData.IMT_TANIM);
    setValue("varsayilanIsEmriTipi", selectedRowData.IMT_VARSAYILAN);
    setValue("isEmriTipiRenk", selectedRowData.IMT_RENK_WEB_VERSION);
    setValue("aktifIsEmriTipi", selectedRowData.IMT_AKTIF);
    setValue("tipGroup", selectedRowData.IMT_TIP_GRUP);
    setValue("lokasyon", selectedRowData.IMT_LOKASYON);
    setValue("makine", selectedRowData.IMT_MAKINE);
    setValue("ekipman", selectedRowData.IMT_EKIPMAN);
    setValue("makineDurum", selectedRowData.IMT_MAKINE_DURUM);
    setValue("sayacDegeri", selectedRowData.IMT_SAYAC_DEGERI);
    setValue("prosedur", selectedRowData.IMT_PROSEDUR);
    setValue("isTipi", selectedRowData.IMT_IS_TIP);
    setValue("isNedeni", selectedRowData.IMT_IS_NEDEN);
    setValue("konu", selectedRowData.IMT_KONU);
    setValue("oncelik", selectedRowData.IMT_ONCELIK);
    setValue("atolye", selectedRowData.IMT_ATOLYE);
    setValue("takvim", selectedRowData.IMT_TAKVIM);
    setValue("talimat", selectedRowData.IMT_TALIMAT);
    setValue("planlananBaslangicTarihi", selectedRowData.IMT_PLAN_TARIH);
    setValue("planlananBitisTarihi", selectedRowData.IMT_PLAN_BITIS);
    setValue("masrafMerkezi", selectedRowData.IMT_MASRAF_MERKEZ);
    setValue("proje", selectedRowData.IMT_PROJE);
    setValue("referansNo", selectedRowData.IMT_REFERANS_NO);
    setValue("firma", selectedRowData.IMT_FIRMA);
    setValue("sozlesme", selectedRowData.IMT_SOZLESME);
    setValue("evrakNo", selectedRowData.IMT_EVRAK_NO);
    setValue("evrakTarihi", selectedRowData.IMT_EVRAK_TARIHI);
    setValue("maliyet", selectedRowData.IMT_MALIYET);
  };

  return (
    <FormProvider {...methods}>
      <div>
        <div style={{ display: "flex", width: "100%", justifyContent: "flex-end" }}>
          <Button
            style={{
              width: "32px",
              height: "32px",
              padding: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={handleModalToggle}>
            <PlusOutlined />
          </Button>
        </div>

        <Modal
          width="1000px"
          title="İş Emri Tipi"
          open={isModalVisible}
          onOk={methods.handleSubmit(onSubmited)}
          onCancel={handleModalToggle}>
          <div style={{ display: "flex", gap: "10px" }}>
            <MainTabs onSelectedRow={handleSelectedRow} />
            <form onSubmit={methods.handleSubmit(onSubmited)}>
              <EditTabs selectedRow={selectedRow} />
            </form>
          </div>
        </Modal>
      </div>
    </FormProvider>
  );
}
