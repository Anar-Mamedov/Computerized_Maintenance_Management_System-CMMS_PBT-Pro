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

const weeks = [
    {
        label: 'birinci',
        value: 1
    },
    {
        label: 'ikinci',
        value: 2
    },
    {
        label: 'üçüncü',
        value: 3
    },
    {
        label: 'dördüncü',
        value: 4
    },
    {
        label: 'son',
        value: 5
    }
]

const weekDays = [
    {
        label: 'Pazartesi',
        value: 1
    },
    {
        label: 'Salı',
        value: 2
    },
    {
        label: 'Çarşamba',
        value: 3
    },
    {
        label: 'Perşembe',
        value: 4
    },
    {
        label: 'Cuma',
        value: 5
    },
    {
        label: 'Cumartesi',
        value: 6
    },
    {
        label: 'Pazar',
        value: 7
    }
]

const handleChange = (value) => {
    console.log(`selected ${value}`);
};

export default function Aylik() {

    const { control, watch, setValue } = useFormContext();

    const tipGroupValue = watch("tipGroup");
    console.log(tipGroupValue)

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
                    <Radio.Group {...field} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }} defaultValue={1}>
                        <Radio value={1}>Her</Radio>
                        <Radio value={2}>Ayın</Radio>
                        <Radio value={3}>Ayın</Radio>
                    </Radio.Group>
                )}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Controller
                    name="count"
                    control={control}
                    render={({ field }) => (
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <InputNumber {...field} min={0} defaultValue={0} onChange={onChangeInputNum} disabled={tipGroupValue !== 1} style={{ height: "40px" }} />
                            <span>günde bir</span>
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
                        name="count"
                        control={control}
                        render={({ field }) => (
                            <>
                                <InputNumber {...field} min={0} defaultValue={0} onChange={onChangeInputNum} disabled={tipGroupValue !== 2} style={{ height: "40px" }} />
                                <span>ayda bir</span>
                            </>
                        )}
                    />
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Controller
                        name="week"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                disabled={tipGroupValue !== 3}
                                allowClear
                                style={{
                                    width: "150px",
                                    height: "40px",
                                }}
                                placeholder=""
                                defaultValue={[]}
                                onChange={handleChange}
                                options={weeks}
                            />
                        )}
                    />
                    <Controller
                        name="weekDay"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                disabled={tipGroupValue !== 3}
                                allowClear
                                style={{
                                    width: "140px",
                                    height: "40px",
                                }}
                                placeholder=""
                                defaultValue={[]}
                                onChange={handleChange}
                                options={weekDays}
                            />
                        )}
                    />
                    <Controller
                        name="count"
                        control={control}
                        render={({ field }) => (
                            <>
                                <InputNumber {...field} min={0} defaultValue={0} onChange={onChangeInputNum} disabled={tipGroupValue !== 3} style={{ height: "40px" }} />
                                <span>ayda bir</span>
                            </>
                        )}
                    />
                </div>

            </div>
        </div>
    );
}
