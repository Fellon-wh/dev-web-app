export class ReportFontModel {
    // 字体名称
    name: string = "Arial";

    // 字号:8,9,10,12,14,16,18,20,22,24,26,28,36,48,72
    size: number = 12;

    // 粗体
    bold: boolean = false;

    // 斜体
    italic: boolean = false;

    // 下划线:无-None,单下划线-SolidNormal,虚下划线-Dashed,粗下划线-SolidBold
    underLine: string = "None";
}