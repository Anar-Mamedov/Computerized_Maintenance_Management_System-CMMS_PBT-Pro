import React from "react";
import PropTypes from "prop-types";
import { Button, Checkbox, Modal, Typography } from "antd";
import { HolderOutlined } from "@ant-design/icons";
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTranslation } from "react-i18next";
import { KOLONLAR } from "../constants";

const { Text } = Typography;

const VARSAYILAN_SIRA = Object.fromEntries(KOLONLAR.map((kolon, index) => [kolon.key, index]));

// Olculer eski tablodaki "Sütunları Yönet" penceresiyle ayni.
const PANEL_STILI = { width: "46%", border: "1px solid #8080806e", borderRadius: "8px", padding: "10px" };
const PANEL_BASLIGI_STILI = { marginBottom: "20px", borderBottom: "1px solid #80808051", padding: "8px 8px 12px 8px" };
const LISTE_STILI = { height: "400px", overflow: "auto" };

/** Siralama listesinde tutamactan surulen satir (eski tablodaki DraggableRow). */
function SuruklenebilirSatir({ id, metin }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const stil = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isDragging ? "#f0f0f0" : "",
    display: "flex",
    alignItems: "center",
    gap: 8,
  };

  return (
    <div ref={setNodeRef} style={stil} {...attributes}>
      <div {...listeners} style={{ cursor: "grab", flexGrow: 1, display: "flex", alignItems: "center" }}>
        <HolderOutlined style={{ marginRight: 8 }} />
        {metin}
      </div>
    </div>
  );
}

SuruklenebilirSatir.propTypes = {
  id: PropTypes.string.isRequired,
  metin: PropTypes.string.isRequired,
};

/**
 * Eski tablodaki "Sütunları Yönet" penceresi: solda tum kolonlarin goster/gizle listesi (varsayilan sirada),
 * sagda gorunur kolonlarin surukle-birak sirasi. Degisiklikler aninda tabloya yansir ve tarayicida saklanir.
 */
export default function KolonAyarlari({ acik, kolonlar, onGorunurlukDegistir, onSiraDegistir, onSifirla, onKapat }) {
  const { t } = useTranslation();
  const sensorler = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const varsayilanSirada = [...kolonlar].sort((a, b) => VARSAYILAN_SIRA[a.key] - VARSAYILAN_SIRA[b.key]);
  const gorunurKolonlar = kolonlar.filter((kolon) => kolon.gorunur);

  const suruklemeBitti = ({ active, over }) => {
    if (over && active.id !== over.id) onSiraDegistir(active.id, over.id);
  };

  return (
    <Modal title={t("sutunlariYonet")} centered width={800} open={acik} onOk={onKapat} onCancel={onKapat}>
      <Text style={{ marginBottom: "15px" }}>{t("sutunlariYonetAciklama")}</Text>
      <div style={{ display: "flex", width: "100%", justifyContent: "center", marginTop: "10px" }}>
        <Button onClick={onSifirla} style={{ marginBottom: "15px" }}>
          {t("sutunlariSifirla")}
        </Button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={PANEL_STILI}>
          <div style={PANEL_BASLIGI_STILI}>
            <Text style={{ fontWeight: 600 }}>{t("sutunlariGosterGizle")}</Text>
          </div>
          <div style={LISTE_STILI}>
            {varsayilanSirada.map((kolon) => (
              <div style={{ display: "flex", gap: "10px" }} key={kolon.key}>
                <Checkbox checked={kolon.gorunur} aria-label={kolon.baslik} onChange={(event) => onGorunurlukDegistir(kolon.key, event.target.checked)} />
                {kolon.baslik}
              </div>
            ))}
          </div>
        </div>

        <DndContext sensors={sensorler} onDragEnd={suruklemeBitti}>
          <div style={PANEL_STILI}>
            <div style={PANEL_BASLIGI_STILI}>
              <Text style={{ fontWeight: 600 }}>{t("sutunSiralamasi")}</Text>
            </div>
            <div style={LISTE_STILI}>
              <SortableContext items={gorunurKolonlar.map((kolon) => kolon.key)} strategy={verticalListSortingStrategy}>
                {gorunurKolonlar.map((kolon) => (
                  <SuruklenebilirSatir key={kolon.key} id={kolon.key} metin={kolon.baslik} />
                ))}
              </SortableContext>
            </div>
          </div>
        </DndContext>
      </div>
    </Modal>
  );
}

KolonAyarlari.propTypes = {
  acik: PropTypes.bool.isRequired,
  kolonlar: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      baslik: PropTypes.string.isRequired,
      gorunur: PropTypes.bool.isRequired,
    })
  ).isRequired,
  onGorunurlukDegistir: PropTypes.func.isRequired,
  onSiraDegistir: PropTypes.func.isRequired,
  onSifirla: PropTypes.func.isRequired,
  onKapat: PropTypes.func.isRequired,
};
