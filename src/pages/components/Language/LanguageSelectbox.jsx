import { useEffect, useState } from "react";
import { Select } from "antd";
import i18n from "../../../utils/i18n";
import styled from "styled-components";
import EnglishFlag from "../../../assets/images/English.svg";
import AzerbaijanFlag from "../../../assets/images/Azerbaijan.svg";
import TurkeyFlag from "../../../assets/images/Turkey.svg";
import RussianFlag from "../../../assets/images/Russian.svg";

const { Option } = Select;

const CustomSelect = styled(Select)`
  .ant-select-selector {
    border: none !important;
    box-shadow: none !important;
  }
`;

const OptionContent = styled.div`
  display: flex;
  align-items: center;
`;

const Flag = styled.img`
  margin-right: 8px;
  width: 24px;
  height: auto;
`;

const LanguageSelector = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  useEffect(() => {
    let storedLanguage = localStorage.getItem("i18nextLng") || "en";
    if (storedLanguage.includes("-")) {
      storedLanguage = storedLanguage.split("-")[0];
    }
    setSelectedLanguage(storedLanguage);
    i18n.changeLanguage(storedLanguage);
  }, []);

  const changeLanguage = (lng) => {
    if (lng.includes("-")) {
      lng = lng.split("-")[0];
    }
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
    setSelectedLanguage(lng);
    window.location.reload();
  };

  return (
    <CustomSelect value={selectedLanguage} style={{ width: 150 }} onChange={changeLanguage}>
      <Option value="en">
        <OptionContent>
          <Flag src={EnglishFlag} alt="English" /> English
        </OptionContent>
      </Option>
      <Option value="tr">
        <OptionContent>
          <Flag src={TurkeyFlag} alt="Türkçe" /> Türkçe
        </OptionContent>
      </Option>
      <Option value="ru">
        <OptionContent>
          <Flag src={RussianFlag} alt="Русский" /> Русский
        </OptionContent>
      </Option>
      <Option value="az">
        <OptionContent>
          <Flag src={AzerbaijanFlag} alt="Azərbaycan" /> Azərbaycan
        </OptionContent>
      </Option>
    </CustomSelect>
  );
};

export default LanguageSelector;
