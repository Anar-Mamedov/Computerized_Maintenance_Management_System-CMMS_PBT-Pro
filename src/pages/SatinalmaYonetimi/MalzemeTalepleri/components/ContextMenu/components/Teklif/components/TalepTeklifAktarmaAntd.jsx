import React, { useMemo, useState } from "react";
import {
  Row,
  Col,
  Input,
  Select,
  Checkbox,
  Button,
  Table,
  Card,
  Tag,
  Space,
  message,
  Divider,
} from "antd";
import { SaveOutlined, SendOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";

// --------------------------------------------------
// Örnek Ant Design bileşeni — "Resimdekine yakın" uygulama
// Tek dosya: Talep → Teklife Aktarma (AntD)
// - Lokal örnek veri ile çalışır
// - Seçimler, filtreler, RFQ grupları, RFQ kart önizlemesi
// - Gerçek API'ye bağlanmak için sendToRFQ() içinde fetch/axios ekle
// --------------------------------------------------

const { Search } = Input;
const { Option } = Select;

const CATEGORIES = [
  { id: "yedek_parca", name: "Yedek Parça" },
  { id: "kirtasiye", name: "Kırtasiye" },
  { id: "gida", name: "Gıda" },
];

const SAMPLE_ITEMS = [
  { key: 1, name: "Hidrolik Hortum 3/8 2SN", qty: 6, unit: "Adet", category: "yedek_parca" },
  { key: 2, name: "A4 Fotokopi Kağıdı 80gr", qty: 20, unit: "Koli", category: "kirtasiye" },
  { key: 3, name: "Öğle Yemeği (Günlük Menü)", qty: 120, unit: "Porsiyon", category: "gida" },
  { key: 4, name: "Rulman SKF 6205", qty: 12, unit: "Adet", category: "yedek_parca" },
  { key: 5, name: "Spiral Defter A4 120y", qty: 50, unit: "Adet", category: "kirtasiye" },
];

const SAMPLE_SUPPLIERS = [
  { key: 101, name: "HidroTek A.Ş.", type: "İmalatçı", region: "İstanbul", scope: "yedek_parca" },
  { key: 102, name: "TekHortum Ltd.", type: "İmalatçı", region: "Kocaeli", scope: "yedek_parca" },
  { key: 103, name: "Ofisline", type: "Tedarikçi", region: "İstanbul", scope: "kirtasiye" },
  { key: 104, name: "PaperMax", type: "Tedarikçi", region: "Ankara", scope: "kirtasiye" },
  { key: 105, name: "Dalaman Catering", type: "Hizmet", region: "Muğla", scope: "gida" },
];

const DELIVERY_OPTIONS = [
  { id: "merkez", label: "Merkez Depo" },
  { id: "atolye", label: "Merkez Atölye" },
  { id: "catering", label: "Dalaman" },
];

const catName = (id) => CATEGORIES.find((c) => c.id === id)?.name || id;

export default function TalepTeklifeAktarmaAntd() {
  // --- Sol panel (kalemler)
  const [itemQuery, setItemQuery] = useState("");
  const [itemCategory, setItemCategory] = useState("all");
  const [selectedItemKeys, setSelectedItemKeys] = useState([1, 2, 3]);

  // --- Sağ panel (tedarikçiler)
  const [supplierQuery, setSupplierQuery] = useState("");
  const [supplierType, setSupplierType] = useState("all");
  const [supplierScopeFilter, setSupplierScopeFilter] = useState(true); // "Seçili Kalemlere Uygun"
  const [selectedSupplierKeys, setSelectedSupplierKeys] = useState([103, 104]);

  // --- Genel
  const [splitByCategory, setSplitByCategory] = useState(true);
  const [groupDelivery, setGroupDelivery] = useState({
    gida: "catering",
    kirtasiye: "merkez",
    yedek_parca: "atolye",
    genel: "merkez",
  });

  const [groupSuppliers, setGroupSuppliers] = useState({
    gida: [105],
    kirtasiye: [103, 104],
    yedek_parca: [101, 102],
    genel: [],
  });

  // --- Filtrelenmiş listeler
  const filteredItems = useMemo(() => {
    return SAMPLE_ITEMS.filter((it) => {
      const q = itemQuery.trim().toLowerCase();
      const okQuery = q ? it.name.toLowerCase().includes(q) : true;
      const okCat = itemCategory === "all" ? true : it.category === itemCategory;
      return okQuery && okCat;
    });
  }, [itemQuery, itemCategory]);

  const selectedCategories = useMemo(() => {
    const set = new Set(
      SAMPLE_ITEMS.filter((i) => selectedItemKeys.includes(i.key)).map((i) => i.category)
    );
    return Array.from(set);
  }, [selectedItemKeys]);

  const filteredSuppliers = useMemo(() => {
    return SAMPLE_SUPPLIERS.filter((s) => {
      const q = supplierQuery.trim().toLowerCase();
      const okQuery = q ? s.name.toLowerCase().includes(q) || s.region.toLowerCase().includes(q) : true;
      const okType = supplierType === "all" ? true : s.type === supplierType;
      const okScope = supplierScopeFilter
        ? selectedCategories.length === 0
          ? true
          : selectedCategories.includes(s.scope)
        : true;
      return okQuery && okType && okScope;
    });
  }, [supplierQuery, supplierType, supplierScopeFilter, selectedCategories]);

  // --- RFQ grupları
  const rfqGroups = useMemo(() => {
    if (!splitByCategory) {
      return [{ key: "genel", name: "GENEL", itemKeys: selectedItemKeys }];
    }
    const byCat = {};
    for (const k of selectedItemKeys) {
      const it = SAMPLE_ITEMS.find((i) => i.key === k);
      if (!it) continue;
      if (!byCat[it.category]) byCat[it.category] = [];
      byCat[it.category].push(k);
    }
    return Object.entries(byCat).map(([cat, keys]) => ({ key: cat, name: catName(cat), itemKeys: keys }));
  }, [selectedItemKeys, splitByCategory]);

  // --- Tablo kolonları
  const itemColumns = [
    { title: "Malzeme", dataIndex: "name", key: "name" },
    { title: "Miktar", dataIndex: "qty", key: "qty", width: 90 },
    { title: "Birim", dataIndex: "unit", key: "unit", width: 110 },
    {
      title: "Kategori",
      dataIndex: "category",
      key: "category",
      width: 140,
      render: (c) => <Tag>{catName(c)}</Tag>,
    },
  ];

  const supplierColumns = [
    { title: "Firma", dataIndex: "name", key: "name" },
    { title: "Tip", dataIndex: "type", key: "type", width: 120 },
    { title: "Bölge", dataIndex: "region", key: "region", width: 120 },
    { title: "Kapsam", dataIndex: "scope", key: "scope", width: 140, render: (s) => <Tag>{catName(s)}</Tag> },
  ];

  // --- İşlevler
  const addSuggestedSuppliers = () => {
    const scopes = new Set(selectedCategories);
    const suggested = SAMPLE_SUPPLIERS.filter((s) => scopes.has(s.scope)).map((s) => s.key);
    setSelectedSupplierKeys((prev) => Array.from(new Set([...prev, ...suggested])));

    // RFQ group supplier list güncelle
    setGroupSuppliers((prev) => {
      const next = { ...prev };
      for (const g of rfqGroups) {
        const allowed = SAMPLE_SUPPLIERS.filter((s) => !splitByCategory || s.scope === g.key || g.key === "genel").map((s) => s.key);
        next[g.key] = Array.from(new Set([...(next[g.key] || []), ...allowed]));
      }
      return next;
    });

    message.success("Önerilen tedarikçiler eklendi");
  };

  const sendToRFQ = () => {
    if (selectedItemKeys.length === 0) {
      message.warning("Lütfen en az bir kalem seçin");
      return;
    }

    const payload = {
      splitByCategory,
      items: SAMPLE_ITEMS.filter((i) => selectedItemKeys.includes(i.key)),
      suppliers: SAMPLE_SUPPLIERS.filter((s) => selectedSupplierKeys.includes(s.key)),
      groups: rfqGroups.map((g) => ({
        key: g.key,
        name: g.name,
        delivery: groupDelivery[g.key] || null,
        itemKeys: g.itemKeys,
        supplierKeys: (groupSuppliers[g.key] || []).filter((id) => selectedSupplierKeys.includes(id)),
      })),
    };

    // Gerçek uygulamada: axios.post('/api/rfq', payload)
    console.log("RFQ PAYLOAD", payload);
    message.success("Seçili kalemler RFQ taslaklarına aktarıldı (konsola bakınız)");
  };

  const saveDraft = () => {
    console.log("DRAFT", { selectedItemKeys, selectedSupplierKeys, splitByCategory, groupDelivery, groupSuppliers });
    message.success("Taslak kaydedildi (konsola bakınız)");
  };

  const addSupplierToGroup = (groupKey) => {
    const candidates = SAMPLE_SUPPLIERS.filter((s) => (groupKey === "genel" ? true : s.scope === groupKey));
    const already = new Set(groupSuppliers[groupKey] || []);
    const toAdd = candidates.find((c) => !already.has(c.key));
    if (toAdd) setGroupSuppliers((prev) => ({ ...prev, [groupKey]: [...(prev[groupKey] || []), toAdd.key] }));
  };

  const removeSupplierFromGroup = (groupKey, supplierKey) => {
    setGroupSuppliers((prev) => ({ ...prev, [groupKey]: (prev[groupKey] || []).filter((k) => k !== supplierKey) }));
  };

  // --- Row selections
  const itemRowSelection = {
    selectedRowKeys: selectedItemKeys,
    onChange: (keys) => setSelectedItemKeys(keys),
  };
  const supplierRowSelection = {
    selectedRowKeys: selectedSupplierKeys,
    onChange: (keys) => setSelectedSupplierKeys(keys),
  };

  // --- Render
  return (
    <div style={{ padding: 20, background: "#f5f7fa", height: "72vh", width: "88vw", overflowY: "auto" }}>
      <Card>
        <Row justify="space-between" align="middle">
          <Col>
            <h2 style={{ margin: 0 }}>Talep → Teklife Aktarma</h2>
            <div style={{ color: "#666" }}>Sol: Talep kalemleri • Sağ: Tedarikçiler — seç, eşleştir ve Teklif İste</div>
          </Col>

          <Col>
            <Space>
              <Checkbox checked={splitByCategory} onChange={(e) => setSplitByCategory(e.target.checked)}>
                Kategoriye göre ayrı RFQ oluştur
              </Checkbox>
              <Button icon={<SaveOutlined />} onClick={saveDraft}>
                Taslak Kaydet
              </Button>
              <Button type="primary" icon={<SendOutlined />} onClick={sendToRFQ}>
                Teklif İste
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={16} style={{ marginTop: 16 }}>
        {/* Sol panel */}
        <Col xs={24} md={12}>
          <Card>
            <Row gutter={8} align="middle">
              <Col span={14}>
                <Search placeholder="Kalem ara: malzeme, kategori..." allowClear onSearch={(v) => setItemQuery(v)} />
              </Col>
              <Col span={10}>
                <Select value={itemCategory} onChange={(v) => setItemCategory(v)} style={{ width: "100%" }}>
                  <Option value="all">Tüm Kategoriler</Option>
                  {CATEGORIES.map((c) => (
                    <Option key={c.id} value={c.id}>{c.name}</Option>
                  ))}
                </Select>
              </Col>
            </Row>

            <Divider style={{ margin: "12px 0" }} />

            <Table
              size="small"
              columns={itemColumns}
              dataSource={filteredItems}
              pagination={false}
              rowSelection={itemRowSelection}
            />

            <div style={{ marginTop: 8, color: "#666" }}>Seçili kalem sayısı: {selectedItemKeys.length}</div>
          </Card>
        </Col>

        {/* Sağ panel */}
        <Col xs={24} md={12}>
          <Card>
            <Row gutter={8} align="middle">
              <Col span={12}>
                <Search placeholder="Tedarikçi ara: firma, bölge..." allowClear onSearch={(v) => setSupplierQuery(v)} />
              </Col>
              <Col span={6}>
                <Select value={supplierType} onChange={(v) => setSupplierType(v)} style={{ width: "100%" }}>
                  <Option value="all">Tüm Tipler</Option>
                  <Option value="İmalatçı">İmalatçı</Option>
                  <Option value="Tedarikçi">Tedarikçi</Option>
                  <Option value="Hizmet">Hizmet</Option>
                </Select>
              </Col>
              <Col span={6}>
                <Select value={supplierScopeFilter ? "uygun" : "tum"} onChange={(v) => setSupplierScopeFilter(v === "uygun")} style={{ width: "100%" }}>
                  <Option value="uygun">Seçili Kalemlere Uygun</Option>
                  <Option value="tum">Tümü</Option>
                </Select>
              </Col>
            </Row>

            <Divider style={{ margin: "12px 0" }} />

            <Table
              size="small"
              columns={supplierColumns}
              dataSource={filteredSuppliers}
              pagination={false}
              rowSelection={supplierRowSelection}
            />

            <div style={{ marginTop: 8, color: "#666" }}>Seçili tedarikçi: {selectedSupplierKeys.length} • Uygunluk: Seçili kalemlerin kategorilerine göre filtrelenir</div>
          </Card>
        </Col>
      </Row>

      {/* Özet + Aksiyonlar */}
      <Card style={{ marginTop: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <div style={{ color: "#333" }}>
              <b>{selectedItemKeys.length}</b> kalem → <b>{selectedSupplierKeys.length}</b> tedarikçi • Kural: "Kategoriye göre ayrı RFQ" {splitByCategory ? "açık" : "kapalı"}
              {splitByCategory && <span> → <b>{rfqGroups.length}</b> ayrı RFQ taslağı oluşacak</span>}
            </div>
          </Col>
          <Col>
            <Space>
              <Button onClick={addSuggestedSuppliers}>Önerilen Tedarikçileri Ekle</Button>
              <Button type="primary" onClick={sendToRFQ}>Seçili Kalemleri Teklife Gönder</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* RFQ Önizleme Kartları */}
      <Row gutter={16} style={{ marginTop: 16 }}>
        {rfqGroups.map((g) => {
          const items = SAMPLE_ITEMS.filter((i) => g.itemKeys.includes(i.key));
          const suppliersInGroup = (groupSuppliers[g.key] || []).map((k) => SAMPLE_SUPPLIERS.find((s) => s.key === k)).filter(Boolean);

          return (
            <Col xs={24} sm={12} md={8} key={g.key}>
              <Card size="small" title={`RFQ — ${g.name}`} extra={<Space>
                <Button size="small">Düzenle</Button>
                <Button size="small" danger onClick={() => setGroupSuppliers((prev) => ({ ...prev, [g.key]: [] }))}>Sil</Button>
              </Space>}>
                <div style={{ marginBottom: 8, color: "#666" }}>Kalem: {items.length} • Tedarikçi: {suppliersInGroup.length}</div>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ color: "#666", marginBottom: 6 }}>Teslim:</div>
                  <Select value={groupDelivery[g.key] || "merkez"} onChange={(v) => setGroupDelivery((prev) => ({ ...prev, [g.key]: v }))} style={{ width: "100%" }}>
                    {DELIVERY_OPTIONS.map((d) => <Option key={d.id} value={d.id}>{d.label}</Option>)}
                  </Select>
                </div>

                <div>
                  <div style={{ color: "#666", marginBottom: 6 }}>Tedarikçiler:</div>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {suppliersInGroup.length === 0 && <div style={{ color: "#999" }}>Bu gruba henüz tedarikçi eklenmedi.</div>}

                    {suppliersInGroup.map((sp) => (
                      <div key={sp.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #f0f0f0", padding: 8, borderRadius: 6 }}>
                        <div>
                          <div style={{ fontWeight: 600 }}>{sp.name}</div>
                          <Space size={6} style={{ marginTop: 6 }}>
                            <Tag>{sp.type}</Tag>
                            <Tag>{sp.region}</Tag>
                            <Tag>{catName(sp.scope)}</Tag>
                          </Space>
                        </div>
                        <div>
                          <Button size="small" onClick={() => removeSupplierFromGroup(g.key, sp.key)}>Tedarikçi Çıkar</Button>
                        </div>
                      </div>
                    ))}
                  </Space>
                </div>

                <div style={{ marginTop: 12 }}>
                  <Space>
                    <Button size="small" icon={<PlusOutlined />} onClick={() => addSupplierToGroup(g.key)}>Tedarikçi Ekle</Button>
                    <Button size="small" icon={<DeleteOutlined />} danger onClick={() => setGroupSuppliers((prev) => ({ ...prev, [g.key]: [] }))}>Tümünü Kaldır</Button>
                  </Space>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      <div style={{ height: 40 }} />
    </div>
  );
}