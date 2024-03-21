import { DatePicker } from 'antd';
import { Button, Popover, ConfigProvider } from 'antd';
import { useForm, Controller } from "react-hook-form";

const DatePickerComp = () => {
    const { handleSubmit, control } = useForm()

    const onChange = (date, dateString) => {
        console.log(date, dateString);
    };

    return (
        <form>
            <Controller
                name="date"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                    <DatePicker
                        {...field}
                        onChange={(date, dateString) => {
                            field.onChange(date);
                            onChange(date, dateString);
                        }}
                        picker="day"
                    />
                )}
            />
        </form>

    )
}

const DayDatePicker = () => {
    return <ConfigProvider
        button={{
            style: { border: 'none' },
        }}
    >
        <div className="demo">
            <div>
                <Popover placement="rightTop" content={<DatePickerComp />}>
                    <Button>Tarih aralığı seç</Button>
                </Popover>
            </div>
        </div>
    </ConfigProvider>
}

export default DayDatePicker;