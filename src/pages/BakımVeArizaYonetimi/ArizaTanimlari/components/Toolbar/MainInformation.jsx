import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import {
  Space,
  Select,
  Input,
  DatePicker,
  Tabs,
  Checkbox,
  Button,
  InputNumber,
} from "antd";
import React from "react";
import styled from "styled-components";

const onChange = (value) => {
  console.log(`selected ${value}`);
};
const onSearch = (value) => {
  console.log("search:", value);
};

// input text area
const { TextArea } = Input;
// input text area end

//styled components
const StyledTabs = styled(Tabs)`
  .ant-tabs-tab {
    width: 200px;
    justify-content: center;
  }
  .ant-tabs-tab-active {
    background-color: #2bc77135;
    color: rgba(0, 0, 0, 0.88);
  }
  .ant-tabs-tab-btn {
    color: rgba(0, 0, 0, 0.88) !important;
  }
  .ant-tabs-ink-bar {
    background-color: #2bc770;
  }
`;

//styled components end

// checkbox

const onChangeCheckbox = (e) => {
  console.log(`checked = ${e.target.checked}`);
};

// checkbox end

// tab
const { TabPane } = Tabs;

// Tab end

// datapicker

const onChangeData = (date, dateString) => {
  console.log(date, dateString);
};

// datapicker end

export default function MainInformation() {
  // Increasing the number of inputs in the tab
  const [financeFormCount, setFinanceFormCount] = React.useState(1);

  const addFinanceForm = () => {
    setFinanceFormCount((state) => state + 1);
  };

  const removeFinanceForm = () => {
    setFinanceFormCount((state) => state - 1);
  };
  // Increasing the number of inputs in the tab end

  return (
    <Space
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}>
      <span style={{ color: "#2bc770" }}>Əsas məlumat:</span>
      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 15,
        }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}>
          <span>
            Təşkilat:<span style={{ color: "red" }}>*</span>
          </span>
          <Select
            required
            showSearch
            style={{
              width: 160,
              marginTop: "0.5rem",
            }}
            placeholder="Seçim edin"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearch}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={[
              {
                value: "jack",
                label: "Jack",
              },
              {
                value: "lucy",
                label: "Lucy",
              },
              {
                value: "tom",
                label: "Tom",
              },
            ]}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}>
          <span>
            Kontragent:<span style={{ color: "red" }}>*</span>
          </span>
          <Select
            required
            showSearch
            style={{
              width: 160,
              marginTop: "0.5rem",
            }}
            placeholder="Seçim edin"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearch}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={[
              {
                value: "jack",
                label: "Jack",
              },
              {
                value: "lucy",
                label: "Lucy",
              },
              {
                value: "tom",
                label: "Tom",
              },
            ]}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}>
          <span>
            Növ:<span style={{ color: "red" }}>*</span>
          </span>
          <Select
            required
            showSearch
            style={{
              width: 160,
              marginTop: "0.5rem",
            }}
            placeholder="Seçim edin"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearch}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={[
              {
                value: "jack",
                label: "Jack",
              },
              {
                value: "lucy",
                label: "Lucy",
              },
              {
                value: "tom",
                label: "Tom",
              },
            ]}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}>
          <span>
            Valyuta:<span style={{ color: "red" }}>*</span>
          </span>
          <Select
            required
            showSearch
            style={{
              width: 80,
              marginTop: "0.5rem",
            }}
            placeholder="Seçim edin"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearch}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={[
              {
                value: "AZN",
                label: "AZN",
              },
              {
                value: "USD",
                label: "USD",
              },
              {
                value: "EUR",
                label: "EUR",
              },
            ]}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}>
          <span>
            Nömrə:<span style={{ color: "red" }}>*</span>
          </span>

          <InputNumber
            type="number"
            placeholder="Daxəl edin"
            required
            min={1}
            style={{
              width: 160,
              marginTop: "0.5rem",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}>
          <span>
            Tarix:<span style={{ color: "red" }}>*</span>
          </span>
          <Space
            direction="vertical"
            style={{
              marginTop: "0.5rem",
            }}>
            <DatePicker
              required
              onChangeData={onChangeData}
              placeholder="Tarix seç"
              style={{ width: 160 }}
            />
          </Space>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}>
          <span>
            Predmet:<span style={{ color: "red" }}>*</span>
          </span>
          <Select
            required
            showSearch
            style={{
              width: 160,
              marginTop: "0.5rem",
            }}
            placeholder="Seçim edin"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearch}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={[
              {
                value: "jack",
                label: "Jack",
              },
              {
                value: "lucy",
                label: "Lucy",
              },
              {
                value: "tom",
                label: "Tom",
              },
            ]}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}>
          <span>
            Ödəniş növü:<span style={{ color: "red" }}>*</span>
          </span>
          <Select
            required
            showSearch
            style={{
              width: 160,
              marginTop: "0.5rem",
            }}
            placeholder="Seçim edin"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearch}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={[
              {
                value: "jack",
                label: "Jack",
              },
              {
                value: "lucy",
                label: "Lucy",
              },
              {
                value: "tom",
                label: "Tom",
              },
            ]}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}>
          <span>
            Başlama tarixi:<span style={{ color: "red" }}>*</span>
          </span>
          <Space
            direction="vertical"
            style={{
              marginTop: "0.5rem",
            }}>
            <DatePicker
              required
              onChangeData={onChangeData}
              placeholder="Tarix seç"
              style={{ width: 160 }}
            />
          </Space>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}>
          <span>
            Bitmə tarixi:<span style={{ color: "red" }}>*</span>
          </span>
          <Space
            direction="vertical"
            style={{
              marginTop: "0.5rem",
            }}>
            <DatePicker
              required
              onChangeData={onChangeData}
              placeholder="Tarix seç"
              style={{ width: 160 }}
            />
          </Space>
        </div>
        {/* tab */}
        <div>
          <StyledTabs>
            <TabPane tab="Maliyyə detalları" key="1">
              {[...Array(financeFormCount)].map((el, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    flexFlow: "row wrap",
                    gap: "15px",
                  }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}>
                    <span>Məbləğ:</span>
                    <InputNumber
                      placeholder="Daxil edin"
                      type="number"
                      style={{
                        width: 160,
                        marginTop: "0.5rem",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}>
                    <span
                      style={{
                        display: "flex",
                        gap: "6.9rem",
                      }}>
                      ƏDV: <Checkbox onChangeCheckbox={onChangeCheckbox} />
                    </span>
                    <Space style={{ marginTop: "0.5rem" }}>
                      <Space.Compact>
                        <Select
                          showSearch
                          style={{
                            width: 80,
                          }}
                          placeholder="Seçim edin"
                          optionFilterProp="children"
                          onChange={onChange}
                          onSearch={onSearch}
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={[
                            {
                              value: "AZN",
                              label: "AZN",
                            },
                            {
                              value: "USD",
                              label: "USD",
                            },
                            {
                              value: "EUR",
                              label: "EUR",
                            },
                          ]}
                        />
                        <Input defaultValue="" style={{ width: 80 }} />
                      </Space.Compact>
                    </Space>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}>
                    <span>Bank zəmanət məbləği:</span>
                    <InputNumber
                      type="number"
                      style={{
                        width: 160,
                        marginTop: "0.5rem",
                      }}
                      placeholder="Daxil edin"
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}>
                    <span>Bank zəmanət məbləği:</span>
                    <Select
                      required
                      showSearch
                      style={{
                        width: 160,
                        marginTop: "0.5rem",
                      }}
                      placeholder="Seçim edin"
                      optionFilterProp="children"
                      onChange={onChange}
                      onSearch={onSearch}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={[
                        {
                          value: "jack",
                          label: "Jack",
                        },
                        {
                          value: "lucy",
                          label: "Lucy",
                        },
                        {
                          value: "tom",
                          label: "Tom",
                        },
                      ]}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}>
                    <span>Bank zəmanət tarixi:</span>
                    <Space
                      direction="vertical"
                      style={{
                        marginTop: "0.5rem",
                      }}>
                      <DatePicker
                        required
                        onChangeData={onChangeData}
                        placeholder="Tarix seç"
                        style={{ width: 160 }}
                      />
                    </Space>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}>
                    <span>Bank zəmanət müddəti:</span>
                    <Space style={{ marginTop: "0.5rem" }}>
                      <Space.Compact>
                        <Select
                          showSearch
                          style={{
                            width: 80,
                          }}
                          placeholder="Seçim edin"
                          optionFilterProp="children"
                          onChange={onChange}
                          onSearch={onSearch}
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={[
                            {
                              value: "AZN",
                              label: "AZN",
                            },
                            {
                              value: "USD",
                              label: "USD",
                            },
                            {
                              value: "EUR",
                              label: "EUR",
                            },
                          ]}
                        />
                        <Input defaultValue="" style={{ width: 80 }} />
                      </Space.Compact>
                    </Space>
                  </div>
                  <Space
                    wrap
                    style={{
                      marginTop: "1.9rem",
                    }}>
                    <Button
                      onClick={
                        idx + 1 === financeFormCount
                          ? addFinanceForm
                          : removeFinanceForm
                      }
                      type="primary"
                      icon={
                        idx + 1 === financeFormCount ? (
                          <PlusOutlined style={{ color: "#d9d9d9" }} />
                        ) : (
                          <MinusOutlined
                            style={{ color: "red", borderColor: "red" }}
                          />
                        )
                      }
                      style={{
                        background: "#fff",
                        color: "#d9d9d9",
                        borderColor:
                          idx + 1 === financeFormCount ? "#d9d9d9" : "red",
                      }}
                      size={"20px"}
                    />
                  </Space>
                </div>
              ))}
            </TabPane>
            <TabPane tab="Rekvizit" key="2">
              <div
                style={{
                  display: "flex",
                  flexFlow: "row wrap",
                  gap: "15px",
                }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}>
                  <span>İmzalayan şəxs:</span>
                  <Select
                    required
                    showSearch
                    style={{
                      width: 160,
                      marginTop: "0.5rem",
                    }}
                    placeholder="Seçim edin"
                    optionFilterProp="children"
                    onChange={onChange}
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={[
                      {
                        value: "jack",
                        label: "Jack",
                      },
                      {
                        value: "lucy",
                        label: "Lucy",
                      },
                      {
                        value: "tom",
                        label: "Tom",
                      },
                    ]}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}>
                  <span>Təşkilatın imza tarixi:</span>
                  <Space
                    direction="vertical"
                    style={{
                      marginTop: "0.5rem",
                    }}>
                    <DatePicker
                      required
                      onChangeData={onChangeData}
                      placeholder="Seçim edin"
                      style={{ width: 160 }}
                    />
                  </Space>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}>
                  <span>Müqavilənin imza tarixi:</span>
                  <Space
                    direction="vertical"
                    style={{
                      marginTop: "0.5rem",
                    }}>
                    <DatePicker
                      required
                      onChangeData={onChangeData}
                      placeholder="Seçim edin"
                      style={{ width: 160 }}
                    />
                  </Space>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}>
                  <span>Əlaqəli şəxs 1:</span>
                  <Input
                    placeholder="Daxil edin"
                    style={{
                      width: 160,
                      marginTop: "0.5rem",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}>
                  <span>Əlaqəli şəxs 2:</span>
                  <Input
                    placeholder="Daxil edin"
                    style={{
                      width: 160,
                      marginTop: "0.5rem",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}>
                  <span>Qeyd:</span>
                  <TextArea
                    style={{
                      width: 290,
                      marginTop: "0.5rem",
                    }}
                    rows={4}
                    placeholder="Daxil edin"
                    maxLength={6}
                  />
                </div>
                <Space
                  wrap
                  style={{
                    marginTop: "1.9rem",
                    display: "flex",
                    alignItems: "flex-end",
                  }}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined style={{ color: "#d9d9d9" }} />}
                    style={{
                      background: "#fff",
                      color: "#d9d9d9",
                      borderColor: "#d9d9d9",
                    }}
                    size={"20px"}
                  />
                </Space>
              </div>
            </TabPane>
            <TabPane tab="Detallar" key="3">
              <div
                style={{
                  display: "flex",
                  flexFlow: "row wrap",
                  gap: "15px",
                }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}>
                  <span>Məhsul:</span>
                  <Select
                    required
                    showSearch
                    style={{
                      width: 160,
                      marginTop: "0.5rem",
                    }}
                    placeholder="Seçim edin"
                    optionFilterProp="children"
                    onChange={onChange}
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={[
                      {
                        value: "jack",
                        label: "Jack",
                      },
                      {
                        value: "lucy",
                        label: "Lucy",
                      },
                      {
                        value: "tom",
                        label: "Tom",
                      },
                    ]}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}>
                  <span>Təsnifatı:</span>
                  <Select
                    required
                    showSearch
                    style={{
                      width: 160,
                      marginTop: "0.5rem",
                    }}
                    placeholder="Seçim edin"
                    optionFilterProp="children"
                    onChange={onChange}
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={[
                      {
                        value: "jack",
                        label: "Jack",
                      },
                      {
                        value: "lucy",
                        label: "Lucy",
                      },
                      {
                        value: "tom",
                        label: "Tom",
                      },
                    ]}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}>
                  <span>Ölçü vahidi:</span>
                  <Select
                    required
                    showSearch
                    style={{
                      width: 160,
                      marginTop: "0.5rem",
                    }}
                    placeholder="Seçim edin"
                    optionFilterProp="children"
                    onChange={onChange}
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={[
                      {
                        value: "jack",
                        label: "Jack",
                      },
                      {
                        value: "lucy",
                        label: "Lucy",
                      },
                      {
                        value: "tom",
                        label: "Tom",
                      },
                    ]}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}>
                  <span>Miqdar:</span>
                  <InputNumber
                    type="number"
                    style={{
                      width: 160,
                      marginTop: "0.5rem",
                    }}
                    placeholder="Daxil edin"
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}>
                  <span>Qiymət:</span>
                  <InputNumber
                    type="number"
                    style={{
                      width: 160,
                      marginTop: "0.5rem",
                    }}
                    placeholder="Daxil edin"
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}>
                  <span>Məbləğ:</span>
                  <InputNumber
                    disabled
                    type="number"
                    style={{
                      width: 160,
                      marginTop: "0.5rem",
                    }}
                    placeholder="Daxil edin"
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}>
                  <span
                    style={{
                      display: "flex",
                      gap: "6.9rem",
                    }}>
                    ƏDV: <Checkbox onChangeCheckbox={onChangeCheckbox} />
                  </span>
                  <Space style={{ marginTop: "0.5rem" }}>
                    <Space.Compact>
                      <Select
                        showSearch
                        style={{
                          width: 80,
                        }}
                        placeholder="Seçim edin"
                        optionFilterProp="children"
                        onChange={onChange}
                        onSearch={onSearch}
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={[
                          {
                            value: "AZN",
                            label: "AZN",
                          },
                          {
                            value: "USD",
                            label: "USD",
                          },
                          {
                            value: "EUR",
                            label: "EUR",
                          },
                        ]}
                      />
                      <Input defaultValue="" style={{ width: 80 }} />
                    </Space.Compact>
                  </Space>
                </div>

                <Space
                  wrap
                  style={{
                    marginTop: "1.9rem",
                  }}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined style={{ color: "#d9d9d9" }} />}
                    style={{
                      background: "#fff",
                      color: "#d9d9d9",
                      borderColor: "#d9d9d9",
                    }}
                    size={"20px"}
                  />
                </Space>
              </div>
            </TabPane>
            <TabPane tab="Çatdırılma" key="4">
              <div
                style={{
                  display: "flex",
                  flexFlow: "row wrap",
                  gap: "15px",
                }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}>
                  <span>Şərt:</span>
                  <Select
                    required
                    showSearch
                    style={{
                      width: 160,
                      marginTop: "0.5rem",
                    }}
                    placeholder="Seçim edin"
                    optionFilterProp="children"
                    onChange={onChange}
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={[
                      {
                        value: "jack",
                        label: "Jack",
                      },
                      {
                        value: "lucy",
                        label: "Lucy",
                      },
                      {
                        value: "tom",
                        label: "Tom",
                      },
                    ]}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}>
                  <span>Tarix:</span>
                  <Space
                    direction="vertical"
                    style={{
                      marginTop: "0.5rem",
                    }}>
                    <DatePicker
                      required
                      onChangeData={onChangeData}
                      placeholder="Seçim edin"
                      style={{ width: 160 }}
                    />
                  </Space>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}>
                  <span>Müddət:</span>
                  <Space style={{ marginTop: "0.5rem" }}>
                    <Space.Compact>
                      <Select
                        showSearch
                        style={{
                          width: 80,
                        }}
                        placeholder="Seçim edin"
                        optionFilterProp="children"
                        onChange={onChange}
                        onSearch={onSearch}
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={[
                          {
                            value: "AZN",
                            label: "AZN",
                          },
                          {
                            value: "USD",
                            label: "USD",
                          },
                          {
                            value: "EUR",
                            label: "EUR",
                          },
                        ]}
                      />
                      <Input defaultValue="" style={{ width: 80 }} />
                    </Space.Compact>
                  </Space>
                </div>
                <Space
                  wrap
                  style={{
                    marginTop: "1.9rem",
                  }}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined style={{ color: "#d9d9d9" }} />}
                    style={{
                      background: "#fff",
                      color: "#d9d9d9",
                      borderColor: "#d9d9d9",
                    }}
                    size={"20px"}
                  />
                </Space>
              </div>
            </TabPane>
          </StyledTabs>
          {/* <Tabs defaultActiveKey="1" items={items} onChangeTab={onChangeTab} /> */}
        </div>
      </div>
    </Space>
  );
}
