import { useState } from "react";
import { Input, AutoComplete } from "antd";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { selectedMenuItemState, menuItemsState } from "../../../state/menuState";
import { SearchOutlined } from "@ant-design/icons";

const SearchComponent = () => {
  const [options, setOptions] = useState([]);
  const [searchInput, setSearchInput] = useState(""); // Search input state
  const navigate = useNavigate();
  const setSelectedMenuItem = useSetRecoilState(selectedMenuItemState);
  const menuPaths = useRecoilValue(menuItemsState);

  const handleSearch = (value) => {
    setSearchInput(value); // Update search input state
    if (value) {
      const filteredOptions = menuPaths
        .filter((item) => item.label.toLowerCase().includes(value.toLowerCase()))
        .map((item) => ({
          value: item.path,
          label: item.label,
        }));
      setOptions(filteredOptions);
    } else {
      setOptions([]);
    }
  };

  const handleSelect = (path, option) => {
    navigate(path);
    setSearchInput(option.label); // Set the search input to the selected label
    const selectedItem = menuPaths.find((item) => item.path === path);
    if (selectedItem) {
      setSelectedMenuItem(selectedItem.path.split("/")[1]);
    }
  };

  return (
    <AutoComplete
      options={options}
      style={{ width: 200 }}
      value={searchInput} // Bind the search input value to the input field
      onSelect={handleSelect}
      onSearch={handleSearch}
    >
      <Input placeholder="Menüde ara..." prefix={<SearchOutlined style={{ color: "#0091ff" }} />} />
    </AutoComplete>
  );
};

export default SearchComponent;
