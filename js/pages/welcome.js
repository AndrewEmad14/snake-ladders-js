import { enableGlobalButtonSfx } from "../utils/button-sfx.js";
import { initBgm } from "../utils/bgm.js";
document.addEventListener("DOMContentLoaded", () => {
  enableGlobalButtonSfx(); // enable button sound effects globally
  initBgm(); // initialize background music
});