import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  // configs do Next
  ...nextVitals,
  ...nextTs,

  // 👇 aqui você sobrescreve regras que quer relaxar
  {
    rules: {
      // pode usar Date.now() sem o erro "impure function during render"
      "react-hooks/purity": "off",

      // libera uso de any (rota, next-auth, strapi etc.)
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // 👇 aqui você fala o que o ESLint deve simplesmente ignorar
  globalIgnores([
    // Defaults do eslint-config-next
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",

    // Ignorar TODO o CMS Strapi
    "ifad-connect-cms/**",
  ]),
]);

export default eslintConfig;
