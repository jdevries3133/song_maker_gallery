import pymysql
pymysql.version_info = (1, 3, 13, "final", 0)
pymysql.install_as_MySQLdb()
import MySQLdb


# Show details for the session. Comment out if not debugging
import logging
import sys
logger = logging.getLogger('file')
logger.debug(f'PYTHON_VERSION: {sys.version}')
logger.debug(f'PYTHON_PATH: {sys.path}')
