import React, { useState } from "react";
import {
  ClockCircleOutlined,
  FormOutlined,
  FallOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { Spin, Modal } from "antd";
import useFetch from "../../../hooks/useFetch";
import bg from "../../../assets/images/bg-card.png";
import "../dashboard.css";
import ModalTablo from "../../YardimMasasi/IsTalepleri/Table/ModalTablo/ModalTablo.jsx";
import MainTable from "../../YardimMasasi/IsTalepleri/Table/Table.jsx";
import { FormProvider, useForm } from "react-hook-form";

export default function DashboardStatisticCards() {
  const [data, isLoading] = useFetch("GetDashboardCards?ID=2");
  const formMethods = useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="statistic-card-flex">
      <div
        className="card"
        style={{
          background: `url(${bg}), linear-gradient(rgb(27 17 92), #7A6FBE)`,
          backgroundPosition: "inherit",
          backgroundSize: "cover",
        }}
      >
        {isLoading ? (
          <Spin tip="Yükleniyor" size="large" style={{ color: "#fff" }}>
            <div />
          </Spin>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
            onClick={showModal}
          >
            <div>
              <p>{data.DEVAM_EDEN_IS_TALEPLERI}</p>
              <h2>Devam Eden İş Talepleri</h2>
            </div>
            <ClockCircleOutlined
              style={{ fontSize: "60px", color: "rgba(255,255,255,.8)" }}
            />
          </div>
        )}
      </div>
      <Modal
        width={1400}
        centered
        title="Devam Eden İş Talepleri"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <FormProvider {...formMethods}>
          <div>
            <ModalTablo />
          </div>
        </FormProvider>
      </Modal>
      <div
        className="card"
        style={{
          background: `url(${bg}), linear-gradient(rgb(27 17 92), #7A6FBE)`,
          backgroundPosition: "inherit",
          backgroundSize: "cover",
        }}
      >
        {isLoading ? (
          <Spin tip="Yükleniyor" size="large" style={{ color: "#fff" }}>
            <div />
          </Spin>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <p>{data.ACIK_IS_EMIRLERI}</p>
              <h2>Açık İş Emirleri</h2>
            </div>
            <FormOutlined
              style={{ fontSize: "60px", color: "rgba(255,255,255,.8)" }}
            />
          </div>
        )}
      </div>
      <div
        className="card"
        style={{
          background: `url(${bg}), linear-gradient(rgb(27 17 92), #7A6FBE)`,
          backgroundPosition: "inherit",
          backgroundSize: "cover",
        }}
      >
        {isLoading ? (
          <Spin tip="Yükleniyor" size="large" style={{ color: "#fff" }}>
            <div />
          </Spin>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <p>{data.DUSUK_STOKLU_MALZEMELER}</p>
              <h2>Düşük Stoklu Malzemeler</h2>
            </div>
            <FallOutlined
              style={{ fontSize: "60px", color: "rgba(255,255,255,.8)" }}
            />
          </div>
        )}
      </div>
      <div
        className="card"
        style={{
          background: `url(${bg}), linear-gradient(rgb(27 17 92), #7A6FBE)`,
          backgroundPosition: "inherit",
          backgroundSize: "cover",
        }}
      >
        {isLoading ? (
          <Spin tip="Yükleniyor" size="large" style={{ color: "#fff" }}>
            <div />
          </Spin>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <p>{data.MAKINE_SAYISI}</p>
              <h2>Toplam Makine Sayısı</h2>
            </div>
            <HistoryOutlined
              style={{ fontSize: "60px", color: "rgba(255,255,255,.8)" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
