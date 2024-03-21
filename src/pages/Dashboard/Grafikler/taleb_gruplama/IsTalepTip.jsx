import useFetch from '../../../hooks/useFetch'
import { Pie } from '@ant-design/charts';
import { Spin, Select } from 'antd';
import { Ayarlar } from '../components/Ayarlar';

const IsTalepTip = ({ handleChange }) => {
  const [data, isLoading] = useFetch("GetIsTalepTipEnvanter?ID=2")

  const total = data.reduce((acc, entry) => acc + entry.TALEP_SAYISI, 0);

  let formattedData = [];

  if (data) {
    formattedData = data.map(item => ({
      ...item,
      "İş talebi sayısı": item.TALEP_SAYISI,
      "İş talebi tipi": item.TALEP_TIPI
    }));
  }

  const config = {
    data: formattedData,
    angleField: 'İş talebi sayısı',
    colorField: 'İş talebi tipi',
    radius: .6,
    label: {
      text: "İş talebi sayısı",
      position: 'outside',
      labelHeight: 10,
    },
    // legend: {
    //   color: {
    //     title: true,
    //     position: 'top',
    //     rowPadding: 5,
    //   },
    // },
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
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>İş Talebi Tipleri</h3>
        <div>
          <Select
            defaultValue="İş Talebi Tipi"
            style={{
              width: 130,
              marginRight: 10
            }}
            onChange={handleChange}
            options={[
              {
                value: 1,
                label: 'İş Talebi Tipi',
              },
              {
                value: 2,
                label: 'İş Talebi Durumu',
              },
              {
                value: 3,
                label: 'Lokasyon',
              }
            ]}
          />
          <Ayarlar chart={<Pie {...modalConfig} />} title={'İş Talebi Tipleri'}/>
        </div>
      </div>
      {isLoading ? <Spin size="large" /> : <Pie {...config} />}
    </>
  );
}

export default IsTalepTip;