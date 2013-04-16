## Script (Python) "iol_eventUtils"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=k='getAttributes'
##title=
##

"""
Gestione centralizzata dei valori di alcuni parametri comuni agli script
degli eventi

k: one of the defaults parameter. If none is specified all params are
	returned in a dictionary
	i.e.:
	* "parentKey"
	* "parentLinkKey"
	* "childrenLinstKey"
"""

"""
Gestione centralizzata dei valori di alcuni parametri comuni agli script
degli eventi

k: one of the defaults parameter. If none is specified all params are
	returned in a dictionary
	i.e.:
	* "parentKey"
	* "parentLinkKey"
	* "childrenLinstKey"
"""

defaults = dict(
    parentKey = 'parentDocument',
    parentLinkKey = 'linkToParent',
    childrenListKey = 'childrenList_%s'
)

if not k:
    return defaults

return defaults[k]
