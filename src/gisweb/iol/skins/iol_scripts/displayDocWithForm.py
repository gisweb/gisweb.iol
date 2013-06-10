## Script (Python) "displayDocWithForm"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=frm_name='base_pratica_dsp'
##title=
##
frm = context.getParentDatabase().getForm(frm_name)
if frm:
    return context.openWithForm(frm)
else:
    return ''
