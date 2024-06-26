import { DatePicker } from "antd";
import { Button, Popover, ConfigProvider } from "antd";
import { useFormContext, Controller, useForm } from "react-hook-form";
import { useDate } from "../../../../DateContext";
import styled from "styled-components";
import locale from "antd/es/locale/tr_TR";

const StyledButton = styled(Button)`
  border: none !important;
  box-shadow: none !important;
`;

const DatePickerComp = () => {
  const { control } = useForm();
  const { selectedDate, setSelectedDate } = useDate();

  const onChange = (date, dateString) => {
    setSelectedDate({ ...selectedDate, tamamlanmis_oranlar_zaman: dateString });
  };

  return (
    <Controller
      name="tamamlanmis_oranlar_zaman"
      control={control}
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
  );
};

const YearDatePicker = () => {
  return (
    <ConfigProvider
      locale={locale}
      button={{
        style: { border: "none" },
      }}>
      <div className="demo">
        <div>
          <Popover placement="rightTop" content={<DatePickerComp />}>
            <StyledButton>Yıla göre seç</StyledButton>
          </Popover>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default YearDatePicker;
