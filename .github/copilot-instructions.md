# GitHub Copilot Instructions

## 対話

- ユーザーとの対話は必ず**日本語**で行う

## 厳守するコーディングルール

### 型安全

- `any`（暗黙的・明示的を問わず）の使用を禁止する
- `as` による型アサーションを禁止する（型ガードを使用すること）
- `!` による非 null アサーションを禁止する（オプショナルチェーン `?.`、null 合体演算子 `??`、事前 `if` ガードを使用すること）
- 引数・変数の型省略による暗黙的 `any` を禁止する

### Lint / フォーマット

- `biome-ignore`、`ts-ignore`、`eslint-disable` などの ignore コメントを禁止する
- Index Signature（`obj[key]` のような文字列キーアクセス）を禁止する。型定義済みプロパティへのアクセス、または `Record<K, V>` を使用すること

### インポート

- すべてのインポートは `@/` プレフィックス付きの絶対パスを使用する（例: `@/features/sake/hooks/useSakeList`）
- 相対インポート（`./`、`../`）は禁止（Biome リンタールールで強制済み）

## アーキテクチャ

```
Pages → Features (Components + Hooks) → Mappers → API Client
```

| 層 | ディレクトリ | 役割 |
|---|---|---|
| Pages | `src/pages/` | ルート単位のページコンポーネント |
| Features | `src/features/` | 機能単位のコンポーネントとフック |
| Mappers | `src/mappers/` | APIレスポンス型（snake_case）→ ドメインモデル型（camelCase）変換 |
| API Client | `src/lib/api/generated.ts` | Orval自動生成（手動編集不可） |

## パッケージマネージャー

`bun` を使用する（`npm` / `yarn` は使わない）

## 主要コマンド

```bash
make build       # 本番ビルド（tsc + vite build）
make lint        # Biome リント
make format      # Biome フォーマット
make test        # テスト実行
make api-generate  # OpenAPI仕様からAPIクライアント生成
```

## テスト規約 (Vitest)

- `describe` は「関数名 → カテゴリ（期待結果を含む）」の階層構造
- `it` は日本語で動作を明記（「〜を許可」「〜を禁止」など）
- `// ===== カテゴリ名 =====` コメントでテストケースをグループ化

## データ変換パターン

APIレスポンス（snake_case） → Mapper → ドメインモデル（camelCase）

```typescript
// API型: ApiSake (generated.ts) → ドメイン型: Sake (types/sake.ts)
// 変換関数: mapSakeFromApi() (mappers/sakeMapper.ts)
```
