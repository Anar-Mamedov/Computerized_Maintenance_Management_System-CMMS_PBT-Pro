import React from "react";
import PropTypes from "prop-types";
import { Button, Dropdown, Input, Select } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LuChevronDown, LuFileSpreadsheet, LuMoreVertical, LuPlus, LuSearch, LuTrash2 } from "react-icons/lu";
import DonemSelectbox from "../../../../utils/components/DonemSelectbox";
import KodFilterSelectbox from "../../../../utils/components/KodFilterSelectbox";
import LokasyonTablo from "../../../../utils/components/LokasyonTablo";
import { YAKIT_TIPI_KOD_GRUBU } from "../../ortak/yakitFiltresi";
import { ISLEM_TIPLERI } from "./YakitFisModali/fisFormu";

function FiltreAlani({ etiket, genislik, children }) {
  return (
    <div className="flex min-w-0 flex-col gap-1" style={{ flex: `1 1 ${genislik}px`, maxWidth: genislik * 1.6 }}>
      <span className="text-[12px] font-semibold text-(--ys-fg)">{etiket}</span>
      {children}
    </div>
  );
}

FiltreAlani.propTypes = { etiket: PropTypes.string.isRequired, genislik: PropTypes.number.isRequired, children: PropTypes.node };

/**
 * Filtreler (Sure, Islem Turu, Yakit Tipi, Lokasyon, Arama) ve islemler: Excel, secili kayitlar icin yesil ⋮ menusu
 * (Sil) ve "+ Yeni Islem" (Giris / Cikis / Transfer).
 */
export default function AracCubugu({ seciliSayisi, excelHazirlaniyor, onExcel, onSil, onYeniIslem }) {
  const { t } = useTranslation();
  const { control, watch } = useFormContext();

  return (
    <div className="flex flex-wrap items-end gap-3">
      {/* "Tarih Araligi"nda baslangic / bitis kutulari secicinin yaninda acilir; alan o kadar genisler. */}
      <FiltreAlani etiket={t("yakitStokIslemleri.filtre.sure")} genislik={watch("donem") === "tarihAraligi" ? 440 : 150}>
        <DonemSelectbox />
      </FiltreAlani>
      <FiltreAlani etiket={t("yakitStokIslemleri.filtre.islemTuru")} genislik={130}>
        <Controller
          name="islemTuru"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={[{ value: "TUMU", label: t("tumu") }, ...ISLEM_TIPLERI.map((tip) => ({ value: tip, label: t(`yakitOrtak.islemTuru.${tip}`) }))]}
              style={{ width: "100%" }}
            />
          )}
        />
      </FiltreAlani>
      <FiltreAlani etiket={t("yakitStokIslemleri.filtre.yakitTipi")} genislik={150}>
        <Controller
          name="yakitTipIds"
          control={control}
          render={({ field }) => <KodFilterSelectbox kodGrubu={YAKIT_TIPI_KOD_GRUBU} placeholder={t("tumu")} value={field.value} onChange={field.onChange} />}
        />
      </FiltreAlani>
      <FiltreAlani etiket={t("yakitStokIslemleri.filtre.lokasyon")} genislik={160}>
        <LokasyonTablo multiple lokasyonFieldName="lokasyonTanim" lokasyonIdFieldName="lokasyonIds" workshopSelectedId={watch("lokasyonIds") || []} placeholder={t("tumu")} />
      </FiltreAlani>
      <FiltreAlani etiket={t("yakitStokIslemleri.filtre.arama")} genislik={160}>
        <Controller
          name="arama"
          control={control}
          render={({ field }) => <Input {...field} allowClear prefix={<LuSearch size={14} />} placeholder={t("yakitStokIslemleri.filtre.aramaPlaceholder")} />}
        />
      </FiltreAlani>

      <div className="ml-auto flex items-center gap-2">
        <Button icon={<LuFileSpreadsheet size={15} />} loading={excelHazirlaniyor} onClick={onExcel}>
          {t("yakitStokIslemleri.excel")}
        </Button>
        <Dropdown trigger={["click"]} disabled={seciliSayisi === 0} menu={{ items: [{ key: "sil", danger: true, icon: <LuTrash2 size={14} />, label: t("sil") }], onClick: onSil }}>
          <button type="button" className="ys-islem-btn" disabled={seciliSayisi === 0} aria-label={t("yakitStokIslemleri.seciliIslemler")}>
            <LuMoreVertical size={16} />
          </button>
        </Dropdown>
        <Dropdown trigger={["click"]} menu={{ items: ISLEM_TIPLERI.map((tip) => ({ key: tip, label: t(`yakitOrtak.islemTuru.${tip}`) })), onClick: ({ key }) => onYeniIslem(key) }}>
          <Button type="primary" icon={<LuPlus size={15} />}>
            <span className="inline-flex items-center gap-1">
              {t("yakitStokIslemleri.yeniIslem")}
              <LuChevronDown size={14} />
            </span>
          </Button>
        </Dropdown>
      </div>
    </div>
  );
}

AracCubugu.propTypes = {
  seciliSayisi: PropTypes.number.isRequired,
  excelHazirlaniyor: PropTypes.bool.isRequired,
  onExcel: PropTypes.func.isRequired,
  onSil: PropTypes.func.isRequired,
  onYeniIslem: PropTypes.func.isRequired,
};
