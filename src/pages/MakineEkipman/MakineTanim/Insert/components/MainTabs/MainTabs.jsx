import React from "react";
import { Drawer, Typography, Button, Input, Select, DatePicker, TimePicker, Row, Col, Checkbox } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import Location from "./components/Location";
import MakineTipi from "./components/MakineTipi";
import Kategori from "./components/Kategori";
import MarkaSelect from "./components/MarkaSelect";
import ModelSelect from "./components/ModelSelect";
import MakineDurum from "./components/MakineDurum";
import MasterMakineTablo from "./components/MasterMakineTablo";
import MakineTakvimTablo from "./components/MakineTakvimTablo";
import OperatorSelect from "./components/OperatorSelect";
import MarkaEkle from "./components/MarkaEkle";

const { Text, Link } = Typography;

export default function MainTabs() {
  const { control, watch, setValue } = useFormContext();

  const handleMinusClick = () => {
    setValue("masterMakineTanimi", "");
    setValue("masterMakineID", "");
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
        marginBottom: "20px",
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
          <Text style={{ fontSize: "14px" }}>Makine Kodu:</Text>
          <Controller
            name="makineKodu"
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
          <Text style={{ fontSize: "14px" }}>Makine Tanımı:</Text>
          <Controller
            name="makineTanimi"
            control={control}
            render={({ field }) => <Input {...field} style={{ width: "300px" }} />}
          />
        </div>
        <Location />
        <MakineTipi />
        <Kategori />
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", width: "100%" }}>
          <MarkaSelect />
          <MarkaEkle />
        </div>

        <ModelSelect />
        <OperatorSelect />
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
        <MakineDurum />
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
            <MasterMakineTablo
              onSubmit={(selectedData) => {
                setValue("masterMakineTanimi", selectedData.definition);
                setValue("masterMakineID", selectedData.key);
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
            <MakineTakvimTablo
              onSubmit={(selectedData) => {
                setValue("makineTakvimTanimi", selectedData.subject);
                setValue("makineTakvimID", selectedData.key);
              }}
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
        }}>
        <Controller
          name="makineAktif"
          control={control}
          defaultValue={true} // or true if you want it checked by default
          render={({ field }) => (
            <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
              Aktif
            </Checkbox>
          )}
        />
        <Controller
          name="makineKalibrasyon"
          control={control}
          defaultValue={false} // or true if you want it checked by default
          render={({ field }) => (
            <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
              Kalibrasyon Var
            </Checkbox>
          )}
        />
        <Controller
          name="kritikMakine"
          control={control}
          defaultValue={false} // or true if you want it checked by default
          render={({ field }) => (
            <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
              Kritik Makine
            </Checkbox>
          )}
        />
        <Controller
          name="makineGucKaynagi"
          control={control}
          defaultValue={false} // or true if you want it checked by default
          render={({ field }) => (
            <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
              Güç Kaynağı
            </Checkbox>
          )}
        />
        <Controller
          name="makineIsBildirimi"
          control={control}
          defaultValue={false} // or true if you want it checked by default
          render={({ field }) => (
            <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
              İş Bildirimi
            </Checkbox>
          )}
        />
        <Controller
          name="makineYakitKullanim"
          control={control}
          defaultValue={false} // or true if you want it checked by default
          render={({ field }) => (
            <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
              Yakıt Kullanım
            </Checkbox>
          )}
        />
        <Controller
          name="makineOtonomBakim"
          control={control}
          defaultValue={false} // or true if you want it checked by default
          render={({ field }) => (
            <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
              Otonom Bakım
            </Checkbox>
          )}
        />
      </div>
    </div>
  );
}
