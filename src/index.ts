import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { INotebookTracker } from '@jupyterlab/notebook';
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

const getUsernameForConfig = () => {
  //EFFECTS: retrieve username from url
  if (window.location.href.split("/")[2].substring(0, 9) == "localhost") {
    return "localhost";
  } else {
    //return window.location.href.split("/")[4];
    return window.location.href.split("/")[2].split(".")[0];
  }
}

const temp_config = {
  jupyter_logging: {
    nameOfLogs: 'April Jupyter Event Logging',
    kinesisStreamName: 'mentoracademy',
    identityPoolId: 'us-east-1:f09d7f65-e395-4aad-a04a-dbb8b0b2f549',
  }
}

const jupyterLogger = () => {
  const consoleStream = new ConsoleRawStream();

  const kinesisWritableStream = new KinesisWritable({
    credentialSource: 'FederatedIdentity',
    identityPoolId: temp_config.jupyter_logging.identityPoolId,
    streamName: temp_config.jupyter_logging.kinesisStreamName,
    objectMode: true
  });


  const bunyan_setup = {
    name: temp_config.jupyter_logging.nameOfLogs,
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


const activateLog = (
  app: JupyterFrontEnd,
  nbtracker: INotebookTracker
) => {
  const logger = jupyterLogger();
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

/**
 * Initialization data for the jupyterlab_log extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-log',
  autoStart: true,
  requires: [INotebookTracker],
  activate: activateLog
};

export default extension;
