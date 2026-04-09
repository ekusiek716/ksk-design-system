/**
 * ## Cake.jp 固有コンポーネントカタログ
 *
 * KSK DS には統合していない Cake.jp 固有のコンポーネント一覧。
 * 各カードから Cake DS の Storybook（localhost:6006）に飛んでプレビューできる。
 *
 * ソース: cake-design-system/src/components/cake/
 */
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta = {
  title: "Extras/Cake.jp 固有コンポーネント",
}
export default meta

type Story = StoryObj

const CAKE_SB = "http://localhost:6006/?path=/story/cake-"

// KSK DS に統合済みのコンポーネント名セット
const integrated = new Set([
  "ProductCard", "ProductCarousel", "PriceDisplay", "QuantitySelector",
  "OrderSummary", "ImageCarousel", "BottomNavigation", "FilterBar",
  "RatingStars", "BulkActionBar", "KebabMenu", "StatusCountTabs",
  "SearchPanel", "ImageUploader", "NotificationList",
])

const categories = [
  {
    title: "EC・コマース系",
    items: [
      { num: 1, name: "ProductCard", desc: "商品カード（画像・価格・評価・ショップ名・タグ付き）", story: "productcard" },
      { num: 2, name: "ProductCTA", desc: "商品CTA（カートに入れる・タイムセール・予約・再入荷通知等）", story: "productcta" },
      { num: 3, name: "ProductCarousel", desc: "商品カルーセル（セクション見出し + レスポンシブカードサイズ）", story: "productcarousel" },
      { num: 4, name: "ProductDetailBar", desc: "商品詳細スティッキーヘッダー（タブ + 評価表示）", story: "productdetailbar" },
      { num: 5, name: "ProductDetailSidebar", desc: "商品詳細サイドバー（オプション・数量・価格・CTA）", story: "productdetailsidebar" },
      { num: 6, name: "ProductOption", desc: "商品オプション選択（数量・セレクト・テキスト・画像・ろうそく本数・レター）", story: "productoption" },
      { num: 7, name: "PriceDisplay", desc: "価格表示（税込・打ち消し線・セール価格）", story: "pricedisplay" },
      { num: 8, name: "QuantitySelector", desc: "数量変更（+/- ボタン + ゴミ箱アイコン）", story: "quantityselector" },
      { num: 9, name: "CouponCard", desc: "クーポンカード（取得ボタン付き、縦/横レイアウト）", story: "couponcard" },
      { num: 10, name: "OrderSummary", desc: "注文合計（明細行 + CTAボタン）", story: "ordersummary" },
      { num: 11, name: "OrderSection", desc: "注文確認セクション（通常/空/エラー状態）", story: "ordersection" },
      { num: 12, name: "DeliveryCalendar", desc: "配送日カレンダー（日付選択 + 配送可否状態）", story: "deliverycalendar" },
      { num: 13, name: "CountdownTimer", desc: "タイムセールカウントダウン（開始前/セール中/終了状態）", story: "countdowntimer" },
      { num: 14, name: "ShopCard", desc: "ショップカード（商品画像・評価・配送日・ブックマーク）", story: "shopcard" },
    ],
  },
  {
    title: "レビュー・評価系",
    items: [
      { num: 15, name: "RatingStars", desc: "星評価表示（スパークルアイコン + レビュー件数）", story: "ratingstars" },
      { num: 16, name: "ReviewSummary", desc: "評価サマリー（平均点 + 星別ゲージ）", story: "review" },
      { num: 17, name: "ReviewCard", desc: "レビューカード（list/card/PC バリアント、参考になった数 + いいね）", story: "reviewcard" },
      { num: 18, name: "ReviewForm", desc: "レビュー投稿フォーム（評価・テキスト・画像アップロード）", story: "reviewform" },
    ],
  },
  {
    title: "ナビゲーション・レイアウト系",
    items: [
      { num: 19, name: "BottomNavigation", desc: "モバイル下部ナビ（アイコン + ラベル + バッジ件数）", story: "bottomnavigation" },
      { num: 20, name: "NavigationRibbon", desc: "水平スクロールナビタブ / チップリンク", story: "navigationribbon" },
      { num: 21, name: "MenuDrawer", desc: "モバイルメニュードロワー（セクション + ネスト）", story: "menudrawer" },
      { num: 22, name: "Footer", desc: "フッター（リンクグループ・決済方法・連絡先）", story: "footer" },
      { num: 23, name: "MyPageSidebar", desc: "マイページサイドバー（アカウント系リンク）", story: null },
      { num: 24, name: "CategoryScroll", desc: "カテゴリ水平スクロール / グリッド", story: "categoryscroll" },
      { num: 25, name: "CategoryIconStrip", desc: "カテゴリアイコンストリップ（コンパクトフィルター）", story: "categoryiconstrip" },
    ],
  },
  {
    title: "検索・フィルター系",
    items: [
      { num: 26, name: "FilterBar", desc: "商品フィルターバー（チップ + ソート + 件数表示）", story: "filterbar" },
      { num: 27, name: "SearchPanel", desc: "管理画面検索パネル（グリッド/フレックスレイアウト）", story: "searchpanel" },
      { num: 28, name: "StatusCountTabs", desc: "ステータスフィルタータブ（件数バッジ付き）", story: "statuscounttab" },
    ],
  },
  {
    title: "メディア系",
    items: [
      { num: 29, name: "ImageGallery", desc: "画像ギャラリー（メイン画像 + サムネイル + ドット）", story: "imagegallery" },
      { num: 30, name: "ImageCarousel", desc: "画像カルーセル（ドット・矢印・オートプレイ・ピーク）", story: "imagecarousel" },
      { num: 31, name: "BannerCarousel", desc: "バナーカルーセル（ラベル + もっと見るリンク）", story: "bannercarousel" },
      { num: 32, name: "ImageUploader", desc: "管理画面画像アップロード（並び替え・削除）", story: "imageuploader" },
    ],
  },
  {
    title: "ソーシャル・認証系",
    items: [
      { num: 33, name: "SocialLoginButton", desc: "ソーシャルログイン（LINE・Amazon・Google・Apple）", story: "socialloginbutton" },
      { num: 34, name: "ShareButtons", desc: "SNSシェアボタン（LINE・X・Facebook・リンクコピー）", story: "sharebutton" },
      { num: 35, name: "PaymentMethod", desc: "決済方法表示（クレジットカードブランドアイコン）", story: "paymentmethod" },
    ],
  },
  {
    title: "管理画面系",
    items: [
      { num: 36, name: "BulkActionBar", desc: "テーブル一括操作バー（選択件数 + アクション）", story: null },
      { num: 37, name: "KebabMenu", desc: "三点ドットメニュー（テーブル行アクション）", story: "kebabmenu" },
      { num: 38, name: "ChartControls", desc: "グラフコントロール（粒度・期間・比較切替）", story: "chartcontrols" },
    ],
  },
  {
    title: "その他",
    items: [
      { num: 39, name: "Balloon", desc: "吹き出しツールチップ（方向指定の矢印付き）", story: "balloon" },
      { num: 40, name: "AnniversaryCard", desc: "記念日リマインダーカード", story: null },
      { num: 41, name: "NotificationList", desc: "通知リスト（縦/横レイアウト）", story: "notificationlist" },
      { num: 42, name: "CakeLogo", desc: "Cake.jp ロゴ SVG", story: "logo" },
    ],
  },
]

export const カタログ: Story = {
  render: () => (
    <div className="p-8 max-w-5xl mx-auto flex flex-col gap-12">
      <div>
        <h1 className="typo-heading-2xl text-[var(--Text-High-Emphasis)]">
          Cake.jp 固有コンポーネント
        </h1>
        <p className="typo-body-md text-[var(--Text-Medium-Emphasis)] mt-2">
          Cake.jp 由来の42コンポーネント。「統合済み」はKSK DSに汎用化して取り込み済み。残りはCake DS Storybookでプレビュー可能。
        </p>
        <div className="flex items-center gap-3 mt-3 p-3 rounded-lg bg-[var(--Surface-Accent-Primary-Light)] border border-[var(--Border-Accent-Primary)]">
          <span className="typo-label-sm text-[var(--Text-Accent-Primary)]">
            Cake DS Storybook が http://localhost:6006 で起動中である必要があります
          </span>
        </div>
      </div>

      {categories.map((cat) => (
        <div key={cat.title}>
          <h2 className="typo-heading-lg text-[var(--Text-High-Emphasis)] mb-4 pb-2 border-b border-[var(--Border-Low-Emphasis)]">
            {cat.title}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {cat.items.map((item) => (
              <div
                key={item.num}
                className="flex items-start gap-4 p-4 rounded-lg border border-[var(--Border-Low-Emphasis)] hover:border-[var(--Border-Accent-Primary)] hover:bg-[var(--Surface-Accent-Primary-Light)] transition-colors"
              >
                <span className="flex items-center justify-center size-9 rounded-full bg-[var(--Surface-Tertiary)] typo-label-sm text-[var(--Text-Medium-Emphasis)] shrink-0">
                  {item.num}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="typo-label-md text-[var(--Text-High-Emphasis)] flex items-center gap-2">
                      {item.name}
                      {integrated.has(item.name) && (
                        <span className="inline-flex items-center rounded-full bg-[var(--Surface-Success)] px-2 py-0.5 typo-label-xs text-[var(--Text-Success)]">
                          統合済み
                        </span>
                      )}
                    </p>
                    {item.story && !integrated.has(item.name) && (
                      <a
                        href={`${CAKE_SB}${item.story}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 inline-flex items-center gap-1 px-2.5 h-7 rounded-full typo-label-xs bg-[var(--Brand-Primary)] text-[var(--Text-on-Inverse)] hover:bg-[var(--Hover-Primary-Button)] transition-colors no-underline"
                      >
                        プレビュー
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M4.5 2.5H9.5V7.5M9.5 2.5L2.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </a>
                    )}
                  </div>
                  <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)] mt-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="p-4 rounded-lg bg-[var(--Surface-Secondary)] border border-[var(--Border-Low-Emphasis)]">
        <p className="typo-label-md text-[var(--Text-High-Emphasis)]">使い方</p>
        <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)] mt-1">
          Claude Code に「#1 ProductCard と #9 CouponCard を KSK DS に持ってきて」と指示すると、
          cake-design-system からコンポーネントをコピーして KSK DS に統合します。
        </p>
      </div>
    </div>
  ),
}
