/*
 * @Author: Fellon 
 * @Date: 2022-01-16 23:07:07 
 * @Last Modified by:   Fellon 
 * @Last Modified time: 2022-01-16 23:07:07 
 */
import { ReportSectionModel } from "./ReportSectionModel";

export class ReportModel {
    
    // 标识
    key!: string;
    // 名称
    caption?: string;
    
    // 页面宽度
    pageWidth: number = 595;
    // 页面高度
    pageHeight: number = 842;
    // 页面方向
    // 0 - 水平，1 - 垂直
    pageOrientation: number = 1;

    // 纸张宽度
    paperWidth: number = 595;
    // 纸张高度
    paperHeight: number = 842;
    // 纸张方向
    // 0 - 水平，1 - 垂直
    paperOrientation: number = 1;
    
    // 左边距
    leftMargin: number = 25;
    // 右边距
    rightMargin: number = 25;
    // 上边距
    topMargin: number = 15;
    // 下边距
    bottomMargin: number = 15;

    // 段集合
    sections: (ReportSectionModel)[] = [];


    // 段距离起始点的高度
    getTop(length: number | undefined = undefined): number {
        if (length === undefined || length < 0 || length > this.sections.length) {
            length = this.sections.length;
        }

        let height = 0;
        for (let index = 0; index < length; index++) {
            height += this.sections[index].getTop();
        }

        return height;
    }

    /**
     * 删除段
     * @param index 
     */
     public deleteSection(index: number): void {
        let section = this.sections[index];
        this.sections.splice(index, 1);
    }
}