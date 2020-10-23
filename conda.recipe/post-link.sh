tar -xvzf ${CONDA_PREFIX}/share/jupyter/lab/extensions/jupyterlab-logging-0.1.1.tgz -C ${CONDA_PREFIX}/share/jupyter/lab/extensions/
${CONDA_PREFIX}/bin/jupyter labextension link $CONDA_PREFIX/share/jupyter/lab/extensions/package/aws-kinesis-writable
${CONDA_PREFIX}/bin/jupyter lab build --minimize=False
