import tr_TR from "antd/es/locale/tr_TR";
import { PlusOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, List, Modal, Select, Typography } from "antd";
import { useForm, FormProvider, Controller } from "react-hook-form";
import AxiosInstance from "../../../../../../../../api/http";
import { useState } from "react";

const data = [];
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

const { Text } = Typography;

export default function FixTarihler() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        const values = methods.getValues();
        const month = months.find(month => month.value === values.month ? month : null).label
        const formattedValues = { ...values, month }
        data.push(`${formattedValues.day} ${formattedValues.month}`)
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const methods = useForm({
        defaultValues: {

        },
    });

    const { setValue, reset, control } = methods;

    // const onSubmit = (data) => {
    //     const Body = {

    //     };

    //     AxiosInstance.post("", Body)
    //         .then((response) => {
    //             // Handle successful response here, e.g.:
    //             console.log("Data sent successfully:", response);
    //             reset();
    //         })
    //         .catch((error) => {
    //             // Handle errors here, e.g.:
    //             console.error("Error sending data:", error);
    //         });
    //     console.log({ Body });
    // };

    return (
        <>
            <FormProvider {...methods}>
                {/* <form onSubmit={methods.handleSubmit(onSubmit)}> */}
                <form>
                    <ConfigProvider locale={tr_TR}>
                        <Button
                            type="primary"
                            onClick={showModal}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: 20
                            }}
                        >
                            <PlusOutlined />
                            Tarih Ekle
                        </Button>

                        <Modal title="Tarih ekle" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                <Text>Gün:</Text>
                                <Controller
                                    name="day"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            allowClear
                                            style={{
                                                width: "100px",
                                                height: "40px",
                                            }}
                                            placeholder="Please select"
                                            defaultValue={[]}
                                            options={days}
                                        />
                                    )}
                                />
                                <Text>Ay:</Text>
                                <Controller
                                    name="month"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            allowClear
                                            style={{
                                                width: "120px",
                                                height: "40px",
                                            }}
                                            placeholder="Please select"
                                            defaultValue={[]}
                                            options={months}
                                        />
                                    )}
                                />
                            </div>
                        </Modal>
                    </ConfigProvider>
                </form>
            </FormProvider>
            <style>
                {
                    `
                        .ant-list {
                            width:230px !important;
                        }
                        .ant-spin-nested-loading {
                            height: 176px !important;
                            overflow: auto !important;
                        }
                    `
                }
            </style>
            <List
                size="small"
                header={<div>Tarihler</div>}
                bordered
                dataSource={data}
                renderItem={(item) => <List.Item>{item}</List.Item>}
            />
        </>


    )
}
