import { Table, Spin } from 'antd';
import { Ayarlar } from './components/Ayarlar';
import useFetch from '../../../hooks/useFetch';
import { useDate } from '../../../DateContext';

const columns = [
    {
        title: 'İş Emri Tipi',
        dataIndex: 'IS_EMRI_TIPI',
        render: (text) => <a>{text}</a>,
        // width: 60,
        ellipsis: true,
    },
    {
        title: 'İş Emri Sayısı',
        className: 'column-money',
        dataIndex: 'IS_EMRI_SAYISI',
        align: 'center',
        // width: 80,
        ellipsis: true
    },
    {
        title: 'Toplam Maliyet',
        dataIndex: 'TOPLAM_MALIYET',
        // width: 100,
        ellipsis: true
    },
    {
        title: 'Ortalama Çalışma Süresi (dk)',
        dataIndex: 'ORTALAMA_CALISMA_SURESI',
        // width: 100,
        ellipsis: true
    },
    {
        title: 'Toplam Çalışma Süresi (dk)',
        dataIndex: 'TOPLAM_CALISMA_SURESI',
        // width: 100,
        ellipsis: true
    },
];

const TableFooter = ({ sum }) => {
    const toplamDk = sum.reduce((a, c) => a + c.TOPLAM_CALISMA_SURESI, 0)

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p><strong>Toplam:</strong></p>
            <p>{toplamDk}</p>

        </div>
    )
}

const IsEmriOzetTablo = () => {
    const { selectedDate } = useDate();
    const [data, isLoading] = useFetch(`GetIsEmriOzetTable?startDate=${selectedDate?.is_emri_ozet_zaman[0]}&endDate=${selectedDate?.is_emri_ozet_zaman[1]}`, [selectedDate.is_emri_ozet_zaman]);

    let formattedData = [];

    if (data) {
        formattedData = data.map(item => (
            {
                ...item,
                ORTALAMA_CALISMA_SURESI: (item.TOPLAM_CALISMA_SURESI / item.IS_EMRI_SAYISI).toFixed(2)
            }
        ))
    }

    return (
        <div style={{ width: '100%', height: '100%',overflow: "auto"  }} id='isemri_ozet_tablo'>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>İş Emirleri Özet Tablosu <br /> ({selectedDate?.is_emri_ozet_zaman[0]} / {selectedDate?.is_emri_ozet_zaman[1]})</h3>
                <Ayarlar chart={<Table
                    columns={columns}
                    dataSource={formattedData}
                    bordered
                    footer={() => <TableFooter sum={formattedData} />}
                />} />
            </div>
            {isLoading ? <Spin size="large" /> : (
                <Table
                    columns={columns}
                    dataSource={formattedData}
                    bordered
                    footer={() => <TableFooter sum={formattedData} />}
                    scroll={{
                        x: 1000,
                    }}
                />
            )}

        </div>
    )
}

export default IsEmriOzetTablo;


