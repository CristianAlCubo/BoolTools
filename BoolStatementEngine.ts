import { OperatorNode, VariableNode, InputNodes, BooleanTree } from "./BooleanTree"
import { LinkedList, Nodo } from "./LinkedList"

export enum OperatorHierarchy{
    '+' = 1,
    '°' = 2,
    '*' = 3,
    '¬' = 4
}

export class Parser{
    public rawStmnt: string
    public preFormatStmnt: string
    public postFixStmnt: string
    public treeRoot: OperatorNode
    private operatorStack: string[] = []
    private treeStack: (VariableNode|OperatorNode)[] = []
    

    private variablePattern = /[a-zA-Z0]/
    private operatorPattern = /[\*¬+°]/

    constructor(rawStmnt : string){
        this.rawStmnt = rawStmnt
        this.preFormat()
        this.toPostFix()
        this.assembleTree()
    }

    private assembleTree(){
        let inputs:InputNodes = {}
        for(const char of this.postFixStmnt){
            if(this.variablePattern.test(char)){
                if(!(char in inputs)){
                    inputs[char] = new VariableNode(false,char)
                }
                this.treeStack.push(inputs[char])
            }else if(this.operatorPattern.test(char)){
                let operand1 = this.treeStack.pop()
                let operand2 = this.treeStack.pop()
                let operator = new OperatorNode(char)
                if(operand1 && operand2){
                    operator.right = operand1
                    if(char != '¬'){
                        operator.left = operand2
                    }
                }
                this.treeStack.push(operator)
            }
        }
        const treeRoot = this.treeStack.pop()
        if(treeRoot) this.treeRoot = treeRoot
    }   

    private toPostFix(){
        let postFixString = ""
        for (const char of this.preFormatStmnt) {
            const stackTail = this.operatorStack[this.operatorStack.length - 1] 
            if(this.variablePattern.test(char)){
                postFixString += char
            }else if(this.operatorPattern.test(char)){
                if(this.operatorStack.length == 0){
                    this.operatorStack.push(char)
                }else{
                    if(stackTail == '(' || OperatorHierarchy[stackTail] < OperatorHierarchy[char]){
                        this.operatorStack.push(char)
                    }else if(OperatorHierarchy[stackTail] >= OperatorHierarchy[char]){
                        const operator = this.operatorStack.pop()
                        postFixString += operator
                        this.operatorStack.push(char)
                    }
                }
            }else if(char == '('){
                this.operatorStack.push(char)
            }else if(char == ')'){
                let operator = this.operatorStack.pop()
                while(operator != '('){
                    postFixString += operator
                    operator = this.operatorStack.pop()
                }
            }
        }
        if(this.operatorStack.length > 0){
            while(this.operatorStack.length > 0){
                let operator = this.operatorStack.pop()
                if(operator != '(') postFixString += operator
            }
        }
        this.postFixStmnt = postFixString
    }

    private preFormat(){ 
        const charactersLL = new LinkedList()
        // Pasar los datos del input a una lista enlazada
        for (const char of this.rawStmnt) {
            charactersLL.addLast(char)
        }
        let node = charactersLL.head
        let i = 0

        // Añadir los operadores explicitos
        while(node != null && i < charactersLL.size - 1){
            if(/[a-zA-Z]|[\)]/g.test(node.value as string)){
                if(/[a-zA-Z]|[0¬\(]/g.test(node.next?.value as string)){
                    charactersLL.addAtIndex(i+1,'*')
                    charactersLL.printRelations()
                } 
            }else if(node.value as string == '¬'){
                charactersLL.addAtIndex(i,'0')
                i++
            }
            node = node.next
            i++
        }
        this.preFormatStmnt = charactersLL.toString()
    }
}