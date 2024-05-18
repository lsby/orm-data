import _ from 'lodash'
import { 取对象键值们 } from './types/取对象键值们'

/*
```
var x = 重命名列(
    [
        { id: 1, 姓名: 'a', 标签: 'a1' },
        { id: 1, 姓名: 'a', 标签: 'a2' },
        { id: 1, 姓名: 'b', 标签: 'a3' },
        { id: 2, 姓名: 'b', 标签: 'b1' },
    ],
    '姓名',
    '名字',
)
```

得到:
```
[
    { id: 1, 标签: 'a1', 名字: 'a' },
    { id: 1, 标签: 'a2', 名字: 'a' },
    { id: 1, 标签: 'a3', 名字: 'b' },
    { id: 2, 标签: 'b1', 名字: 'b' },
]
```
*/
export function 重命名列<A extends Record<string, b>, b, 名称 extends keyof A, 新名称 extends string>(
  关系: A[],
  名称: 名称,
  新名称: 新名称,
): 计算返回值_重命名列<A, 名称, 新名称>[] {
  var _关系 = _.cloneDeep(关系)

  var c = _关系.map((a) => ({
    ...a,
    [新名称]: a[名称 as any],
  }))

  for (var a of c) {
    delete a[名称 as any]
  }

  return c as any
}
type 计算返回值_重命名列<对象, 名称, 新名称> = _计算返回值_重命名列<取对象键值们<对象>, 名称, 新名称>
type _计算返回值_重命名列<对象键值们, 名称, 新名称> = 对象键值们 extends []
  ? {}
  : 新名称 extends string
  ? 对象键值们 extends [infer a, ...infer as]
    ? a extends [infer key, infer value]
      ? key extends 名称
        ? Record<新名称, value> & _计算返回值_重命名列<as, 名称, 新名称>
        : key extends string
        ? Record<key, value> & _计算返回值_重命名列<as, 名称, 新名称>
        : never
      : never
    : never
  : never

/*
```
var x = 删除列(
    [
        { id: 1, 姓名: 'a', 标签: 'a1' },
        { id: 1, 姓名: 'a', 标签: 'a2' },
        { id: 1, 姓名: 'b', 标签: 'a3' },
        { id: 2, 姓名: 'b', 标签: 'b1' },
    ],
    '标签',
)
```

得到:
```
[
    { id: 1, 姓名: 'a' },
    { id: 1, 姓名: 'a' },
    { id: 1, 姓名: 'b' },
    { id: 2, 姓名: 'b' },
]
```
*/
export function 删除列<A extends Record<string, b>, b, 名称 extends keyof A>(
  关系: A[],
  名称: 名称,
): 计算返回值_删除列<A, 名称>[] {
  var c = _.cloneDeep(关系)

  for (var a of c) {
    delete a[名称 as any]
  }

  return c as any
}
type 计算返回值_删除列<对象, 名称> = _计算返回值_删除列<取对象键值们<对象>, 名称>
type _计算返回值_删除列<对象键值们, 名称> = 对象键值们 extends []
  ? {}
  : 对象键值们 extends [infer a, ...infer as]
  ? a extends [infer key, infer value]
    ? key extends 名称
      ? _计算返回值_删除列<as, 名称>
      : key extends string
      ? Record<key, value> & _计算返回值_删除列<as, 名称>
      : never
    : never
  : never

/*
```
var x = 合并列(
    [
        { id: 1, 姓名: 'a', 标签: 'a1' },
        { id: 1, 姓名: 'a', 标签: 'a2' },
        { id: 1, 姓名: 'b', 标签: 'a3' },
        { id: 2, 姓名: 'b', 标签: 'b1' },
    ],
    '合并',
    '姓名',
    '标签',
    (a, b) => a + '_' + b
)
```

得到:
```
[
    { id: 1, 姓名: 'a', 标签: 'a1', 合并: 'a_a1' },
    { id: 1, 姓名: 'a', 标签: 'a2', 合并: 'a_a2' },
    { id: 1, 姓名: 'b', 标签: 'a3', 合并: 'b_a3' },
    { id: 2, 姓名: 'b', 标签: 'b1', 合并: 'b_b1' },
]
```
*/
export function 合并列<
  A extends Record<string, b>,
  b,
  列1 extends keyof A,
  列2 extends keyof A,
  函数返回,
  新名称 extends string,
>(
  关系: A[],
  新名称: `${新名称}`,
  列1: 列1,
  列2: 列2,
  合并函数: (a: 计算参数类型<A, 列1>, b: 计算参数类型<A, 列2>) => 函数返回,
): 计算返回值_合并列<A, 新名称, 函数返回>[] {
  var c = _.cloneDeep(关系)

  var r = c.map((a) => ({
    ...a,
    [新名称]: 合并函数(a[列1] as any, a[列2] as any),
  }))

  return r as any
}
type 计算参数类型<关系, 键> = 键 extends keyof 关系 ? 关系[键] : never
type 计算返回值_合并列<对象, 新名称, 新类型> = _计算返回值_合并列<取对象键值们<对象>, 新名称, 新类型>
type _计算返回值_合并列<对象键值们, 新名称, 新类型> = 对象键值们 extends []
  ? 新名称 extends string
    ? Record<新名称, 新类型>
    : never
  : 对象键值们 extends [infer a, ...infer as]
  ? a extends [infer key, infer value]
    ? key extends string
      ? Record<key, value> & _计算返回值_合并列<as, 新名称, 新类型>
      : never
    : never
  : never
