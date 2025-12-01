import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: "./external/backend-api/api/openapi.bundled.yaml",
    output: {
      mode: "single",
      target: "./src/lib/api/generated.ts",
      client: "axios",
      override: {
        mutator: {
          path: "./src/lib/axios/client.ts",
          name: "customInstance",
        },
      },
    },
  },
});
