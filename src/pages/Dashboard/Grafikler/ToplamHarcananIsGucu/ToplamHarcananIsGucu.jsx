import { Pie } from '@ant-design/plots';
import { Spin } from 'antd';
import { Ayarlar } from './components/Ayarlar';
import useFetch from '../../../hooks/useFetch';
import { useDate } from '../../../DateContext';

const ToplamHarcananIsGucu = () => {
    const { selectedDate } = useDate();
    const [data, isLoading] = useFetch(`GetToplamHarcananIsGuc?startDate=${selectedDate?.toplam_harcanan_is_gucu_zaman[0]}&endDate=${selectedDate?.toplam_harcanan_is_gucu_zaman[1]}`, [selectedDate.toplam_harcanan_is_gucu_zaman]);

    let formattedData = [];

    if (data) {
        formattedData = data.map(item => ({
            ...item,
            Dakika: item.DAKIKA
        }));
    }


    const config = {
        appendPadding: 10,
        data: formattedData,
        angleField: 'Dakika',
        colorField: 'TANIM',
        radius: .6,
        label: {
            text: 'Dakika',
            position: 'outside',
            style: {
                fontSize: 10 // adjust the font size as needed
            },
            line: {},
        },
        // legend: {
        //     color: {
        //       title: false,
        //       position: 'top',
        //       rowPadding: 5,
        //     },
        //   },
        innerRadius: 0.2,
        legend: {
            color: {
                title: false,
                position: 'top',
                rowPadding: 1,
            },
        },
        annotations: [
            {
                type: 'text',
                style: {
                    text: '',
                    x: '50%',
                    y: '50%',
                    textAlign: 'center',
                    fontSize: 40,
                    fontStyle: 'bold',
                },
            },
        ]
    };

    const modalConfig = { ...config, radius: 1 }

    return (
        <div style={{ width: '100%', height: '100%' }} className='chart-container'>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>Toplam Harcanan İş Gücü</h3>
                <Ayarlar chart={<Pie {...modalConfig} />} />
            </div>
            {isLoading ? <Spin size="large" /> : <Pie {...config} />}
        </div>
    )
}

export default ToplamHarcananIsGucu;