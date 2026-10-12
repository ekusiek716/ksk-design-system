import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { getComponent } from "./tools/get-component.js";
import { getToken } from "./tools/get-token.js";
import { checkRule } from "./tools/check-rule.js";
import { search } from "./tools/search.js";
import {
  CONTRACT_DEFINITIONS,
  getContract,
  listContracts,
  readContractText,
} from "./tools/get-contract.js";

export function createServer(): Server {
  const server = new Server(
    { name: "ksk-ds", version: "1.0.0" },
    { capabilities: { tools: {}, resources: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: "get_component",
        description:
          "KSK DSコンポーネントのメタデータを取得。variants, sizes, 使い方, インポートパスを返す。" +
          "実 export 名（CheckboxCardGroup 等の subcomponents）でも引ける。" +
          "import できない名前で引いた場合は importable:false と import 可能な名前を返す。",
        inputSchema: {
          type: "object" as const,
          properties: {
            id: {
              type: "string",
              description:
                'コンポーネント名またはID (例: "Button", "button", "FormField", "CheckboxCardGroup", "ProductCard")',
            },
          },
          required: ["id"],
        },
      },
      {
        name: "get_token",
        description:
          "デザイントークン（CSS変数）をカテゴリ別に取得。primitive.css / semantic.css / typography.css からパース。",
        inputSchema: {
          type: "object" as const,
          properties: {
            category: {
              type: "string",
              description:
                'トークンカテゴリ (例: "color", "typography", "spacing", "radius", "shadow", "size")',
            },
          },
          required: ["category"],
        },
      },
      {
        name: "check_rule",
        description:
          "TailwindクラスをKSK DS禁止ルールに照合。違反がある場合は理由と正しい代替を返す。",
        inputSchema: {
          type: "object" as const,
          properties: {
            classes: {
              type: "string",
              description:
                'チェックするTailwindクラス文字列 (例: "text-sm font-bold bg-gray-100")',
            },
          },
          required: ["classes"],
        },
      },
      {
        name: "search",
        description:
          "コンポーネント・トークン・ルールを横断検索。日本語・英語キーワード対応。",
        inputSchema: {
          type: "object" as const,
          properties: {
            query: {
              type: "string",
              description:
                '検索キーワード (例: "ボタン", "Card", "禁止", "orange")',
            },
          },
          required: ["query"],
        },
      },
      {
        name: "list_contracts",
        description:
          "配信している正本（contracts/*.json・tokens.json・DESIGN.md・COMPONENT_LOOKUP.md）の名前・説明・URI を一覧する。" +
          "resources を読めないクライアントでも get_contract で同じ内容を取得できる。",
        inputSchema: { type: "object" as const, properties: {} },
      },
      {
        name: "get_contract",
        description:
          "正本を名前で取得する（例: components / rules / tokens / composition / screen-patterns / design）。" +
          "JSON は path（ドット区切り。例: meta.counts）、Markdown は section（見出しの部分一致。例: Colors）で部分取得できる。" +
          "大きい契約は path / section 省略時に目次だけ返す（full:true で全文）。",
        inputSchema: {
          type: "object" as const,
          properties: {
            name: {
              type: "string",
              description: '契約名 (list_contracts の name。例: "components", "design", "DESIGN.md")',
            },
            path: {
              type: "string",
              description: "JSON 契約のドット区切り部分取得 (例: \"meta.counts\", \"ui.0\")",
            },
            section: {
              type: "string",
              description: 'Markdown 契約の見出し部分一致 (例: "Colors")',
            },
            full: {
              type: "boolean",
              description: "true で大きい契約も全文を返す",
            },
          },
          required: ["name"],
        },
      },
    ],
  }));

  server.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources: CONTRACT_DEFINITIONS.map((d) => ({
      uri: d.uri,
      name: d.name,
      description: d.description,
      mimeType: d.mimeType,
    })),
  }));

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const definition = CONTRACT_DEFINITIONS.find((d) => d.uri === request.params.uri);
    if (!definition) {
      throw new Error(`Unknown resource: ${request.params.uri}`);
    }
    // 読み込み失敗は MCP のエラー応答（JSON-RPC error）として返す。理由をメッセージに含める
    let text: string;
    try {
      text = readContractText(definition);
    } catch (error) {
      throw new Error(
        `Failed to read resource ${definition.uri}: ${error instanceof Error ? error.message : String(error)}`,
        { cause: error }
      );
    }
    return {
      contents: [{ uri: definition.uri, mimeType: definition.mimeType, text }],
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    switch (name) {
      case "get_component": {
        const result = getComponent(args?.id as string);
        // note は import できない名前（exported:false のエントリ名・非推奨エイリアス）で
        // 引かれたときだけ付く。JSON に埋めるだけだと読み飛ばされるので先頭にも出す。
        const text = result
          ? `${result.note ? `⚠️ ${result.note}\n\n` : ""}${JSON.stringify(result, null, 2)}`
          : `コンポーネント "${args?.id}" が見つかりません`;
        return {
          content: [{ type: "text" as const, text }],
        };
      }

      case "get_token": {
        const result = getToken(args?.category as string);
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "check_rule": {
        const { violations, aiPatternMatches } = checkRule(args?.classes as string);
        const total = violations.length + aiPatternMatches.length;
        let text = "";
        if (total === 0) {
          text = "✅ 違反なし";
        } else {
          if (violations.length > 0) {
            text += `❌ 禁止パターン ${violations.length}件:\n${JSON.stringify(violations, null, 2)}\n`;
          }
          if (aiPatternMatches.length > 0) {
            text += `⚠️ AIアンチパターン ${aiPatternMatches.length}件:\n${JSON.stringify(aiPatternMatches, null, 2)}`;
          }
        }
        return {
          content: [{ type: "text" as const, text }],
        };
      }

      case "search": {
        const results = search(args?.query as string);
        return {
          content: [
            {
              type: "text" as const,
              text:
                results.length === 0
                  ? `"${args?.query}" に一致する結果はありません`
                  : `${results.length}件の結果:\n${JSON.stringify(results, null, 2)}`,
            },
          ],
        };
      }

      case "list_contracts": {
        return {
          content: [
            { type: "text" as const, text: JSON.stringify(listContracts(), null, 2) },
          ],
        };
      }

      case "get_contract": {
        let result: ReturnType<typeof getContract>;
        try {
          result = getContract(String(args?.name ?? ""), {
            path: typeof args?.path === "string" ? args.path : undefined,
            section: typeof args?.section === "string" ? args.section : undefined,
            full: args?.full === true,
          });
        } catch (error) {
          // ファイル欠落・JSON 破損などで例外になっても、クライアントには isError で返す
          result = {
            ok: false,
            error: `get_contract に失敗しました: ${error instanceof Error ? error.message : String(error)}`,
          };
        }
        return {
          content: [
            { type: "text" as const, text: result.ok ? result.text : result.error },
          ],
          ...(result.ok ? {} : { isError: true }),
        };
      }

      default:
        return {
          content: [
            { type: "text" as const, text: `Unknown tool: ${name}` },
          ],
        };
    }
  });

  return server;
}

export async function startServer(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
