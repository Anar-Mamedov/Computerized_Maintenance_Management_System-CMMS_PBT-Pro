import React from "react";
import { Tabs } from "antd";
import PropTypes from "prop-types";
import DetayBilgiler from "../../../Update/components/SecondTabs/components/DetayBilgiler/DetayBilgiler";
import DisServis from "../../../Update/components/SecondTabs/components/DisServis/DisServis";

const onChange = () => {
  // console.log(key);
};

export default function SecondTabs({ fieldRequirements }) {
  const items = [
    {
      key: "1",
      label: "Detay Bilgiler",
      children: <DetayBilgiler fieldRequirements={fieldRequirements} />,
    },
    {
      key: "16",
      label: "Dış Servis",
      children: <DisServis fieldRequirements={fieldRequirements} />,
    },
  ];

  return (
    <div>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
}

SecondTabs.propTypes = {
  fieldRequirements: PropTypes.object,
};
