import os
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

FALSE_STRINGS = ('NO', '0', 'FALSE')

if os.environ.get('BOOTSTRAP_THEME', '').upper() in FALSE_STRINGS:
    BOOTSTRAP_THEME = True
    # Avoid port collisions on Jenkins parallel build matrix
    z2.ZServer.port = 55002
else:
    BOOTSTRAP_THEME = False


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
        applyProfile(portal, 'gisweb.iol:default')
        if BOOTSTRAP_THEME:
            portal.portal_quickinstaller.installProduct('plonetheme.bootstrap')
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
