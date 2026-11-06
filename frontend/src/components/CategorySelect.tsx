import { CATEGORY_GROUPS, DEFAULT_SHARES, getGroupKey } from "../categories"

type CategorySelectProps = {
  value: string
  onChange: (value: string) => void
  emptyLabel: string // 值为空时显示的文字，比如 "Category" 或 "All categories"
}

function CategorySelect({ value, onChange, emptyLabel }: CategorySelectProps) {
  // 编辑一条旧交易时，它的类别可能不在固定列表里（比如以前手打的 "food"），
  // 这时把它也作为一个选项显示出来，否则下拉框会显示成空的
  const isLegacy = value !== "" && getGroupKey(value) === undefined

  return (
    <select aria-label="Category" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{emptyLabel}</option>
      {isLegacy && <option value={value}>{value}</option>}
      {CATEGORY_GROUPS.map((group) => (
        <optgroup key={group.key} label={`${group.label} (${DEFAULT_SHARES[group.key]}%)`}>
          {group.categories.map((category) => (
            <option key={category.name} value={category.name}>
              {category.name}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  )
}

export default CategorySelect