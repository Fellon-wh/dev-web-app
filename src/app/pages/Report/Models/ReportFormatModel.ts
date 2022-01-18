export class ReportFormatModel {
    // 格式类型:文本-Text，数值-Number，字典-Dict，单选列表项-List，多选列表项-MultiList，货币-Money，日期-Date，多选字典-MultiDict
    dataType: string = 'Text';

    /********************************格式类型为字典/多选字典时********************************/
    // 字典
    itemKey?: string;

    // 字段列表
    fieldKeys?: string;

    /********************************格式类型为数值/货币/日期时********************************/
    // 格式化字符串
    formatString?: string;
    
    /********************************格式类型为单/多选列表项时********************************/
    listItems: (ListItem)[] = [];
}

export class ListItem {
    // 项目文本
    text?: string;

    // 项目值
    value?: string;
}