import { OperatorNode } from "./BooleanTree";
export declare enum OperatorHierarchy {
    '+' = 1,
    '°' = 2,
    '*' = 3,
    '¬' = 4
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
    constructor(rawStmnt: string);
    private assembleTree;
    private toPostFix;
    private preFormat;
}
