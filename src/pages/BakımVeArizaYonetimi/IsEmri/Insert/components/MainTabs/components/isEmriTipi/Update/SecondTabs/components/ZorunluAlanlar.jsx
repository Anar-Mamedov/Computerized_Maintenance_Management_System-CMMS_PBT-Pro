import { Checkbox } from "antd";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

export default function ZorunluAlanlar() {
  const { control, watch, setValue } = useFormContext();

  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div>
          <Controller
            name="lokasyon"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} disabled onChange={(e) => field.onChange(e.target.checked)}>
                Lokasyon
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="makine"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Makine
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="ekipman"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Ekipman
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="makineDurum"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Makine Durum
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="sayacDegeri"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Sayaç Değeri
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="prosedur"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Prosedur
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="isTipi"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                İş Tipi
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="isNedeni"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                İş Nedeni
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="konu"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Konu
              </Checkbox>
            )}
          />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div>
          <Controller
            name="oncelik"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Öncelik
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="atolye"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Atölye
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="takvim"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Takvim
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="talimat"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Talimat
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="planlananBaslangicTarihi"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Plan. Başl. Tarihi
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="planlananBitisTarihi"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Plan. Bitiş Tarihi
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="masrafMerkezi"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Masraf Merkezi
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="proje"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Proje
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="referansNo"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Referans No
              </Checkbox>
            )}
          />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div>
          <Controller
            name="firma"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Firma
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="sozlesme"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Sözleşme
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="evrakNo"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Evrak No
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="evrakTarihi"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Evrak Tarihi
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="maliyet"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Maliyet
              </Checkbox>
            )}
          />
        </div>
      </div>
    </div>
  );
}
