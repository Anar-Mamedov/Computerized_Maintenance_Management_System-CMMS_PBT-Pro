import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Input } from "antd";
import { useTranslation } from "react-i18next";
import { LuSearch } from "react-icons/lu";
import useDebounce from "../../../../../../hooks/useDebounce";

/** Serbest metin aramasi; yazma bitince (500 ms) listeye uygulanir. */
export default function AramaKutusu({ arama, onAramaDegistir }) {
  const { t } = useTranslation();
  const [deger, setDeger] = useState(arama);
  const gecikmeliDeger = useDebounce(deger, 500);
  // Listeye en son uygulanan arama; disaridan temizlemeyi kendi yazdigimizdan ayirmak icin tutulur.
  const uygulananRef = useRef(arama);

  useEffect(() => {
    const temizDeger = gecikmeliDeger.trim();
    if (temizDeger === uygulananRef.current) return;
    uygulananRef.current = temizDeger;
    onAramaDegistir(temizDeger);
  }, [gecikmeliDeger, onAramaDegistir]);

  // "Tumunu temizle" gibi disaridan gelen degisiklikler kutuya yansitilir.
  useEffect(() => {
    if (arama === uygulananRef.current) return;
    uygulananRef.current = arama;
    setDeger(arama);
  }, [arama]);

  return (
    <Input
      className="ek-arama"
      allowClear
      value={deger}
      onChange={(event) => setDeger(event.target.value)}
      placeholder={t("ekipmanListesi.aramaYap")}
      aria-label={t("ekipmanListesi.aramaAria")}
      prefix={<LuSearch size={16} className="text-(--ek-subtle)" />}
    />
  );
}

AramaKutusu.propTypes = {
  arama: PropTypes.string.isRequired,
  onAramaDegistir: PropTypes.func.isRequired,
};
