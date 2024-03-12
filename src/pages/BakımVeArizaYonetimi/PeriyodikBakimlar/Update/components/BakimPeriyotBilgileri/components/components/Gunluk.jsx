import { InputNumber, Typography } from 'antd';

const { Text } = Typography;

export default function Gunluk() {

    const onChange = (value) => {
        console.log('changed', value);
    };

    return (
        <div>
            <Text>
                Her <InputNumber min={0} defaultValue={0} onChange={onChange} /> günde bir
            </Text>
        </div>
    )
}
