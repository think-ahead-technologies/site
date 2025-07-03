import { fileURLToPath } from "node:url";
import glob from "fast-glob";

export default function astroI18nextReloader() {
  return {
    name: "astro-i18next-reloader",
    hooks: {
      "astro:config:setup": async ({ command, config, addWatchFile }) => {
        if (command !== "dev") return;

        await glob(`**/*.json`, {
          cwd: fileURLToPath(config.publicDir),
        }).then((f) =>
          f.map((file) => {
            addWatchFile(new URL(`./${file}`, config.publicDir));
          })
        );
      },
    },
  };
}