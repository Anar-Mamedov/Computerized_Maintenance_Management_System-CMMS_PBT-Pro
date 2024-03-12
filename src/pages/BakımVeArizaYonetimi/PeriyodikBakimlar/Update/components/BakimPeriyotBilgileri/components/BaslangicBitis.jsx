import React from 'react';
import { Radio, Typography, Select, InputNumber, Space } from "antd";
import { Controller, useFormContext } from "react-hook-form";

const { Text } = Typography;

const days = [];
for (let i = 1; i <= 31; i++) {
    days.push({
        label: i,
        value: i,
    });
}

const months = [
    {
        label: 'Ocak',
        value: 1
    },
    {
        label: 'Şubat',
        value: 2
    },
    {
        label: 'Mart',
        value: 3
    },
    {
        label: 'Nisan',
        value: 4
    },
    {
        label: 'Mayıs',
        value: 5
    },
    {
        label: 'Haziran',
        value: 6
    },
    {
        label: 'Temmuz',
        value: 7
    },
    {
        label: 'Ağustos',
        value: 8
    },
    {
        label: 'Eylül',
        value: 9
    },
    {
        label: 'Ekim',
        value: 10
    },
    {
        label: 'Kasım',
        value: 11
    },
    {
        label: 'Aralık',
        value: 12
    }
]

const handleChange = (value) => {
    console.log(`selected ${value}`);
};

export default function BaslangicBitis() {

    const { control, watch, setValue } = useFormContext();

    const startEnd = watch("startEndGroup");

    const onChangeInputNum = (value) => {
        console.log(`selected ${value}`);
    }

    return (
        <div
            style={{
                width: "100%",
                display: 'flex'
            }}>
            <style>
                {
                    `
                            :where(.css-dev-only-do-not-override-1drr2mu).ant-select-multiple.ant-select-show-arrow .ant-select-selector, :where(.css-dev-only-do-not-override-1drr2mu).ant-select-multiple.ant-select-allow-clear .ant-select-selector {overflow: auto !important}
                        `
                }
            </style>
            <Controller
                name="startEndGroup"
                control={control}
                defaultValue={1}
                render={({ field }) => (
                    <Radio.Group {...field} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', gap: '0px' }} >
                        <Radio value={1}>Sürekli Bakım</Radio>
                        <Radio value={2}>Bakım Tekrarlama Sayısı</Radio>
                        <Radio value={3}>Bakım Dönem Aralığı</Radio>
                        <Radio value={4}>Bakım Bitiş Tarihi</Radio>
                    </Radio.Group>
                )}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '44px' }}>
                <Controller
                    name="year_count"
                    control={control}
                    render={({ field }) => (
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>

                        </div>
                    )}
                />
                <Controller
                    name="day"
                    control={control}
                    render={({ field }) => (
                        <InputNumber {...field} min={0} defaultValue={0} onChange={onChangeInputNum} disabled={startEnd !== 2} style={{ height: "40px" }} />
                    )}
                />
                <Controller
                    name="month"
                    control={control}
                    render={({ field }) => (
                        <InputNumber {...field} min={0} defaultValue={0} onChange={onChangeInputNum} disabled={startEnd !== 3} style={{ height: "40px" }} />
                    )}
                />
                <Controller
                    name="count"
                    control={control}
                    render={({ field }) => (
                        <>
                            <InputNumber {...field} min={0} defaultValue={0} onChange={onChangeInputNum} disabled={startEnd !== 4} style={{ height: "40px" }} />
                        </>
                    )}
                />
            </div>
        </div>
    );
}
