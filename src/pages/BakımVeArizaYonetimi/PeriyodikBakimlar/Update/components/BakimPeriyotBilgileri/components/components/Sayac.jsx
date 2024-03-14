import { InputNumber, Typography, Select } from 'antd';
import { Controller, useFormContext } from "react-hook-form";

const { Text } = Typography;

const units = [
    {
        label: 'Adet',
        value: 1
    },
    {
        label: 'BAR',
        value: 2
    },
    {
        label: 'CM',
        value: 3
    },
    {
        label: 'Derece',
        value: 4
    },
    {
        label: 'Kalıp/Saat',
        value: 5
    },
    {
        label: 'KG',
        value: 6
    },
    {
        label: 'KW',
        value: 7
    },
    {
        label: 'Litre',
        value: 8
    }
]

export default function Sayac() {
    const { control, watch, setValue } = useFormContext();

    const onChange = (value) => {
        console.log('changed', value);
    };

    return (
        <div
            style={{
                width: "100%",
                display: 'flex'
            }}>
            <div style={{ display: 'flex', gap: '10px' }}>
                <Controller
                    name="sayac"
                    control={control}
                    render={({ field }) => (
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <span>Her</span>
                            <InputNumber {...field} min={0} placeholder='0' style={{ height: "40px" }} />
                        </div>
                    )}
                />
                <Controller
                    name="sayac_unit"
                    control={control}
                    render={({ field }) => (
                        <Select
                            {...field}
                            allowClear
                            style={{
                                width: "150px",
                                height: "40px",
                            }}
                            placeholder=""
                            defaultValue={[]}
                            // onChange={handleChange}
                            options={units}
                        />
                    )}
                />

            </div>
        </div>
    )
}
