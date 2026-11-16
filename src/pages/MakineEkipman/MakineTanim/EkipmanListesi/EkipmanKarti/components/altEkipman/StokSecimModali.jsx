import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Input, Pagination, message } from "antd";
import { useTranslation } from "react-i18next";
import { LuSearch } from "react-icons/lu";
import KartModali from "../ortak/KartModali";
import KartTablosu from "../ortak/KartTablosu";
import ModalDugmeleri from "../ortak/ModalDugmeleri";
import useDebounce from "../../../../../../../hooks/useDebounce";
import { getStoklar, hataMesaji, listeyiAl } from "../../ekipmanKartiService";
import { anahtarEkle, bosIse, buyukHarf, sayiMetni } from "../../yardimcilar";

const SAYFA_BOYUTU = 10;

const KOLONLAR = [
  { alan: "STK_KOD", baslikKey: "ekipmanKarti.altEkipman.kolon.stokKodu", genislik: 140 },
  { alan: "STK_TANIM", baslikKey: "ekipmanKarti.altEkipman.kolon.tanim", genislik: 240 },
  { alan: "STK_TIP", baslikKey: "ekipmanKarti.altEkipman.kolon.tip", genislik: 130 },
  { alan: "STK_GRUP", baslikKey: "ekipmanKarti.altEkipman.kolon.grup", genislik: 130 },
  { alan: "STK_MARKA", baslikKey: "ekipmanKarti.altEkipman.kolon.marka", genislik: 120 },
  { alan: "STK_MIKTAR", baslikKey: "ekipmanKarti.altEkipman.stokMiktari", genislik: 120, sayi: true },
];

// Stok listesi { Data: [], TotalCount } doner.
const stokListesi = (yanit) => (Array.isArray(yanit?.Data) ? yanit.Data : listeyiAl(yanit));

/** Malzemeyi bir stok kartiyla iliskilendirmek icin aktif stok kartlarindan tek secim (arama ve sayfalama ile). */
export default function StokSecimModali({ onKapat, onSecildi }) {
  const { t, i18n } = useTranslation();
  const [arama, setArama] = useState("");
  const gecikmeliArama = useDebounce(arama, 400);
  const [parametre, setParametre] = useState("");
  const [sayfa, setSayfa] = useState(1);
  const [kayitlar, setKayitlar] = useState([]);
  const [toplam, setToplam] = useState(0);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [seciliAnahtar, setSeciliAnahtar] = useState(null);

  // Yazma bitince arama uygulanir ve ilk sayfaya donulur (render sirasinda; tek istek atilir).
  const yeniParametre = gecikmeliArama.trim();
  if (yeniParametre !== parametre) {
    setParametre(yeniParametre);
    setSayfa(1);
  }

  useEffect(() => {
    let iptal = false;
    const yukle = async () => {
      setYukleniyor(true);
      try {
        const yanit = await getStoklar({ parametre, sayfa, sayfaBoyutu: SAYFA_BOYUTU });
        if (iptal) return;
        setKayitlar(anahtarEkle(stokListesi(yanit), "TB_STOK_ID"));
        setToplam(Number(yanit?.TotalCount) || 0);
      } catch (hata) {
        if (iptal) return;
        console.error("Stok listesi alinamadi:", hata);
        setKayitlar([]);
        setToplam(0);
        message.error(hataMesaji(hata, t("ekipmanKarti.listeAlinamadi")));
      } finally {
        if (!iptal) setYukleniyor(false);
      }
    };

    yukle();
    return () => {
      iptal = true;
    };
  }, [parametre, sayfa, t]);

  const kolonlar = useMemo(
    () =>
      KOLONLAR.map(({ alan, baslikKey, genislik, sayi }) => ({
        key: alan,
        dataIndex: alan,
        title: buyukHarf(t(baslikKey), i18n.language),
        width: genislik,
        ellipsis: true,
        align: sayi ? "right" : undefined,
        render: (deger) => bosIse(sayi ? sayiMetni(deger, i18n.language) : deger),
      })),
    [t, i18n.language]
  );

  // Tablo satir anahtari clientKey'dir; secilen satirin backend kaydi (TB_STOK_ID) disari verilir.
  const seciliStok = kayitlar.find((kayit) => kayit.clientKey === seciliAnahtar) ?? null;
  const sec = () => seciliStok && onSecildi(seciliStok);

  return (
    <KartModali
      acik
      baslik={t("ekipmanKarti.altEkipman.stokSecBaslik")}
      altBaslik={t("ekipmanKarti.altEkipman.stokSecAciklama")}
      genislik={960}
      onKapat={onKapat}
      altBilgi={<ModalDugmeleri onKapat={onKapat} onKaydet={sec} kaydetMetni={t("ekipmanKarti.altEkipman.sec")} kaydetDevreDisi={!seciliStok} />}
    >
      <div className="space-y-3">
        <div className="w-full sm:w-80">
          <Input
            allowClear
            value={arama}
            onChange={(olay) => setArama(olay.target.value)}
            placeholder={t("ekipmanKarti.altEkipman.stokAramaYerTutucu")}
            prefix={<LuSearch size={16} className="ek-kart-soluk" />}
          />
        </div>
        <KartTablosu
          ic
          rowKey="clientKey"
          columns={kolonlar}
          dataSource={kayitlar}
          loading={yukleniyor}
          scroll={{ x: 880 }}
          rowSelection={{ type: "radio", selectedRowKeys: seciliAnahtar ? [seciliAnahtar] : [], onChange: (anahtarlar) => setSeciliAnahtar(anahtarlar[0] ?? null) }}
          onRow={(kayit) => ({ onClick: () => setSeciliAnahtar(kayit.clientKey), onDoubleClick: () => onSecildi(kayit) })}
        />
        <div className="flex justify-end">
          <Pagination size="small" hideOnSinglePage showSizeChanger={false} current={sayfa} pageSize={SAYFA_BOYUTU} total={toplam} onChange={(yeniSayfa) => setSayfa(yeniSayfa)} />
        </div>
      </div>
    </KartModali>
  );
}

StokSecimModali.propTypes = {
  onKapat: PropTypes.func.isRequired,
  /** Secilen stok kaydi (TB_STOK_ID, STK_KOD, STK_TANIM ...) ile cagrilir. */
  onSecildi: PropTypes.func.isRequired,
};
