import tr_TR from "antd/es/locale/tr_TR";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Space, ConfigProvider, Modal } from "antd";
import React, { useEffect, useState } from "react";
import MainTabs from "./components/MainTabs/MainTabs";
import secondTabs from "./components/secondTabs/secondTabs";
import { useForm, Controller, useFormContext, FormProvider, set } from "react-hook-form";
import dayjs from "dayjs";
import AxiosInstance from "../../../../api/http";
import Footer from "../Footer";

export default function EditDrawer({ selectedRow, onDrawerClose, drawerVisible, onRefresh }) {
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
        onDrawerClose(); // Close the drawer
        onRefresh();
        reset();
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
      Nedeni: {
        label: "",
        value: "",
      },
      // NedeniID: "",
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
      locationID: "",
      equipmentID: "",
      machine: "",
      machineId: "",
      machine_status: "",
      machine_type: "",
      warranty_end: "",
      work_order_no: "",
      plkLocation: "",
      plkMachine: "",
      plkWarranty_end: "",
      time: "",
      linked_work_order: "",
      linked_work_orderID: "",
      work_order_type: {
        label: "",
        value: "",
      },
      status: "",
      statusID: "",
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
    return formattedTime.isValid() ? formattedTime.format("HH:mm:ss") : "";
  };

  const { setValue, reset } = methods;

  //* export
  const onSubmit = (data) => {
    const Body = {
      TB_ISEMRI_ID: data.key,
      ISM_ISEMRI_NO: data.work_order_no,
      ISM_DUZENLEME_TARIH: formatDateWithDayjs(data.date),
      ISM_DUZENLEME_SAAT: formatTimeWithDayjs(data.time),
      machine_type: data.machine_type,
      category: data.category,
      brand: data.brand,
      ISM_LOKASYON_ID: data.locationID,
      ISM_MAKINE_ID: data.machineId,
      warranty_end: data.warranty_end,
      ISM_MAKINE_DURUM_KOD_ID: data.machineStatusID,
      plkLocation: data.plkLocation,
      plkMachine: data.plkMachine,
      plkWarranty_end: data.plkWarranty_end,
      ISM_EKIPMAN_ID: data.equipmentID,
      ISM_SAYAC_DEGER: data.counter_value,
      ISM_BAGLI_ISEMRI_ID: data.linked_work_orderID,
      ISM_TIP_ID: data.work_order_type.value,
      ISM_DURUM_KOD_ID: data.statusID,
      ISM_REF_ID: data.procedureSelectedId,
      ISM_TIP_KOD_ID: data.TipiID,
      ISM_NEDEN_KOD_ID: data.Nedeni.value,
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
      ISM_MASRAF_MERKEZI_ID: data.costcenterSelectedIdDetailsTab,
      ISM_PROJE_ID: data.projectID,
      ISM_REFERANS_NO: data.ReferansNo,
      ISM_TAMAMLANMA_ORAN: data.Tamamlama === "" ? 0 : data.Tamamlama,
      ISM_FIRMA_ID: data.companyID,
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

    AxiosInstance.post("UpdateIsEmri", Body)
      .then((response) => {
        // Handle successful response here, e.g.:
        console.log("Data sent successfully:", response.data);
        onDrawerClose(); // Close the drawer
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
  // useEffect(() => {
  //   if (open) {
  //     AxiosInstance.get("IsEmriKodGetir") // Replace with your actual API endpoint
  //       .then((response) => {
  //         // Assuming the response contains the new work order number in 'response.Tanim'
  //         setValue("work_order_no", response.Tanim);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching new work order number:", error);
  //       });
  //   }
  // }, [open, setValue]);

  // İş Emri No değerini her drawer açıldığında güncellemek için son

  useEffect(() => {
    if (drawerVisible && selectedRow) {
      Object.keys(selectedRow).forEach((key) => {
        // console.log(key, selectedRow[key]);
        setValue(key, selectedRow[key]);
        setValue("isEmriSelectedId", selectedRow.key);
        setValue("work_order_no", selectedRow.number);
        setValue(
          "date",
          selectedRow.editDate && dayjs(selectedRow.editDate).isValid() ? dayjs(selectedRow.editDate) : ""
        );
        setValue(
          "time",
          selectedRow.editTime && dayjs(selectedRow.editTime, "HH:mm:ss").isValid()
            ? dayjs(selectedRow.editTime, "HH:mm:ss")
            : null
        );

        // setValue("work_order_type", selectedRow.type);
        setValue("work_order_type", {
          value: selectedRow.ISM_TIP_ID,
          label: selectedRow.type,
        });
        setValue("statusInput", selectedRow.status);
        setValue("linked_work_orderID", selectedRow.linked_work_orderID);
        setValue("linked_work_order", selectedRow.linked_work_order);
        setValue("statusID", selectedRow.statusID);
        setValue("machine_type", selectedRow.machine_type);
        setValue("category", selectedRow.category);
        setValue("brand", selectedRow.brand);
        setValue("location", selectedRow.location);
        setValue("locationID", selectedRow.locationID);
        setValue("equipmentID", selectedRow.equipmentID);
        setValue("plkLocation", selectedRow.fullLocation);
        setValue("machine", selectedRow.machine);
        setValue("machineId", selectedRow.machineId);
        setValue("machineDefinition", selectedRow.machineDescription);
        setValue("equipment", selectedRow.equipment);
        setValue("plkEquipment", selectedRow.equipment);
        setValue("warranty_end", selectedRow.warranty_end);
        setValue("machine_status", selectedRow.machineStatus);
        setValue("machineStatusID", selectedRow.machineStatusID);
        setValue("counter_value", selectedRow.currentCounterValue);
        setValue("Konu", selectedRow.subject);
        setValue("Tipi", selectedRow.jobType);
        setValue("TipiID", selectedRow.TipiID);
        setValue("procedure", selectedRow.procedure);
        setValue("procedureSelectedId", selectedRow.procedureSelectedId);

        setValue("Nedeni", {
          value: selectedRow.jobReasonId,
          label: selectedRow.jobReason,
        });

        // setValue("Nedeni", selectedRow.jobReason);
        // setValue("NedeniID", selectedRow.jobReasonId);
        setValue("priority", selectedRow.priorityIcon);
        setValue("prioritySelectedId", selectedRow.prioritySelectedId);
        setValue("workshop", selectedRow.workshop);
        setValue("workshopSelectedId", selectedRow.workshopID);
        setValue("calendarTable", selectedRow.calendar);
        setValue("calendarTableSelectedId", selectedRow.ISM_TAKVIM_ID);
        setValue("costcenter", selectedRow.spending);
        setValue("costcenterSelectedIdDetailsTab", selectedRow.ISM_MASRAF_MERKEZ_ID);
        setValue("companyDetailsTab", selectedRow.company);
        setValue("companyID", selectedRow.companyID);
        setValue("instruction", selectedRow.instruction);
        setValue("instructionSelectedId", selectedRow.instructionID);
        setValue("Tamamlama", selectedRow.completion);
        setValue("MaliyetKapsaminda", selectedRow.warranty);
        setValue("project", selectedRow.ISM_PROJE_KOD);
        setValue("projectID", selectedRow.ISM_PROJE_ID);
        setValue("contract", selectedRow.ISM_SOZLESME_TANIM);
        setValue("contractId", selectedRow.ISM_FIRMA_SOZLESME_ID);
        setValue("EvrakNo", selectedRow.ISM_EVRAK_NO);
        setValue("ReferansNo", selectedRow.ISM_REFERANS_NO);

        setValue(
          "EvrakTarihi",
          selectedRow.ISM_EVRAK_TARIHI && dayjs(selectedRow.ISM_EVRAK_TARIHI).isValid()
            ? dayjs(selectedRow.ISM_EVRAK_TARIHI)
            : ""
        );
        setValue(
          "PlannedCommencementDate",
          selectedRow.plannedStartDate && dayjs(selectedRow.plannedStartDate).isValid()
            ? dayjs(selectedRow.plannedStartDate)
            : ""
        );
        setValue(
          "PlannedCommencementTime",
          selectedRow.plannedStartTime && dayjs(selectedRow.plannedStartTime, "HH:mm:ss").isValid()
            ? dayjs(selectedRow.plannedStartTime, "HH:mm:ss")
            : null
        );

        setValue(
          "PlannedCompletionDate",
          selectedRow.plannedEndDate && dayjs(selectedRow.plannedEndDate).isValid()
            ? dayjs(selectedRow.plannedEndDate)
            : ""
        );

        setValue(
          "PlannedCompletionTime",
          selectedRow.plannedEndTime && dayjs(selectedRow.plannedEndTime, "HH:mm:ss").isValid()
            ? dayjs(selectedRow.plannedEndTime, "HH:mm:ss")
            : null
        );

        setValue(
          "StartedDate",
          selectedRow.startdate && dayjs(selectedRow.startdate).isValid() ? dayjs(selectedRow.startdate) : ""
        );
        setValue(
          "StartedTime",
          selectedRow.startTime && dayjs(selectedRow.startTime, "HH:mm:ss").isValid()
            ? dayjs(selectedRow.startTime, "HH:mm:ss")
            : null
        );
        setValue(
          "FinishedDate",
          selectedRow.enddate && dayjs(selectedRow.enddate).isValid() ? dayjs(selectedRow.enddate) : ""
        );
        setValue(
          "FinishedTime",
          selectedRow.endTime && dayjs(selectedRow.endTime, "HH:mm:ss").isValid()
            ? dayjs(selectedRow.endTime, "HH:mm:ss")
            : null
        );
        // API'den gelen jobTime değerini varsayalım
        const jobTime = selectedRow.jobTime; // Örneğin, 862 dakika

        // Saat ve dakikayı hesapla
        const hours = Math.floor(jobTime / 60);
        const minutes = jobTime % 60;

        // React Hook Form'un setValue fonksiyonu ile değerleri ayarla
        setValue("WorkingTimeHours", hours);
        setValue("WorkingTimeMinutes", minutes);
        //süre bilgileri tabı
        setValue("logisticsDuration", selectedRow.logisticsDuration);
        setValue("travellingDuration", selectedRow.travellingDuration);
        setValue("approvalDuration", selectedRow.approvalDuration);
        setValue("waitingDuration", selectedRow.waitingDuration);
        setValue("otherDuration", selectedRow.otherDuration);
        setValue("interventionDuration", selectedRow.interventionDuration);
        setValue("workingDuration", selectedRow.workingDuration);
        setValue("totalWorkTime", selectedRow.totalWorkTime);
        // Maliyetler tabı
        setValue("realisedMaterialCost", selectedRow.realisedMaterialCost);
        setValue("realisedLabourCost", selectedRow.realisedLabourCost);
        setValue("realisedExternalServiceCost", selectedRow.realisedExternalServiceCost);
        setValue("realisedGeneralExpenses", selectedRow.realisedGeneralExpenses);
        setValue("realisedDiscount", selectedRow.realisedDiscount);
        setValue("realisedKDV", selectedRow.realisedKDV);
        setValue("realisedTotalCost", selectedRow.realisedTotalCost);
        // özel alanlar tabı
        setValue("custom_field_1", selectedRow.temperature);
        setValue("custom_field_2", selectedRow.weight);
        setValue("custom_field_3", selectedRow.invoiceStatus1);
        setValue("custom_field_4", selectedRow.specialArea4);
        setValue("custom_field_5", selectedRow.specialArea5);
        setValue("custom_field_6", selectedRow.specialArea6);
        setValue("custom_field_7", selectedRow.specialArea7);
        setValue("custom_field_8", selectedRow.specialArea8);
        setValue("custom_field_9", selectedRow.specialArea9);
        setValue("custom_field_10", selectedRow.specialArea10);
        setValue("custom_field_11", selectedRow.invoiceStatus2);
        setValue("custom_field_12", selectedRow.specialArea12);
        setValue("custom_field_13", selectedRow.specialArea13);
        setValue("custom_field_14", selectedRow.specialArea14);
        setValue("custom_field_15", selectedRow.specialArea15);
        setValue("custom_field_16", selectedRow.specialArea16);
        setValue("custom_field_17", selectedRow.specialArea17);
        setValue("custom_field_18", selectedRow.specialArea18);
        setValue("custom_field_19", selectedRow.specialArea19);
        setValue("custom_field_20", selectedRow.specialArea20);
      });
    }
  }, [selectedRow, setValue, drawerVisible]);

  useEffect(() => {
    if (!drawerVisible) {
      reset(); // Drawer kapandığında formu sıfırla
    }
  }, [drawerVisible, reset]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <ConfigProvider locale={tr_TR}>
          {/* <Button
            type="primary"
            onClick={showDrawer}
            style={{
              display: "flex",
              alignItems: "center",
            }}>
            <PlusOutlined />
            Ekle
          </Button> */}
          <Drawer
            width="1660px"
            title="Düzenleme İş Emri"
            placement={"right"}
            onClose={onDrawerClose}
            open={drawerVisible}
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
                  Güncelle
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
