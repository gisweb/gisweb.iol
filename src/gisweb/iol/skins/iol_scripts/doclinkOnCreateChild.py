## Script (Python) "doclinkOnCreateChild"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=CASCADE=True, redirect=True
##title=Actions for child document creation event
##
"""
Actions for child document creation:
set parent reference in child document

CASCADE: True/False
redirect: True/False
"""

parentKey = context.doclinkCommons('parentKey')
parentId = context.REQUEST.get(parentKey)

context.setItem(parentKey, parentId)
if context.getParentDatabase().plomino_version < '1.17':
    # Plomino versions < 1.17 does not support BOOLEAN data type
    CASCADE = 1 if CASCADE else 0
context.setItem('CASCADE', CASCADE)

if redirect:
    backUrl = context.absolute_url().replace(context.getId(), parentId)
    if isinstance(redirect, basestring):
        backUrl = '%s#%s' % (backUrl, redirect)
    context.setItem('plominoredirecturl', backUrl)
