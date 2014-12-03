import sqlalchemy as sql
import sqlalchemy.orm as orm

from copy import deepcopy
import simplejson as json
import DateTime

from Products.CMFPlomino import PlominoDocument,PlominoForm

from plone import api


def getIolRoles(doc):
    result = dict(
        iol_owner = [],
        iol_reviewer = [],
        iol_manager = [],
    )
    for usr,roles in doc.get_local_roles():
        if 'Owner' in roles:
            result['iol_owner'].append(usr)
        if 'iol-reviewer' in roles:
            result['iol_reviewer'].append(usr)
        if 'iol-manager' in roles:
            result['iol_manager'].append(usr)
    return result

class plominoData(object):
    def __init__(self, id, plominodb, form, owner, url, review_state, review_history,iol_owner,iol_reviewer,iol_manager, data):
        self.id = id
        self.plominoform = form
        self.plominodb = plominodb
        self.owner = owner
        self.review_state = review_state
        self.review_history = review_history
        self.url = url
        self.iol_owner = iol_owner
        self.iol_reviewer = iol_reviewer
        self.iol_manager = iol_manager
        self.data = data
        

def serialDatagridItem(doc, obj ):
    result = list()
    itemvalue = doc.getItem(obj['name'])
    for el in itemvalue:
        i = 0
        res = dict()
        for fld in obj['field_list']:
            res['fld']= el[i]
            i+=1
        result.append(res)
    return result
    
def getPlominoValues(doc):
    results = dict(deepcopy(doc.items))
    try:
    frm = doc.getForm()
    fieldnames = []
    for i in frm.getFormFields(includesubforms=True, doc=None, applyhidewhen=False):
        if i.getFieldType()=='DATAGRID':
            fieldnames.append(dict(field=i,name=i.getId(),form=i.getSettings().associated_form,field_list=i.getSettings().field_mapping.split(',')))
    try:
        for f in fieldnames:
            if f['name'] in results:
                del results[f['name']]
            results[f['name']]=serialDatagridItem(doc,f)
    except:
        results[f['name']]= []
        api.portal.show_message(message='Errore nel campo %s' %f['name'], request=doc.REQUEST)
    return results 

def saveData(doc):
    #getting database configuration
    param_name = 'db_%s' %doc.getParentDatabase().id
    conf = doc.get_properties(params=(param_name, )).values()[0]
    if not 'value' in conf.keys():
        api.portal.show_message(message='Replication not configured', request=doc.REQUEST)
        return -1
    conf = json.loads(conf['value'])
    
    #istantiation of SQLAlquemy object
    try:
        db = sql.create_engine(conf['conn_string'])
        metadata = sql.schema.MetaData(bind=db,reflect=True,schema=conf['db_schema'])
        table = sql.Table(conf['db_table'], metadata, autoload=True)
        orm.clear_mappers() 
        rowmapper = orm.mapper(plominoData,table)
    except Exception as e:
        api.portal.show_message(message=u'Si sono verificati errori nella connessione al database : %s' %str(e), request=doc.REQUEST )
        return -1
    #creating session
    Sess = orm.sessionmaker(bind = db)
    session = Sess()

    
    #getting data from plominoDocument
    try:
        serialData = getPlominoValues(doc)
        d = json.loads(json.dumps(serialData, default=DateTime.DateTime.ISO,use_decimal=True ))
    except Exception as e:
        api.portal.show_message(message='Si sono verificati errori nella serializzazione del documento %s' %str(e), request=doc.REQUEST)
        d = dict()
    
    #initialize object plominoData
    wf = api.portal.get_tool(name='portal_workflow')
    id = doc.getId()
    roles = getIolRoles(doc)
    data = dict(
        id = id,
        plominoform = doc.getForm().getFormName(),
        plominodb = doc.getParentDatabase().id,
        owner = doc.getOwner().getUserName(),
        url = doc.absolute_url(),
        review_state = api.content.get_state(obj=doc),
        review_history = json.loads(json.dumps(wf.getInfoFor(doc,'review_history'), default=DateTime.DateTime.ISO,use_decimal=True )),
        iol_owner = roles['iol_owner'],
        iol_reviewer = roles['iol_reviewer'],
        iol_manager = roles['iol_manager'],
        data = d
    )
    try:    
        row = plominoData(data['id'],data['plominodb'],data['plominoform'],data['owner'],data["url"], data["review_state"], data["review_history"],data['iol_owner'],data['iol_reviewer'],data['iol_manager'],d)
        session = Sess()
        #deleting row from database
        session.query(plominoData).filter_by(id=id).delete()
        session.commit()
        #adding row to database
        session.add(row)
        session.commit()
        session.close()
    except Exception as e:
        api.portal.show_message(message=u'Si sono verificati errore nel salvataggio su database', request=doc.REQUEST )
        return -1
    return 1
    
    
def delData(doc):
    #getting database configuration
    param_name = 'db_%s' %doc.getParentDatabase().id
    conf = doc.get_properties(params=(param_name, )).values()[0]
    if not 'value' in conf.keys():
        api.portal.show_message(message='Replication not configured')
        return -1
    conf = json.loads(conf['value'])
    #istantiation of SQLAlquemy object
    try:
        db = sql.create_engine(conf['conn_string'])
        metadata = sql.schema.MetaData(bind=db,reflect=True,schema=conf['db_schema'])
        table = sql.Table(conf['db_table'], metadata, autoload=True)
        orm.clear_mappers() 
        rowmapper = orm.mapper(plominoData,table)
    except:
        api.portal.show_message(message=u'Si sono verificati errori nella connessione al database', request=doc.REQUEST )
        return -1
    #creating session
    Sess = orm.sessionmaker(bind = db)
    session = Sess()
    #deleting row from database
    docid = doc.getId()
    session.query(plominoData).filter_by(id=docid).delete()
    session.commit()    