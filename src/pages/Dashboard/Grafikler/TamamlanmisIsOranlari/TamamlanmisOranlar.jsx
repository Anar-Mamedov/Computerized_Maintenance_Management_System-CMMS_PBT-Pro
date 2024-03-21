import { useMemo } from "react";
import { Column } from '@ant-design/plots';
import { Spin } from "antd";
import useFetch from '../../../hooks/useFetch';
import { Ayarlar } from './components/Ayarlar';
import { useDate } from "../../../DateContext";

const convertMonthNumberToName = (monthNumber) => {
    if (!monthNumber || monthNumber < 1 || monthNumber > 12) return "";

    const date = new Date(2021, monthNumber - 1, 1);

    const formatter = new Intl.DateTimeFormat(navigator.language, { month: "long" });
    return formatter.format(date);
};

const TamamlanmisOranlar = () => {
    const { selectedDate } = useDate();

    const [data, isLoading] = useFetch(`GetTamamlanmisIsEmirleriIsTalepleri?ID=2&year=${selectedDate.tamamlanmis_oranlar_zaman}`, [selectedDate.tamamlanmis_oranlar_zaman]);

    const formattedData = useMemo(() => {
        if (!data) return [];

        return data.map(item => ({
            ...item,
            AY: convertMonthNumberToName(item.AY),
        }));
    }, [data]);

    const config = useMemo(() => ({
        data: formattedData,
        xField: 'AY',
        yField: 'DEGER',
        stack: true,
        colorField: 'TIP',
        label: {
            text: 'DEGER',
            textBaseline: 'bottom',
            position: 'inside',
        },
        interaction: {
            elementHighlightByColor: {
                link: true,
            },
        },
        state: {
            active: { linkFill: 'rgba(0,0,0,0.25)', stroke: 'black', lineWidth: 0.5 },
            inactive: { opacity: 0.5 },
        },
        // width: 1000, // Örnek bir genişlik değeri
        // height: 1000, // Örnek bir yükseklik değeri
    }), [formattedData]);

    return (
        <div style={{ width: '100%', height: '100%' }} className='column' id="tamamlanmis_oranlar">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>Tamamlanmış İş talepleri ve İş Emirleri Oranları ({selectedDate.tamamlanmis_oranlar_zaman})</h3>
                <Ayarlar chart={<Column {...config} />} />
            </div>
            {isLoading ? <Spin size="large" /> : <Column {...config} />}
        </div>
    );
};

export default TamamlanmisOranlar;
