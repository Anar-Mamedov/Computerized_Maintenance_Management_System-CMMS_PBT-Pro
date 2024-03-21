import { Line } from '@ant-design/plots';
import { Spin } from "antd";
import { Ayarlar } from './components/Ayarlar';
import useFetch from '../../../hooks/useFetch';
import { useDate } from '../../../DateContext';



const IsEmirlerininZamanDagilimi = () => {
    const { selectedDate } = useDate();

    const [data, isLoading] = useFetch(`GetIsEmirleriByTarih?startDate=${selectedDate?.is_emirlerinin_zaman_dagilimi[0]}&endDate=${selectedDate?.is_emirlerinin_zaman_dagilimi[1]}`, [selectedDate.is_emirlerinin_zaman_dagilimi]);

    let formattedData = [];

    if (data) {
        formattedData = data.map(item => {

            item.TARIH = item.TARIH.split("T")[0]
            return ({
                ...item,
                "Tarih": item.TARIH,
                "Değer": item.DEGER
            })
        });
    }

    const config = {
        data: formattedData,
        xField: 'Tarih',
        yField: 'Değer',
        point: {
            shapeField: 'square',
            sizeField: 4,
        },
        interaction: {
            tooltip: {
                marker: false,
            },
        },
        style: {
            lineWidth: 2,
        }
    };

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }} className='column' id='isemirlerinin_zaman_dagilimi'>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>İş Emirlerinin Zaman İçerisinde Dağılımı <br /> ({selectedDate?.is_emirlerinin_zaman_dagilimi[0]} / {selectedDate?.is_emirlerinin_zaman_dagilimi[1]})</h3>
                <Ayarlar chart={<Line {...config} />} />
            </div>
            {isLoading ? <Spin size="large" /> : <Line {...config} />}
        </div>
    );
}

export default IsEmirlerininZamanDagilimi;

