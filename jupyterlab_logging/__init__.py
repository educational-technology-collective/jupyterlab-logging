from ._version import __version__
from .handlers import setup_handlers


def _jupyter_server_extension_paths():
    return [{"module": "jupyterlab_logging"}]


def load_jupyter_server_extension(lab_app):
    """Registers the API handler to receive HTTP requests from the frontend extension.
    Parameters
    ----------
    lab_app: jupyterlab.labapp.LabApp
        JupyterLab application instance
    """
    url_path = "jupyterlab_logging"
    setup_handlers(lab_app.web_app, url_path)
    lab_app.log.info(
        "Registered jupyterlab_logging extension at URL path /{}".format(url_path)
    )
