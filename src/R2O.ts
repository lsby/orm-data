import _ from 'lodash'

function 等价<A>(a: A, b: A) {
  return JSON.stringify(a) == JSON.stringify(b)
}

function 数组等价去重<A>(数组: A[]) {
  return _.uniqWith(数组, 等价)
}

/*
输入关系, 主码, 和要合并的属性们.

例如, 输入:
[
    { id: 1, 姓名: 'a', 标签: 'a1' },
    { id: 1, 姓名: 'a', 标签: 'a2' },
    { id: 1, 姓名: 'b', 标签: 'a3' },
    { id: 2, 姓名: 'b', 标签: 'b1' },
]

以"id"为主码, ["标签"]为要合并的字段.

得到:
[
    { id: 1, 姓名: 'a', 标签: ['a1', 'a2', 'a3'] },
    { id: 2, 姓名: 'b', 标签: ['b1'] },
]

因为最终要合并成对象, 而对象的key只能是一个, 所以主码只能写一个, 如果是主码是多个属性, 请先手动合并成一个属性.
为了结果形式简单, 需要指明合并字段, 如果某个属性没有被指明合并属性, 但这个属性在合并中结果不同, 将会取第一个.

```
var x = 关系转对象(
    [
        { id: 1, 姓名: 'a', 标签: 'a1' },
        { id: 1, 姓名: 'a', 标签: 'a2' },
        { id: 1, 姓名: 'b', 标签: 'a3' },
        { id: 2, 姓名: 'b', 标签: 'b1' },
    ],
    'id',
    ['标签'],
)
```
*/
export function 关系转对象<A extends { [key: string]: unknown }, B extends keyof A, C extends (keyof A)[]>(
  关系: A[],
  主码: B,
  合并属性: C,
): { [K in keyof A]: 对表合并行_返回值计算<C, K, A> }[] {
  return 数组等价去重(关系.map((a) => a[主码])).map((主字段值) => {
    var 子表 = 关系.filter((b) => 等价(b[主码], 主字段值))
    var 列名们 = Object.keys(关系[0])
    var 合并后对象 = 列名们.reduce((s, 列名) => {
      var 结果数组 = 子表.map((a) => a[列名])
      return { ...s, [列名]: !合并属性.includes(列名) ? 结果数组[0] : 结果数组 }
    }, {} as { [K in keyof A]: A[K][] })
    return 合并后对象
  }) as any
}
type 对表合并行_返回值计算<C, K extends keyof A, A> = C extends (infer X)[] ? (K extends X ? A[K][] : A[K]) : never

/**
 * 例如, 输入:
 * [
 *     { id: 1, 姓名: 'a', 标签1: 'a1', 标签2: 'c1' },
 *     { id: 1, 姓名: 'a', 标签1: 'a2', 标签2: 'c2' },
 *     { id: 1, 姓名: 'b', 标签1: 'a3', 标签2: 'd1' },
 *     { id: 2, 姓名: 'b', 标签1: 'b1', 标签2: 'd2' },
 * ]
 *
 * 以"id"为主码, ["标签1", "标签2"]为要合并的字段, 以"合并键"为结果属性.
 *
 * 得到:
 * [
 *     { id: 1, 姓名: 'a', 合并键: [{标签1: 'a1', 标签2: 'c1'}, {标签1: 'a2', 标签2: 'c2'}, {标签1: 'a3', 标签2: 'd1'}] },
 *     { id: 2, 姓名: 'b', 合并键: [{标签1: 'b1', 标签2: 'd2'}] },
 * ]
 */
export function 关系转对象并组合<
  A extends { [key: string]: unknown },
  B extends keyof A,
  C extends (keyof A)[],
  D extends string,
>(关系: A[], 主码: B, 合并属性: C, 结果属性: D): Omit<A, 解数组<C>> & Record<D, { [K in 解数组<C>]: A[K] }[]> {
  var 转换结果 = 关系转对象(关系, 主码, 合并属性)
  var 合并结果 = 转换结果.map((转换结果项) => {
    var 结果键 = _.zip(...合并属性.map((a) => 转换结果项[a])).map((a) =>
      _.zip(合并属性, a)
        .map((a) => ({ [a[0] as string]: a[1] }))
        .reduce((s, a) => Object.assign(s, a), {}),
    )

    return Object.assign(
      Object.keys(转换结果项)
        .map((k) => (合并属性.includes(k) ? null : { [k]: 转换结果项[k] }))
        .filter((a) => a != null)
        .reduce((s, a) => Object.assign(s, a), {}),
      { [结果属性]: 结果键 },
    )
  })

  return 合并结果 as any
}
type 解数组<A> = A extends Array<infer X> ? X : never
