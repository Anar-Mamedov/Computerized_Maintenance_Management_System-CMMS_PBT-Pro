import React, { useState, useContext, useMemo } from "react";
import { Flex, Transfer, Table, Tag, Button } from "antd";
import { DndContext } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { HolderOutlined } from "@ant-design/icons";

const RowContext = React.createContext({});

// Drag handle for sorting
const DragHandle = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <Button
      type="text"
      size="small"
      icon={<HolderOutlined />}
      style={{
        cursor: "move",
      }}
      ref={setActivatorNodeRef}
      {...listeners}
    />
  );
};

// Sortable Row component for right-side table
const SortableRow = (props) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: props["data-row-key"],
  });
  const style = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging
      ? {
          position: "relative",
          zIndex: 9999,
        }
      : {}),
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

// Customize Table Transfer
const TableTransfer = (props) => {
  const { leftColumns, rightColumns, targetKeys, onTargetChange, ...restProps } = props;
  const [rightTableData, setRightTableData] = useState(props.dataSource.filter((item) => targetKeys.includes(item.key)));

  const handleDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setRightTableData((prevState) => {
        const activeIndex = prevState.findIndex((item) => item.key === active.id);
        const overIndex = prevState.findIndex((item) => item.key === over?.id);
        const updatedData = arrayMove(prevState, activeIndex, overIndex);
        onTargetChange(updatedData.map((item) => item.key));
        return updatedData;
      });
    }
  };

  const handleTableTransferChange = (nextTargetKeys) => {
    // Update the target keys
    onTargetChange(nextTargetKeys);

    // Update the data in the right table
    const newRightTableData = props.dataSource.filter((item) => nextTargetKeys.includes(item.key));
    setRightTableData(newRightTableData);
  };

  return (
    <Transfer
      {...restProps}
      style={{
        width: "100%",
      }}
      targetKeys={targetKeys}
      onChange={handleTableTransferChange} // Update target keys and right table data when transferring items
    >
      {({ direction, filteredItems, onItemSelect, onItemSelectAll, selectedKeys, disabled }) => {
        const columns = direction === "left" ? leftColumns : rightColumns;
        const data = direction === "left" ? filteredItems : rightTableData;

        const rowSelection = {
          getCheckboxProps: () => ({
            disabled,
          }),
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
            style={{
              pointerEvents: disabled ? "none" : undefined,
            }}
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
                style={{
                  pointerEvents: disabled ? "none" : undefined,
                }}
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

// Sample data and columns for left and right tables
const mockTags = ["cat", "dog", "bird"];
const mockData = Array.from({ length: 20 }).map((_, i) => ({
  key: i.toString(),
  title: `content${i + 1}`,
  description: `description of content${i + 1}`,
  tag: mockTags[i % 3],
}));
const columns = [
  {
    dataIndex: "title",
    title: "Name",
  },
  {
    dataIndex: "tag",
    title: "Tag",
    render: (tag) => (
      <Tag
        style={{
          marginInlineEnd: 0,
        }}
        color="cyan"
      >
        {tag.toUpperCase()}
      </Tag>
    ),
  },
  {
    dataIndex: "description",
    title: "Description",
  },
];

const filterOption = (input, item) => item.title?.includes(input) || item.tag?.includes(input);

const MainTabs = () => {
  const [targetKeys, setTargetKeys] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const onChange = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys);
  };
  const toggleDisabled = (checked) => {
    setDisabled(checked);
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
