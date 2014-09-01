## Script (Python) "renderedItemEditWf_read"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=list_item,n
##title=Clone the specified PlominoItem from source to context
##

doc=context
myForm=doc.getForm()

html=''
l=len(list_item)
len_row=l*n    
if len_row <=12:
    html_header='''<div class="row-fluid">'''
    for campo in list_item:
        a=myForm.getFormField(campo).getFieldRender(myForm, doc, doc.isDocument(), False, request=doc.REQUEST)        
        html += '''<div class="span%d">%s</div>''' % (n,a.replace('\n',''))
    html= html_header + html + '</div>'
else:
    for campo in list_item:
        a=myForm.getFormField(campo).getFieldRender(myForm, doc, doc.isDocument(), False, request=doc.REQUEST)
        html_head = '''<div class="row-fluid">'''
        html_con = '''<div class="span%d">%s</div></div>''' % (n,a.replace('\n',''))
        html += html_head + html_con               

return html
