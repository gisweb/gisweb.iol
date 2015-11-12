## Script (Python) "bootstrap_left_column"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=
##
if context.portal_type == 'PlominoDocument':
    targetname = context.getForm().getFormName()
elif context.portal_type == 'PlominoForm':
    targetname = context.getFormName()
elif context.portal_type == 'PlominoView':
    targetname = context.getViewName()
else:
    targetname = 'left_column_pippo'

if targetname=='left_column_info':
    return ''
#if context.isEditMode() and not context.isNewDocument(): return ''

post_str = targetname.split('_')[-1]
formname = targetname[:-1*len(post_str)] + 'info'

db = context.getParentDatabase()

targetform = db.getForm(formname)  #or db.getForm('left_column_info')
if not targetform: return ''

if context.portal_type == 'PlominoDocument':
    return context.openWithForm(targetform)
else:
    return targetform.formLayout(context.REQUEST)

	
	
	
