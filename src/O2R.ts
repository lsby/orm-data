import _ from 'lodash'
import { 取对象键值们 } from './types/取对象键值们'

/*
需要输入一个数组, 数组内的每一项都是一个对象.
对每一个对象递归进行如下变换:
- 值为基础值的, 不变.
- 值为数组的, 拆分为多行.
- 值为对象的, 删除key, 将内部key扩展到表上.

例如:

输入:
```
var x = 对象转关系([
    {
        a: 1,
        b: [2, 3],
        c: { d: 4, e: [5, 6] },
        f: [
            { f1: 'a', f2: 'b' },
            { f1: 'c', f2: 'd' },
        ],
    },
])
```

得到:
```
[
    { a: 1, b: 2, d: 4, e: 5, f1: 'a', f2: 'b' },
    { a: 1, b: 2, d: 4, e: 5, f1: 'c', f2: 'd' },
    { a: 1, b: 2, d: 4, e: 6, f1: 'a', f2: 'b' },
    { a: 1, b: 2, d: 4, e: 6, f1: 'c', f2: 'd' },
    { a: 1, b: 3, d: 4, e: 5, f1: 'a', f2: 'b' },
    { a: 1, b: 3, d: 4, e: 5, f1: 'c', f2: 'd' },
    { a: 1, b: 3, d: 4, e: 6, f1: 'a', f2: 'b' },
    { a: 1, b: 3, d: 4, e: 6, f1: 'c', f2: 'd' },
]
```
*/

export default function 对象转关系<a>(数组对象: a[]): 计算类型<a>[] {
  return 数组对象.map(_对象转关系).flat()
}
function _对象转关系<a>(_对象: a): 计算类型<a>[] {
  var 对象: any = _.cloneDeep(_对象)

  var 元素们 = Object.values(对象)
  var 特殊元素名称们 = Object.keys(对象).filter((_, i) => typeof 元素们[i] == 'object')

  if (特殊元素名称们.length == 0) {
    return [对象]
  }

  var 对象元素名称们 = []
  var 数组元素名称们 = []

  for (let n of 特殊元素名称们) {
    if (Array.isArray(对象[n])) {
      数组元素名称们.push(n)
    } else {
      对象元素名称们.push(n)
    }
  }

  var 解开对象后: any = {}
  if (对象元素名称们.length == 0) {
    解开对象后 = 对象
  } else {
    for (var n in 对象) {
      var item = 对象[n]
      if (对象元素名称们.includes(n)) {
        for (var nn in item) {
          解开对象后[nn] = item[nn]
        }
      } else {
        解开对象后[n] = item
      }
    }
  }

  var 解开数组后: any = []
  if (数组元素名称们.length == 0) {
    解开数组后 = [解开对象后]
  } else {
    var 本次处理名称 = 数组元素名称们[0]
    var 本次处理元素们 = 对象[本次处理名称]
    解开数组后 = 本次处理元素们.map((a: any) => {
      var rx = _.cloneDeep(解开对象后)
      rx[本次处理名称] = a
      return rx
    })
  }

  return 对象转关系(解开数组后)
}

type 计算类型<对象> = _计算类型<取对象键值们<对象>>
type _计算类型<对象键值们> = 对象键值们 extends []
  ? {}
  : 对象键值们 extends [infer a, ...infer as]
  ? a extends [`${infer key}`, infer value]
    ? value extends any[]
      ? 计算类型<Record<key, value[0]>> & _计算类型<as>
      : value extends Record<any, any>
      ? 计算类型<value & _计算类型<as>>
      : Record<key, value> & _计算类型<as>
    : never
  : never
