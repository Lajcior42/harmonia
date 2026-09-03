import { Sparkles, Wind, Sun, Building2, Wifi } from "lucide-react";

export const SERVICES = [
  {
    id: "czakry",
    icon: Sparkles,
    title: "Harmonizacja Czakr",
    duration: "60 min",
    price: "180 zł",
    description: "Sesja przywracająca równowagę w ciele energetycznym poprzez pracę z siedmioma głównymi czakrami.",
    image: "https://images.pexels.com/photos/3278758/pexels-photo-3278758.jpeg?auto=compress&cs=tinysrgb&w=500",
  },
  {
    id: "aura",
    icon: Wind,
    title: "Oczyszczanie Aury",
    duration: "45 min",
    price: "150 zł",
    description: "Delikatna praca z polem energetycznym, usuwająca nagromadzone napięcia i blokady emocjonalne.",
    image: "https://images.pexels.com/photos/6998217/pexels-photo-6998217.jpeg?auto=compress&cs=tinysrgb&w=500",
  },
  {
    id: "reiki",
    icon: Sun,
    title: "Reiki",
    duration: "50 min",
    price: "160 zł",
    description: "Japońska technika przekazywania energii życiowej poprzez delikatny dotyk lub pracę nad ciałem.",
    image: "https://images.pexels.com/photos/6998279/pexels-photo-6998279.jpeg?auto=compress&cs=tinysrgb&w=500",
  },
];

export const FORMS = [
  { id: "Stacjonarnie", icon: Building2, title: "Stacjonarnie", description: "Wizyta w gabinecie — pełne doświadczenie sesji na miejscu, w spokojnej przestrzeni." },
  { id: "Na odległość", icon: Wifi, title: "Na odległość", description: "Sesja zdalna, prowadzona przez WhatsApp — Ty zapewniasz spokojne miejsce, resztą zajmuję się ja. Numer telefonu jest wymagany, żebym mogła się z Tobą połączyć." },
];
