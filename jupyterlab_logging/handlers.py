import os
import json

from notebook.base.handlers import APIHandler
from notebook.utils import url_path_join

import tornado
# from tornado.web import StaticFileHandler


class RouteHandler(APIHandler):
    # Ensure only authorized user can request the Jupyter server
    @tornado.web.authenticated
    def get(self):
        # WORKSPACE is an ENV variable provided by Coursera
        # You could use this same strategy to get additional info from ENV variables
        workspace_id = os.getenv("WORKSPACE_ID") if os.getenv("WORKSPACE_ID") is not None else "UNDEFINED"
        self.finish(json.dumps({"workspace_id": workspace_id}))


def setup_handlers(web_app, url_path):
    host_pattern = ".*$"
    base_url = web_app.settings["base_url"]

    # Prepend the base_url so that it works in a jupyterhub setting
    route_pattern = url_path_join(base_url, url_path, "id")
    handlers = [(route_pattern, RouteHandler)]
    web_app.add_handlers(host_pattern, handlers)
