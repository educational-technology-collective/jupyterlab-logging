import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the jupyterlab_log extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-log',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyterlab-log is activated!');
  }
};

export default extension;
