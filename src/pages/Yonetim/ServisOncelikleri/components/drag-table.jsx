import React, { useState } from "react";
import { Table } from "antd";
import ReactDragListView from "react-drag-listview";

const columnsName = [
  {
    title: <span className="dragHandler">Key</span>,
    dataIndex: "key",
    render: (text) => <span>{text}</span>,
    width: 50,
  },
  {
    title: <span className="dragHandler">Name</span>,
    dataIndex: "name",
    width: 200,
  },
  {
    title: <span className="dragHandler">Gender</span>,
    dataIndex: "gender",
    width: 100,
  },
  {
    title: <span className="dragHandler">Age</span>,
    dataIndex: "age",
    width: 100,
  },
  {
    title: <span className="dragHandler">Address</span>,
    dataIndex: "address",
  },
];

const Demo = () => {
  const [columns, setColumns] = useState(columnsName);

  const dragProps = {
    onDragEnd: (fromIndex, toIndex) => {
      const updatedColumns = [...columns];
      const item = updatedColumns.splice(fromIndex, 1)[0];
      updatedColumns.splice(toIndex, 0, item);
      setColumns(updatedColumns);
    },
    nodeSelector: "th",
    handleSelector: ".dragHandler",
    ignoreSelector: "react-resizable-handle",
  };

  const data = [
    {
      key: "1",
      name: "Boran",
      gender: "male",
      age: "12",
      address: "New York",
    },
    {
      key: "2",
      name: "JayChou",
      gender: "male",
      age: "38",
      address: "TaiWan",
    },
    {
      key: "3",
      name: "Lee",
      gender: "female",
      age: "22",
      address: "BeiJing",
    },
    {
      key: "4",
      name: "ChouTan",
      gender: "male",
      age: "31",
      address: "HangZhou",
    },
    {
      key: "5",
      name: "AiTing",
      gender: "female",
      age: "22",
      address: "Xi’An",
    },
  ];

  const renderedColumns = columns.map((col, index) => ({
    ...col,
    onHeaderCell: (column) => ({
      width: column.width,
    }),
  }));

  return (
    <ReactDragListView.DragColumn {...dragProps}>
      <Table bordered columns={renderedColumns} dataSource={data} />
    </ReactDragListView.DragColumn>
  );
};

export default Demo;
