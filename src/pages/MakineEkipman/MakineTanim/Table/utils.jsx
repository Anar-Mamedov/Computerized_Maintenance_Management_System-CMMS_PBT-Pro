import "../components/styled.css";

export const getColor = (status) => {
  switch (status) {
    case "Qaralama":
      return "#00ffee";
    case "BAKIM":
      return "green";
    case "ARIZA":
      return "red";
    case "PERİYODİK BAKIM":
      return "orange";
    default:
      return "grey";
  }
};

export const getIcon = (priorityIcon) => {
  switch (priorityIcon) {
    case "YÜKSEK ÖNCELİK":
      return (
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <div>⚠️</div>
        </div>
      );
    case "NORMAL ÖNCELİK":
      return (
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#000dff",
            }}></div>
        </div>
      );
    case "DÜŞÜK ÖNCELİK":
      return (
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: "13px",
              height: "13px",
              borderRadius: "50%",
              backgroundColor: "#202020",
            }}></div>
        </div>
      );
    default:
      return null;
  }
};

export const getOpenIcon = (open) => {
  switch (open) {
    case true:
      return (
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              backgroundColor: "red",
            }}></div>
        </div>
      );
    default:
      return (
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              backgroundColor: "green",
            }}></div>
        </div>
      );
  }
};

export const getMaterialIcon = (material) => {
  switch (material) {
    case 1:
      return (
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <div style={{ width: "16px", height: "16px", borderRadius: "50%" }}>⚙️</div>
        </div>
      );
    default:
      return null;
  }
};

export const getDocumentIcon = (document) => {
  switch (document) {
    case 1:
      return (
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <div style={{ width: "16px", height: "16px", borderRadius: "50%" }}>📝</div>
        </div>
      );
    default:
      return null;
  }
};

export const getPictureIcon = (picture) => {
  switch (picture) {
    case 1:
      return (
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <div style={{ width: "16px", height: "16px", borderRadius: "50%" }}>🌄</div>
        </div>
      );
    default:
      return null;
  }
};

export const getPersonnelIcon = (personnel) => {
  switch (personnel) {
    case 1:
      return (
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <div style={{ width: "16px", height: "16px", borderRadius: "50%" }}>🤵‍♂️</div>
        </div>
      );
    default:
      return null;
  }
};
export const getDurusIcon = (durus) => {
  switch (durus) {
    case 1:
      return (
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <div style={{ width: "16px", height: "16px", borderRadius: "50%" }}>⏰</div>
        </div>
      );
    default:
      return null;
  }
};

export const getNotIcon = (not) => {
  switch (not) {
    case "":
      return null;
    default:
      return (
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <div style={{ width: "16px", height: "16px", borderRadius: "50%" }}>🗒️</div>
        </div>
      );
  }
};

export const getSpecialareaIcon = (specialarea) => {
  switch (specialarea) {
    case 0.0:
      return null;
    default:
  }
};
