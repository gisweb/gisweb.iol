from plone.app.testing import PloneSandboxLayer
from plone.app.testing import IntegrationTesting
from plone.app.testing import FunctionalTesting
from plone.app.testing import login
from plone.app.testing import PLONE_FIXTURE
from plone.app.testing import setRoles
from plone.app.testing import TEST_USER_ID
from plone.app.testing import applyProfile

from zope.configuration import xmlconfig

import gisweb.iol
from plone.testing import z2


class GiswebIol(PloneSandboxLayer):
    defaultBases = (PLONE_FIXTURE,)

    def setUpZope(self, app, configurationContext):
        xmlconfig.file(
            'configure.zcml',
            gisweb.iol,
            context=configurationContext
        )

    def setUpPloneSite(self, portal):
        portal.acl_users.userFolderAddUser('admin',
                                           'secret',
                                           ['Manager'],
                                           [])
        login(portal, 'admin')
        portal.portal_workflow.setDefaultChain("simple_publication_workflow")
        setRoles(portal, TEST_USER_ID, ['Manager'])
        applyProfile(portal, 'gisweb.iol:default')


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
