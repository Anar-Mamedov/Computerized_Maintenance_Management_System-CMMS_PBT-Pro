import { createContext, useState, useContext } from 'react';

const DateContext = createContext();

export const DateProvider = ({ children }) => {

  const [selectedDate, setSelectedDate] = useState({
    tamamlanmis_oranlar_zaman: "2023",
    toplam_harcanan_is_gucu_zaman: ["2023-01-01", "2023-12-31"],
    personel_is_gucu_zaman: ['2023-01-01', '2023-12-31'],
    lokasyon_dagilimi_zaman: ['2020-01-01', '2024-03-01'],
    is_emri_ozet_zaman: ['2023-01-01', '2023-12-31'],
    is_emirlerinin_zaman_dagilimi: ['2023-01-01', '2023-12-31'],
    aylik_bakim_maliyeti: "2023",
  });

  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </DateContext.Provider>
  );
};

export const useDate = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error('useYear must be used within a YearProvider');
  }
  return context;
};
