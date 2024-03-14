import { Tabs } from 'antd';
import Sayac from './components/Sayac';

export default function TarihVeYASayac({ items }) {
    return (
        <div className='inner-tabs'>
            <style>
                {
                    `
                        .inner-tabs .ant-tabs-tab {
                            background: transparent !important;
                        }
                    `
                }
            </style>
            <Tabs
                defaultActiveKey="1"
                tabPosition={'left'}
                style={{
                    height: 268,
                }}
                items={items}
            />
            {items.find(item => item.key === 5) === undefined && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '30px', paddingLeft: 24, gap: 86 }}>
                    <label htmlFor="">Sayaç</label>
                    <Sayac />
                </div>
            )}


        </div>
    );
}