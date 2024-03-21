import { DatePicker } from 'antd';
import { Button, Popover, ConfigProvider } from 'antd';
import { useForm, Controller } from "react-hook-form";

const DatePickerComp = () => {
    const { handleSubmit, control } = useForm()

    // const onChange = (date, dateString) => {
    //     console.log(date, dateString);
    // };

    return (
        <form>
            <Controller
                name="tamamlanmis_oranlar_zaman"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                    <DatePicker
                        {...field}
                        onChange={(date, dateString) => {
                            field.onChange(date);
                            // onChange(date, dateString);
                        }}
                        picker="month"
                    />
                )}
            />
        </form>

    )
}

const MonthDatePicker = () => {
    return <ConfigProvider
        button={{
            style: { border: 'none' },
        }}
    >
        <div className="demo">
            <div>
                <Popover placement="rightTop" content={<DatePickerComp />}>
                    <Button>Aya göre seç</Button>
                </Popover>
            </div>
        </div>
    </ConfigProvider>
}

export default MonthDatePicker;