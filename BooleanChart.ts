import { VariableNode, OperatorNode, BooleanTree } from "./BooleanTree"
export interface Data{
    [key: string]:string|number
}
export class BooleanChart{
    private tree:BooleanTree
    private data:Data[] = []
    

    constructor(tree : BooleanTree){
        this.tree = tree
    }

    public calculateChart(){
        const inputKeys = Object.keys(this.tree.inputs)
        let permutations:string[] = this.inputPermutations(inputKeys.length)
        while(permutations.length > 0){
            let permutationData: Data = {}
            const permutation = permutations[0]
            permutations.shift()
            for (let i = 0; i < permutation.length; i++) {
                this.tree.inputs[inputKeys[i]].truthValue = permutation?.charAt(i) == '1' ? true : false
                permutationData[inputKeys[i]] = permutation.charAt(i)
            }
            this.tree.calculateValue()
            for (const node of this.tree.outputs.reverse()) {
                permutationData[node.subtreeSymbol] = node.truthValue ? '1' : '0'
            }
            this.data.push(permutationData)
        }
        return this.data
    }

    private inputPermutations(nInputs: number): string[] {
        let permutations: string[] = []
        for (let i = 0; i < 2**nInputs; i++) {
            let iBinary = i.toString(2);  // Convierte numero decimal en binario
            permutations.push(`${'0'.repeat(nInputs - iBinary.length)}${iBinary}`)
        }
        return permutations
      }
}
