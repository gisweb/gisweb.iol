## Script (Python) "handleError"
##bind container=container
##bind context=context
##bind namespace=_
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=
##
error = _['error']
return """<div class="alert-error" style="padding:10px;border-radius: 4px 4px 4px 4px;">Si è verificato un errore : <b>%s %s</b> </div>""" %(error.type,error.value)
