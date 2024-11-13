// VirtualizedTable.js
import React, { useRef, useEffect } from "react";
import { VariableSizeGrid as Grid } from "react-window";
import { Table } from "antd";
import classNames from "classnames";
import scrollbarSize from "dom-helpers/scrollbarSize";
import ResizeObserver from "rc-resize-observer";

const VirtualizedTable = ({ columns, dataSource, scroll, ...rest }) => {
  const gridRef = useRef();

  const [tableWidth, setTableWidth] = React.useState(0);

  const mergedColumns = React.useMemo(
    () =>
      columns.map((column) => ({
        ...column,
        width: column.width || 100,
      })),
    [columns]
  );

  const [connectObject] = React.useState(() => {
    const obj = {};
    Object.defineProperty(obj, "scrollLeft", {
      get: () => null,
      set: (scrollLeft) => {
        if (gridRef.current) {
          gridRef.current.scrollTo({
            scrollLeft,
          });
        }
      },
    });
    return obj;
  });

  const resetVirtualGrid = () => {
    gridRef.current &&
      gridRef.current.resetAfterIndices({
        columnIndex: 0,
        shouldForceUpdate: false,
      });
  };

  useEffect(() => {
    resetVirtualGrid();
  }, [tableWidth]);

  const renderVirtualList = (rawData, { scrollbarSize, ref, onScroll }) => {
    ref.current = connectObject;
    const totalHeight = rawData.length * 54; // Adjust row height as needed

    return (
      <Grid
        ref={gridRef}
        columnCount={mergedColumns.length}
        columnWidth={(index) => {
          const { width } = mergedColumns[index];
          return width;
        }}
        height={scroll.y}
        rowCount={totalHeight / 54}
        rowHeight={() => 54} // Adjust row height as needed
        width={tableWidth}
        onScroll={({ scrollLeft }) => {
          onScroll({
            scrollLeft,
          });
        }}
      >
        {({ columnIndex, rowIndex, style }) => {
          const column = mergedColumns[columnIndex];
          const data = rawData[rowIndex];
          const cellData = data[column.dataIndex];

          return (
            <div
              className={classNames("virtual-table-cell", {
                "virtual-table-cell-last": columnIndex === mergedColumns.length - 1,
              })}
              style={{
                ...style,
                boxSizing: "border-box",
                padding: "8px",
                borderBottom: "1px solid #f0f0f0",
                borderRight: "1px solid #f0f0f0",
                background: "#fff",
              }}
            >
              {column.render ? column.render(cellData, data, rowIndex) : cellData}
            </div>
          );
        }}
      </Grid>
    );
  };

  return (
    <ResizeObserver
      onResize={({ width }) => {
        setTableWidth(width);
      }}
    >
      <Table
        {...rest}
        columns={mergedColumns}
        dataSource={dataSource}
        pagination={false}
        components={{
          body: renderVirtualList,
        }}
        scroll={scroll}
      />
    </ResizeObserver>
  );
};

export default VirtualizedTable;
