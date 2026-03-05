import type { OpenAPIObject } from "openapi3-ts/oas30";
import { defineConfig } from "orval";

/**
 * OpenAPI paths オブジェクトから HTTP 4xx/5xx エラーレスポンスを除外する input transformer。
 * orval が不要なエラーレスポンス型を生成しないようにする。
 */
const errorResponseFilter = (spec: OpenAPIObject): OpenAPIObject => {
	const paths = spec.paths;
	for (const path of Object.keys(paths)) {
		const pathItem = paths[path];
		if (!pathItem) {
			continue;
		}
		const methods = ["get", "put", "post", "delete", "patch", "head", "options", "trace"] as const;
		for (const method of methods) {
			const operation = pathItem[method];
			if (!operation?.responses) {
				continue;
			}
			for (const statusCode of Object.keys(operation.responses)) {
				const code = Number(statusCode);
				if (code >= 400) {
					delete operation.responses[statusCode];
				}
			}
		}
	}
	return spec;
};

export default defineConfig({
	api: {
		input: {
			target: "./external/backend-api/api/openapi.bundled.yaml",
			override: {
				transformer: errorResponseFilter,
			},
		},
		output: {
			mode: "tags-split",
			target: "./src/lib/api/generated",
			schemas: "./src/lib/api/generated/models",
			namingConvention: "camelCase",
			client: "axios",
			indexFiles: true,
			clean: true,
			biome: true,
			override: {
				useTypeOverInterfaces: true,
				mutator: {
					path: "./src/lib/axios/client.ts",
					name: "customInstance",
				},
			},
		},
	},
});
