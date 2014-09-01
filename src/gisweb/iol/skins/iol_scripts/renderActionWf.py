## Script (Python) "renderActionWf"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=action,wf_id='iol_workflow',actionurl='',description=''
##title=Clone the specified PlominoItem from source to context
##

db = context.getParentDatabase()

doc=context  


dburl=db.absolute_url()
status = doc.wf_getInfoFor('review_state')
stato_info = doc.wf_statesInfo(wf_id=wf_id,args=['description'])
actions = doc.wf_transitionsInfo(wf_id=wf_id,args=['description'])

for act in actions:
    
    if act.get('id') == action:
        if  actionurl=='':
            actionurl='''%s/%s/content_status_modify?workflow_action=%s''' %(dburl,doc.getId(),act.get('id'))
        if description=='':            
            description = act.get('description') or act.get('title') or act.get('id')
            
        html='''<div class="row-fluid"><div class="span12 alert-error"><h4>%s</h4><a style="width:200px" class="btn pull-right wf-actions" id="btn_wf_%s" href="%s"><i class='icon-hand-right'></i><span>%s</span></a></div></div>''' %(description,act.get('id'),actionurl,act.get('title'))            
            
        return html
