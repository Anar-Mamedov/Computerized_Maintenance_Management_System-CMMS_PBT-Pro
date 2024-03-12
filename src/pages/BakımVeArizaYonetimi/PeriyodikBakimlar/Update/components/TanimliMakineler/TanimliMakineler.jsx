import { Divider, Table } from 'antd';
const columns = [
    {
        title: 'Makine Kodu',
        dataIndex: 'kod',
    },
    {
        title: 'Makine Tanımı',
        dataIndex: 'tanim',
    },
    {
        title: 'Plaka',
        dataIndex: 'plaka',
    },
    {
        title: 'Son Uygulama Tarihi',
        dataIndex: 'uygulama_tarih',
    },
    {
        title: 'Hedef Tarihi',
        dataIndex: 'hedef_tarih',
    },
    {
        title: 'Kalan Süre',
        dataIndex: 'kalan_sure',
    },
    {
        title: 'Kalan Süre  (%)',
        dataIndex: 'kalan_sure_yuzde',
    },
    {
        title: 'Genel Sayaç Değeri',
        dataIndex: 'genel_sayac_deger',
    },
    {
        title: 'Hedef Sayaç',
        dataIndex: 'hedef_sayac',
    },
    {
        title: 'Kalan Sayaç',
        dataIndex: 'kalan_sayac',
    },
    {
        title: 'Kalan Sayaç (%)',
        dataIndex: 'kalan_sayac_yuzde',
    },
    {
        title: 'Makine Tipi',
        dataIndex: 'makine_tipi',
    },
    {
        title: 'Lokasyon',
        dataIndex: 'lokasyon',
    },
    {
        title: 'Makine Durumu',
        dataIndex: 'makine_durum',
    },
    {
        title: 'Makine Kategori',
        dataIndex: 'makine_kategori',
    },
    {
        title: 'Makine Marka',
        dataIndex: 'makine_marka',
    },
    {
        title: 'Makine Model',
        dataIndex: 'makine_model',
    },
    {
        title: 'Hatırlatma Süre',
        dataIndex: 'hatirlatma_sure',
    },
];
const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
    },
];

export default function TanimliMakineler() {
    return (
        <Table
            columns={columns}
            dataSource={data}
            size="small"
            scroll={{
                x: 2000,
                // y: 500,
            }}
        />
    )
}
