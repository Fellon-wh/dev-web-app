/*
 * @Author: Fellon 
 * @Date: 2022-01-16 23:06:34 
 * @Last Modified by:   Fellon 
 * @Last Modified time: 2022-01-16 23:06:34 
 */
import { ReportDisplayModel } from "./ReportDisplayModel";

export class ReportCellModel {
    // 标识
    key!: string;
    // 名称
    caption?: string;
    // 单元格文本
    cellText?: string;

    // 合并的头
    isMergedHead: boolean = false;
    // 是否合并
    isMerged: boolean = false;

    // 合并列数
    mergedColumnSpan?: number = 1;
    // 合并行数
    mergedRowSpan?: number = 1;

    // 文本处理:不处理-0,自适应大小-1,自适应内容-2,文字自动换行-3
    overflow = 0;

    // 显示样式
    display = new ReportDisplayModel();

}