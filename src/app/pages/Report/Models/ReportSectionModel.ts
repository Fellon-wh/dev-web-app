/*
 * @Author: Fellon 
 * @Date: 2022-01-16 23:07:24 
 * @Last Modified by:   Fellon 
 * @Last Modified time: 2022-01-16 23:07:24 
 */
import { ReportCellModel } from "./ReportCellModel";
import { ReportColumnModel } from "./ReportColumnModel";
import { ReportRowModel } from "./ReportRowModel";


export class ReportSectionModel {
    
    // 段标识
    key!: string;
    // 段名称
    caption?: string;
    // 段类型
    type: string = '';

    // 列集合
    columns: (ReportColumnModel)[] = []
    // 行集合
    rows: (ReportRowModel)[] = [];

    /**
     * 获取当前段内，单元格距离Left的位置
     * @param length 
     * @returns 
     */
     public getLeft(length: number | undefined = undefined): number {
        if (length === undefined || length < 0 || length > this.columns.length) {
            length = this.columns.length;
        }

        let width = 0;
        for (let index = 0; index < length; index++) {
            const column = this.columns[index];
            width += column.width;
        }

        return width;
    }

    /**
     * 单元格的宽度
     * @param columnIndex 
     * @param columnSpan 
     * @returns 
     */
    public getWidth(columnIndex: number, columnSpan: number = 1): number {
        if (columnIndex < 0 || columnSpan < 1 || columnIndex + columnSpan > this.columns.length) {
            console.log("Illegal argument exception!!!");
            return 0;
        }

        let width = 0;
        for (let index = 0; index < columnSpan; index++) {

            const column = this.columns[columnIndex + index];
            width += column.width;
        }
        return width;
    }

    /**
     * 获取当前段内，单元格距离Top的位置
     * @param length 
     * @returns 
     */
    public getTop(length: number | undefined = undefined): number {
        if (length === undefined || length < 0 || length > this.rows.length) {
            length = this.rows.length;
        }

        let height = 0;
        for (let index = 0; index < length; index++) {
            const row = this.rows[index];
            height += row.height;
        }

        return height;
    }

    /**
     * 单元格的高度
     * @param rowIndex 
     * @param rowSpan 
     * @returns 
     */
     public getHeight(rowIndex: number, rowSpan: number = 1): number {
        if (rowIndex < 0 || rowSpan < 1 || rowIndex + rowSpan > this.rows.length) {
            console.log("Illegal argument exception!!!");
            return 0;
        }

        let height = 0;
        for (let index = 0; index < rowSpan; index++) {

            const row = this.rows[rowIndex + index];
            height += row.height;
        }
        return height;
    }

    /**
     * 插入一行, 并处理跨行跨列的单元格
     * @param insertIndex 
     */
     public addRow(insertIndex: number): void {
        const currentRow = new ReportRowModel();
        currentRow.height = 30;
        for (let columnIndex = 0; columnIndex < this.columns.length; columnIndex++) {
            currentRow.cells.push(new ReportCellModel());
        }
        
        for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
            if (rowIndex >= insertIndex) {
                break;
            }
            
            
            let row = this.rows[rowIndex];
            for (let cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
                let cell = row.cells[cellIndex];
                
                
                // 找到合并的单元格作整理
                if (cell.isMergedHead) {
                    let rowSpan = cell.mergedRowSpan || 1;
                    let columnSpan = cell.mergedColumnSpan || 1;
                    
                    if (rowIndex + rowSpan <= insertIndex) {
                        continue;
                    }

                    cell.mergedRowSpan = rowSpan + 1;
                    for (let n = 0; n < columnSpan; n++) {
                        let nextCell = currentRow.cells[cellIndex + n];
                        nextCell.isMerged = true;
                        nextCell.mergedRowSpan = insertIndex - rowIndex;
                        nextCell.mergedColumnSpan = (n === 0 ? undefined : n);
                    }

                    for (let m = insertIndex; m < rowIndex + rowSpan; m++) {
                        let nextRow = this.rows[m];
                        
                        for (let n = 0; n < columnSpan; n++) {
                            let nextCell = nextRow.cells[cellIndex + n];
                            nextCell.mergedRowSpan = <number>nextCell.mergedRowSpan + 1;
                        }
                    }
                }
            }
        }

        this.rows.splice(insertIndex, 0, currentRow);
    }

    /**
     * 删除一行, 并处理跨行跨列的单元格
     * @param deleteIndex 
     */
     public deleteRow(deleteIndex: number): void {
        const currentRow = this.rows[deleteIndex];

        for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
            if (rowIndex >= deleteIndex) {
                break;
            }
            
            
            let row = this.rows[rowIndex];
            for (let cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
                let cell = row.cells[cellIndex];
                
                
                // 找到合并的单元格作整理
                if (cell.isMergedHead) {
                    let rowSpan = <number>cell.mergedRowSpan || 1;
                    let columnSpan = <number>cell.mergedColumnSpan || 1;
                    
                    if (rowIndex + rowSpan <= deleteIndex) {
                        continue;
                    }

                    cell.mergedRowSpan = rowSpan - 1;

                    for (let m = deleteIndex; m < rowIndex + rowSpan; m++) {
                        let nextRow = this.rows[m];
                        
                        for (let n = 0; n < columnSpan; n++) {
                            let nextCell = nextRow.cells[cellIndex + n];
                            let tempSpan = <number>nextCell.mergedRowSpan - 1;
                            nextCell.mergedRowSpan = (tempSpan === 0 ? undefined : tempSpan);
                        }
                    }
                }
            }
        }

        // 处理当前行中含有合并行的单元格/最后一行放行
        if (deleteIndex < this.rows.length - 1) {
            for (let cellIndex = 0; cellIndex < currentRow.cells.length; cellIndex++) {
                let cell = currentRow.cells[cellIndex];
                
                if (cell.isMergedHead) {
                    let rowSpan = <number>cell.mergedRowSpan || 1;
                    let columnSpan = <number>cell.mergedColumnSpan || 1;
                    if (rowSpan === 1) {
                        continue;
                    }

                    let nextRow = this.rows[deleteIndex + 1];
                    let nextCell = nextRow.cells[cellIndex];
                    nextCell.isMerged = true;
                    nextCell.isMergedHead = true;
                    nextCell.mergedRowSpan = rowSpan - 1;
                    nextCell.mergedColumnSpan = columnSpan;

                    for (let m = deleteIndex + 1; m < deleteIndex + rowSpan; m++) {
                        nextRow = this.rows[m];
                        
                        for (let n = 0; n < columnSpan; n++) {
                            if (m == deleteIndex + 1 && n === 0) {
                                continue;
                            }

                            nextCell = nextRow.cells[cellIndex + n];
                            let tempSpan = <number>nextCell.mergedRowSpan - 1;
                            nextCell.mergedRowSpan = (tempSpan === 0 ? undefined : tempSpan);
                        }
                    }
                }
            }
        }

        this.rows.splice(deleteIndex, 1);
    }

    /**
     * 插入一列, 并处理跨行跨列的单元格
     * @param insertIndex 
     */
    public addColumn(insertIndex: number): void {
        const currentColumn = new ReportColumnModel();
        currentColumn.width = 80;

        let columnCells: (ReportCellModel)[] = [];
        for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
            let row = this.rows[rowIndex];
            let cell = new ReportCellModel();
            row.cells.splice(insertIndex, 0, cell);
            columnCells.push(cell);
        }
        
        for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
            let row = this.rows[rowIndex];
            
            for (let cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
                if (cellIndex >= insertIndex) {
                    break;
                }
                
                let cell = row.cells[cellIndex];
                // 找到合并的单元格作整理
                if (cell.isMergedHead) {
                    let rowSpan = <number>cell.mergedRowSpan || 1;
                    let columnSpan = <number>cell.mergedColumnSpan || 1;
                    
                    if (cellIndex + columnSpan <= insertIndex) {
                        continue;
                    }

                    cell.mergedColumnSpan = columnSpan + 1;
                    for (let n = 0; n < rowSpan; n++) {
                        let nextCell = columnCells[rowIndex + n];
                        nextCell.isMerged = true;
                        nextCell.mergedRowSpan = (n === 0 ? undefined : n);
                        nextCell.mergedColumnSpan = insertIndex - cellIndex;
                    }

                    for (let m = 0; m < rowSpan; m++) {
                        let nextRow = this.rows[rowIndex + m];

                        for (let n = insertIndex; n < cellIndex + columnSpan; n++) {
                            let nextCell = nextRow.cells[n];
                            nextCell.mergedColumnSpan = <number>nextCell.mergedColumnSpan + 1;
                        }
                    }
                }
            }
        }

        this.columns.splice(insertIndex, 0, currentColumn);
    }

    /**
     * 删除一列, 并处理跨行跨列的单元格
     * @param deleteIndex 
     */
    public deleteColumn(deleteIndex: number): void {
        const currentColumn = this.columns[deleteIndex];

        for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
            let row = this.rows[rowIndex];

            for (let cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
                if (cellIndex >= deleteIndex) {
                    break;
                }
                
                let cell = row.cells[cellIndex];
                // 找到合并的单元格作整理
                if (cell.isMergedHead) {
                    let rowSpan = <number>cell.mergedRowSpan || 1;
                    let columnSpan = <number>cell.mergedColumnSpan || 1;
                    
                    if (cellIndex + columnSpan <= deleteIndex) {
                        continue;
                    }

                    cell.mergedColumnSpan = columnSpan - 1;

                    for (let m = 0; m < rowSpan; m++) {
                        let nextRow = this.rows[rowIndex + m];
                        
                        for (let n = deleteIndex; n < cellIndex + columnSpan; n++) {
                            let nextCell = nextRow.cells[n];
                            let tempSpan = <number>nextCell.mergedColumnSpan - 1;
                            nextCell.mergedColumnSpan = (tempSpan === 0 ? undefined : tempSpan);
                        }
                    }
                }
            }
        }

        // 处理当前列中含有合并行的单元格/最后一列放行
        if (deleteIndex < this.columns.length - 1) {

            for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
                let row = this.rows[rowIndex];
                let cell = row.cells[deleteIndex];

                if (cell.isMergedHead) {
                    let rowSpan = <number>cell.mergedRowSpan || 1;
                    let columnSpan = <number>cell.mergedColumnSpan || 1;
                    if (columnSpan === 1) {
                        continue;
                    }

                    let nextCell = row.cells[deleteIndex + 1];
                    nextCell.isMerged = true;
                    nextCell.isMergedHead = true;
                    nextCell.mergedRowSpan = rowSpan;
                    nextCell.mergedColumnSpan = columnSpan - 1;

                    for (let m = 0; m < rowSpan; m++) {
                        let nextRow = this.rows[rowIndex + m];

                        for (let n = deleteIndex + 1; n < deleteIndex + rowSpan; n++) {
                            if (m === 0 && n === deleteIndex + 1) {
                                continue;
                            }

                            nextCell = nextRow.cells[n];
                            let tempSpan = <number>nextCell.mergedColumnSpan - 1;
                            nextCell.mergedColumnSpan = (tempSpan === 0 ? undefined : tempSpan);
                        }
                    }
                }
            }
        }

        for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
            let row = this.rows[rowIndex];
            let cell = row.cells[deleteIndex];
            row.cells.splice(deleteIndex, 1);
        }

        this.columns.splice(deleteIndex, 1);
    }
}