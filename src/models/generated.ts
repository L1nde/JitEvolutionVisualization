/* tslint:disable */
/* eslint-disable */
//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v13.15.5.0 (NJsonSchema v10.6.6.0 (Newtonsoft.Json v11.0.0.0)) (http://NSwag.org)
// </auto-generated>
//----------------------
// ReSharper disable InconsistentNaming



export interface AnalyzerResponseDto {
    results?: ResultDto[] | null;
}

export interface AppDetailDto {
    id?: string | null;
    name?: string | null;
    appKey?: string | null;
    versionNumber?: number;
    addedOn?: number;
    classes?: ClassDetailDto[] | null;
    variables?: VariableDetailDto[] | null;
}

export interface ClassDetailDto {
    id?: string | null;
    code?: string | null;
    kind?: string | null;
    modifier?: string | null;
    name?: string | null;
    numberOfLines?: number;
    path?: string | null;
    usr?: string | null;
    versionNUmber?: number;
    addedOn?: number;
    methods?: MethodDetailDto[] | null;
    variables?: VariableDetailDto[] | null;
}

export interface ClassDto {
    id?: number;
    code?: string | null;
    kind?: string | null;
    modifier?: string | null;
    name?: string | null;
    numberOfLines?: number;
    path?: string | null;
    usr?: string | null;
    versionNUmber?: number;
}

export interface DataDto {
    row?: number[] | null;
    meta?: string[] | null;
}

export interface FileOpenedDto {
    projectId?: string | null;
    fileUri?: string | null;
}

export interface MergeDuplicatesDto {
    appKey?: string | null;
    version?: string | null;
}

export interface MethodDetailDto {
    id?: string | null;
    code?: string | null;
    cyclomaticComplexity?: number;
    endLine?: number;
    modifier?: string | null;
    isConstructor?: boolean;
    isSetter?: boolean;
    isGetter?: boolean;
    kind?: string | null;
    maxNestingDepth?: number;
    name?: string | null;
    numberOfAccessedVariables?: number;
    numberOfCalledMethods?: number;
    numberOfCallers?: number;
    numberOfInstructors?: number;
    startLine?: number;
    type?: string | null;
    usr?: string | null;
    versionNumber?: number;
    addedOn?: number;
    calls?: string[] | null;
    uses?: string[] | null;
}

export interface MethodDto {
    id?: number;
    code?: string | null;
    cyclomaticComplexity?: number;
    endLine?: number;
    isConstructor?: boolean;
    isSetter?: boolean;
    isGetter?: boolean;
    kind?: string | null;
    maxNestingDepth?: number;
    name?: string | null;
    numberOfAccessedVariables?: number;
    numberOfCalledMethods?: number;
    numberOfCallers?: number;
    numberOfInstructors?: number;
    startLine?: number;
    type?: string | null;
    usr?: string | null;
    versionNumber?: number;
}

export interface NodeDto {
    id?: number;
    label?: NodeLabelEnum;
    properties?: { [key: string]: any; } | null;
}

export interface NodeDtoResultDto {
    appKey?: string | null;
    version?: string | null;
    data?: NodeDto;
}

export enum NodeLabelEnum {
    App = "App",
    Method = "Method",
    Class = "Class",
    Variable = "Variable",
    External = "External",
    Parameter = "Parameter",
}

export interface PasswordLoginDto {
    username?: string | null;
    password?: string | null;
}

export interface ProjectDto {
    id?: string;
    userId?: string;
    projectId?: string | null;
}

export interface QueryDto {
    statements?: StatementDto[] | null;
}

export interface RegisterDto {
    username: string;
    password: string;
    email: string;
}

export interface RelationshipAddDto {
    from?: NodeDto;
    to?: NodeDto;
    relationship?: RelationshipDto;
}

export interface RelationshipAddDtoResultDto {
    appKey?: string | null;
    version?: string | null;
    data?: RelationshipAddDto;
}

export interface RelationshipDto {
    type?: string | null;
    properties?: { [key: string]: any; } | null;
}

export interface ResultDto {
    columns?: string[] | null;
    data?: DataDto[] | null;
}

export interface StatementDto {
    statement?: string | null;
}

export interface UserDto {
    id?: string;
    username?: string | null;
}

export interface UserTokenDto {
    user?: UserDto;
    token?: string | null;
}

export interface VariableDetailDto {
    id?: string | null;
    code?: string | null;
    name?: string | null;
    endLine?: number;
    kind?: string | null;
    startLine?: number;
    type?: string | null;
    usr?: string | null;
    versionNumber?: number;
    addedOn?: number;
}

export interface FileParameter {
    data: any;
    fileName: string;
}