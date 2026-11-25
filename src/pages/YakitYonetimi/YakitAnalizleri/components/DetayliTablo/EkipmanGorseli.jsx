import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { LuTruck } from "react-icons/lu";
import AxiosInstance from "../../../../../api/http";

/**
 * Ekipman gorseli (ResimGetirByID). Uclar JWT ile korundugu icin resim, diger ekranlardaki gibi AxiosInstance ile
 * blob olarak cekilir; ResimId yoksa ya da yuklenemezse varsayilan ikon gosterilir.
 */
export default function EkipmanGorseli({ resimId }) {
  const [adres, setAdres] = useState(null);

  useEffect(() => {
    if (!resimId) return undefined;
    let iptal = false;
    let nesneAdresi = null;
    AxiosInstance.get(`ResimGetirByID?id=${resimId}`, { responseType: "blob" })
      .then((blob) => {
        if (iptal) return;
        nesneAdresi = URL.createObjectURL(blob);
        setAdres(nesneAdresi);
      })
      .catch(() => !iptal && setAdres(null));
    return () => {
      iptal = true;
      if (nesneAdresi) URL.revokeObjectURL(nesneAdresi);
    };
  }, [resimId]);

  return (
    <span className="ya-gorsel">{resimId && adres ? <img src={adres} alt="" className="size-full object-cover" /> : <LuTruck size={18} className="text-(--ya-muted)" />}</span>
  );
}

EkipmanGorseli.propTypes = { resimId: PropTypes.number };
