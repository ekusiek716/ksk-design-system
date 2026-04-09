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
  DataTableBulkActions,
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
import type { SortDirection } from "./data-table"
import { Badge } from "../../ui/badge"

const meta: Meta = {
  title: "Admin/DataTable",
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
        <DataTableBulkActions selectedCount={selected.size}>
          <button
            type="button"
            className="typo-label-sm text-[var(--Text-Caution)] hover:underline"
          >
            削除する
          </button>
          <button
            type="button"
            className="typo-label-sm text-[var(--Text-Accent-Primary)] hover:underline"
          >
            エクスポート
          </button>
        </DataTableBulkActions>

        <DataTable>
          <DataTableTable>
            <DataTableHeader>
              <tr>
                <DataTableHead>
                  <DataTableCheckboxCell
                    checked={selected.size === sampleUsers.length}
                    indeterminate={selected.size > 0 && selected.size < sampleUsers.length}
                    onCheckedChange={toggleAll}
                    className="border-none bg-transparent p-0 w-auto"
                  />
                </DataTableHead>
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
