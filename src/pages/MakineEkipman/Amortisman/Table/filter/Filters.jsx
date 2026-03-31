import React from "react";
import ConditionFilter from "./ConditionFilter";
import LocationFilter from "./LocationFilter";
import TypeFilter from "./TypeFilter";
import ZamanAraligi from "./ZamanAraligi";

export default function Filters({ onChange, kelime, selectedProfilId }) {
  const [filters, setFilters] = React.useState({
    ProfilId: selectedProfilId || 1, // Dokümana göre zorunlu
    LokasyonIds: [],                 // API [1, 5] formatında dizi bekliyor
    MakineTipIds: [],                // API [12, 14] formatında dizi bekliyor
    DurumId: null,                   // Tekil ID veya null
    Kelime: kelime || "",
  });

  // Filtreler her değiştiğinde üst bileşene (Dashboard'a) haber ver
  React.useEffect(() => {
    onChange("filters", filters);
  }, [filters, onChange]);

  // Kelime arama kutusu değişirse senkronize et
  React.useEffect(() => {
    setFilters((prev) => ({ ...prev, Kelime: kelime }));
  }, [kelime]);

  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      
      {/* LOKASYON FİLTRESİ */}
      <LocationFilter
        onSubmit={(selectedObj) => {
          // selectedObj şuna benziyor: {0: "Bursa", 1: "İstanbul"}
          // API ise ID listesi istiyor. Eğer value'lar ID ise:
          const idArray = Object.values(selectedObj).map(val => Number(val));
          
          setFilters((state) => ({
            ...state,
            LokasyonIds: idArray.length > 0 ? idArray : [], 
          }));
        }}
      />

      {/* DURUM FİLTRESİ (Condition) */}
      <ConditionFilter
        onSubmit={(val) =>
          setFilters((state) => ({
            ...state,
            DurumId: val, // API tek bir DurumId bekliyor gibi görünüyor
          }))
        }
      />

      {/* TİP FİLTRESİ (Örnek kullanım) */}
      <TypeFilter 
        onSubmit={(selectedTypes) => 
          setFilters(state => ({
            ...state,
            MakineTipIds: selectedTypes // Array olarak gönderilmeli
          }))
        }
      />

    </div>
  );
}