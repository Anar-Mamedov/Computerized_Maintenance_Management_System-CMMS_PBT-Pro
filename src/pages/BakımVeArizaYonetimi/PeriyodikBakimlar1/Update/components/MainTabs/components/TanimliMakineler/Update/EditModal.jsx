import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, message } from "antd";
import AxiosInstance from "../../../../../../../../../api/http";
import { Controller, useForm, FormProvider } from "react-hook-form";
import dayjs from "dayjs";
import PeryotBakimBilgileriEkle from "./MainTabs/PeryotBakimBilgileriEkle.jsx";

export default function EditModal({ selectedRow, isModalVisible, onModalClose, onRefresh, activeTab, tarihSayacBakim }) {
  const [tabIndex, setTabIndex] = useState(0);
  const methods = useForm({
    defaultValues: {
      siraNo: "",
      secilenID: "",
      isTanimi: "",
      aciklama: "",
      // Add other default values here
    },
  });

  const { setValue, reset, handleSubmit } = methods;

  useEffect(() => {
    if (tarihSayacBakim === "b") {
      setTabIndex(0);
    } else if (tarihSayacBakim === "a") {
      if (activeTab === "SAYAC") {
        setTabIndex(1);
      } else {
        setTabIndex(2);
      }
    }
  }, [tarihSayacBakim, activeTab]);

  // Aşğaıdaki form elemanlarını eklemek üçün API ye gönderilme işlemi

  const onSubmited = (data) => {
    const Body = {
      TB_IS_TANIM_KONROLLIST_ID: data.secilenID,
      ISK_SIRANO: data.siraNo,
      ISK_TANIM: data.isTanimi,
      ISK_ACIKLAMA: data.aciklama,
    };

    AxiosInstance.post("UpdateIsTanimKontrolList", Body)
      .then((response) => {
        console.log("Data sent successfully:", response.data);

        if (response.status_code === 200 || response.status_code === 201) {
          message.success("Ekleme Başarılı.");
          reset();
          onModalClose(); // Modal'ı kapat
          onRefresh(); // Tabloyu yenile
        } else if (response.status_code === 401) {
          message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
        } else {
          message.error("Ekleme Başarısız.");
        }
      })
      .catch((error) => {
        // Handle errors here, e.g.:
        console.error("Error sending data:", error);
        message.error("Başarısız Olundu.");
      });

    console.log({ Body });
  };

  const handleModalOk = () => {
    handleSubmit(onSubmited)();
    onModalClose();
    onRefresh();
  };

  // Aşğaıdaki form elemanlarını eklemek üçün API ye gönderilme işlemi sonu

  useEffect(() => {
    if (isModalVisible && selectedRow) {
      // console.log("selectedRow", selectedRow);
      // startTransition(() => {
      // Object.keys(selectedRow).forEach((key) => {
      //   console.log(key, selectedRow[key]);
      //   setValue(key, selectedRow[key]);
      setValue("makineID", selectedRow.key);
      setValue("makineKodu", selectedRow.MKN_KOD);
      setValue("makineTanimi", selectedRow.MKN_TANIM);
      setValue("makineLokasyon", selectedRow.MKN_LOKASYON);
      setValue("makineTipi", selectedRow.MKN_TIP);
      setValue(
        "sonUygulamaTarihi",
        selectedRow.PBM_SON_UYGULAMA_TARIH ? (dayjs(selectedRow.PBM_SON_UYGULAMA_TARIH).isValid() ? dayjs(selectedRow.PBM_SON_UYGULAMA_TARIH) : null) : null
      );
      setValue("hedefTarih", selectedRow.PBM_HEDEF_TARIH ? (dayjs(selectedRow.PBM_HEDEF_TARIH).isValid() ? dayjs(selectedRow.PBM_HEDEF_TARIH) : null) : null);
      setValue("harırlatmaGunOnce", selectedRow.PBM_HATIRLAT_TARIH);
      // setValue("sayac", selectedRow.PBM_HATIRLAT_TARIH);
      setValue("sonUygulamaSayac", selectedRow.PBM_SON_UYGULAMA_SAYAC);
      setValue("hedefSayac", selectedRow.PBM_HEDEF_SAYAC);
      setValue("harırlatmaSayiOnce", selectedRow.PBM_HATIRLAT_SAYAC);
      // add more fields as needed

      // });
      // });
    }
  }, [selectedRow, isModalVisible, setValue]);

  console.log("selectedRow", selectedRow);

  useEffect(() => {
    if (!isModalVisible) {
      reset();
    }
  }, [isModalVisible, reset]);

  return (
    <FormProvider {...methods}>
      <div>
        <Modal width="500px" title="Tanımlı Makine Listesi Güncelle" open={isModalVisible} onOk={handleModalOk} onCancel={onModalClose}>
          <PeryotBakimBilgileriEkle tarihSayacBakim={tarihSayacBakim} activeTab={activeTab} />
        </Modal>
      </div>
    </FormProvider>
  );
}
