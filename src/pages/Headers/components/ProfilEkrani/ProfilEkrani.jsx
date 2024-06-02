import React from "react";
import { Avatar, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

function ProfilEkrani(props) {
  return (
    <div>
      <div className="profil-ekrani">
        <div className="profil-ekrani__avatar">
          <Avatar size={64} icon={<UserOutlined />} />
        </div>
        <div className="profil-ekrani__bilgiler">
          <Text strong>{props.adSoyad}</Text>
          <Text>{props.email}</Text>
        </div>
      </div>
    </div>
  );
}

export default ProfilEkrani;
