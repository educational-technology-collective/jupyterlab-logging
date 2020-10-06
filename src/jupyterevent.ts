import { INotebookTracker, NotebookActions } from "@jupyterlab/notebook";
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

export class onCellExecutedEvent extends JupyterEvent {
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

export class onCellInsertedEvent extends JupyterEvent {
    tracker: INotebookTracker;
    name: string = 'onCellInserted';
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

export class onCellCutEvent extends JupyterEvent {
    tracker: INotebookTracker;
    name: string = 'onCellCut';
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

export class onCellCopyEvent extends JupyterEvent {
    tracker: INotebookTracker;
    name: string = 'onCellCopy';
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


export class onCellPasteEvent extends JupyterEvent {
    tracker: INotebookTracker;
    name: string = 'onCellPaste';
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

export class onCellTypeChangeEvent extends JupyterEvent {
    tracker: INotebookTracker;
    name: string = 'onCellTypeChange';
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

export class onRunAllEvent extends JupyterEvent {
    name: string = 'onRunAll';
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

export class onRunAndAdvanceEvent extends JupyterEvent {
    tracker: INotebookTracker;
    name: string = 'onRunAndAdvance';
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
