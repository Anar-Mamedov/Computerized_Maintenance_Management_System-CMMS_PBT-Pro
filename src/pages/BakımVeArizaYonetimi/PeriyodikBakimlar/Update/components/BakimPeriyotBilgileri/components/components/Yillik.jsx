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

export default function Yillik() {

    const { control, watch, setValue } = useFormContext();

    const tipGroupValue = watch("tipGroup");

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
                name="tipGroup"
                control={control}
                defaultValue={1}
                render={({ field }) => (
                    <Radio.Group {...field} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }} >
                        <Radio value={1}>Her</Radio>
                        <Radio value={2}></Radio>
                    </Radio.Group>
                )}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Controller
                    name="year_count"
                    control={control}
                    render={({ field }) => (
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <InputNumber {...field} min={0} placeholder='0' onChange={onChangeInputNum} disabled={tipGroupValue !== 1} style={{ height: "40px" }} />
                            <span>yılda bir</span>
                        </div>
                    )}
                />
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Controller
                        name="day"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                disabled={tipGroupValue !== 2}
                                mode="multiple"
                                allowClear
                                style={{
                                    width: "300px",
                                    height: "40px",
                                }}
                                placeholder="Please select"
                                defaultValue={[]}
                                onChange={handleChange}
                                options={days}
                            />
                        )}
                    />
                    <Controller
                        name="month"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                disabled={tipGroupValue !== 2}
                                mode="multiple"
                                allowClear
                                style={{
                                    width: "300px",
                                    height: "40px",
                                }}
                                placeholder="Please select"
                                defaultValue={[]}
                                onChange={handleChange}
                                options={months}
                            />
                        )}
                    />
                    <Controller
                        name="count"
                        control={control}
                        render={({ field }) => (
                            <>
                                <InputNumber {...field} min={0} placeholder='0' onChange={onChangeInputNum} disabled={tipGroupValue !== 2} style={{ height: "40px" }} />
                                <span>ayda bir</span>
                            </>
                        )}
                    />
                </div>
            </div>
        </div>
    );
}
