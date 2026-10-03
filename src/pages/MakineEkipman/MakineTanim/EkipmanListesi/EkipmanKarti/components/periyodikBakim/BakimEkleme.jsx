import React, { useState } from "react";
import PropTypes from "prop-types";
import BakimSecimModali from "./BakimSecimModali";
import BakimEklemeModali from "./BakimEklemeModali";

/**
 * Yeni Kayit akisi: once eklenebilir bakimlar secilir, sonra her secili bakim icin sirayla ekleme modali acilir.
 * Ekleme modali kapatilirsa o bakim atlanir. Son bakimdan sonra en az biri eklendiyse liste yenilenir.
 */
export default function BakimEkleme({ makineId, onKapat, onTamamlandi }) {
  const [kuyruk, setKuyruk] = useState(null);
  const [sira, setSira] = useState(0);
  const [eklenen, setEklenen] = useState(0);

  if (!kuyruk) {
    return <BakimSecimModali makineId={makineId} onKapat={onKapat} onDevam={setKuyruk} />;
  }

  const sonrakiBakim = (eklenenSayisi) => {
    if (sira + 1 < kuyruk.length) {
      setEklenen(eklenenSayisi);
      setSira(sira + 1);
      return;
    }
    if (eklenenSayisi > 0) onTamamlandi();
    else onKapat();
  };

  return (
    <BakimEklemeModali
      key={sira}
      makineId={makineId}
      bakim={kuyruk[sira]}
      sira={sira + 1}
      toplam={kuyruk.length}
      onKapat={() => sonrakiBakim(eklenen)}
      onKaydedildi={() => sonrakiBakim(eklenen + 1)}
    />
  );
}

BakimEkleme.propTypes = {
  makineId: PropTypes.number.isRequired,
  onKapat: PropTypes.func.isRequired,
  onTamamlandi: PropTypes.func.isRequired,
};
