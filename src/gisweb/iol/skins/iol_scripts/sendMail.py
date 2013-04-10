## Script (Python) "sendMail"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=Object, Text, To, From='', Attachment='', Attachment_name=''
##title=Low level sending email management
##

"""
Gestione di invio mail
"""

from Products.CMFCore.utils import getToolByName
from gisweb.utils import Type

mail_host = getToolByName(context, 'MailHost')

def sendMail(Object, Text, To, From='', Attachment='', Attachment_name=''):
    
    success = 0
    
    if Attachment:
        Attachment_name = Attachment_name or 'test'
        msg = context.mime_file(file=Attachment, text=Text, nomefile=Attachment_name)
    else:
        msg = Text
    
    messages = []
    try:
        mail_host.send(msg, To, From or mail_host.getProperty('email_from_address'), Object)
    except Exception as err:
        err_msg = '%s: %s' % (Type(err), err)
        err = (unicode(err_msg, errors='replace'), 'error')
        wrn_msg = 'ATTENZIONE! Non è stato possibile inviare la mail con oggetto: %s' % Object
        wrn = (unicode(wrn_msg, errors='replace'), 'warning')
        messages.append(err)
        messages.append(wrn)
    else:
        success = 1
        ok_msg = 'La mail con oggetto "%s" è stata inviata correttamente' % Object
        ok = (unicode(ok_msg, errors='replace'), 'info')
        messages.append(ok)

    plone_tools = getToolByName(context.getParentDatabase().aq_inner, 'plone_utils')
    for msg in messages:	
        plone_tools.addPortalMessage(*msg, request=context.REQUEST)
    
    return success

return sendMail(Object, Text, To, From=From, Attachment=Attachment, Attachment_name=Attachment_name)
