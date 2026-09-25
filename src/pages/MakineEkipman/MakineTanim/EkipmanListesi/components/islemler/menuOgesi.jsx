import React from "react";
import { ISLEMLER } from "./islemTanimlari";

/** antd Dropdown menusu icin ikonlu ve aciklamali islem ogesi uretir. */
export const menuOgesi = (anahtar, t, devreDisi = false) => {
  const { Ikon, baslikKey, aciklamaKey, tehlikeli } = ISLEMLER[anahtar];

  return {
    key: anahtar,
    disabled: devreDisi,
    danger: tehlikeli,
    icon: <Ikon size={16} className="ek-menu-ikon" />,
    label: (
      <span className="flex min-w-0 flex-col gap-0.5 py-0.5">
        <span className="text-[13px] leading-tight font-medium">{t(baslikKey)}</span>
        <span className="text-[11px] leading-snug text-(--ek-muted)">{t(aciklamaKey)}</span>
      </span>
    ),
  };
};

/** Menunun en ustundeki baslik satiri (tiklanamaz grup basligi olarak eklenir). */
export const menuBasligi = (baslik, altBaslik) => ({
  type: "group",
  key: "menu-basligi",
  className: "ek-menu-basligi",
  label: (
    <span className="block min-w-0">
      <span className="block truncate text-[13px] font-semibold text-(--ek-fg)">{baslik}</span>
      <span className="block truncate text-[11px] text-(--ek-subtle)">{altBaslik}</span>
    </span>
  ),
});
