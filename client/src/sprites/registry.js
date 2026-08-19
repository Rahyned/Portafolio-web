import { TRAINER, POKEBALL, COIN, STAR } from "./trainer";
import {
  ABSTRACT_SHOPP,
  FLORERIA_SUSI,
  RIODENT,
  SOLUTIONS_CARS,
  STELLA,
  BUTTERFLIES,
  LIBRETA
} from "./projects";
import { BOX_WEB, BOX_SYSTEMS, BOX_DESKTOP } from "./boxes";

// Registro global: clave -> grilla de píxeles.
// Las claves de proyectos coinciden con project.id en data/projects.json.
export const SPRITES = {
  trainer: TRAINER,
  pokeball: POKEBALL,
  coin: COIN,
  star: STAR,
  box_web: BOX_WEB,
  box_systems: BOX_SYSTEMS,
  box_desktop: BOX_DESKTOP,
  abstractoshopp: ABSTRACT_SHOPP,
  floreria_susi: FLORERIA_SUSI,
  riodent: RIODENT,
  solutionscars: SOLUTIONS_CARS,
  stella: STELLA,
  butterflies: BUTTERFLIES,
  libreta: LIBRETA
};

export const getSprite = (key) => SPRITES[key] || null;

// Mapea project.id (data/projects.json) a la clave de sprite.
const PROJECT_SPRITES = {
  "abstractoshopp": "abstractoshopp",
  "floreria-susi": "floreria_susi",
  "riodent": "riodent",
  "solutionscars": "solutionscars",
  "stella": "stella",
  "butterflies": "butterflies",
  "libreta": "libreta"
};

export const getProjectSprite = (id) => SPRITES[PROJECT_SPRITES[id]] ? PROJECT_SPRITES[id] : null;