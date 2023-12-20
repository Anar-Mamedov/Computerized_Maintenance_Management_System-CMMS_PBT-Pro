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
        marginBottom: "40px",
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
          <Text style={{ fontSize: "14px" }}>Seri No #:</Text>
          <Controller
            name="makineSeriNO"
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
          <Text style={{ fontSize: "14px" }}>Master Makine:</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              width: "300px",
            }}>
            <Controller
              name="masterMakineTanimi"
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
              name="masterMakineID"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text" // Set the type to "text" for name input
                  style={{ display: "none" }}
                />
              )}
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
          <Text style={{ fontSize: "14px" }}>Çalışma Takvimi:</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              width: "300px",
            }}>
            <Controller
              name="makineTakvimTanimi"
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
              name="makineTakvimID"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text" // Set the type to "text" for name input
                  style={{ display: "none" }}
                />
              )}
            />

            <Button onClick={handleTakvimMinusClick}> - </Button>
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
          <Text style={{ fontSize: "14px" }}>Üretici:</Text>
          <Controller
            name="uretici"
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
          <Text style={{ fontSize: "14px" }}>Üretim Yılı:</Text>
          <Controller
            name="uretimYili"
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
          <Text style={{ fontSize: "14px" }}>Garanti Bitiş Tarihi:</Text>
          <Controller
            name="makineGarantiBitisTarihi"
            control={control}
            render={({ field }) => (
              <DatePicker {...field} style={{ width: "200px" }} format="DD-MM-YYYY" placeholder="Tarih seçiniz" />
            )}
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
          <Text style={{ fontSize: "14px" }}>Duruş Birim Maliyeti:</Text>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", alignItems: "center", width: "200px" }}>
            <Controller
              name="makineDurusBirimMaliyeti"
              control={control}
              render={({ field }) => <Input {...field} style={{ width: "150px" }} />}
            />
            <Text style={{ fontSize: "12px" }}>(tl/saat)</Text>
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
          <Text style={{ fontSize: "14px" }}>Plan. Çalışma Süresi:</Text>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", alignItems: "center", width: "200px" }}>
            <Controller
              name="makinePlanCalismaSuresi"
              control={control}
              render={({ field }) => <Input {...field} style={{ width: "140px" }} />}
            />
            <Text style={{ fontSize: "12px" }}>(saat/yıl)</Text>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "column",
          border: "1px solid #80808068",
          width: "fit-content",
          padding: "5px",
          justifyContent: "flex-start",
          gap: "15px",
          alignContent: "flex-start",
          height: "fit-content",
        }}></div>
    </div>
  );
}
