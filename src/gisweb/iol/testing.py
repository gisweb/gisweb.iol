import os
import logging
from plone.app.testing import PloneSandboxLayer
from plone.app.testing import IntegrationTesting
from plone.app.testing import FunctionalTesting
from plone.app.testing import login
from plone.app.testing import PLONE_FIXTURE
from plone.app.testing import applyProfile
from plone.testing.z2 import installProduct

from zope.configuration import xmlconfig

import gisweb.iol
from plone.testing import z2

THIS_DIR = os.path.dirname(__file__)
IOL_BASE_FOLDER = os.path.join(THIS_DIR, 'db_dumps', 'iol_base')

PLONE_LANGUAGE = os.environ.get('PLONE_LANGUAGE')
PLONE_VERSION = os.environ.get('PLONE_VERSION')
FALSE_STRINGS = ('NO_BOOTSTRAP', 'NO', '0', 'FALSE', '')
if os.environ.get('BOOTSTRAP_THEME', '').upper() in FALSE_STRINGS:
    BOOTSTRAP_THEME = False
else:
    BOOTSTRAP_THEME = True


class GiswebIol(PloneSandboxLayer):
    defaultBases = (PLONE_FIXTURE,)

    def setUpZope(self, app, configurationContext):
        # We need to explicitly install Zope2 products
        # otherwise their factory methods won't be registered
        installProduct(app, 'Products.CMFPlomino')
        xmlconfig.file(
            'configure.zcml',
            gisweb.iol,
            context=configurationContext
        )
        if BOOTSTRAP_THEME:
            import plonetheme.bootstrap
            xmlconfig.file(
                'configure.zcml',
                plonetheme.bootstrap,
                context=configurationContext
            )

    def setUpPloneSite(self, portal):
        portal.acl_users.userFolderAddUser('admin',
                                           'secret',
                                           ['Manager'],
                                           [])
        login(portal, 'admin')
        if BOOTSTRAP_THEME:
            portal.portal_quickinstaller.installProduct('plonetheme.bootstrap')
        if PLONE_LANGUAGE:
            portal.portal_languages.setDefaultLanguage(PLONE_LANGUAGE)
        applyProfile(portal, 'gisweb.iol:default')
        portal.invokeFactory('PlominoDatabase', 'iol_base')
        portal.iol_base.at_post_create_script()
        portal.iol_base.importDesignFromXML(from_folder=IOL_BASE_FOLDER)


GISWEB_IOL = GiswebIol()

GISWEB_IOL_INTEGRATION = IntegrationTesting(
    bases=(GISWEB_IOL, ),
    name="GISWEB_IOL_INTEGRATION")

GISWEB_IOL_FUNCTIONAL = FunctionalTesting(
    bases=(GISWEB_IOL, ),
    name="GISWEB_IOL_FUNCTIONAL")

GISWEB_IOL_ROBOT = FunctionalTesting(
    bases=(GISWEB_IOL, z2.ZSERVER_FIXTURE),
    name='GISWEB_IOL_ROBOT')

# The following code forces a different port on each combination
# of variables on our Jenkins CI.
# All ports are in the 54000-54512 range

POSSIBLE_VALUES = {
    'PLONE_LANGUAGE': (None, 'it', 'en'),
    'PLONE_VERSION': (None, '4.0', '4.1', '4.2', '4.3'),
    'BOOTSTRAP_THEME': (True, False)
}
PORT_NUMBER = 54000
for i, axis in enumerate(POSSIBLE_VALUES):
    value = locals()[axis]
    PORT_NUMBER += POSSIBLE_VALUES[axis].index(value) * (2**(i*3))
# Avoid port collisions on Jenkins parallel build matrix
# BUILD_NUMBER is usually only set on Jenkins
if os.environ.get('BUILD_NUMBER'):
    z2.ZServer.port = PORT_NUMBER
logger = logging.getLogger('gisweb_iol_testing')
logger.warn("Server port: %(PORT_NUMBER)s")
logger.warn("Bootstrap theme: %(BOOTSTRAP_THEME)s")
logger.warn("Plone version: %(PLONE_VERSION)s")
logger.warn("Plone language: %(PLONE_LANGUAGE)s")
