import { DatePicker } from 'antd';
import { Button, Popover, ConfigProvider } from 'antd';
import { useForm, Controller } from "react-hook-form";
import { useDate } from '../../../../DateContext';
import locale from 'antd/es/locale/tr_TR';

const DatePickerComp = () => {
    const { control } = useForm()
    const { selectedDate, setSelectedDate } = useDate();

    const onChange = (date, dateString) => {
        setSelectedDate({ ...selectedDate, is_emirlerinin_zaman_dagilimi: [dateString + '-01-01', dateString + '-12-31'] });
    };

    return (
        <form>
            <Controller
                name="is_emirlerinin_zaman_dagilimi"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                    <DatePicker
                        {...field}
                        onChange={(date, dateString) => {
                            field.onChange(date);
                            onChange(date, dateString);
                        }}
                        picker='year'
                    />
                )}
            />
        </form>

    )
}

const YearDatePicker = () => {

    return <ConfigProvider
        locale={locale}
        button={{
            style: { border: 'none' },
        }}
    >
        <div className="demo">
            <div>
                <Popover placement="rightTop" content={<DatePickerComp />}>
                    <Button>Yıla göre seç</Button>
                </Popover>
            </div>
        </div>
    </ConfigProvider>
}

export default YearDatePicker;