import React from "react";
import { Drawer, Typography, Button, Input, Select, DatePicker, TimePicker, Row, Col, Checkbox } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import MasrafMerkeziTablo from "./MasrafMerkeziTablo";
import MakineAtolyeTablo from "./MakineAtolyeTablo";
import BakimGrubu from "./BakimGrubu";
import ArizaGrubu from "./ArizaGrubu";
import ServisSaglayici from "./ServisSaglayici";
import ServisSekli from "./ServisSekli";
import TeknikSeviyesi from "./TeknikSeviyesi";
import FizikselDurumu from "./FizikselDurumu";
import MakineOncelikTablo from "./MakineOncelikTablo";
import IsletimSistemi from "./IsletimSistemi";
import Agirlik from "./Agirlik";
import Hacim from "./MakineHacim";
import Kapasite from "./MakineKapasite";
import ElektrikTuketim from "./ElektrikTuketim";
import ValfTipi from "./ValfTipi";
import ValfBoyutu from "./ValfBoyutu";
import GirisBoyutu from "./GirisBoyutu.jsx";
import CikisBoyutu from "./CikisBoyutu.jsx";
import Konnektor from "./Konnektor.jsx";
import MakineBasinc from "./MakineBasinc.jsx";
import BasincMiktar from "./BasincMiktar.jsx";

const { Text, Link } = Typography;

export default function DetayBilgi() {
  const { control, watch, setValue } = useFormContext();

  const handleMinusClick = () => {
    setValue("makineMasrafMerkeziTanim", "");
    setValue("makineMasrafMerkeziID", "");
  };
  const handleAtolyeMinusClick = () => {
    setValue("makineAtolyeTanim", "");
    setValue("makineAtolyeID", "");
  };

  const handleOncelikMinusClick = () => {
    setValue("makineOncelik", "");
    setValue("makineOncelikID", "");
  };

  const handleTakvimMinusClick = () => {
    setValue("makineTakvimTanimi", "");
    setValue("makineTakvimID", "");
  };
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        columnGap: "10px",
      }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          border: "1px solid #80808068",
          width: "430px",
          padding: "5px",
          justifyContent: "center",
          gap: "5px",
          alignContent: "flex-start",
          height: "fit-content",
        }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <Text style={{ fontSize: "14px" }}>Masraf Merkezi:</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              width: "300px",
            }}>
            <Controller
              name="makineMasrafMerkeziTanim"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text" // Set the type to "text" for name input
                  style={{ width: "215px" }}
                  disabled
                />
              )}
            />
            <Controller
              name="makineMasrafMerkeziID"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text" // Set the type to "text" for name input
                  style={{ display: "none" }}
                />
              )}
            />
            <MasrafMerkeziTablo
              onSubmit={(selectedData) => {
                setValue("makineMasrafMerkeziTanim", selectedData.age);
                setValue("makineMasrafMerkeziID", selectedData.key);
              }}
            />
            <Button onClick={handleMinusClick}> - </Button>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <Text style={{ fontSize: "14px" }}>Sorumlu Atölye:</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              width: "300px",
            }}>
            <Controller
              name="makineAtolyeTanim"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text" // Set the type to "text" for name input
                  style={{ width: "215px" }}
                  disabled
                />
              )}
            />
            <Controller
              name="makineAtolyeID"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text" // Set the type to "text" for name input
                  style={{ display: "none" }}
                />
              )}
            />
            <MakineAtolyeTablo
              onSubmit={(selectedData) => {
                setValue("makineAtolyeTanim", selectedData.subject);
                setValue("makineAtolyeID", selectedData.key);
              }}
            />
            <Button onClick={handleAtolyeMinusClick}> - </Button>
          </div>
        </div>
        <BakimGrubu />
        <ArizaGrubu />
        <ServisSaglayici />
        <ServisSekli />
        <TeknikSeviyesi />
        <FizikselDurumu />
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <Text style={{ fontSize: "14px" }}>Öncelik:</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              width: "300px",
            }}>
            <Controller
              name="makineOncelik"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text" // Set the type to "text" for name input
                  style={{ width: "215px" }}
                  disabled
                />
              )}
            />
            <Controller
              name="makineOncelikID"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text" // Set the type to "text" for name input
                  style={{ display: "none" }}
                />
              )}
            />
            <MakineOncelikTablo
              onSubmit={(selectedData) => {
                setValue("makineOncelik", selectedData.subject);
                setValue("makineOncelikID", selectedData.key);
              }}
            />
            <Button onClick={handleOncelikMinusClick}> - </Button>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <Text style={{ fontSize: "14px" }}>Risk Puanı:</Text>
          <Controller
            name="makineRiskPuani"
            control={control}
            render={({ field }) => <Input {...field} style={{ width: "300px" }} />}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          border: "1px solid #80808068",
          width: "430px",
          padding: "5px",
          justifyContent: "center",
          gap: "5px",
          alignContent: "flex-start",
          height: "fit-content",
        }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <Text style={{ fontSize: "14px" }}>Kurulum Tarihi:</Text>
          <Controller
            name="makineKurulumTarihi"
            control={control}
            render={({ field }) => (
              <DatePicker {...field} style={{ width: "200px" }} format="DD-MM-YYYY" placeholder="Tarih seçiniz" />
            )}
          />
        </div>
        <IsletimSistemi />
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <Text style={{ fontSize: "14px" }}>IP No:</Text>
          <Controller
            name="makineIPNo"
            control={control}
            render={({ field }) => <Input {...field} style={{ width: "300px" }} />}
          />
        </div>
        <Agirlik />
        <Hacim />
        <Kapasite />
        <ElektrikTuketim />

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <Text style={{ fontSize: "14px" }}>Voltaj/Güç (Amper)</Text>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            <Controller
              name="makineVoltaj"
              control={control}
              render={({ field }) => <Input {...field} style={{ width: "145px" }} />}
            />
            <Controller
              name="makineGuc"
              control={control}
              render={({ field }) => <Input {...field} style={{ width: "145px" }} />}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <Text style={{ fontSize: "14px" }}>Faz:</Text>
          <Controller
            name="makineFaz"
            control={control}
            render={({ field }) => <Input {...field} style={{ width: "300px" }} />}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          border: "1px solid #80808068",
          width: "430px",
          padding: "5px",
          justifyContent: "center",
          gap: "5px",
          alignContent: "flex-start",
          height: "fit-content",
        }}>
        <ValfTipi />
        <ValfBoyutu />
        <GirisBoyutu />
        <CikisBoyutu />
        <Konnektor />
        <MakineBasinc />
        <BasincMiktar />
        <div
          style={{
          display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <Text style={{ fontSize: "14px" }}>Devir Sayısı:</Text>
          <Controller
            name="makineDevirSayisi"
            control={control}
            render={({ field }) => <Input {...field} style={{ width: "300px" }} />}
          />
        </div>
        <div
          style={{
          display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <Text style={{ fontSize: "14px" }}>Motor Gücü (bg):</Text>
          <Controller
            name="makineMotorGucu"
            control={control}
            render={({ field }) => <Input {...field} style={{ width: "300px" }} />}
          />
        </div>
        <div
          style={{
          display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <Text style={{ fontSize: "14px" }}>Silindir Sayısı:</Text>
          <Controller
            name="makineSilindirSayisi"
            control={control}
            render={({ field }) => <Input {...field} style={{ width: "300px" }} />}
          />
        </div>
      </div>
    </div>
  );
}
