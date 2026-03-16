import React from "react";
import { HeartOutlined, StarOutlined, UserOutlined } from "@ant-design/icons";

const Popup = ({ record, visible, x, y }) =>
  visible && (
    <ul className="popup" style={{ left: `${x}px`, top: `${y}px` }}>
      <li>
        <UserOutlined />
        {record.name}
      </li>
      <li>
        <HeartOutlined />
        Like it
      </li>
      <li>
        <StarOutlined />
        Bookmark
      </li>
    </ul>
  );

export default Popup;
