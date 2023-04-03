import {OperatorNode, VariableNode, BooleanTree} from './BooleanTree'
import { BooleanChart } from './BooleanChart'
import { Parser } from './BoolStatementEngine'

//(x+y)(wy)

const notn = new OperatorNode('¬',null,null)
const notn2 = new OperatorNode('¬',null,null)
const nor = new OperatorNode('+',null,null)
const nand = new OperatorNode('*',null,null)
const w = new VariableNode(true,'w')
const x = new VariableNode(true,'x')

notn2.right = x

nor.left = notn2
nor.right = w

notn.right = nor

nand.left = x
nand.right = notn

let bTree = new BooleanTree(nand)

const bChart = new BooleanChart(bTree)
bTree.print()

console.table(bChart.calculateChart())
let parser = new Parser('(¬x+(y+w))(x¬y)')
// console.log(parser.removeParentheses('(¬x+(y+w))(x¬y)'))
// console.log(parser.removeParentheses('(¬x+(y+w))'))
// console.log(parser.removeParentheses('(x¬y)'))
// console.log(parser.removeParentheses('¬x+(y+w)'))
// console.log(parser.removeParentheses('(y+w)'))
parser.parse()