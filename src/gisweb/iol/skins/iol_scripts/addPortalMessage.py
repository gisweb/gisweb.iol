## Script (Python) "addPortalMessage"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=msg, msg_type='info'
##title=
##
"""
Shortcut for reporting messages to the user.
msg: message or list of messages
error_type: type or list of types (i.e. info, warning, error, success)
"""

if isinstance(msg, basestring):
    msg = [msg]

if isinstance(msg_type, basestring):
    msg_type = [msg_type]

from Products.CMFCore.utils import getToolByName
plone_tools = getToolByName(context, 'plone_utils')

def getUnicode(x):
    if isinstance(x, unicode):
        return x
    else:
        return unicode(x, errors='replace')

messages = [(getUnicode(m[0]), m[1])
    for m in zip(msg, msg_type)]

plone_tools.addPortalMessage(*msg, request=context.REQUEST)
