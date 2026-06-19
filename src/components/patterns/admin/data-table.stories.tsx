import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import {
  DataTable,
  DataTableTable,
  DataTableHeader,
  DataTableBody,
  DataTableRow,
  DataTableHead,
  DataTableCell,
  DataTableAvatarCell,
  DataTableCheckboxCell,
  DataTableActionCell,
  DataTableEmptyState,
  DataTableAddRow,
  DataTableSectionRow,
  DataTableNumberCell,
  DataTableLinkCell,
  DataTableDragHandleCell,
  DataTableInputCell,
  DataTableSelectCell,
  DataTableImageCell,
} from "./data-table"
import type { DataTableColumn, DataTableRowId, DataTableSortState, SortDirection } from "./data-table"
import { Badge } from "../../ui/badge"
import { Button } from "../../ui/button"
import { BulkActions } from "./bulk-actions"
import { cn } from "@/lib/utils"

const meta: Meta = {
  title: "Components/Admin/DataTable",
}
export default meta

// ─── Sample Data ───

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  status: "active" | "inactive" | "pending" | "suspended"
}

const sampleUsers: User[] = [
  {
    id: "1",
    name: "田中 太郎",
    email: "tanaka@example.com",
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=tanaka",
    status: "active",
  },
  {
    id: "2",
    name: "鈴木 花子",
    email: "suzuki@example.com",
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=suzuki",
    status: "inactive",
  },
  {
    id: "3",
    name: "佐藤 一郎",
    email: "sato@example.com",
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=sato",
    status: "pending",
  },
  {
    id: "4",
    name: "山田 美咲",
    email: "yamada@example.com",
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=yamada",
    status: "active",
  },
]

const statusBadgeVariant: Record<User["status"], "default" | "secondary" | "outline" | "destructive"> = {
  active: "default",
  inactive: "secondary",
  pending: "outline",
  suspended: "destructive",
}

const statusLabel: Record<User["status"], string> = {
  active: "有効",
  inactive: "無効",
  pending: "保留中",
  suspended: "停止",
}

const statusOptions = [
  { label: "有効", value: "active" },
  { label: "無効", value: "inactive" },
  { label: "保留中", value: "pending" },
  { label: "停止", value: "suspended" },
]

// ─── Default Story ───

export const Default: StoryObj = {
  render: function DefaultStory() {
    const [selected, setSelected] = React.useState<Set<string>>(new Set())
    const [sortCol, setSortCol] = React.useState<string | null>(null)
    const [sortDir, setSortDir] = React.useState<SortDirection>(null)

    const toggleAll = () => {
      if (selected.size === sampleUsers.length) {
        setSelected(new Set())
      } else {
        setSelected(new Set(sampleUsers.map((u) => u.id)))
      }
    }

    const toggleOne = (id: string) => {
      setSelected((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      })
    }

    const handleSort = (col: string) => {
      if (sortCol === col) {
        setSortDir((prev) => (prev === "asc" ? "desc" : prev === "desc" ? null : "asc"))
        if (sortDir === "desc") setSortCol(null)
      } else {
        setSortCol(col)
        setSortDir("asc")
      }
    }

    const sortedUsers = React.useMemo(() => {
      if (!sortCol || !sortDir) return sampleUsers
      return [...sampleUsers].sort((a, b) => {
        const aVal = a[sortCol as keyof User] ?? ""
        const bVal = b[sortCol as keyof User] ?? ""
        const cmp = String(aVal).localeCompare(String(bVal), "ja")
        return sortDir === "asc" ? cmp : -cmp
      })
    }, [sortCol, sortDir])

    return (
      <div className="space-y-4 p-6">
        <DataTable>
          <DataTableTable>
            <DataTableHeader>
              <tr>
                <DataTableCheckboxCell
                  as="th"
                  checked={selected.size === sampleUsers.length}
                  indeterminate={selected.size > 0 && selected.size < sampleUsers.length}
                  onCheckedChange={toggleAll}
                />
                <DataTableHead
                  sortable
                  sortDirection={sortCol === "name" ? sortDir : null}
                  onSort={() => handleSort("name")}
                >
                  名前
                </DataTableHead>
                <DataTableHead
                  sortable
                  sortDirection={sortCol === "email" ? sortDir : null}
                  onSort={() => handleSort("email")}
                >
                  メールアドレス
                </DataTableHead>
                <DataTableHead>ステータス</DataTableHead>
                <DataTableHead />
              </tr>
            </DataTableHeader>
            <DataTableBody>
              {sortedUsers.map((user) => (
                <DataTableRow key={user.id} selected={selected.has(user.id)}>
                  <DataTableCheckboxCell
                    checked={selected.has(user.id)}
                    onCheckedChange={() => toggleOne(user.id)}
                  />
                  <DataTableAvatarCell
                    src={user.avatar}
                    title={user.name}
                    caption={user.email}
                  />
                  <DataTableCell>{user.email}</DataTableCell>
                  <DataTableCell>
                    <Badge variant={statusBadgeVariant[user.status]}>
                      {statusLabel[user.status]}
                    </Badge>
                  </DataTableCell>
                  <DataTableActionCell
                    items={[
                      { label: "編集", onClick: () => console.log("edit", user.id) },
                      { label: "複製", onClick: () => console.log("duplicate", user.id) },
                      {
                        label: "削除",
                        destructive: true,
                        onClick: () => console.log("delete", user.id),
                      },
                    ]}
                  />
                </DataTableRow>
              ))}
            </DataTableBody>
          </DataTableTable>
        </DataTable>

        <BulkActions selectedCount={selected.size} onClear={() => setSelected(new Set())}>
          <Button variant="ghost-inverse" size="sm" className="rounded-full">
            削除する
          </Button>
          <Button variant="ghost-inverse" size="sm" className="rounded-full">
            エクスポート
          </Button>
        </BulkActions>
      </div>
    )
  },
}

// ─── Rows / Columns API ───

export const RowsAndColumns: StoryObj = {
  name: "Rows / Columns API",
  render: function RowsAndColumnsStory() {
    const [users, setUsers] = React.useState<User[]>(sampleUsers)
    const [selectedIds, setSelectedIds] = React.useState<DataTableRowId[]>(["1"])
    const [sort, setSort] = React.useState<DataTableSortState | null>({
      key: "name",
      direction: "asc",
    })

    const columns = React.useMemo<DataTableColumn<User>[]>(
      () => [
        {
          key: "name",
          header: "名前",
          sortable: true,
          sortValue: (user) => user.name,
          render: (user) => (
            <div className="flex flex-col min-w-0">
              <span className="typo-label-md text-[var(--Text-High-Emphasis)] truncate">
                {user.name}
              </span>
              <span className="typo-body-sm text-[var(--Text-Low-Emphasis)] truncate">
                {user.email}
              </span>
            </div>
          ),
        },
        {
          key: "email",
          header: "メールアドレス",
          sortable: true,
        },
        {
          key: "status",
          header: "ステータス",
          sortable: true,
          editable: true,
          editValue: (user) => user.status,
          editOptions: statusOptions,
          onEditChange: (user, value) => {
            setUsers((current) =>
              current.map((item) =>
                item.id === user.id ? { ...item, status: value as User["status"] } : item
              )
            )
          },
        },
      ],
      []
    )

    return (
      <div className="space-y-4 p-6">
        <BulkActions selectedCount={selectedIds.length} onClear={() => setSelectedIds([])}>
          <Button variant="ghost-inverse" size="sm" className="rounded-full">
            選択中のユーザーを更新
          </Button>
        </BulkActions>
        <DataTable
          rows={users}
          columns={columns}
          getRowId={(user) => user.id}
          sort={sort}
          onSortChange={setSort}
          selection={{
            mode: "multi",
            selectedRowIds: selectedIds,
            onSelectionChange: setSelectedIds,
          }}
          sectionRow={(user) => ({
            key: user.status === "active" ? "active" : "other",
            label: user.status === "active" ? "有効なユーザー" : "その他のユーザー",
          })}
          emptyMessage="ユーザーが見つかりません"
          emptyDescription="rows と columns だけで空状態まで表示できます。"
        />
      </div>
    )
  },
}

// ─── Empty State ───

export const Empty: StoryObj = {
  render: () => (
    <div className="p-6">
      <DataTable>
        <DataTableTable>
          <DataTableHeader>
            <tr>
              <DataTableHead>名前</DataTableHead>
              <DataTableHead>メールアドレス</DataTableHead>
              <DataTableHead>ステータス</DataTableHead>
            </tr>
          </DataTableHeader>
          <DataTableBody>
            <DataTableEmptyState
              colSpan={3}
              message="ユーザーが見つかりません"
              description="条件を変更してもう一度検索してください"
            />
          </DataTableBody>
        </DataTableTable>
      </DataTable>
    </div>
  ),
}

// ─── With Sections ───

export const WithSections: StoryObj = {
  render: function SectionsStory() {
    const [activeOpen, setActiveOpen] = React.useState(true)
    const [inactiveOpen, setInactiveOpen] = React.useState(true)

    const activeUsers = sampleUsers.filter((u) => u.status === "active")
    const inactiveUsers = sampleUsers.filter((u) => u.status !== "active")

    return (
      <div className="p-6">
        <DataTable>
          <DataTableTable>
            <DataTableHeader>
              <tr>
                <DataTableHead>名前</DataTableHead>
                <DataTableHead>メールアドレス</DataTableHead>
                <DataTableHead>ステータス</DataTableHead>
              </tr>
            </DataTableHeader>
            <DataTableBody>
              <DataTableSectionRow
                label="有効なユーザー"
                count={activeUsers.length}
                open={activeOpen}
                onToggle={() => setActiveOpen(!activeOpen)}
                colSpan={3}
              />
              {activeOpen &&
                activeUsers.map((user) => (
                  <DataTableRow key={user.id}>
                    <DataTableAvatarCell src={user.avatar} title={user.name} />
                    <DataTableCell>{user.email}</DataTableCell>
                    <DataTableCell>
                      <Badge variant={statusBadgeVariant[user.status]}>
                        {statusLabel[user.status]}
                      </Badge>
                    </DataTableCell>
                  </DataTableRow>
                ))}

              <DataTableSectionRow
                label="その他のユーザー"
                count={inactiveUsers.length}
                open={inactiveOpen}
                onToggle={() => setInactiveOpen(!inactiveOpen)}
                colSpan={3}
              />
              {inactiveOpen &&
                inactiveUsers.map((user) => (
                  <DataTableRow key={user.id}>
                    <DataTableAvatarCell src={user.avatar} title={user.name} />
                    <DataTableCell>{user.email}</DataTableCell>
                    <DataTableCell>
                      <Badge variant={statusBadgeVariant[user.status]}>
                        {statusLabel[user.status]}
                      </Badge>
                    </DataTableCell>
                  </DataTableRow>
                ))}

              <DataTableAddRow colSpan={3} onClick={() => console.log("add")} />
            </DataTableBody>
          </DataTableTable>
        </DataTable>
      </div>
    )
  },
}

// ─── With Various Cell Types ───

export const CellVariants: StoryObj = {
  render: function CellVariantsStory() {
    const [inputVal, setInputVal] = React.useState("サンプル商品")
    const [selectVal, setSelectVal] = React.useState("published")

    return (
      <div className="p-6">
        <DataTable>
          <DataTableTable>
            <DataTableHeader>
              <tr>
                <DataTableHead />
                <DataTableHead>画像</DataTableHead>
                <DataTableHead>商品名</DataTableHead>
                <DataTableHead>ステータス</DataTableHead>
                <DataTableHead>価格</DataTableHead>
                <DataTableHead>リンク</DataTableHead>
              </tr>
            </DataTableHeader>
            <DataTableBody>
              <DataTableRow>
                <DataTableDragHandleCell />
                <DataTableImageCell
                  src="https://placehold.co/40x40/e2e8f0/475569?text=A"
                  title="商品A"
                  caption="SKU-001"
                />
                <DataTableInputCell
                  value={inputVal}
                  onChange={setInputVal}
                  placeholder="商品名を入力"
                />
                <DataTableSelectCell
                  value={selectVal}
                  onValueChange={setSelectVal}
                  options={[
                    { label: "公開", value: "published" },
                    { label: "下書き", value: "draft" },
                    { label: "非公開", value: "archived" },
                  ]}
                />
                <DataTableNumberCell value={3980} prefix="¥" />
                <DataTableLinkCell href="https://example.com" external>
                  詳細を見る
                </DataTableLinkCell>
              </DataTableRow>
              <DataTableRow>
                <DataTableDragHandleCell />
                <DataTableImageCell
                  src="https://placehold.co/40x40/e2e8f0/475569?text=B"
                  title="商品B"
                  caption="SKU-002"
                />
                <DataTableInputCell
                  value="別の商品"
                  placeholder="商品名を入力"
                />
                <DataTableSelectCell
                  value="draft"
                  options={[
                    { label: "公開", value: "published" },
                    { label: "下書き", value: "draft" },
                    { label: "非公開", value: "archived" },
                  ]}
                />
                <DataTableNumberCell value={12500} prefix="¥" />
                <DataTableLinkCell href="https://example.com">
                  内部リンク
                </DataTableLinkCell>
              </DataTableRow>
            </DataTableBody>
          </DataTableTable>
        </DataTable>
      </div>
    )
  },
}

// ─── Sticky Columns ───

export const StickyColumns: StoryObj = {
  name: "Sticky Columns (左端固定)",
  render: function StickyColumnsStory() {
    const rows = Array.from({ length: 12 }).map((_, i) => ({
      id: `row-${i + 1}`,
      name: `ユーザー ${i + 1}`,
      email: `user${i + 1}@example.com`,
      department: ["営業", "開発", "デザイン", "マーケ"][i % 4],
      country: ["JP", "US", "DE", "SG", "FR"][i % 5],
      city: ["Tokyo", "NYC", "Berlin", "Singapore", "Paris"][i % 5],
      role: ["Manager", "Lead", "Member", "Owner"][i % 4],
      joined: `2024-${String((i % 12) + 1).padStart(2, "0")}-01`,
      revenue: 100000 + i * 31337,
      orders: 3 + i,
      lastLogin: `2026-05-${String((i % 28) + 1).padStart(2, "0")}`,
    }))

    return (
      <div className="p-6">
        <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)] mb-3">
          横スクロールして左端 2 列が固定されることを確認。
          `sticky` prop を `DataTableHead` / `DataTableCell` 系に付与。
        </p>
        <DataTable>
          <DataTableTable className="min-w-[1200px]">
            <DataTableHeader>
              <tr>
                <DataTableHead sticky="left" stickyOffset={0} className="w-[140px]">
                  名前
                </DataTableHead>
                <DataTableHead sticky="left" stickyOffset={140} className="w-[200px]">
                  メールアドレス
                </DataTableHead>
                <DataTableHead>部署</DataTableHead>
                <DataTableHead>国</DataTableHead>
                <DataTableHead>都市</DataTableHead>
                <DataTableHead>役割</DataTableHead>
                <DataTableHead>入社日</DataTableHead>
                <DataTableHead>売上</DataTableHead>
                <DataTableHead>注文数</DataTableHead>
                <DataTableHead>最終ログイン</DataTableHead>
              </tr>
            </DataTableHeader>
            <DataTableBody>
              {rows.map((r) => (
                <DataTableRow key={r.id}>
                  <DataTableCell sticky="left" stickyOffset={0} className="w-[140px]">
                    {r.name}
                  </DataTableCell>
                  <DataTableCell sticky="left" stickyOffset={140} className="w-[200px]">
                    {r.email}
                  </DataTableCell>
                  <DataTableCell>{r.department}</DataTableCell>
                  <DataTableCell>{r.country}</DataTableCell>
                  <DataTableCell>{r.city}</DataTableCell>
                  <DataTableCell>{r.role}</DataTableCell>
                  <DataTableCell>{r.joined}</DataTableCell>
                  <DataTableNumberCell value={r.revenue} prefix="¥" />
                  <DataTableNumberCell value={r.orders} />
                  <DataTableCell>{r.lastLogin}</DataTableCell>
                </DataTableRow>
              ))}
            </DataTableBody>
          </DataTableTable>
        </DataTable>
      </div>
    )
  },
}

// ─── Drag & Drop 並べ替え ───

export const DragAndDrop: StoryObj = {
  name: "Drag & Drop (行の並べ替え)",
  render: function DragAndDropStory() {
    const [rows, setRows] = React.useState(sampleUsers)
    const [dragIndex, setDragIndex] = React.useState<number | null>(null)
    // ドロップ先を「行と行の間」= 挿入位置(0..rows.length)で持つ。
    // 行インデックスだと最下行の“下”を指せず「一番下に移動できない」が起きるため。
    const [overPos, setOverPos] = React.useState<number | null>(null)

    const reset = () => {
      setDragIndex(null)
      setOverPos(null)
    }

    const handleDrop = () => {
      if (dragIndex !== null && overPos !== null) {
        setRows((prev) => {
          const next = [...prev]
          const [moved] = next.splice(dragIndex, 1)
          // dragIndex を抜いた分、挿入位置が後ろなら 1 つ詰める
          const insertAt = dragIndex < overPos ? overPos - 1 : overPos
          next.splice(insertAt, 0, moved)
          return next
        })
      }
      reset()
    }

    return (
      <div className="p-6">
        <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)] mb-3">
          行頭のハンドルを掴んでドラッグすると並べ替えできます。
        </p>
        <DataTable>
          <DataTableTable>
            <DataTableHeader>
              <tr>
                <DataTableHead className="w-[36px]" />
                <DataTableHead>名前</DataTableHead>
                <DataTableHead>メールアドレス</DataTableHead>
                <DataTableHead>ステータス</DataTableHead>
              </tr>
            </DataTableHeader>
            <DataTableBody>
              {rows.map((user, index) => (
                <DataTableRow
                  key={user.id}
                  draggable
                  onDragStart={() => setDragIndex(index)}
                  onDragOver={(e) => {
                    e.preventDefault()
                    // カーソルが行の上半分なら「この行の前」、下半分なら「この行の後」に挿入
                    const rect = e.currentTarget.getBoundingClientRect()
                    const after = e.clientY - rect.top > rect.height / 2
                    const pos = after ? index + 1 : index
                    if (pos !== overPos) setOverPos(pos)
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    handleDrop()
                  }}
                  onDragEnd={reset}
                  className={cn(
                    dragIndex === index && "opacity-40",
                    // 挿入位置インジケータ（行間の線）。最下行の“下”も表示できる。
                    dragIndex !== null && overPos === index &&
                      "shadow-[inset_0_2px_0_var(--Brand-Primary)]",
                    dragIndex !== null && index === rows.length - 1 && overPos === rows.length &&
                      "shadow-[inset_0_-2px_0_var(--Brand-Primary)]"
                  )}
                >
                  <DataTableDragHandleCell />
                  <DataTableAvatarCell src={user.avatar} title={user.name} />
                  <DataTableCell>{user.email}</DataTableCell>
                  <DataTableCell>
                    <Badge variant={statusBadgeVariant[user.status]}>
                      {statusLabel[user.status]}
                    </Badge>
                  </DataTableCell>
                </DataTableRow>
              ))}
            </DataTableBody>
          </DataTableTable>
        </DataTable>
      </div>
    )
  },
}
