import { Spin, Table, Input } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import AxiosInstance from '../../../../../../../../../../api/http';
import TipEkle from '../../Insert/TipEkle';

export default function MainTabs({ onSelectedRow, isEmriTipiID }) {
  const { setValue } = useFormContext();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRowKey, setSelectedRowKey] = useState(null); // Yeni state
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Filtrelenmiş veri için yeni state
  const [searchTerm, setSearchTerm] = useState(''); // Arama terimi için state

  console.log(isEmriTipiID);

  // Örnek kolonlar ve başlangıçta hepsinin görünür olacağı varsayılıyor
  const columns = [
    {
      title: '',
      dataIndex: 'IMT_TANIM',
      key: 'IMT_TANIM',
      width: '150px',
      ellipsis: true,
    },
    // Diğer kolonlarınız...
  ];

  useEffect(() => {
    const fetchEquipmentData = async () => {
      try {
        setLoading(true);
        const response = await AxiosInstance.get(`IsEmriTip`);
        if (response) {
          const formattedData = response.map((item) => ({
            ...item,
            key: item.TB_ISEMRI_TIP_ID,
          }));
          setData(formattedData);
          setFilteredData(formattedData);
          setLoading(false);

          // Check if there's an ID to select initially, including 0
          if (isEmriTipiID !== null && isEmriTipiID !== undefined) {
            const selectedRow = formattedData.find((row) => row.key === isEmriTipiID);
            if (selectedRow) {
              setSelectedRowKeys([selectedRow.key]);
              setSelectedRows([selectedRow]);
              setSelectedRowKey(selectedRow.key); // Set the selected row key
              onSelectedRow(selectedRow); // Simulate the click event after data load
            }
          }
        } else {
          console.error('API response is not in expected format');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in API request:', error);
        setLoading(false);
      }
    };

    if (isEmriTipiID !== null && isEmriTipiID !== undefined) {
      fetchEquipmentData();
    }
  }, [isEmriTipiID]); // Dependency array to refetch when ID changes

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    if (newSelectedRowKeys.length > 0) {
      setValue('selectedLokasyonId', newSelectedRowKeys[0]);
    } else {
      setValue('selectedLokasyonId', null);
    }
    // Seçilen satırların verisini bul
    const newSelectedRows = data.filter((row) => newSelectedRowKeys.includes(row.key));
    setSelectedRows(newSelectedRows); // Seçilen satırların verilerini state'e ata
  };

  const rowSelection = {
    type: 'checkbox',
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onRowClick = (record) => {
    return {
      onClick: () => {
        setSelectedRowKey(record.key); // Seçili satırın key'ini ayarla
        onSelectedRow(record); // Üst bileşene tıklanan satırın verisini aktar
      },
    };
  };

  const rowClassName = (record) => {
    return record.key === selectedRowKey ? 'selected-row' : ''; // Seçili satıra özel class
  };

  const refreshTableData = useCallback(() => {
    // Tablodan seçilen kayıtların checkbox işaretini kaldır
    setSelectedRowKeys([]);
    setSelectedRows([]);

    // Verileri yeniden çekmek için `fetchEquipmentData` fonksiyonunu çağır
    fetchEquipmentData();
  }, []); // Bağımlılıkları kaldırdık, çünkü fonksiyon içindeki değerler zaten en güncel halleriyle kullanılıyor.

  // Arama terimindeki değişiklikleri işleyen fonksiyon
  // Türkçe karakterleri İngilizce karşılıkları ile değiştiren fonksiyon
  const normalizeText = (text) => {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ğ/g, 'g')
      .replace(/Ğ/g, 'G')
      .replace(/ü/g, 'u')
      .replace(/Ü/g, 'U')
      .replace(/ş/g, 's')
      .replace(/Ş/g, 'S')
      .replace(/ı/g, 'i')
      .replace(/İ/g, 'I')
      .replace(/ö/g, 'o')
      .replace(/Ö/g, 'O')
      .replace(/ç/g, 'c')
      .replace(/Ç/g, 'C');
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value) {
      const normalizedSearchTerm = normalizeText(value); // Arama terimini normalize et
      const filtered = data.filter((item) =>
        Object.keys(item).some((key) => item[key] && normalizeText(item[key].toString()).toLowerCase().includes(normalizedSearchTerm.toLowerCase()))
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  return (
    <div style={{ width: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
      <style>
        {`
          .boldRow {
            font-weight: bold;
          }
          .selected-row {
            background-color: #2bc77135;  // Açık yeşil arkaplan rengi
          }
        `}
      </style>
      <Input
        placeholder="Ara..."
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: '-48px', zIndex: '2' }} // Arama kutusunun altındaki boşluk
      />
      <Spin spinning={loading}>
        <Table
          columns={columns}
          // rowSelection={rowSelection}
          rowClassName={rowClassName}
          dataSource={filteredData}
          pagination={false}
          onRow={onRowClick}
          scroll={{ y: '500px' }}
        />
      </Spin>
      <TipEkle onRefresh={refreshTableData} />
    </div>
  );
}
