// Gorunum, sayfa boyutu gibi kullaniciya ozel tercihler. Depolama kapaliysa ekran varsayilanlarla calisir.

export const tercihOku = (anahtar, varsayilan) => {
  try {
    const ham = localStorage.getItem(anahtar);
    return ham === null ? varsayilan : JSON.parse(ham);
  } catch {
    return varsayilan;
  }
};

export const tercihYaz = (anahtar, deger) => {
  try {
    localStorage.setItem(anahtar, JSON.stringify(deger));
  } catch {
    // Tercih kaydedilemese de ekran calismaya devam eder.
  }
};
