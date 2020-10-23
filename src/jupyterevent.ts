import { INotebookTracker, NotebookActions } from "@jupyterlab/notebook";
import { CodeCell, MarkdownCell } from '@jupyterlab/cells';

/**
 Defines the JupyterEvent class.
 */

class JupyterEvent {
    name: string;

    constructor() {
    };

    dispatchJupyterEvent(event_name: string, details = {}) {
        const defaultDetails = {
            event_name,
            event_time: Date.now()
        }
        const combinedDetails = { ...defaultDetails, ...details };
        const newJupyterEvent = new CustomEvent(event_name, { detail: combinedDetails });
        document.dispatchEvent(newJupyterEvent);
    };

    onEventCalled() {
    };

    release() {
        // release the modified Jupyter functions here 
    }

}

export class OnActiveCellChangedEvent extends JupyterEvent {
    tracker: INotebookTracker;
    name: string = 'ChangeCellsInViewEvent';
    constructor(nbtracker: INotebookTracker) {
        super();
        this.tracker = nbtracker;
        this.tracker.activeCellChanged.connect(this.onEventCalled, this);
    };

    onEventCalled() {
        const active_cell = this.tracker.activeCell;
        const cell_content = active_cell?.model?.value.text;
        const cell_type = active_cell?.model?.type;
        const cell_index = this.tracker.currentWidget.content.activeCellIndex;
        const details = {
            cell_content,
            cell_type,
            cell_index
        };
        JupyterEvent.prototype.dispatchJupyterEvent(this.name, details);
    };
}

export class OnCurrentWidgetChangedEvent extends JupyterEvent {
    tracker: INotebookTracker;
    name: string = 'OpenNotebookEvent';
    constructor(nbtracker: INotebookTracker) {
        super();
        this.tracker = nbtracker;
        this.tracker.currentChanged.connect(this.onEventCalled, this);
    }

    onEventCalled() {
        const active_widget = this.tracker.currentWidget;
        const widget_name = active_widget?.context.path;
        const details = {
            widget_name
        };
        JupyterEvent.prototype.dispatchJupyterEvent(this.name, details);
    }
}

export class OnCellExecutedEvent extends JupyterEvent {
    tracker: INotebookTracker;
    name: string = 'FinishExecuteCellEvent';
    constructor(nbtracker: INotebookTracker) {
        super();
        this.tracker = nbtracker;
        NotebookActions.executed.connect(this.onEventCalled, this);
    }

    onEventCalled() {
        const active_cell = this.tracker.activeCell;
        const cell_content = active_cell?.model?.value.text;
        const cell_type = active_cell?.model?.type;
        const cell_index = this.tracker.currentWidget.content.activeCellIndex;
        const details = {
            cell_content,
            cell_type,
            cell_index
        };
        JupyterEvent.prototype.dispatchJupyterEvent(this.name, details);
    }
}

export class OnCellInsertedEvent extends JupyterEvent {
    tracker: INotebookTracker;
    name: string = 'CellInsertedEvent';
    oldFunc: any;
    constructor(nbtracker: INotebookTracker) {
        super();
        this.tracker = nbtracker;
        this.oldFunc = NotebookActions.insertBelow
        NotebookActions.insertBelow = (notebook) => {
            this.oldFunc(notebook)
            this.onEventCalled()
        };
    };

    onEventCalled = () => {
        const active_cell = this.tracker.activeCell;
        const cell_content = active_cell?.model?.value.text;
        const cell_type = active_cell?.model?.type;
        const cell_index = this.tracker.currentWidget.content.activeCellIndex;
        const details = {
            cell_content,
            cell_type,
            cell_index
        };
        JupyterEvent.prototype.dispatchJupyterEvent(this.name, details);
    };

    release = () => {
        NotebookActions.insertBelow = this.oldFunc;
    };
}

export class OnCellCutEvent extends JupyterEvent {
    tracker: INotebookTracker;
    name: string = 'CellCutEvent';
    oldFunc: any;
    constructor(nbtracker: INotebookTracker) {
        super();
        this.tracker = nbtracker;
        this.oldFunc = NotebookActions.cut;
        NotebookActions.cut = (notebook) => {
            this.oldFunc(notebook)
            this.onEventCalled()
        };
    };

    onEventCalled = () => {
        const active_cell = this.tracker.activeCell;
        const cell_content = active_cell?.model?.value.text;
        const cell_type = active_cell?.model?.type;
        const cell_index = this.tracker.currentWidget.content.activeCellIndex;
        const details = {
            cell_content,
            cell_type,
            cell_index
        };
        JupyterEvent.prototype.dispatchJupyterEvent(this.name, details);
    };

    release = () => {
        NotebookActions.cut = this.oldFunc;
    };
}

export class OnCellCopyEvent extends JupyterEvent {
    tracker: INotebookTracker;
    name: string = 'CellCopyEvent';
    oldFunc: any;
    constructor(nbtracker: INotebookTracker) {
        super();
        this.tracker = nbtracker;
        this.oldFunc = NotebookActions.copy;
        NotebookActions.copy = (notebook) => {
            this.oldFunc(notebook)
            this.onEventCalled()
        };
    };

    onEventCalled = () => {
        const active_cell = this.tracker.activeCell;
        const cell_content = active_cell?.model?.value.text;
        const cell_type = active_cell?.model?.type;
        const cell_index = this.tracker.currentWidget.content.activeCellIndex;
        const details = {
            cell_content,
            cell_type,
            cell_index
        };
        JupyterEvent.prototype.dispatchJupyterEvent(this.name, details);
    };

    release = () => {
        NotebookActions.copy = this.oldFunc;
    };
}


export class OnCellPasteEvent extends JupyterEvent {
    tracker: INotebookTracker;
    name: string = 'CellPasteEvent';
    oldFunc: any;
    constructor(nbtracker: INotebookTracker) {
        super();
        this.tracker = nbtracker;
        this.oldFunc = NotebookActions.paste
        NotebookActions.paste = (notebook) => {
            this.oldFunc(notebook)
            this.onEventCalled()
        };
    };

    onEventCalled = () => {
        const active_cell = this.tracker.activeCell;
        const cell_content = active_cell?.model?.value.text;
        const cell_type = active_cell?.model?.type;
        const cell_index = this.tracker.currentWidget.content.activeCellIndex;
        const details = {
            cell_content,
            cell_type,
            cell_index
        };
        JupyterEvent.prototype.dispatchJupyterEvent(this.name, details);
    };

    release = () => {
        NotebookActions.paste = this.oldFunc;
    };
}

export class OnCellTypeChangeEvent extends JupyterEvent {
    tracker: INotebookTracker;
    name: string = 'CellTypeChangeEvent';
    oldFunc: any;
    constructor(nbtracker: INotebookTracker) {
        super();
        this.tracker = nbtracker;
        this.oldFunc = NotebookActions.changeCellType;
        NotebookActions.changeCellType = (notebook, target) => {
            this.oldFunc(notebook, target)
            this.onEventCalled()
        };
    };

    onEventCalled = () => {
        const active_cell = this.tracker.activeCell;
        const cell_content = active_cell?.model?.value.text;
        const cell_type = active_cell?.model?.type;
        const cell_index = this.tracker.currentWidget.content.activeCellIndex;
        const details = {
            cell_content,
            cell_type,
            cell_index
        };
        JupyterEvent.prototype.dispatchJupyterEvent(this.name, details);
    };

    release = () => {
        NotebookActions.changeCellType = this.oldFunc;
    };
}

export class OnRunAllEvent extends JupyterEvent {
    name: string = 'RunAllEvent';
    oldFunc: any;
    constructor() {
        super();
        this.oldFunc = NotebookActions.runAll;
        NotebookActions.runAll = (notebook, target): Promise<boolean> => {
            this.onEventCalled();
            return this.oldFunc(notebook, target);
        };
    };

    onEventCalled = () => {
        const details = {};
        JupyterEvent.prototype.dispatchJupyterEvent(this.name, details);
    };

    release = () => {
        NotebookActions.runAll = this.oldFunc;
    };
}

export class OnRunAndAdvanceEvent extends JupyterEvent {
    tracker: INotebookTracker;
    name: string = 'RunAndAdvanceEvent';
    oldFunc: any;
    constructor(nbtracker: INotebookTracker) {
        super();
        this.tracker = nbtracker;
        this.oldFunc = NotebookActions.runAndAdvance;
        NotebookActions.runAndAdvance = (notebook, context): Promise<boolean> => {
            this.onEventCalled();
            return this.oldFunc(notebook, context);
        };
    };

    onEventCalled = () => {
        const active_cell = this.tracker.activeCell;
        const cell_content = active_cell?.model?.value.text;
        const cell_type = active_cell?.model?.type;
        const cell_index = this.tracker.currentWidget.content.activeCellIndex;
        const details = {
            cell_content,
            cell_type,
            cell_index
        };
        JupyterEvent.prototype.dispatchJupyterEvent(this.name, details);
    };

    release = () => {
        NotebookActions.runAndAdvance = this.oldFunc;
    };
}


export class OnSaveEvent extends JupyterEvent {
    tracker: INotebookTracker;
    notebook: any;
    name: string = 'SaveEvent';
    content: string;
    constructor(nbtracker: INotebookTracker) {
        super();
        this.tracker = nbtracker;
        const current_widget = this.tracker.currentWidget;
        current_widget.context?.saveState.connect(this.onSave, this);
        this.tracker.currentChanged.connect(this.onEventCalled, this);
    }

    onEventCalled = () => {
        const current_widget = this.tracker.currentWidget;
        current_widget.context?.saveState.connect(this.onSave, this);
    }

    onSave = () => {
        this.notebook = this.tracker.currentWidget.content;
        let notebook_json = []
        
        for (let cell of this.notebook.widgets) {
            let cell_json = {
               "cell_type": "null",
               "source":[] as any 
            }
            if (cell instanceof CodeCell) {
                cell_json.cell_type = "code",
                cell_json.source.push((cell.editor as any).doc?.getValue())
            }
            if (cell instanceof MarkdownCell) {
                cell_json.cell_type = "markdown",
                cell_json.source.push((cell.editor as any).doc?.getValue())
            }
            notebook_json.push(cell_json)
        }
        const details = {
            notebook_content: notebook_json
        };
        JupyterEvent.prototype.dispatchJupyterEvent(this.name, details);
    }

    release = () => {

    }
}

export class OnScrollEvent extends JupyterEvent {
    tracker: INotebookTracker;
    name: string = 'ScrollEvent';
    constructor(nbtracker: INotebookTracker) {
        super();
        this.tracker = nbtracker;
        this.tracker.currentWidget.content.node.addEventListener('scroll', this.onScroll)
        this.tracker.currentChanged.connect(this.onEventCalled, this);
    }
    onEventCalled = () => { 
        this.tracker.currentWidget.content.node.addEventListener('scroll', this.onScroll)
    }

    onScroll = () => {
        const view_top = this.tracker.currentWidget.content.node.scrollTop
        const view_bottom = this.tracker.currentWidget.content.node.scrollTop + this.tracker.currentWidget.content.node.offsetHeight
        let cell_list = []

        const notebook = this.tracker.currentWidget.content;
        let index = 0
        for (let cell of notebook.widgets) {
            const cell_top = cell.node.offsetTop;
            const cell_bottom = cell.node.offsetTop + cell.node.offsetHeight;
            if(cell_top > view_bottom || cell_bottom < view_top) {
                index ++;
                continue;
            }
            cell_list.push(index)
            index ++;
        }
        const details = {
            cell_list
        };
        JupyterEvent.prototype.dispatchJupyterEvent(this.name, details);

    }
}