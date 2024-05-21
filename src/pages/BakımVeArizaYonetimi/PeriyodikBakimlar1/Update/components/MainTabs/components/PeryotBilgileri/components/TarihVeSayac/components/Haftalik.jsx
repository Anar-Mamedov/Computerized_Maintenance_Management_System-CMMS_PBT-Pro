import React, { useEffect } from "react";
import { InputNumber, Typography, Checkbox } from "antd";
import { Controller, useFormContext } from "react-hook-form";

const { Text } = Typography;

export default function Haftalik(props) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const gunler = {
    pazartesi: "01",
    sali: "02",
    carsamba: "03",
    persembe: "04",
    cuma: "05",
    cumartesi: "06",
    pazar: "07",
  };

  const gelenDeger = watch("haftaninGunleri");

  useEffect(() => {
    for (let i = 0; i < gelenDeger.length; i += 2) {
      const gunKodu = gelenDeger.substring(i, i + 2);
      const gunAdi = Object.keys(gunler).find((key) => gunler[key] === gunKodu);
      if (gunAdi) {
        setValue(gunAdi, true);
      }
    }
  }, [gelenDeger, setValue]);

  useEffect(() => {
    const seciliGunler = Object.keys(gunler).filter((gun) => watch(gun));
    const gunKodlari = seciliGunler.map((gun) => gunler[gun]).join("");
    if (gunKodlari !== watch("haftaninGunleri")) {
      setValue("haftaninGunleri", gunKodlari);
    }
  }, [watch, setValue, gunler]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div>
        <Text>Her </Text>
        <Controller
          name="haftalik"
          control={control}
          render={({ field }) => (
            <InputNumber {...field} min={0} style={{ width: "70px" }} />
          )}
        />
        <Text> haftada bir</Text>
      </div>
      <div>
        <Text style={{ textDecoration: "underline" }}>
          Bakımın Gerçekleşeceği Günler
        </Text>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr 1fr 1fr",
          gap: "10px",
          gridAutoFlow: "column",
        }}
      >
        <Controller
          name="pazartesi"
          control={control}
          defaultValue={false} // or true if you want it checked by default
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            >
              Pazartesi
            </Checkbox>
          )}
        />
        <Controller
          name="sali"
          control={control}
          defaultValue={false} // or true if you want it checked by default
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            >
              Salı
            </Checkbox>
          )}
        />
        <Controller
          name="carsamba"
          control={control}
          defaultValue={false} // or true if you want it checked by default
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            >
              Çarşamba
            </Checkbox>
          )}
        />
        <Controller
          name="persembe"
          control={control}
          defaultValue={false} // or true if you want it checked by default
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            >
              Perşembe
            </Checkbox>
          )}
        />
        <Controller
          name="cuma"
          control={control}
          defaultValue={false} // or true if you want it checked by default
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            >
              Cuma
            </Checkbox>
          )}
        />
        <Controller
          name="cumartesi"
          control={control}
          defaultValue={false} // or true if you want it checked by default
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            >
              Cumartesi
            </Checkbox>
          )}
        />
        <Controller
          name="pazar"
          control={control}
          defaultValue={false} // or true if you want it checked by default
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            >
              Pazar
            </Checkbox>
          )}
        />
      </div>
    </div>
  );
}
