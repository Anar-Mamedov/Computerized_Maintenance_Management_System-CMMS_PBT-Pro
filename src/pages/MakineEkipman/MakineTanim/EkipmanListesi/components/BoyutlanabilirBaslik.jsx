import React from "react";
import PropTypes from "prop-types";
import { Resizable } from "react-resizable";

// Eski tablodaki (MakineTanim/Table) tutamacla ayni: hucrenin sag %20'si, komsu kolona 5px tasar.
const TUTAMAC_STILI = {
  position: "absolute",
  bottom: 0,
  right: "-5px",
  width: "20%",
  height: "100%",
  zIndex: 2,
  cursor: "col-resize",
  padding: "0px",
  backgroundSize: "0px",
};

// Tutamacin tutulabilir kalmasi icin kolon bundan dar olamaz.
const ASGARI_GENISLIK = 60;

const SURUKLEME_AYARLARI = { enableUserSelectHack: false };

// Surukleme sirasinda fare komsu basliklarin metnini secmesin.
const metinSeciminiEngelle = (event) => event.preventDefault();

/** Kenarindan surukleyerek genisligi degisen tablo basligi. Genislik verilmeyen hucreler (secim kolonu) duz kalir. */
export default function BoyutlanabilirBaslik({ onResize, width, ...thProps }) {
  if (!width) {
    return <th {...thProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      minConstraints={[ASGARI_GENISLIK, 0]}
      handle={
        <span
          className="react-resizable-handle"
          style={TUTAMAC_STILI}
          // Suruklemenin sonundaki tiklama baslikta siralamayi tetiklemesin.
          onClick={(event) => event.stopPropagation()}
        />
      }
      onResizeStart={metinSeciminiEngelle}
      onResize={onResize}
      draggableOpts={SURUKLEME_AYARLARI}
    >
      <th {...thProps} />
    </Resizable>
  );
}

BoyutlanabilirBaslik.propTypes = {
  onResize: PropTypes.func,
  width: PropTypes.number,
};
