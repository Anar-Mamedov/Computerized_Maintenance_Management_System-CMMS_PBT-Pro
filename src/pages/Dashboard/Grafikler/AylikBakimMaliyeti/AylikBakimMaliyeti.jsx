import { useState, useEffect, useMemo } from "react";
import { Column } from '@ant-design/plots';
import { Spin } from 'antd';
import useFetch from '../../../hooks/useFetch';
import { Ayarlar } from './components/Ayarlar';
import { useDate } from "../../../DateContext";

const convertMonthNumberToName = (monthNumber) => {
  if (!monthNumber || monthNumber < 1 || monthNumber > 12) return "";

  const date = new Date(2021, monthNumber - 1, 1);
  const formatter = new Intl.DateTimeFormat(navigator.language, { month: "long" });
  return formatter.format(date);
};

const AylikBakimMaliyeti = () => {
  const { selectedDate } = useDate();
  const [data, isLoading] = useFetch(`GetAylikBakimIsEmriMaliyet?ID=2&year=${selectedDate.aylik_bakim_maliyeti}`, [selectedDate.aylik_bakim_maliyeti]);

  const formattedData = useMemo(() => {
    if (!data) return [];

    return data.map(item => ({
      ...item,
      AY: convertMonthNumberToName(item.AY),
      "İş emri maliyeti": item.AYLIK_BAKIM_ISEMRI_MALIYET
    }));
  }, [data]);

  const config = {
    data: formattedData,
    xField: 'AY',
    yField: 'İş emri maliyeti',
    scrollbar: {
      x: {
        ratio: 3,
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '100%' }} className='column' id="aylik_bakim_maliyeti">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Aylık Bakım Maliyetleri ({selectedDate.aylik_bakim_maliyeti})</h3>
        <Ayarlar chart={<Column {...config} />} />
      </div>
      {isLoading ? <Spin size="large" /> : <Column {...config} />}
    </div>
  );
};

export default AylikBakimMaliyeti;
