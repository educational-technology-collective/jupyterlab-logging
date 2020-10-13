import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { INotebookTracker } from '@jupyterlab/notebook';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import {
  OnActiveCellChangedEvent,
  OnCurrentWidgetChangedEvent,
  onCellExecutedEvent,
  onCellInsertedEvent,
  onCellCutEvent,
  onCellCopyEvent,
  onCellPasteEvent,
  onCellTypeChangeEvent,
  onRunAllEvent,
  onRunAndAdvanceEvent
} from './jupyterevent';
import KinesisWritable from 'aws-kinesis-writable';
import { createLogger, INFO, ConsoleRawStream } from 'browser-bunyan';
// import { Menu } from '@lumino/widgets';


const PLUGIN_ID = 'jupyterlab-log:settings-log';

const getUsernameForConfig = () => {
  //EFFECTS: retrieve username from url
  if (window.location.href.split("/")[2].substring(0, 9) == "localhost") {
    return "localhost";
  } else {
    //return window.location.href.split("/")[4];
    return window.location.href.split("/")[2].split(".")[0];
  }
}

const jupyterLogger = (config: any) => {
  const consoleStream = new ConsoleRawStream();

  const kinesisWritableStream = new KinesisWritable({
    credentialSource: 'FederatedIdentity',
    identityPoolId: config.jupyter_logging.identityPoolId,
    streamName: config.jupyter_logging.kinesisStreamName,
    objectMode: true
  });


  const bunyan_setup = {
    name: config.jupyter_logging.nameOfLogs,
    username: getUsernameForConfig(),
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

const initLogger = (config: any, nbtracker: INotebookTracker) => {
  // Activate the log
  const logger = jupyterLogger(config);
  logger.info('JupyterLab extension jupyterlab-log is activated!');

  const logRecord = (event: any) => {
    logger.info(event.detail)
  };

  const jupyterEventsToLog = [
    new OnActiveCellChangedEvent(nbtracker),
    new OnCurrentWidgetChangedEvent(nbtracker),
    new onCellExecutedEvent(nbtracker),
    new onCellInsertedEvent(nbtracker),
    new onCellCutEvent(nbtracker),
    new onCellPasteEvent(nbtracker),
    new onCellCopyEvent(nbtracker),
    new onCellTypeChangeEvent(nbtracker),
    new onRunAllEvent(),
    new onRunAndAdvanceEvent(nbtracker)
  ];

  jupyterEventsToLog.forEach((jupyterEvent) => {
    document.addEventListener(jupyterEvent.name, logRecord, false);
  });
}


const activateLog = (
  app: JupyterFrontEnd,
  nbtracker: INotebookTracker,
  settingRegistry: ISettingRegistry,
) => {
  let nameOfLogs = 'April Jupyter Event Logging';
  let kinesisStreamName = 'mentoracademy';
  let identityPoolId = 'us-east-1:f09d7f65-e395-4aad-a04a-dbb8b0b2f549';

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
  }
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
        }
      }

      initLogger(config, nbtracker)
    })
    .catch(reason => {
      console.error(
        `Something went wrong when reading the settings.\n${reason}`
      );
    });

}

/**
 * Initialization data for the jupyterlab_log extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: PLUGIN_ID,
  autoStart: true,
  requires: [INotebookTracker, ISettingRegistry],
  activate: activateLog
};

export default extension;
