import { OperatorNode, VariableNode, InputNodes, BooleanTree } from "./BooleanTree"

export class Parser{
    public rawStmnt: string
    private preFormatStmnt: string
    private parseQueue: string[] = []
    private operations: string[] = []
    private primitives: string[] = []
    private buildingNodes: OperatorNode[] = []
    private inputs: InputNodes = {}
    private outputs: OperatorNode[] = []

    private operators:string[] = ['+','*','¬']

    constructor(rawStmnt : string){
        this.rawStmnt = rawStmnt
        this.preFormat()
    }
    private preFormat(){ 
        let rawStmntArr = this.rawStmnt.split('')
        for (let i = 0; i < this.rawStmnt.length - 1; i++) {
            if(/[a-zA-Z)]/.test(rawStmntArr[i]) && /[a-zA-Z(¬]/.test(rawStmntArr[i+1])){
                this.insertAt(rawStmntArr, i+1, '*')
            }
        }
        this.preFormatStmnt = rawStmntArr.join('')
    }

    public parse(){
        this.parseQueue.push(this.removeParentheses(this.preFormatStmnt))
        while(this.parseQueue.length > 0){
            const stmnt = this.parseQueue[0]
            this.parseQueue.shift()
            if(stmnt[0] === '('){
                let operatorFound = false
                for (const operator of this.operators) {
                    let parenthesisCount = 0
                    let i = 0
                    for (const char of stmnt) {
                        if(char == '(') parenthesisCount++
                        if(char == ')') parenthesisCount--
                        if(char == operator && parenthesisCount==0){
                            const {fHalf, sHalf} = this.sliceStatement(stmnt,i)
                            this.operations.push(stmnt[i])
                            this.parseQueue.push(this.removeParentheses(fHalf))
                            this.parseQueue.push(this.removeParentheses(sHalf))
                            operatorFound = true
                            break;
                        }
                        i++;
                    }
                    if(operatorFound) break
                }
            }else{
                if(stmnt.length == 1){
                    this.primitives.push(stmnt)
                }else{
                    for (const operator of this.operators) {
                        let i = 0
                        let operatorFound = false
                        for (const char of stmnt) {
                            if(char == operator){
                                const {fHalf, sHalf} = this.sliceStatement(stmnt,i)
                                this.operations.push(stmnt[i])
                                this.parseQueue.push(this.removeParentheses(fHalf))
                                this.parseQueue.push(this.removeParentheses(sHalf))
                                operatorFound = true
                                break;
                            }
                            i++;
                        }
                        if(operatorFound) break
                    }                    
                }
            }
        }
    
        this.assembleTree()
        return new BooleanTree(this.outputs.pop() as OperatorNode)
    }

    private assembleTree(){
        while(this.operations.length > 0){
            const operator = this.operations.pop() as string
            if(operator == '¬'){
                if(this.primitives.length > 0){
                    const operand = this.primitives.pop() as string
                    if(!(operand in this.inputs)){
                        this.inputs[operand] = new VariableNode(false,operand)
                    }
                    const node = new OperatorNode('¬')
                    node.right = this.inputs[operand]
                    this.buildingNodes.push(node)
                    this.outputs.push(node)
                }else{
                    const operand = this.buildingNodes.shift() as OperatorNode
                    const node = new OperatorNode('¬')
                    node.right = operand
                    this.buildingNodes.push(node)
                    this.outputs.push(node)
                }
            }else{
                if(this.primitives.length > 0){
                    // Definir operandos del nodo
                    let operand1 = this.primitives.pop() as string
                    if(!(operand1 in this.inputs)){
                        this.inputs[operand1] = new VariableNode(false,operand1)
                    }
                    const node = new OperatorNode(operator)
                    node.left = this.inputs[operand1]
                    if(this.primitives.length > 0){
                        let operand2 = this.primitives.pop() as string
                        if(!(operand2 in this.inputs)){
                            this.inputs[operand2] = new VariableNode(false,operand2)
                        }
                        // Definir operacion del nodo y vincular operandos
                        node.right = this.inputs[operand2]
                        this.buildingNodes.push(node)
                        this.outputs.push(node)
                    }else{
                        // Definir operacion del nodo y vincular operandos
                        let operand2 = this.buildingNodes.shift() as OperatorNode
                        node.right = operand2
                        this.buildingNodes.push(node)
                        this.outputs.push(node)
                    }
                }else{
                    // Definir operandos del nodo
                    let operand1 = this.buildingNodes.shift() as OperatorNode
                    let operand2 = this.buildingNodes.shift() as OperatorNode

                    // Definir operacion del nodo y vincular operandos
                    const node = new OperatorNode(operator)
                    node.left = operand1
                    node.right = operand2
                    this.buildingNodes.push(node)
                    this.outputs.push(node)
                }
            }
        }
    }

    private removeParentheses(stmnt:string){
        const doubleParenthesesPattern = /^\([a-zA-Z+\*¬\(\)]+\)[+\*¬]?\([a-zA-Z+\*¬\(\)]+\)$/
        if(doubleParenthesesPattern.test(stmnt)){
            return stmnt
        }else if(stmnt[0] == '(' && stmnt[stmnt.length - 1] == ')'){
            //Remove outer parenthesis
            let parenthesisCount = 0
            for (let i = 0; i < stmnt.length - 1; i++) {
                if(stmnt[i] == '(' && stmnt[i+1] == '(') {
                    parenthesisCount++
                }else{
                    break;
                }
            } 
            if(parenthesisCount > 0) {
                stmnt = stmnt.slice(0+parenthesisCount,0-parenthesisCount)
            }else{
                stmnt = stmnt.slice(1,-1)
            }
        }
        return stmnt
}

    private sliceStatement(stmnt:string,index:number){
        const fHalf = stmnt.slice(0,index)
        const sHalf = stmnt.slice(index+1)
        return {fHalf:fHalf, sHalf:sHalf}
    }

    private insertAt<T>(array: T[], index: number, element: T): T[] {
        for (let i = array.length - 1; i >= index; i--) {
          array[i + 1] = array[i];
        }
        array[index] = element;
        return array;
      }
}