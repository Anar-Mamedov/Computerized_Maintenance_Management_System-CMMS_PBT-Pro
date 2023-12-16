import tr_TR from "antd/es/locale/tr_TR";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Space, ConfigProvider, Modal } from "antd";
import React, { useEffect, useState } from "react";
import MainTabs from "./components/MainTabs/MainTabs";
import secondTabs from "./components/secondTabs/secondTabs";
import { useForm, Controller, useFormContext, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import AxiosInstance from "../../../api/http";
import Footer from "../../DashboardAnalytics2/Footer";

export default function CreateDrawer({ onRefresh }) {
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    Modal.confirm({
      title: "İptal etmek istediğinden emin misin?",
      content: "Kaydedilmemiş değişiklikler kaybolacaktır.",
      okText: "Evet",
      cancelText: "Hayır",
      onOk: () => {
        setOpen(false);
      },
      onCancel: () => {
        // Do nothing, continue from where the user left off
      },
    });
  };

  // back-end'e gönderilecek veriler

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
      time: "",
      linked_work_order: "",
      work_order_type: "",
      status: "",
      procedureSelectedId: "",
      // Tipi: "",
      // Nedeni: "",
      prioritySelectedId: "",
      workshopSelectedId: "",
      calendarTableSelectedId: "",
      instructionSelectedId: "",
      aciklama: "",
      PlannedCommencementDate: "",
      PlannedCommencementTime: "",
      PlannedCompletionDate: "",
      PlannedCompletionTime: "",
      StartedDate: "",
      StartedTime: "",
      FinishedDate: "",
      FinishedTime: "",
      WorkingTimeHours: "",
      WorkingTimeMinutes: "",
      costcenterSelectedIdDetailsTab: "",
      project: "",
      // ReferansNo: "",
      Tamamlama: "",
      company: "",
      contractId: "",
      // EvrakNo: "",
      // Maliyet: "",
      custom_field_1: "",
      custom_field_2: "",
      custom_field_3: "",
      custom_field_4: "",
      custom_field_5: "",
      custom_field_6: "",
      custom_field_7: "",
      custom_field_8: "",
      custom_field_9: "",
      custom_field_10: "",
      custom_field_11: "",
      custom_field_12: "",
      custom_field_13: "",
      custom_field_14: "",
      custom_field_15: "",
      custom_field_16: "",
      custom_field_17: "",
      custom_field_18: "",
      custom_field_19: "",
      custom_field_20: "",
      realisedMaterialCost: "",
      realisedLabourCost: "",
      realisedExternalServiceCost: "",
      realisedGeneralExpenses: "",
      realisedDiscount: "",
      realisedKDV: "",
      realisedTotalCost: "",
      logisticsDuration: "",
      travellingDuration: "",
      approvalDuration: "",
      waitingDuration: "",
      otherDuration: "",
      interventionDuration: "",
      workingDuration: "",
      totalWorkTime: "",
      IsEmriPersonelList: [],
      IsEmriDurusList: [],
      IsEmriAracGerecList: [],
      IsEmriOlcumDegeriList: [],
      IsEmriKontrolList: [],
      IsEmriMalzemeList: [],
    },
  });

  const formatDateWithDayjs = (dateString) => {
    const formattedDate = dayjs(dateString);
    return formattedDate.isValid() ? formattedDate.format("YYYY-MM-DD") : "";
  };

  const formatTimeWithDayjs = (timeObj) => {
    const formattedTime = dayjs(timeObj);
    return formattedTime.isValid() ? formattedTime.format("HH:mm") : "";
  };

  const { setValue, reset } = methods;

  //* export
  const onSubmit = (data) => {
    const Body = {
      ISM_ISEMRI_NO: data.work_order_no,
      ISM_DUZENLEME_TARIH: formatDateWithDayjs(data.date),
      ISM_DUZENLEME_SAAT: formatTimeWithDayjs(data.time),
      machine_type: data.machine_type,
      category: data.category,
      brand: data.brand,
      ISM_LOKASYON_ID: data.location,
      ISM_MAKINE_ID: data.machine,
      warranty_end: data.warranty_end,
      ISM_MAKINE_DURUM_KOD_ID: data.machine_status,
      plkLocation: data.plkLocation,
      plkMachine: data.plkMachine,
      plkWarranty_end: data.plkWarranty_end,
      ISM_EKIPMAN_ID: data.equipment,
      ISM_SAYAC_DEGER: data.counter_value,
      ISM_BAGLI_ISEMRI_ID: data.linked_work_order,
      ISM_TIP_ID: data.work_order_type.value,
      ISM_DURUM_KOD_ID: data.status,
      ISM_REF_ID: data.procedureSelectedId,
      ISM_TIP_KOD_ID: data.Tipi,
      ISM_NEDEN_KOD_ID: data.Nedeni,
      ISM_ONCELIK_ID: data.prioritySelectedId,
      ISM_ATOLYE_ID: data.workshopSelectedId,
      ISM_TAKVIM_ID: data.calendarTableSelectedId,
      ISM_TALIMAT_ID: data.instructionSelectedId,
      ISM_ACIKLAMA: data.aciklama,
      ISM_PLAN_BASLAMA_TARIH: formatDateWithDayjs(data.PlannedCommencementDate),
      ISM_PLAN_BASLAMA_SAAT: formatTimeWithDayjs(data.PlannedCommencementTime),
      ISM_PLAN_BITIS_TARIH: formatDateWithDayjs(data.PlannedCompletionDate),
      ISM_PLAN_BITIS_SAAT: formatTimeWithDayjs(data.PlannedCompletionTime),
      ISM_BASLAMA_TARIH: formatDateWithDayjs(data.StartedDate),
      ISM_BASLAMA_SAAT: formatTimeWithDayjs(data.StartedTime),
      ISM_BITIS_TARIH: formatDateWithDayjs(data.FinishedDate),
      ISM_BITIS_SAAT: formatTimeWithDayjs(data.FinishedTime),
      ISM_SURE_CALISMA: data.WorkingTimeHours * 60 + data.WorkingTimeMinutes,
      ISM_MASRAF_MERKEZ_ID: data.costcenterSelectedIdDetailsTab,
      ISM_PROJE_ID: data.project,
      ISM_REFERANS_NO: data.ReferansNo,
      ISM_TAMAMLANMA_ORAN: data.Tamamlama === "" ? 0 : data.Tamamlama,
      ISM_FIRMA_ID: data.company,
      ISM_FIRMA_SOZLESME_ID: data.contractId,
      ISM_EVRAK_NO: data.EvrakNo,
      ISM_EVRAK_TARIHI: formatDateWithDayjs(data.EvrakTarihi),
      // ISM_MALIYET_KDV: data.Maliyet,
      ISM_GARANTI_KAPSAMINDA: data.MaliyetKapsaminda,
      ISM_KONU: data.Konu,
      ISM_OZEL_ALAN_1: data.custom_field_1,
      ISM_OZEL_ALAN_2: data.custom_field_2,
      ISM_OZEL_ALAN_3: data.custom_field_3,
      ISM_OZEL_ALAN_4: data.custom_field_4,
      ISM_OZEL_ALAN_5: data.custom_field_5,
      ISM_OZEL_ALAN_6: data.custom_field_6,
      ISM_OZEL_ALAN_7: data.custom_field_7,
      ISM_OZEL_ALAN_8: data.custom_field_8,
      ISM_OZEL_ALAN_9: data.custom_field_9,
      ISM_OZEL_ALAN_10: data.custom_field_10,
      ISM_OZEL_ALAN_11_KOD_ID: data.custom_field_11,
      ISM_OZEL_ALAN_12_KOD_ID: data.custom_field_12,
      ISM_OZEL_ALAN_13_KOD_ID: data.custom_field_13,
      ISM_OZEL_ALAN_14_KOD_ID: data.custom_field_14,
      ISM_OZEL_ALAN_15_KOD_ID: data.custom_field_15,
      ISM_OZEL_ALAN_16: data.custom_field_16,
      ISM_OZEL_ALAN_17: data.custom_field_17,
      ISM_OZEL_ALAN_18: data.custom_field_18,
      ISM_OZEL_ALAN_19: data.custom_field_19,
      ISM_OZEL_ALAN_20: data.custom_field_20,
      ISM_MALIYET_MLZ: data.realisedMaterialCost,
      ISM_MALIYET_PERSONEL: data.realisedLabourCost,
      ISM_MALIYET_DISSERVIS: data.realisedExternalServiceCost,
      ISM_MALIYET_DIGER: data.realisedGeneralExpenses,
      ISM_MALIYET_INDIRIM: data.realisedDiscount,
      ISM_MALIYET_KDV: data.realisedKDV,
      ISM_MALIYET_TOPLAM: data.realisedTotalCost,
      ISM_SURE_MUDAHALE_LOJISTIK: data.logisticsDuration,
      ISM_SURE_MUDAHALE_SEYAHAT: data.travellingDuration,
      ISM_SURE_MUDAHALE_ONAY: data.approvalDuration,
      ISM_SURE_BEKLEME: data.waitingDuration,
      ISM_SURE_MUDAHALE_DIGER: data.otherDuration,
      ISM_SURE_PLAN_MUDAHALE: data.interventionDuration,
      ISM_SURE_PLAN_CALISMA: data.workingDuration,
      ISM_SURE_TOPLAM: data.totalWorkTime,

      IsEmriPersonelList: data.IsEmriPersonelList.map((item) => ({
        IDK_REF_ID: item.key,
        IDK_SURE: item.workingtime,
        IDK_SAAT_UCRETI: item.hourlyrate,
        IDK_MALIYET: item.cost,
        IDK_MASRAF_MERKEZI_ID: item.costCenterId,
        IDK_ACIKLAMA: item.customdescription,
        IDK_FAZLA_MESAI_VAR: item.overtime,
        IDK_FAZLA_MESAI_SURE: item.workinghours,
        IDK_FAZLA_MESAI_SAAT_UCRETI: item.overtimepay,
        IDK_VARDIYA: item.shiftId,
      })),
      IsEmriDurusList: data.IsEmriDurusList.map((item) => ({
        MKD_MAKINE_ID: item.machine,
        MKD_BASLAMA_TARIH: formatDateWithDayjs(item.durusStartedDate),
        MKD_BASLAMA_SAAT: formatTimeWithDayjs(item.durusStartedTime),
        MKD_BITIS_TARIH: formatDateWithDayjs(item.durusFinishedDate),
        MKD_BITIS_SAAT: formatTimeWithDayjs(item.durusFinishedTime),
        MKD_SURE: item.durusWorkingTimeHours * 60 + item.durusWorkingTimeMinutes,
        MKD_SAAT_MALIYET: item.downtimeCost,
        MKD_TOPLAM_MALIYET: item.durusTotalCost,
        // MKD_NEDEN_KOD_ID: item.,
        MKD_PLANLI: item.plannedDowntime,
        MKD_OLUSTURAN_ID: 24,
        // MKD_PROJE_ID: item.,
        MKD_LOKASYON_ID: item.location,
        MKD_ACIKLAMA: item.DurusStallDescription,
      })),
      IsEmriAracGerecList: data.IsEmriAracGerecList.map((item) => ({
        IAG_ARAC_GEREC_ID: item.key,
        IAG_OLUSTURAN_ID: "24",
        IAG_DEGISTIREN_ID: "24",
      })),

      IsEmriOlcumDegeriList: data.IsEmriOlcumDegeriList.map((item) => ({
        IDO_SIRANO: item.olcumSeriesNo,
        IDO_TANIM: item.olcumDescription,
        IDO_BIRIM_KOD_ID: item.olcumUnit,
        // IDO_FORMAT:item.,
        IDO_HEDEF_DEGER: item.olcumTargetValue,
        // IDO_MIN_MAX_DEGER: item.,
        IDO_MIN_DEGER: item.olcumMinValue,
        IDO_MAX_DEGER: item.olcumMaxValue,
        IDO_OLCUM_DEGER: item.olcumMeasurementvalue,
        IDO_FARK: item.olcumDifference,
        IDO_DURUM: item.olcumStatus,
        IDO_TARIH: formatDateWithDayjs(item.date),
        IDO_SAAT: formatTimeWithDayjs(item.time),
        IDO_OLUSTURAN_ID: 24,
        IDO_DEGISTIREN_ID: 24,
        IDO_REF_ID: -1,
      })),

      IsEmriKontrolListesi: data.IsEmriKontrolList.map((item) => ({
        DKN_SIRANO: item.sequence,
        DKN_YAPILDI: item.done,
        DKN_TANIM: item.type,
        DKN_OLUSTURAN_ID: 24,
        DKN_MALIYET: item.cost,
        DKN_YAPILDI_PERSONEL_ID: item.personelSelectedId,
        DKN_YAPILDI_ATOLYE_ID: item.workshopSelectedId,
        DKN_YAPILDI_SURE: item.duration,
        DKN_ACIKLAMA: item.description,
        DKN_YAPILDI_KOD_ID: -1,
        DKN_REF_ID: -1,
        DKN_YAPILDI_TARIH: formatDateWithDayjs(item.startDate),
        DKN_YAPILDI_SAAT: formatTimeWithDayjs(item.startTime),
        DKN_BITIS_TARIH: formatDateWithDayjs(item.endDate),
        DKN_BITIS_SAAT: formatTimeWithDayjs(item.endTime),
        DKN_YAPILDI_MESAI_KOD_ID: item.shiftId,
      })),
      IsEmriMalzemeList: data.IsEmriMalzemeList.map((item) => ({
        // IDM_TARIH: "2023-11-24",
        // IDM_SAAT: "11:11",
        IDM_STOK_ID: item.key,
        IDM_DEPO_ID: item.warehouseId,
        IDM_BIRIM_KOD_ID: item.STK_BIRIM_KOD_ID,
        IDM_STOK_TIP_KOD_ID: "37",
        IDM_STOK_DUS: false,
        IDM_STOK_TANIM: item.subject,
        IDM_BIRIM_FIYAT: item.unitPrice,
        IDM_MIKTAR: "5",
        IDM_TUTAR: "10",
        IDM_OLUSTURAN_ID: "24",
        IDM_REF_ID: "-1",
        IDM_STOK_KULLANIM_SEKLI: "0",
        IDM_MALZEME_STOKTAN: item.stock,
        IDM_ALTERNATIF_STOK_ID: "-1",
        IDM_MARKA_KOD_ID: item.STK_MARKA_KOD_ID,
      })),
      // add more fields as needed
    };

    // AxiosInstance.post("/api/endpoint", { Body }).then((response) => {
    // handle response
    // });

    AxiosInstance.post("IsEmri?ID=2&isWeb=true", Body)
      .then((response) => {
        // Handle successful response here, e.g.:
        console.log("Data sent successfully:", response.data);
        setOpen(false);
        onRefresh();
        reset();
      })
      .catch((error) => {
        // Handle errors here, e.g.:
        console.error("Error sending data:", error);
      });
    console.log({ Body });
  };

  // İş Emri No değerini her drawer açıldığında güncellemek için
  useEffect(() => {
    if (open) {
      const now = dayjs(); // Use dayjs for date and time
      setValue("date", now); // Set current date
      setValue("time", now); // Set current time

      AxiosInstance.get("IsEmriKodGetir") // Replace with your actual API endpoint
        .then((response) => {
          // Assuming the response contains the new work order number in 'response.Tanim'
          setValue("work_order_no", response.Tanim);
        })
        .catch((error) => {
          console.error("Error fetching new work order number:", error);
        });
    }
  }, [open, setValue]);

  // İş Emri No değerini her drawer açıldığında güncellemek için son

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <ConfigProvider locale={tr_TR}>
          <Button
            type="primary"
            onClick={showDrawer}
            style={{
              display: "flex",
              alignItems: "center",
            }}>
            <PlusOutlined />
            Ekle
          </Button>
          <Drawer
            width="1660px"
            title="Yeni iş emri ekle"
            placement={"right"}
            onClose={onClose}
            open={open}
            extra={
              <Space>
                <Button onClick={onClose}>İptal</Button>
                <Button
                  type="submit"
                  onClick={handleClick}
                  style={{
                    backgroundColor: "#2bc770",
                    borderColor: "#2bc770",
                    color: "#ffffff",
                  }}>
                  Kaydet
                </Button>
              </Space>
            }>
            <MainTabs />
            <Footer />
            {/* <secondTabs /> */}
          </Drawer>
        </ConfigProvider>
      </form>
    </FormProvider>
  );
}
