import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { getComponent } from "./tools/get-component.js";
import { getToken } from "./tools/get-token.js";
import { checkRule } from "./tools/check-rule.js";
import { search } from "./tools/search.js";
export function createServer() {
    const server = new Server({ name: "ksk-ds", version: "1.0.0" }, { capabilities: { tools: {} } });
    server.setRequestHandler(ListToolsRequestSchema, async () => ({
        tools: [
            {
                name: "get_component",
                description: "KSK DSコンポーネントのメタデータを取得。variants, sizes, 使い方, インポートパスを返す。",
                inputSchema: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            description: 'コンポーネント名またはID (例: "Button", "button", "FormField", "ProductCard")',
                        },
                    },
                    required: ["id"],
                },
            },
            {
                name: "get_token",
                description: "デザイントークン（CSS変数）をカテゴリ別に取得。primitive.css / semantic.css / typography.css からパース。",
                inputSchema: {
                    type: "object",
                    properties: {
                        category: {
                            type: "string",
                            description: 'トークンカテゴリ (例: "color", "typography", "spacing", "radius", "shadow", "size")',
                        },
                    },
                    required: ["category"],
                },
            },
            {
                name: "check_rule",
                description: "TailwindクラスをKSK DS禁止ルールに照合。違反がある場合は理由と正しい代替を返す。",
                inputSchema: {
                    type: "object",
                    properties: {
                        classes: {
                            type: "string",
                            description: 'チェックするTailwindクラス文字列 (例: "text-sm font-bold bg-gray-100")',
                        },
                    },
                    required: ["classes"],
                },
            },
            {
                name: "search",
                description: "コンポーネント・トークン・ルールを横断検索。日本語・英語キーワード対応。",
                inputSchema: {
                    type: "object",
                    properties: {
                        query: {
                            type: "string",
                            description: '検索キーワード (例: "ボタン", "Card", "禁止", "orange")',
                        },
                    },
                    required: ["query"],
                },
            },
        ],
    }));
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
        switch (name) {
            case "get_component": {
                const result = getComponent(args?.id);
                return {
                    content: [
                        {
                            type: "text",
                            text: result
                                ? JSON.stringify(result, null, 2)
                                : `コンポーネント "${args?.id}" が見つかりません`,
                        },
                    ],
                };
            }
            case "get_token": {
                const result = getToken(args?.category);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            }
            case "check_rule": {
                const { violations, aiPatternMatches } = checkRule(args?.classes);
                const total = violations.length + aiPatternMatches.length;
                let text = "";
                if (total === 0) {
                    text = "✅ 違反なし";
                }
                else {
                    if (violations.length > 0) {
                        text += `❌ 禁止パターン ${violations.length}件:\n${JSON.stringify(violations, null, 2)}\n`;
                    }
                    if (aiPatternMatches.length > 0) {
                        text += `⚠️ AIアンチパターン ${aiPatternMatches.length}件:\n${JSON.stringify(aiPatternMatches, null, 2)}`;
                    }
                }
                return {
                    content: [{ type: "text", text }],
                };
            }
            case "search": {
                const results = search(args?.query);
                return {
                    content: [
                        {
                            type: "text",
                            text: results.length === 0
                                ? `"${args?.query}" に一致する結果はありません`
                                : `${results.length}件の結果:\n${JSON.stringify(results, null, 2)}`,
                        },
                    ],
                };
            }
            default:
                return {
                    content: [
                        { type: "text", text: `Unknown tool: ${name}` },
                    ],
                };
        }
    });
    return server;
}
export async function startServer() {
    const server = createServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
