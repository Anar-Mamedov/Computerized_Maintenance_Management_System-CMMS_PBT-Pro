import { InputNumber, Typography, Checkbox } from 'antd';

const { Text } = Typography;

const plainOptions = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

export default function Haftalik() {

    const onChange = (value) => {
        console.log('changed', value);
    };

    const onChangeCheckboxes = (checkedValues) => {
        console.log('checked = ', checkedValues);
    };

    return (
        <div>
            <Text>
                Her <InputNumber min={0} placeholder='0' onChange={onChange} /> haftada bir
            </Text>
            <div style={{ borderBottom: "1px solid #e8e8e8", margin: "20px 0 5px", paddingBottom: "5px", width: "100%" }}>
                <Text style={{ fontSize: "14px", fontWeight: "500", color: "#0062ff" }}>Bakımın gerçekleşeceği günler</Text>
            </div>
            <Checkbox.Group options={plainOptions} onChange={onChangeCheckboxes} style={{ flexDirection: 'column' }} />
        </div>
    )
}
