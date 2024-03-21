import React, { useEffect, useState } from 'react';
import { Spin, Table } from 'antd';
import useFetch from '../../../hooks/useFetch';
import { Ayarlar } from './components/Ayarlar';

const columns = [
  {
    title: 'Makine tipi',
    dataIndex: 'MAKINE_TIPI',
    // width: 60,
    ellipsis: true,
  },
  {
    title: 'Adet',
    className: 'column-money',
    dataIndex: 'MAKINE_SAYISI',
    align: 'center',
    // width: 100,
    ellipsis: true,
  },
  {
    title: 'Yüzde',
    dataIndex: 'MAKINE_SAYISI',
    render: (text) => `${text}%`,
    align: 'center',
    // width: 100,
    ellipsis: true,
  },
];

const MakineTipEnvanter = () => {
  const [pageSize, setPageSize] = useState(15);
  const [data, isLoading] = useFetch("GetMakineTipEnvanter?ID=2");

  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
  };

  return (
    <div style={{ height: '100%', width: '100%', overflow: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Makine Tiplerine Göre Envanter Dağılımı</h3>
        <Ayarlar chart={<Table
          columns={columns}
          dataSource={data}
          bordered
          pagination={{ pageSize: pageSize, onChange: handlePageSizeChange }}
        />} />
      </div>
      {
        isLoading ? <Spin size='large' /> :
          (<Table
            id='makine_tip_dagilim'
            columns={columns}
            dataSource={data}
            bordered
            pagination={{ pageSize: pageSize, onChange: handlePageSizeChange }}
            scroll={{
              x: 600,
            }}
          />)
      }
    </div>
  );
};

export default MakineTipEnvanter;
