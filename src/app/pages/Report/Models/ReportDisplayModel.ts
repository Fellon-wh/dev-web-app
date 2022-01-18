import { ReportBorderModel } from "./ReportBorderModel";
import { ReportFontModel } from "./ReportFontModel";
import { ReportFormatModel } from "./ReportFormatModel";

export class ReportDisplayModel {

    // 水平对齐方式:左对齐-Left,水平居中-Center,右对齐-Right
    halign: string = 'Center';
    // 垂直对齐方式:顶对齐-Top,垂直居中-Center,底对齐-Bottom
    valign: string = 'Middle';
    // 背景色
    backColor?: string;

    // 前景色
    foreColor?: string;

    // 字体样式
    font = new ReportFontModel();
    // 数据格式
    format = new ReportFormatModel();

    // 边框样式
    border = new ReportBorderModel();
}