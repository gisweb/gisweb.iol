## Script (Python) "getRndDoc"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=process_attachments=True, redirect=False, remove_on_fails=True
##title=Create just one PlominoDocument filled with random values according to context form
##

assert context.portal_type in ('PlominoForm', 'PlominoDocument', ), 'PlominoForm or PlominoDocument expected, got %s instead' % context.portal_type

assert 'Manager' in context.getRoles(), 'Ehi! Only Managers can do it!'

if 'remove_on_fails' in context.REQUEST.form:
    remove_on_fails = int(remove_on_fails)
if 'redirect' in context.REQUEST.form:
    redirect = int(redirect)

from gisweb.utils import rndgenerate, batch_saveDocument, namegenerate, dategenerate, boolgenerate
from gisweb.utils import numbergenerate, urllib_quote_plus, da_du_ma, cf_build, rndselection, rndCodFisco
from gisweb.utils import printToPdf, is_valid_piva, geocode, latlongenerate
from gisweb.utils import json_dumps
db = context.getParentDatabase()

# if context is a PlominoDocument we use its form
if context.portal_type == 'PlominoDocument':
    form = context.getForm()
else:
    form = context

doc = db.createDocument()

#context.REQUEST.set('Form', form.getFormName())
doc.setItem('Form', form.getFormName())

containsany = lambda string, *subs: any([r>0 for r in map(string.count, subs)])

def getRndValue(field):
    """
    TODO: "DATAGRID", "DOCLINK"
    """

    fieldname = field.getId()
    fieldtype = field.getFieldType()
    value = None

    #if fieldtype == 'DATAGRID':
        #frmname = field.getSettings().associated_form
        #nfrm = db.getForm(frmname)
        #value = []
        #for cname in field.getSettings().getColumnLabels():
            #fld = nfrm.getFormField(cname)
            
        
        #value = []
    
    if containsany(fieldtype, "DATE", "DATETIME"):
        fr = field.getSettings('format') or db.getDateTimeFormat()
        value = dategenerate(s=-14000, e=90, format=fr, type=fieldtype)
        #req[fieldname] = value

    elif fieldtype == "NUMBER":
        value = numbergenerate(type=field.getSettings('type'))
        #req[fieldname] = value

    elif fieldtype == "BOOLEAN":
        value = boolgenerate()
        #req[fieldname] = value

    elif process_attachments and fieldtype == "ATTACHMENT":
        # allego la conversione in pdf del form vuoto
        html_content = form.applyHideWhen(silent_error=False)
        pdf = printToPdf(html=html_content, content=False)
        # piccolo trucco perché non sono riuscito a mettere in request un oggetto
        # FileUpload-like (https://github.com/silviot/Plomino/blob/github-main/Products/CMFPlomino/PlominoField.py#L192)
        filename, contenttype = doc.setfile(pdf,
            filename='domanda_inviata.pdf' if fieldname=='documenti_pdf' else'%s.pdf' % da_du_ma(4),
            overwrite=False,
            contenttype='application/pdf'
        )
        value = {filename: contenttype}
        #doc.setItem(fieldname, {filename: contenttype})

    elif fieldtype == "SELECTION":
        sel = field.getSettings().getSelectionList(form)
        vals = [i.split('|')[1] for i in sel]
        
        if field.getMandatory() is True:
            vals = filter(lambda x: x, vals)
        if field.getSettings('widget') in ("SELECTION", "RADIO", ) or True:
            value = rndselection(vals)
        else:
            length = len(vals)
            if length > 1:
                rndlen = numbergenerate(lower=1, upper=length)
            else:
                rndlen = 1
            value = rndselection(vals, n=rndlen)
        #req[fieldname] = value

    elif containsany(fieldtype, "TEXT", "NAME"):

        if containsany(fieldname, 'cognome'):
            value = namegenerate('LAST')
        elif containsany(fieldname, 'nome') or fieldtype=="NAME":
            value = namegenerate()
        elif containsany(fieldname, 'email', 'mail', 'pec'):
            value = '%s@example.com' % da_du_ma(4)
        elif containsany(fieldname, '_cf', 'fiscale'):
            surname = namegenerate('LAST')
            name = namegenerate()
            birth = dategenerate(s=-14000, e=0)
            sex = random.choice(('M', 'F', ))
            cod = rndCodFisco()[-1]
            value = cf_build(surname, name, birth.year(), birth.month(), birth.day(), sex, cod)
        elif containsany(fieldname, 'piva'):
            part = numbergenerate(digits=11)
            if part < 0:
                part *= -1
            part = str(part)
            suff = is_valid_piva(part, validate=False)
            value = part[:-1] + suff
        elif containsany(fieldname, 'comune'):
            comune, prov, cap, codfisco = rndCodFisco()
            value = comune
            context.REQUEST.set(fieldname.replace('comune', 'localita'), comune)
            context.REQUEST.set(fieldname.replace('comune', 'provincia'), prov)
            context.REQUEST.set(fieldname.replace('comune', 'cap'), cap)
            context.REQUEST.set(fieldname.replace('comune', 'cod_cat'), codfisco)
            #req[fieldname.replace('comune', 'localita')] = comune
            #req[fieldname.replace('comune', 'provincia')] = prov
            #req[fieldname.replace('comune', 'cap')] = cap
            #req[fieldname.replace('comune', 'cod_cat')] = '40007' # codfisco
        elif containsany(fieldname, 'cap'):
            value = str(numbergenerate(digits=5, negative=False))
        elif containsany(fieldname, 'cittadinanza'):
            value = da_du_ma(4)
        elif containsany(fieldname, 'civico'):
            value = ('%s %s' % (numbergenerate(negative=False, lower=0, upper=100), da_du_ma(2)))[:5]
        elif containsany(fieldname, 'cciaa'):
            value = da_du_ma(6)
        elif containsany(fieldname, 'tel', 'cell', 'fax'):
            prefix = numbergenerate(digits=4, negative=False)
            number = numbergenerate(digits=9, negative=False)
            value = '%s/%s' % (prefix, number, )
        elif containsany(fieldname, 'geometry', 'the_geom'):
            latlon = latlongenerate(tl=(9.85, 44.10), br=(9.80, 44.15))
            value = '%.5f %.5f' % latlon[-1::-1]
            if containsany(fieldname, 'indirizzo_geometry'):
                try:
                    res1 = geocode(latlng='%.5f,%.5f' % value)
                # ConnectionError
                except Exception as err:
                    pass
                else:
                    if res1['status'] == 'OK':
                        #address = res1['results'][0]['formatted_address']
                        address = res1['results'][0]['address_components'][0]['long_name']
                        fn = fieldname.replace('_geometry', '')
                        context.REQUEST.set(fn, address)
                        #req[fieldname.replace('_geometry', '')] = address
        elif containsany(fieldname, 'indirizzo'):
            latlon = latlongenerate(tl=(9.85, 44.10), br=(9.80, 44.15))
            try:
                # first take: I ask google for the nearest address
                res1 = geocode(latlng='%.5f,%.5f' % latlon)
            # ConnectionError
            except Exception as err:
                value = ''
            else:
                if res1['status'] == 'OK':
                    value = res1['results'][0]['address_components'][0]['long_name']
                else:
                    value = ''
            finally:
                # if internet connection not available or response status is not OK
                # I fill it in with random text
                if value == '':
                    z = rndgenerate(length=10, prefix=False)
                    length = int(field.getSettings('size') or -1)
                    value = z[:length].replace('\n', ' ')

        elif containsany(fieldname, 'foglio', 'mappale'):
            value = numbergenerate(digits=2, negative=False)

        else:
            length = int(field.getSettings('size') or -1)
            if field.getSettings('widget') == 'TEXTAREA':
                z = rndgenerate(length=random.randint(10, 100), prefix=False)                
                value = '\n'.join(z.split('\n')[:length])
            elif field.getSettings('widget') == 'TEXT':
                z = rndgenerate(length=10, prefix=False)
                value = z[:length].replace('\n', ' ')
            if len(value)>50:
                value = value[:49]

    return value

# TODO: support for option to fill only a fields subset
for field in form.getFormFields(includesubforms=True):

    fieldname = field.getId()
    fieldtype = field.getFieldType()

    # I arbitrarily mantain values already set up
    if fieldname not in context.REQUEST.keys():
    
        value = getRndValue(field)
        if value != None:
            if fieldtype == "ATTACHMENT":
                doc.setItem(fieldname, value)
            else:
                context.REQUEST.set(fieldname, value)

errors = batch_saveDocument(context, doc, context.REQUEST, creation=True)

if len(errors)>0 and remove_on_fails:
    db.deleteDocuments(ids=[doc.getId()])
    redirect_url = form.absolute_url()
else:
    redirect_url = doc.absolute_url()

if redirect:
    for err in errors:
        msg = "%(date)s %(method)s: %(message)s" % err
        context.addPortalMessage(msg, msg_type='error')
    context.REQUEST.RESPONSE.redirect(redirect_url)

else:
    out = dict(errors=errors, form=form.getFormName())
    if not (remove_on_fails and errors):
        out['id'] = doc.getId()
        out['url'] = doc.absolute_url()
    print json_dumps(out)
    return printed
