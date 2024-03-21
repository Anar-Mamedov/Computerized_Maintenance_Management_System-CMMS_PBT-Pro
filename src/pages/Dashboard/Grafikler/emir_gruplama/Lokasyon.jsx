import { Spin, Select } from 'antd';

const Lokasyon = ({ handleChange }) => {
    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>Lokasyon Grafiği</h3>
                <div>
                    <Select
                        defaultValue="Lokasyon"
                        style={{
                            width: 130,
                            marginRight: 10
                        }}
                        onChange={handleChange}
                        options={[
                            {
                                value: 1,
                                label: 'İş Emri Tipi',
                            },
                            {
                                value: 2,
                                label: 'İş Emri Durumu',
                            },
                            {
                                value: 3,
                                label: 'Lokasyon',
                            }
                        ]}
                    />
                    {/* <Ayarlar chart={<Pie {...modalConfig} />} /> */}
                </div>
            </div>
            {/* {isLoading ? <Spin size="large" /> : <Pie {...config} />} */}
            <h5>lokasyon bulunmamakda</h5>
        </>
    )
}

export default Lokasyon;