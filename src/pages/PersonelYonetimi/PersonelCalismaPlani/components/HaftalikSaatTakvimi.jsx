import React, { useLayoutEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { theme } from "antd";
import "./haftalikSaatTakvimi.css";

const SAAT_YUKSEKLIGI = 48;
const DAKIKA_YUKSEKLIGI = SAAT_YUKSEKLIGI / 60;
const EN_AZ_KAYIT_YUKSEKLIGI = 22;
// Bitisi olmayan ya da baslangictan once biten kayit ekranda bu sure kadar yer kaplar.
const BITISSIZ_KAYIT_DAKIKASI = 30;
const SAATLER = Array.from({ length: 24 }, (_, saat) => saat);

/**
 * Bir gune dusen kayit parcalari (gun basindan itibaren dakika). Birden cok gune yayilan kayit her gunde o gune dusen
 * kismiyla gorunur. Ust uste binen kayitlar yan yana seritlere dagitilir: `serit` kaydin sirasi, `seritSayisi` ayni anda
 * cakisan kayit grubunun genisligi.
 */
const gunParcalari = (olaylar, gun) => {
  const gunBasi = gun.startOf("day");
  const gunSonu = gunBasi.add(1, "day");

  const parcalar = olaylar
    .map((olay) => {
      const baslangic = dayjs(olay.BASLAMA_TARIH);
      if (!baslangic.isValid()) return null;
      const bitis = dayjs(olay.BITIS_TARIH);
      const gercekBitis = bitis.isAfter(baslangic) ? bitis : baslangic.add(BITISSIZ_KAYIT_DAKIKASI, "minute");
      const parcaBasi = baslangic.isAfter(gunBasi) ? baslangic : gunBasi;
      const parcaSonu = gercekBitis.isBefore(gunSonu) ? gercekBitis : gunSonu;
      if (!parcaSonu.isAfter(parcaBasi)) return null;
      return { olay, bas: parcaBasi.diff(gunBasi, "minute"), bit: parcaSonu.diff(gunBasi, "minute") };
    })
    .filter(Boolean)
    .sort((a, b) => a.bas - b.bas || b.bit - a.bit);

  const sonuc = [];
  let kume = [];
  let kumeSonu = 0;
  let seritSonlari = [];
  const kumeyiKapat = () => {
    kume.forEach((parca) => sonuc.push({ ...parca, seritSayisi: seritSonlari.length }));
    kume = [];
    seritSonlari = [];
  };

  parcalar.forEach((parca) => {
    if (kume.length > 0 && parca.bas >= kumeSonu) kumeyiKapat();
    let serit = seritSonlari.findIndex((son) => son <= parca.bas);
    if (serit === -1) serit = seritSonlari.length;
    seritSonlari[serit] = parca.bit;
    kumeSonu = kume.length === 0 ? parca.bit : Math.max(kumeSonu, parca.bit);
    kume.push({ ...parca, serit });
  });
  kumeyiKapat();

  return sonuc;
};

/**
 * Haftalik gorunum: solda 00-23 saat sutunu, her gun bir sutun; kayitlar baslangic/bitis saatine gore yerlesir.
 * Kaydin rengi ve tiklaninca acilacak detay (`renderOlay`, ornegin Popover) cagirandan gelir.
 */
export default function HaftalikSaatTakvimi({ gunler, olaylar, olayRengi, renderOlay }) {
  const { token } = theme.useToken();
  const kaydirmaRef = useRef(null);
  const gunlukParcalar = useMemo(() => gunler.map((gun) => gunParcalari(olaylar, gun)), [gunler, olaylar]);

  // Hafta ya da veri degisince gorunum haftanin en erken kaydina kayar; kayit yoksa 00:00'dan baslar.
  const haftaAnahtari = gunler[0]?.format("YYYY-MM-DD");
  const ilkSaat = useMemo(() => {
    const saatler = gunlukParcalar.flat().map((parca) => Math.floor(parca.bas / 60));
    return saatler.length > 0 ? Math.min(...saatler) : 0;
  }, [gunlukParcalar]);

  useLayoutEffect(() => {
    if (kaydirmaRef.current) kaydirmaRef.current.scrollTop = ilkSaat * SAAT_YUKSEKLIGI;
  }, [haftaAnahtari, ilkSaat]);

  return (
    <div ref={kaydirmaRef} className="hst" style={{ gridTemplateColumns: `56px repeat(${gunler.length}, minmax(130px, 1fr))` }}>
      <div className="hst-kose" />
      {gunler.map((gun) => {
        const bugunMu = gun.isSame(dayjs(), "day");
        return (
          <div key={gun.format("YYYY-MM-DD")} className="hst-gun-basligi" style={bugunMu ? { color: token.colorPrimary, background: token.colorPrimaryBg } : undefined}>
            <span className="hst-gun-adi">{gun.format("dddd")}</span>
            <span className="hst-gun-tarihi">{gun.format("DD MMMM")}</span>
          </div>
        );
      })}

      <div className="hst-saatler">
        {SAATLER.map((saat) => (
          <div key={saat} className="hst-saat" style={{ height: SAAT_YUKSEKLIGI }}>
            {String(saat).padStart(2, "0")}
          </div>
        ))}
      </div>

      {gunler.map((gun, gunIndex) => (
        <div key={gun.format("YYYY-MM-DD")} className="hst-gun" style={gun.isSame(dayjs(), "day") ? { background: `${token.colorPrimary}0d` } : undefined}>
          {SAATLER.map((saat) => (
            <div key={saat} className="hst-saat-hucresi" style={{ height: SAAT_YUKSEKLIGI }} />
          ))}

          {gunlukParcalar[gunIndex].map((parca, index) => {
            const renk = olayRengi(parca.olay);
            const baslangicSaati = dayjs(parca.olay.BASLAMA_TARIH).format("HH:mm");
            const bitis = dayjs(parca.olay.BITIS_TARIH);
            const icerik = (
              <div className="hst-kayit-icerik" style={{ borderLeftColor: renk, backgroundImage: `linear-gradient(${renk}26, ${renk}26)` }}>
                <span className="hst-kayit-personel">{parca.olay.IDK_PERSONEL}</span>
                <span className="hst-kayit-saat">{bitis.isValid() ? `${baslangicSaati} - ${bitis.format("HH:mm")}` : baslangicSaati}</span>
                <span className="hst-kayit-aciklama">{parca.olay.ISM_ICERIK}</span>
              </div>
            );
            return (
              <div
                key={`${parca.olay.TB_ISEMRI_KAYNAK_ID}-${index}`}
                className="hst-kayit"
                style={{
                  top: parca.bas * DAKIKA_YUKSEKLIGI,
                  height: Math.max((parca.bit - parca.bas) * DAKIKA_YUKSEKLIGI, EN_AZ_KAYIT_YUKSEKLIGI),
                  left: `${(parca.serit / parca.seritSayisi) * 100}%`,
                  width: `${100 / parca.seritSayisi}%`,
                }}
              >
                {renderOlay(parca.olay, icerik)}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

HaftalikSaatTakvimi.propTypes = {
  gunler: PropTypes.arrayOf(PropTypes.object).isRequired,
  olaylar: PropTypes.arrayOf(PropTypes.object).isRequired,
  olayRengi: PropTypes.func.isRequired,
  renderOlay: PropTypes.func.isRequired,
};
