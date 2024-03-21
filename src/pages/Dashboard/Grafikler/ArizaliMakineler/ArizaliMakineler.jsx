import { Table, Spin } from 'antd';
import { useState } from 'react';
import useFetch from '../../../hooks/useFetch';
import { Ayarlar } from './components/Ayarlar';

const columns = [
    {
        title: 'Makine Kodu',
        dataIndex: 'MAKINE_KODU',
        // width: 40,
        ellipsis: true,
    },
    {
        title: 'Makine Tanımı',
        dataIndex: 'MAKINE_TANIMI',
        // width: 120,
        ellipsis: true,
    },
    {
        title: 'Makine Tipi',
        dataIndex: 'MAKINE_TIPI',
        // width: 120,
        ellipsis: true,
    },
    {
        title: 'Lokasyon',
        dataIndex: 'LOKASYON',
        // width: 120,
        ellipsis: true,
    },
    {
        title: 'İş Emri Sayısı',
        dataIndex: 'IS_EMRI_SAYISI',
        // width: 120,
        ellipsis: true,
    },
];

const ArizaliMakinelerTablo = () => {
    const [pageSize, setPageSize] = useState(15);
    const [data, isLoading] = useFetch(`GetArizaliMakineler`);

    const handlePageSizeChange = (current, size) => {
        setPageSize(size);
    };

    return (
        <div style={{ width: '100%', height: '100%', overflow: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>Arızalı Makineler</h3>
                <Ayarlar chart={<Table
                    columns={columns}
                    dataSource={data}
                    pagination={{ pageSize: pageSize, onChange: handlePageSizeChange }}
                    bordered
                />} />
            </div>
            {isLoading ? <Spin size="large" /> : <Table
            id='arizali_makineler'
                columns={columns}
                dataSource={data}
                pagination={{ pageSize: pageSize, onChange: handlePageSizeChange }}
                scroll={{
                    x: 1000,
                }}
                bordered
            />}

        </div>
    );
}

export default ArizaliMakinelerTablo

