import { 联合转元组 } from './联合转元组'

export type 取对象键值们<obj, 剩余的键 extends any[] = 联合转元组<keyof obj>> = 剩余的键 extends []
  ? []
  : 剩余的键 extends [infer a, ...infer as]
  ? a extends keyof obj
    ? [[a, obj[a]], ...取对象键值们<obj, as>]
    : never
  : never
