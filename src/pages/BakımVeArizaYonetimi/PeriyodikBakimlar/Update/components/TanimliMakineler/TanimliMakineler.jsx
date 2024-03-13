import { Button, Table, Modal } from 'antd';
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useState } from 'react';
import LocationFilter from '../../../Table/filter/LocationFilter';

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        lokasyonlar: {},
        bakimtipleri: {},
        bakimgruplar: {},
        atolyeler: {},
    });
    const [body, setBody] = useState({
        keyword: "",
        filters: {},
    });
    const [currentPage, setCurrentPage] = useState(1);

    const handleBodyChange = useCallback((type, newBody) => {
        setBody((state) => ({
            ...state,
            [type]: newBody,
        }));
        setCurrentPage(1); // Filtreleme yapıldığında sayfa numarasını 1'e ayarla
    }, []);

    useEffect(() => {
        handleBodyChange("filters", filters);
    }, [filters, handleBodyChange]);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
                <Button
                    type="primary"
                    onClick={showModal}
                    style={{
                        display: "flex",
                        alignItems: "center",
                    }}>
                    <PlusOutlined />
                    Ekle
                </Button>

                <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                        <div>
                            <LocationFilter onSubmit={(newFilters) => setFilters((state) => ({ ...state, lokasyonlar: newFilters }))} />
                        </div>
                        <div>
                            <Button
                                // type="primary"
                                // onClick={showModal}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}>
                                <SearchOutlined />
                                Ara
                            </Button>
                        </div>

                    </div>

                    <Table
                        columns={columns}
                        dataSource={data}
                        size="small"
                        scroll={{
                            x: 2000,
                            // y: 500,
                        }}
                    />


                </Modal>
            </div>
            <Table
                columns={columns}
                dataSource={data}
                size="small"
                scroll={{
                    x: 2000,
                    // y: 500,
                }}
            />
        </>

    )
}
