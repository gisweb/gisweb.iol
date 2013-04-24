## Script (Python) "createPdf"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=filename='', itemname='documenti_pdf', overwrite=False
##title=Create pdf file from PlominoDocument
##

"""
Create pdf file using wkpdf service and attach to the PlominoDocument in
context

filename: if not given I get it from the request or the context id
"""

if context.portal_type != 'PlominoDocument':
    return ''

from gisweb.utils import attachThis

filename = '%s.pdf' % filename or \
    context.REQUEST.get('filename') or \
    context.getId()

try:
    res = context.restrictedTraverse('@@wkpdf').get_pdf_file()
except Exception as err:
    from gisweb.utils import Type
    msg1 = "%s: %s" % (Type(err), err)
    msg2 = "Attenzione! Non è stato possibile allegare il file: %s" % filename
    script.addPortalMessage(msg1, 'error')
    script.addPortalMessage(msg2, 'warning')
else:
    attachThis(
        context,
        res,
        itemname,
        filename=filename,
        overwrite=overwrite
    )
