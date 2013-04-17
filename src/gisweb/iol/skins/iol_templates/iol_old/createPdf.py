## Script (Python) "createPdf"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=filename=''
##title=copiato in gisweb.iol, DA CANCELLARE
##
if context.portal_type != 'PlominoDocument':
    return ''

from gisweb.utils import attachThis

filename=filename or context.REQUEST.get('filename') or context.id
res = context.restrictedTraverse('@@wkpdf').get_pdf_file()
attachThis(context, res, 'documenti_pdf', filename='%s.pdf' % filename, overwrite=False)
