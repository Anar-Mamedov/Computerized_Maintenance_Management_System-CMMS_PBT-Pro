import { useState } from 'react';
import { Space, Button } from 'antd';
import FilterGrafik from './components/FilterGrafik';

const plainOptions = ['İş Emri Tipi Grafiği', 'İş Talebi Tipi Grafiği', 'Tamamlanmış İş talepleri ve İş Emirleri Oranları', 'Aylık Bakım Maliyetleri', 'Personel Bazında Harcanan İş Gücü', 'Bakım İşlemlerinin Zaman İçerisinde Dağılımı', 'Toplam Harcanan İş Gücü', 'Lokasyon Bazında İş talepleri / İş Emirleri Dağılımı', 'İş Emirleri Özet Tablosu', 'Arızalı Makineler', 'Makine Tiplerine Göre Envanter Dağılımı'];

export default function Filter({ onUpdateFilters, setComponentLayout, setFilteredGraphs }) {
  const [mobileView, setMobileView] = useState(window.innerWidth < 768);
  const [checkedList, setCheckedList] = useState(plainOptions);

  window.addEventListener("resize", () => {
    setMobileView(window.innerWidth < 768);
  });


  const handleReset = () => {
    const newCheckedList = plainOptions;
    setCheckedList(newCheckedList);
    setFilteredGraphs(newCheckedList);

    const initialLayout = plainOptions.map((graphKey, index) => ({
      i: graphKey,
      x: (index % 4) * 3,
      y: Math.floor(index / 3) * 4,
      w: 3,
      h: 3,
    }));
    setComponentLayout(initialLayout);
    localStorage.setItem("componentLayout", JSON.stringify(initialLayout));

    // Save the updated state to local storage
    localStorage.setItem("filteredGraphs", JSON.stringify(newCheckedList));
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', margin: '30px 0 10px' }}>
      <Space wrap>
        <Button onClick={handleReset}>Sıfırla</Button>
      </Space>

      <Space>
        <FilterGrafik onUpdateFilters={onUpdateFilters} checkedList={checkedList} setCheckedList={setCheckedList} />
      </Space>
    </div>
  )
}
