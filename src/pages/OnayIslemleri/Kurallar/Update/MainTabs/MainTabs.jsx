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
  const contextValue = useMemo(
    () => ({
      setActivatorNodeRef,
      listeners,
    }),
    [setActivatorNodeRef, listeners]
  );
  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  );
};

const TableTransfer = (props) => {
  const { leftColumns, rightColumns, targetKeys, rightTableData, onTargetChange, ...restProps } = props;
  const [rightTableStateData, setRightTableStateData] = useState(rightTableData); // Initialize with API data

  useEffect(() => {
    setRightTableStateData(rightTableData); // Ensure state is updated with API data when rightTableData changes
  }, [rightTableData]);

  const { setValue } = useFormContext();

  const handleDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setRightTableStateData((prevState) => {
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

    const newRightTableData = rightTableStateData.filter((item) => nextTargetKeys.includes(item.key));
    const newItems = nextTargetKeys.filter((key) => !rightTableStateData.some((item) => item.key === key));
    const updatedRightTableData = [...newRightTableData, ...props.dataSource.filter((item) => newItems.includes(item.key))];

    setRightTableStateData(updatedRightTableData);
    setValue(
      "sortedKeys",
      updatedRightTableData.map((item) => item.key)
    );
  };

  return (
    <Transfer {...restProps} style={{ width: "100%" }} targetKeys={targetKeys} onChange={handleTableTransferChange}>
      {({ direction, filteredItems, onItemSelect, onItemSelectAll, selectedKeys, disabled }) => {
        const columns = direction === "left" ? leftColumns : rightColumns;
        const data = direction === "left" ? filteredItems : rightTableStateData;

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
                if (itemDisabled || disabled) return;
                onItemSelect(key, !selectedKeys.includes(key));
              },
            })}
          />
        ) : (
          <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
            <SortableContext items={rightTableStateData.map((item) => item.key)} strategy={verticalListSortingStrategy}>
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
                dataSource={rightTableStateData}
                components={{
                  body: {
                    row: SortableRow,
                  },
                }}
                size="small"
                style={{ pointerEvents: disabled ? "none" : undefined }}
                onRow={({ key, disabled: itemDisabled }) => ({
                  onClick: () => {
                    if (itemDisabled || disabled) return;
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

const columns = [
  {
    dataIndex: "ROL_TANIM",
    title: "",
  },
];

const filterOption = (input, item) => item.ROL_TANIM?.includes(input);

const MainTabs = ({ selectedRow }) => {
  const [targetKeys, setTargetKeys] = useState([]);
  const [rightTableData, setRightTableData] = useState([]); // Right table data state
  const [mockData, setMockData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.post("/GetOnayRolTanim");
        const data = response.map((item) => ({
          ...item,
          key: item.TB_ROL_ID.toString(),
        }));
        setMockData(data);
      } catch (error) {
        console.error("API Error:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchRightTableData = async () => {
      if (selectedRow?.key) {
        try {
          const response = await AxiosInstance.post(`/GetOnayKuralList?ONR_ONYTANIM_ID=${selectedRow.key}`);
          const data = response.map((item) => ({
            ...item,
            key: item.TB_ROL_ID.toString(),
          }));
          setRightTableData(data);
          setTargetKeys(data.map((item) => item.key)); // Set initial keys
        } catch (error) {
          console.error("API Error:", error);
        }
      }
    };

    fetchRightTableData();
  }, [selectedRow]);

  return (
    <Flex align="start" gap="middle" vertical>
      <TableTransfer
        dataSource={mockData}
        targetKeys={targetKeys}
        rightTableData={rightTableData}
        showSearch
        showSelectAll={false}
        onChange={setTargetKeys}
        filterOption={filterOption}
        leftColumns={columns}
        rightColumns={columns}
        onTargetChange={setTargetKeys}
      />
    </Flex>
  );
};

export default MainTabs;
