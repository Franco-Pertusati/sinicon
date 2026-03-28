import { Component, computed, input } from '@angular/core';


export interface TableColumn {
  header: string;
  key: string;
  headerClass?: string;
  cellClass?: string;
  cellType?: 'code' | 'badge' | 'muted' | 'html' | 'text';
}

export interface TableRow {
  [key: string]: any;
}

export interface TableConfig {
  containerClass?: string;
  tableClass?: string;
  headerClass?: string;
  headerCellClass?: string;
  bodyClass?: string;
  rowClass?: string;
  cellClass?: string;
}

@Component({
  selector: 'prt-table',
  imports: [],
  templateUrl: './prt-table.component.html'
})
export class PrtTableComponent {
  columns = input<TableColumn[]>([]);
  data = input<TableRow[]>([]);
  config = input<TableConfig>({});

  cellTypeStyleMap: Record<string, string> = {
    code: 'text-sm',
    badge: 'inline-block px-2 py-1 text-xs rounded bg-light',
    muted: 'text-sm text-muted',
    html: 'text-sm',
    text: 'text-sm',
  };

  containerClasses = computed(() =>
    this.config().containerClass || 'overflow-hidden rounded-xl border border-light'
  );

  tableClasses = computed(() =>
    this.config().tableClass || 'w-full'
  );

  headerClasses = computed(() =>
    this.config().headerClass || 'bg-light'
  );

  bodyClasses = computed(() =>
    this.config().bodyClass || ''
  );

  getHeaderCellClasses(column: TableColumn): string {
    return column.headerClass || this.config().headerCellClass || 'px-6 py-4 text-left text-sm font-medium';
  }

  getRowClasses(): string {
    return this.config().rowClass || 'border-t border-light';
  }

  getCellClasses(column: TableColumn): string {
    return column.cellClass || this.config().cellClass || 'px-6 py-4';
  }

  getCellType(value: any, columnType?: string): 'code' | 'badge' | 'muted' | 'html' | 'text' {
    if (columnType) return columnType as any;
    if (value === null || value === undefined || value === '-') return 'muted';
    if (typeof value === 'string' && value.includes('<')) return 'html';
    return 'text';
  }

  getCellTypeClass(type: string): string {
    return this.cellTypeStyleMap[type] || this.cellTypeStyleMap['text'];
  }
}
