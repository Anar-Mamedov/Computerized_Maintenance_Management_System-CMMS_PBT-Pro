import React from 'react';
import { Tabs, Input, Typography, Tooltip } from 'antd';
import styled from 'styled-components';
import { useFormContext, Controller } from 'react-hook-form';
import ResimCarousel from './ResimCarousel';
import ResimUpload from './Resim/ResimUpload';
import DosyaUpload from './Dosya/DosyaUpload';

const { TextArea } = Input;
const { Text, Link } = Typography;

const onChange = (key) => {
  // console.log(key);
};

//styled components
const StyledTabs = styled(Tabs)`
  .ant-tabs-nav {
    align-items: flex-start !important;
  }

  .ant-tabs-tab {
    margin: 0 !important;
    width: 100% !important;
    padding: 10px 15px;
    justify-content: left;
    text-align: left;
    ${'' /* background-color: rgba(230, 230, 230, 0.3); */}
  }

  .ant-tabs-tab-active {
    background-color: #2bc77135;
    width: 100%;
  }

  .ant-tabs-nav .ant-tabs-tab-active .ant-tabs-tab-btn {
    color: rgba(0, 0, 0, 0.88) !important;
  }

  .ant-tabs-tab:hover .ant-tabs-tab-btn {
    color: rgba(0, 0, 0, 0.88) !important;
  }

  .ant-tabs-tab:not(:first-child) {
    ${'' /* border-left: 1px solid #80808024; */}
  }

  .ant-tabs-ink-bar {
    background: #2bc770;
  }

  .ant-tabs-nav-operations {
    display: none !important;
  }
`;

//styled components end

export default function Sekmeler({ refreshKey, disabled, selectedRows }) {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const text = `${selectedRows[0]?.MKN_KOD} - ${selectedRows[0]?.MKN_TANIM}`;

  const operations = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        padding: '5px',
      }}
    >
      <Tooltip title={text}>
        <Text
          style={{
            fontSize: '15px',
            fontWeight: '500',
            width: '100%',
            maxWidth: '290px', // ya da belirli bir piksel değeri, örneğin '200px'
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {text}
        </Text>
      </Tooltip>

      <div style={{ display: 'flex', gap: '10px' }}>
        <ResimCarousel selectedRows={selectedRows} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginRight: '5px',
            gap: '1px',
          }}
        >
          <Text
            type="secondary"
            style={{
              width: '100%',
              maxWidth: '166px', // ya da belirli bir piksel değeri, örneğin '200px'
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={`${selectedRows[0]?.MKN_MARKA} | ${selectedRows[0]?.MKN_MODEL}`}
          >
            {selectedRows[0]?.MKN_MARKA} | {selectedRows[0]?.MKN_MODEL}
          </Text>
          <Text
            type="secondary"
            style={{
              width: '100%',
              maxWidth: '166px', // ya da belirli bir piksel değeri, örneğin '200px'
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={`Makne Tipi: ${selectedRows[0]?.MKN_TIP}`}
          >
            Makne Tipi: {selectedRows[0]?.MKN_TIP}
          </Text>
          <Text
            type="secondary"
            style={{
              width: '100%',
              maxWidth: '166px', // ya da belirli bir piksel değeri, örneğin '200px'
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={`Lokasyon: ${selectedRows[0]?.MKN_LOKASYON}`}
          >
            Lokasyon: {selectedRows[0]?.MKN_LOKASYON}
          </Text>
          <Text
            type="secondary"
            style={{
              width: '100%',
              maxWidth: '166px', // ya da belirli bir piksel değeri, örneğin '200px'
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={`Durum: ${selectedRows[0]?.MKN_DURUM}`}
          >
            Durum: {selectedRows[0]?.MKN_DURUM}
          </Text>
        </div>
      </div>
    </div>
  );

  const items = [
    {
      key: '1',
      label: 'Özet',
      children: 'Grafikler',
    },
    {
      key: '2',
      label: 'İş Emirleri',
      children: '',
    },
    {
      key: '3',
      label: 'İş Talepleri',
      children: '',
    },
    {
      key: '4',
      label: 'Yedek Parça ve Malzeme Kullanımları',
      children: '',
    },
    {
      key: '5',
      label: 'Yapılan İşçilikler',
      children: '',
    },
    {
      key: '6',
      label: 'Duruşlar',
      children: '',
    },
    {
      key: '7',
      label: 'Lokasyon Transferleri',
      children: '',
    },
    {
      key: '8',
      label: 'Resimler',
      children: <ResimUpload selectedRows={selectedRows} />,
    },
    {
      key: '9',
      label: 'Dokümanlar',
      children: <DosyaUpload selectedRows={selectedRows} />,
    },
  ];

  return (
    <div>
      <StyledTabs defaultActiveKey="1" tabBarExtraContent={{ left: operations }} tabPosition="left" items={items} onChange={onChange} />
    </div>
  );
}
