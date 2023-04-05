import { OperatorNode } from "./BooleanTree";
export interface StringNumberMap {
    [key: string]: number;
}
export declare class Parser {
    rawStmnt: string;
    preFormatStmnt: string;
    postFixStmnt: string;
    treeRoot: OperatorNode;
    private operatorStack;
    private treeStack;
    private variablePattern;
    private operatorPattern;
    private OperatorHierarchy;
    constructor(rawStmnt: string);
    private assembleTree;
    private toPostFix;
    private preFormat;
}
