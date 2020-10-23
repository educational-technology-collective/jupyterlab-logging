import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { requestAPI } from './jlabserverconn';

import { INotebookTracker } from '@jupyterlab/notebook';
import { ISettingRegistry } from '@jupyterlab/settingregistry';

import {
  OnActiveCellChangedEvent,
  OnCurrentWidgetChangedEvent,
  OnCellExecutedEvent,
  OnCellInsertedEvent,
  OnCellCutEvent,
  OnCellCopyEvent,
  OnCellPasteEvent,
  OnCellTypeChangeEvent,
  OnRunAllEvent,
  OnRunAndAdvanceEvent,
  OnSaveEvent,
  OnScrollEvent
} from './jupyterevent';
import KinesisWritable from 'aws-kinesis-writable';
import { createLogger, INFO, ConsoleRawStream } from 'browser-bunyan';

const PLUGIN_ID = 'jupyterlab-logging:settings-log';

const jupyterLogger = (config: any, user:any) => {
  const consoleStream = new ConsoleRawStream();

  const kinesisWritableStream = new KinesisWritable({
    credentialSource: 'FederatedIdentity',
    identityPoolId: config.jupyter_logging.identityPoolId,
    streamName: config.jupyter_logging.kinesisStreamName,
    objectMode: true
  });


  const bunyan_setup = {
    name: config.jupyter_logging.nameOfLogs,
    username: user.workspace_id,
    window_location: window.location.href,
    streams: [
      {
        level: INFO,
        stream: kinesisWritableStream
      },
      {
        level: INFO,
        stream: consoleStream
      }
    ]
  };

  const logger = createLogger(bunyan_setup);
  return logger;
}

const initLogger = async(config: any, nbtracker: INotebookTracker) => {
  // Activate the log

  let user: any = {"workspace_id": "undefined"};
  // get the server side username
  try {
    user = await requestAPI<any>('id');
    // console.log(user.workspace_id);
  } catch (reason) {
    console.error(`Error on GET /jupyterlab_logging/id.\n${reason}`);
  }

  const logger = jupyterLogger(config, user);

  const logRecord = (event: any) => {
    logger.info(event.detail)
  };

  const jupyterEventsToLog = [
    new OnActiveCellChangedEvent(nbtracker),
    new OnCurrentWidgetChangedEvent(nbtracker),
    new OnCellExecutedEvent(nbtracker),
    new OnCellInsertedEvent(nbtracker),
    new OnCellCutEvent(nbtracker),
    new OnCellPasteEvent(nbtracker),
    new OnCellCopyEvent(nbtracker),
    new OnCellTypeChangeEvent(nbtracker),
    new OnRunAllEvent(),
    new OnRunAndAdvanceEvent(nbtracker),
    new OnSaveEvent(nbtracker),
    new OnScrollEvent(nbtracker)
  ];

  jupyterEventsToLog.forEach((jupyterEvent) => {
    if (config.eventList[jupyterEvent.name]) 
      document.addEventListener(jupyterEvent.name, logRecord, false);
  });

  logger.info('JupyterLab extension jupyterlab_logging is activated!');
}


const activateLog = (
  app: JupyterFrontEnd,
  nbtracker: INotebookTracker,
  settingRegistry: ISettingRegistry,
) => {
  let nameOfLogs = 'April Jupyter Event Logging';
  let kinesisStreamName = 'mentoracademy';
  let identityPoolId = 'us-east-1:f09d7f65-e395-4aad-a04a-dbb8b0b2f549';
  let eventList: any = {
    'ChangeCellsInViewEvent': true, 
    'OpenNotebookEvent': true,
    'FinishExecuteCellEvent': true,
    'CellInsertedEvent': true,
    'CellCutEvent': true,
    'CellCopyEvent': true,
    'CellPasteEvent': true,
    'RunAllEvent': true,
    'RunAndAdvanceEvent': true,
    'CellTypeChangeEvent': true,
    'SaveEvent': true,
    'ScrollEvent': true
  }
  /**
     * Load the settings for this extension
     *
     * @param setting Extension settings
     */
  function loadSetting(setting: ISettingRegistry.ISettings): void {
    // Read the settings and convert to the correct type
    nameOfLogs = setting.get('nameOfLogs').composite as string;
    kinesisStreamName = setting.get('kinesisStreamName').composite as string;
    identityPoolId = setting.get('identityPoolId').composite as string;
    for(const eventname in eventList) {
      let flag = setting.get(eventname).composite as boolean;
      eventList[eventname] = flag;
    }
  }
  // Load the settings after the notebook is ready
  Promise.all([app.restored, settingRegistry.load(PLUGIN_ID)])
    .then(([, setting]) => {
      // Read the settings
      loadSetting(setting);

      // Listen for your plugin setting changes using Signal
      setting.changed.connect(loadSetting);

      const config = {
        jupyter_logging: {
          nameOfLogs,
          kinesisStreamName,
          identityPoolId,
        },
        eventList
      }

      initLogger(config, nbtracker)
    })
    .catch(reason => {
      console.log(reason)
      console.error(
        `Something went wrong when reading the settings.\n${reason}`
      );
    });

}

/**
 * Initialization data for the jupyterlab_logging extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: PLUGIN_ID,
  autoStart: true,
  requires: [INotebookTracker, ISettingRegistry],
  activate: activateLog
};

export default extension;
