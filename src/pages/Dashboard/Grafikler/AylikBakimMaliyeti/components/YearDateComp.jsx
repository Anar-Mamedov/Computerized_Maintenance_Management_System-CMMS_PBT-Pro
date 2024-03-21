import { DatePicker } from 'antd';
import { Button, Popover, ConfigProvider } from 'antd';
import { useForm, Controller } from "react-hook-form";
import { useDate } from '../../../../DateContext';
import styled from "styled-components";
import locale from 'antd/es/locale/tr_TR';

const StyledButton = styled(Button)`
        border: none !important;
        box-shadow: none !important;
`;

const DatePickerComp = () => {
    const { control } = useForm()
    const { selectedDate, setSelectedDate } = useDate();

    const onChange = (date, dateString) => {
        setSelectedDate({ ...selectedDate, aylik_bakim_maliyeti: dateString });
    };

    return (
        <form>
            <Controller
                name="aylik_bakim_maliyeti"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                    <DatePicker
                        {...field}
                        onChange={(date, dateString) => {
                            field.onChange(date);
                            onChange(date, dateString);
                        }}
                        picker="year"
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
                    <StyledButton>Yıla göre seç</StyledButton>
                </Popover>
            </div>
        </div>
    </ConfigProvider>
}

export default YearDatePicker;