from plone.app.testing import PloneWithPackageLayer
from plone.app.testing import IntegrationTesting
from plone.app.testing import FunctionalTesting

import gisweb.iol


GISWEB_IOL = PloneWithPackageLayer(
    zcml_package=gisweb.iol,
    zcml_filename='testing.zcml',
    gs_profile_id='gisweb.iol:testing',
    name="GISWEB_IOL")

GISWEB_IOL_INTEGRATION = IntegrationTesting(
    bases=(GISWEB_IOL, ),
    name="GISWEB_IOL_INTEGRATION")

GISWEB_IOL_FUNCTIONAL = FunctionalTesting(
    bases=(GISWEB_IOL, ),
    name="GISWEB_IOL_FUNCTIONAL")
