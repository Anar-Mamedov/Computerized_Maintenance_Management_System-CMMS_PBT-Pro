// MainTabs.jsx
import React, { useState, useContext, useMemo, useEffect } from "react";
import { Flex, Transfer, Table, Button } from "antd";
import { DndContext } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { HolderOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../api/http.jsx";

const RowContext = React.createContext({});

const DragHandle = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return <Button type="text" size="small" icon={<HolderOutlined />} style={{ cursor: "move" }} ref={setActivatorNodeRef} {...listeners} />;
};

const SortableRow = (props) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: props["data-row-key"],
  });
  const style = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
  };
  const contextValue = useMemo(() => ({ setActivatorNodeRef, listeners }), [setActivatorNodeRef, listeners]);
  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  );
};

const TableTransfer = (props) => {
  const { leftColumns, rightColumns, targetKeys, onTargetChange, ...restProps } = props;
  const [rightTableData, setRightTableData] = useState(props.dataSource.filter((item) => targetKeys.includes(item.key)));
  const { setValue } = useFormContext();

  useEffect(() => {
    const updatedRightTableData = props.dataSource.filter((item) => targetKeys.includes(item.key));
    setRightTableData(updatedRightTableData);
  }, [targetKeys, props.dataSource]);

  const handleDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setRightTableData((prevState) => {
        const activeIndex = prevState.findIndex((item) => item.key === active.id);
        const overIndex = prevState.findIndex((item) => item.key === over?.id);
        const updatedData = arrayMove(prevState, activeIndex, overIndex);
        const updatedKeys = updatedData.map((item) => item.key);
        onTargetChange(updatedKeys);
        setValue("sortedKeys", updatedKeys);
        return updatedData;
      });
    }
  };

  const handleTableTransferChange = (nextTargetKeys) => {
    onTargetChange(nextTargetKeys);
    const newRightTableData = props.dataSource.filter((item) => nextTargetKeys.includes(item.key));
    setRightTableData(newRightTableData);
    setValue(
      "sortedKeys",
      newRightTableData.map((item) => item.key)
    );
  };

  return (
    <Transfer {...restProps} style={{ width: "100%" }} targetKeys={targetKeys} onChange={handleTableTransferChange} render={(item) => item.ROL_TANIM}>
      {({ direction, filteredItems, onItemSelect, onItemSelectAll, selectedKeys, disabled }) => {
        const columns = direction === "left" ? leftColumns : rightColumns;
        const data = direction === "left" ? filteredItems : rightTableData;

        const rowSelection = {
          getCheckboxProps: () => ({ disabled }),
          onChange(selectedRowKeys) {
            onItemSelectAll(selectedRowKeys, "replace");
          },
          selectedRowKeys: selectedKeys,
        };

        return direction === "left" ? (
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={filteredItems}
            size="small"
            style={{ pointerEvents: disabled ? "none" : undefined }}
            onRow={({ key, disabled: itemDisabled }) => ({
              onClick: () => {
                if (itemDisabled || disabled) {
                  return;
                }
                onItemSelect(key, !selectedKeys.includes(key));
              },
            })}
          />
        ) : (
          <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
            <SortableContext items={rightTableData.map((item) => item.key)} strategy={verticalListSortingStrategy}>
              <Table
                rowSelection={rowSelection}
                columns={[
                  {
                    key: "sort",
                    align: "center",
                    width: 80,
                    render: () => <DragHandle />,
                  },
                  ...rightColumns,
                ]}
                dataSource={rightTableData}
                components={{
                  body: {
                    row: SortableRow,
                  },
                }}
                size="small"
                style={{ pointerEvents: disabled ? "none" : undefined }}
                onRow={({ key, disabled: itemDisabled }) => ({
                  onClick: () => {
                    if (itemDisabled || disabled) {
                      return;
                    }
                    onItemSelect(key, !selectedKeys.includes(key));
                  },
                })}
              />
            </SortableContext>
          </DndContext>
        );
      }}
    </Transfer>
  );
};

const columns = [{ dataIndex: "ROL_TANIM", title: "Rol Tanımı" }];

const filterOption = (input, item) => item.ROL_TANIM?.includes(input);

const MainTabs = ({ selectedRow }) => {
  const [targetKeys, setTargetKeys] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [mockData, setMockData] = useState([]);
  const [rightTableData, setRightTableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.post("/GetOnayRolTanim");
        const data = response.map((item) => ({ ...item, key: item.TB_ROL_ID.toString() }));
        setMockData(data);
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchRightTableData = async () => {
      if (selectedRow) {
        try {
          const response = await AxiosInstance.post(`/GetOnayKuralList?ONR_ONYTANIM_ID=${selectedRow.key}`);
          const data = response.map((item) => item.ONR_ROL_ID.toString());
          setTargetKeys(data);
          const updatedRightTableData = mockData.filter((item) => data.includes(item.key));
          setRightTableData(updatedRightTableData);
        } catch (error) {
          console.error("API Error:", error);
        }
      }
    };

    fetchRightTableData();
  }, [selectedRow, mockData]);

  const onChange = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys);
    const newRightTableData = mockData.filter((item) => nextTargetKeys.includes(item.key));
    setRightTableData(newRightTableData);
  };

  return (
    <Flex align="start" gap="middle" vertical>
      <TableTransfer
        dataSource={mockData}
        targetKeys={targetKeys}
        disabled={disabled}
        showSearch
        showSelectAll={false}
        onChange={onChange}
        filterOption={filterOption}
        leftColumns={columns}
        rightColumns={columns}
        onTargetChange={setTargetKeys}
      />
    </Flex>
  );
};

export default MainTabs;
