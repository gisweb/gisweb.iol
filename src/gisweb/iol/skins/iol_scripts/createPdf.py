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

filename = filename or \
	context.REQUEST.get('filename') or \
	context.getId()

res = context.restrictedTraverse('@@wkpdf').get_pdf_file()

attachThis(context, res, itemname,
	filename='%s.pdf' % filename,
	overwrite=overwrite
)
