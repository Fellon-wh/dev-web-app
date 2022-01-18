/*
 * @Author: Fellon 
 * @Date: 2022-01-16 23:07:16 
 * @Last Modified by:   Fellon 
 * @Last Modified time: 2022-01-16 23:07:16 
 */
import { ReportCellModel } from "./ReportCellModel";

export class ReportRowModel {
    
    // 行高
    height: number = 30;
    // 类型
    type: string = '';

    // 背景颜色
    backColor: string = '';

    // 单元格集合
    cells: (ReportCellModel)[] = [];
}