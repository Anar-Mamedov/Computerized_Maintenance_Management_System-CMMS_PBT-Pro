import { createContext, useState, useContext } from "react";

const DateContext = createContext();

export const DateProvider = ({ children }) => {
  const sD = `${new Date().getFullYear()}-01-01`;
  const eD = `${new Date().getFullYear()}-12-31`;

  const [selectedDate, setSelectedDate] = useState({
    tamamlanmis_oranlar_zaman: new Date().getFullYear(),
    toplam_harcanan_is_gucu_zaman: [sD, eD],
    personel_is_gucu_zaman: [sD, eD],
    lokasyon_dagilimi_zaman: [sD, eD],
    is_emri_ozet_zaman: [sD, eD],
    is_emirlerinin_zaman_dagilimi: [sD, eD],
    aylik_bakim_maliyeti: new Date().getFullYear(),
  });

  return <DateContext.Provider value={{ selectedDate, setSelectedDate }}>{children}</DateContext.Provider>;
};

export const useDate = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error("useYear must be used within a YearProvider");
  }
  return context;
};
