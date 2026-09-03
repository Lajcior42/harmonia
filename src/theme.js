// Paleta miętowo-błękitna. Uwaga: klucze `gold` / `goldDark` / `amber` zostały
// przemapowane na odcienie turkusu/mięty — nazwy zachowano, żeby nie zmieniać
// kilkudziesięciu miejsc użycia. To główny kolor akcentu na całej stronie.
export const COLORS = {
  bg: "#E8F1EF",
  surface: "#FBFEFD",
  mint: "#4FAF93",
  mintDark: "#3C8570",
  gold: "#2E9C8E",
  goldDark: "#227A6F",
  amber: "#7FC9BA",
  blue: "#3E8FB0",
  blueDark: "#2E7089",
  danger: "#B8604A",
  ink: "#213230",
  textMuted: "#6C817C",
  line: "rgba(33,50,48,0.12)",
  lineStrong: "rgba(33,50,48,0.2)",
};

// Wspólne style: fonty, glow, bloby, oraz efekt "mieniącego się" gradientu (shimmer)
export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,450;9..144,600&family=Work+Sans:wght@400;500;600&display=swap');

  .glow-card { transition: transform .28s ease, box-shadow .28s ease; }
  .glow-card:hover { transform: translateY(-5px); box-shadow: 0 16px 36px -12px rgba(79,175,147,0.35), 0 0 0 1px rgba(62,143,176,0.18); }

  .glow-btn { position: relative; overflow: hidden; transition: box-shadow .25s ease, transform .2s ease; }
  .glow-btn:hover { box-shadow: 0 0 26px rgba(79,175,147,0.45), 0 0 40px rgba(62,143,176,0.3); transform: translateY(-1px); }
  .glow-btn::after {
    content: ""; position: absolute; top: 0; left: -75%; width: 50%; height: 100%;
    background: linear-gradient(120deg, transparent, rgba(255,255,255,0.55), transparent);
    transform: skewX(-20deg);
  }
  .glow-btn:hover::after { animation: shine 0.9s ease; }
  @keyframes shine { from { left: -75%; } to { left: 125%; } }

  .blob {
    border-radius: 62% 38% 55% 45% / 55% 45% 62% 38%;
    animation: blobMove 9s ease-in-out infinite, blobHue 12s linear infinite;
  }
  @keyframes blobMove {
    0%, 100% { border-radius: 62% 38% 55% 45% / 55% 45% 62% 38%; }
    50% { border-radius: 45% 55% 40% 60% / 50% 40% 60% 50%; }
  }
  @keyframes blobHue { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(45deg); } }

  .shimmer-text {
    background: linear-gradient(90deg, ${COLORS.gold}, ${COLORS.mint}, ${COLORS.blue}, ${COLORS.gold});
    background-size: 300% auto;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: shimmerMove 6s linear infinite;
  }
  @keyframes shimmerMove { 0% { background-position: 0% 50%; } 100% { background-position: 300% 50%; } }

  .shimmer-border {
    position: relative;
    background: linear-gradient(${COLORS.surface}, ${COLORS.surface}) padding-box,
                linear-gradient(120deg, ${COLORS.gold}, ${COLORS.mint}, ${COLORS.blue}, ${COLORS.gold}) border-box;
    background-size: 100% 100%, 300% 100%;
    border: 1.5px solid transparent;
    animation: shimmerMove 7s linear infinite;
  }

  .fade-in { animation: fadeIn .35s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
`;
