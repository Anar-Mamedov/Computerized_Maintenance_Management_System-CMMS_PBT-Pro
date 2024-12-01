import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Form, Input, InputNumber, Popconfirm, Table, Switch, message } from "antd";
import AxiosInstance from "../../../../../../api/http";
import { t } from "i18next";
import styled from "styled-components";

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, ...restProps }) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    if (dataIndex === "hatirlat") {
      childNode = <Switch checked={record[dataIndex]} onChange={(checked) => handleSave({ ...record, [dataIndex]: checked })} />;
    } else {
      const isNumberField = dataIndex === "uyariSuresi" || dataIndex === "kritikSure";

      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
            {
              type: "number",
              message: `${title} must be a number.`,
            },
          ]}
        >
          {isNumberField ? (
            <InputNumber
              ref={inputRef}
              onPressEnter={save}
              onBlur={save}
              min={1} // Minimum değer
              style={{ width: "100%" }}
            />
          ) : (
            <Input ref={inputRef} onPressEnter={save} onBlur={save} />
          )}
        </Form.Item>
      ) : (
        <EditableCellValueWrap onClick={toggleEdit}>{children}</EditableCellValueWrap>
      );
    }
  }

  return <EditableCellStyled {...restProps}>{childNode}</EditableCellStyled>;
};

const HatirlaticiTablosu = ({ setLoading }) => {
  const [dataSource, setDataSource] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get(`ReminderSettings/GetReminderSettingsItems`);
      const items = response.data.map((item) => ({
        ...item,
        key: item.hatirlaticiAyarId,
        hatirlat: item.hatirlat,
      }));
      setDataSource(items);
    } catch (error) {
      console.error("Veri çekilirken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const defaultColumns = [
    {
      title: t("hatirlatici"),
      dataIndex: "grupAciklama",
      width: "150px",
      ellipsis: true,
    },
    {
      title: t("uyariSuresi"),
      dataIndex: "uyariSuresi",
      width: "50px",
      ellipsis: true,
      editable: true,
    },
    {
      title: t("kritikSure"),
      dataIndex: "kritikSure",
      width: "50px",
      ellipsis: true,
      editable: true,
    },
    {
      title: t("hatirlat"),
      dataIndex: "hatirlat",
      width: "50px",
      ellipsis: true,
      editable: true,
    },
  ];

  const handleSave = async (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);

    // Send the updated data to the API
    try {
      const response = await AxiosInstance.post(`ReminderSettings/UpdateReminderSettingsItems`, {
        hatirlaticiAyarId: Number(row.key),
        hatirlat: row.hatirlat,
        uyariSuresi: Number(row.uyariSuresi),
        kritikSure: Number(row.kritikSure),
        ekranYenilemeSuresi: row.ekranYenilemeSuresi || 0, // Assuming ekranYenilemeSuresi is not editable and default to 0
      });
      if (response.data.statusCode === 200 || response.data.statusCode === 201 || response.data.statusCode === 202) {
        message.success(t("kayitGuncellendi"));
      }
    } catch (error) {
      console.error("Güncelleme sırasında hata oluştu:", error);
    }
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div>
      <Table components={components} rowClassName={() => "editable-row"} bordered dataSource={dataSource} columns={columns} />
    </div>
  );
};

const EditableCellStyled = styled.td`
  position: relative;
`;

const EditableCellValueWrap = styled.div`
  padding: 5px 12px;
  cursor: pointer;

  .editable-row:hover & {
    padding: 4px 11px;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
  }
`;

export default HatirlaticiTablosu;
