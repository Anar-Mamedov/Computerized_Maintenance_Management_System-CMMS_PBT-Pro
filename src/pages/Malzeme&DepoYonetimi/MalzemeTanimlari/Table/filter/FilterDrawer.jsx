import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Badge, Button, Checkbox, Drawer, Space, Typography } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { FormProvider, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { t } from "i18next";
import LokasyonTablo from "../../../../../utils/components/LokasyonTablo";
import EkipmanFilterSelectbox from "../../../../../utils/components/EkipmanFilterSelectbox";
import FullDatePicker from "../../../../../utils/components/FullDatePicker";

const { Text } = Typography;

const kutuStili = {
  marginBottom: "20px",
  border: "1px solid #80808048",
  padding: "15px 10px",
  borderRadius: "8px",
};

const etiketStili = { fontSize: "14px", display: "block", marginBottom: "10px" };

const toGunFormati = (value) => {
  const tarih = value ? dayjs(value) : null;
  return tarih?.isValid() ? tarih.format("YYYY-MM-DD") : null;
};

/**
 * Malzeme Tanımları filtre çekmecesi.
 * Dashboard'dan gelen lokasyon / ekipman / tarih / kritik filtreleri buraya yerleşir;
 * değerler ID bazlıdır ve kullanıcı çekmeceden değiştirip temizleyebilir.
 */
export default function FilterDrawer({ onSubmit, baslangicLokasyonIds, baslangicMakineIds, baslangicTarihi, bitisTarihi, baslangicKritik }) {
  const [open, setOpen] = useState(false);

  const methods = useForm({
    defaultValues: {
      filtreLokasyonTanim: "",
      filtreLokasyonID: [],
      filtreBaslangicTarihi: baslangicTarihi ? dayjs(baslangicTarihi) : null,
      filtreBitisTarihi: bitisTarihi ? dayjs(bitisTarihi) : null,
    },
  });

  const { setValue, watch } = methods;
  const filtreBaslangic = watch("filtreBaslangicTarihi");
  const filtreBitis = watch("filtreBitisTarihi");

  const [lokasyonIds, setLokasyonIds] = useState(() => (Array.isArray(baslangicLokasyonIds) ? baslangicLokasyonIds : []));
  const [makineIds, setMakineIds] = useState(() => (Array.isArray(baslangicMakineIds) ? baslangicMakineIds : []));
  const [kritik, setKritik] = useState(Boolean(baslangicKritik));

  const onSubmitRef = useRef(onSubmit);

  useEffect(() => {
    onSubmitRef.current = onSubmit;
  }, [onSubmit]);

  // Dashboard'dan gelen değerler çekmecenin kontrollerine başlangıç değeri olarak yerleşir.
  const lokasyonAnahtari = JSON.stringify(baslangicLokasyonIds || []);
  const makineAnahtari = JSON.stringify(baslangicMakineIds || []);

  useEffect(() => {
    const gelenler = JSON.parse(lokasyonAnahtari);
    setLokasyonIds(gelenler);
    setValue("filtreLokasyonID", gelenler);
  }, [lokasyonAnahtari, setValue]);

  useEffect(() => {
    setMakineIds(JSON.parse(makineAnahtari));
  }, [makineAnahtari]);

  useEffect(() => {
    setKritik(Boolean(baslangicKritik));
  }, [baslangicKritik]);

  useEffect(() => {
    setValue("filtreBaslangicTarihi", baslangicTarihi ? dayjs(baslangicTarihi) : null);
    setValue("filtreBitisTarihi", bitisTarihi ? dayjs(bitisTarihi) : null);
  }, [baslangicTarihi, bitisTarihi, setValue]);

  const tarihAraligi = useMemo(() => {
    const startDate = toGunFormati(filtreBaslangic);
    const endDate = toGunFormati(filtreBitis);

    return {
      ...(startDate ? { startDate } : {}),
      ...(endDate ? { endDate } : {}),
    };
  }, [filtreBaslangic, filtreBitis]);

  useEffect(() => {
    onSubmitRef.current({
      lokasyonlar: lokasyonIds,
      makineler: makineIds,
      customfilters: tarihAraligi,
      kritik,
    });
  }, [lokasyonIds, makineIds, tarihAraligi, kritik]);

  const filtreSayisi = lokasyonIds.length + makineIds.length + (kritik ? 1 : 0) + (tarihAraligi.startDate || tarihAraligi.endDate ? 1 : 0);

  const temizle = () => {
    setLokasyonIds([]);
    setMakineIds([]);
    setKritik(false);
    setValue("filtreLokasyonTanim", "");
    setValue("filtreLokasyonID", []);
    setValue("filtreBaslangicTarihi", null);
    setValue("filtreBitisTarihi", null);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <FilterOutlined />
        {t("filtreler")}
        <Badge count={filtreSayisi} size="small" style={{ backgroundColor: "#006cb8" }} />
      </Button>

      <Drawer
        title={
          <span>
            <FilterOutlined style={{ marginRight: "8px" }} />
            {t("filtreler")}
          </span>
        }
        placement="right"
        open={open}
        onClose={() => setOpen(false)}
        extra={
          <Space>
            <Button onClick={temizle}>{t("temizle")}</Button>
            <Button type="primary" onClick={() => setOpen(false)}>
              {t("uygula")}
            </Button>
          </Space>
        }
      >
        <FormProvider {...methods}>
          <div style={kutuStili}>
            <Text style={etiketStili}>{t("tarihAraligi")}</Text>
            <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
              <FullDatePicker name1="filtreBaslangicTarihi" placeholder={t("baslangicTarihi")} style={{ width: "100%" }} />
              <Text style={{ fontSize: "14px" }}>-</Text>
              <FullDatePicker name1="filtreBitisTarihi" placeholder={t("bitisTarihi")} style={{ width: "100%" }} />
            </div>
          </div>

          <div style={kutuStili}>
            <Text style={etiketStili}>{t("lokasyon")}</Text>
            <LokasyonTablo
              multiple
              workshopSelectedId={lokasyonIds}
              lokasyonFieldName="filtreLokasyonTanim"
              lokasyonIdFieldName="filtreLokasyonID"
              placeholder={t("lokasyon")}
              onSubmit={(secilenler) => setLokasyonIds(secilenler.map((item) => item.key))}
              onClear={() => setLokasyonIds([])}
            />
          </div>

          <div style={kutuStili}>
            <Text style={etiketStili}>{t("ekipman")}</Text>
            <EkipmanFilterSelectbox value={makineIds} onChange={setMakineIds} />
          </div>

          <div style={kutuStili}>
            <Checkbox checked={kritik} onChange={(event) => setKritik(event.target.checked)}>
              {t("kritikMalzeme")}
            </Checkbox>
          </div>
        </FormProvider>
      </Drawer>
    </>
  );
}

FilterDrawer.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  baslangicLokasyonIds: PropTypes.array,
  baslangicMakineIds: PropTypes.array,
  baslangicTarihi: PropTypes.string,
  bitisTarihi: PropTypes.string,
  baslangicKritik: PropTypes.bool,
};
