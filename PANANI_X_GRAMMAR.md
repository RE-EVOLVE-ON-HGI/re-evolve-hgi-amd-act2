# PANANI X GRAMMAR

This document defines the EBNF grammar specification for the Panani X DSL.

---

## EBNF Specification

```ebnf
Program         ::= ( AgentDecl | WorkflowDecl )*
AgentDecl       ::= 'agent' Identifier '{' AgentProperties '}'
AgentProperties ::= ( 'model' ':' StringLiteral | 'policies' ':' ListLiteral | 'tools' ':' ListLiteral )*

WorkflowDecl    ::= 'workflow' Identifier '{' WorkflowProperties '}'
WorkflowProperties ::= ( 'goal' ':' StringLiteral | 'memory' ':' StringLiteral | 'knowledge' ':' ListLiteral | 'execute' '{' Statement* '}' )*

Statement       ::= Identifier '->' ActionCall ( '->' ActionCall )*
ActionCall      ::= Identifier '(' ArgumentList? ')'

ListLiteral     ::= '[' ( StringLiteral ( ',' StringLiteral )* )? ']'
StringLiteral   ::= '"' [^"]* '"'
Identifier      ::= [a-zA-Z_][a-zA-Z0-9_]*
```
