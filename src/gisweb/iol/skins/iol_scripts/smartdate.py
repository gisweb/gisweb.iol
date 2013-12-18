## Script (Python) "smartdate"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=date='', dateformat=''
##title=
##
if not date:
    date = DateTime(2013, 3, 29, 8, 54, 3)

if isinstance(date, basestring) and dateformat:
    from Products.CMFPlomino.PlominoUtils import StringToDate
    date = StringToDate(date, format=dateformat)

def smartdate(date):

    now = DateTime()
    delta = now - date

    y,d = divmod(delta, 365)
    w,d = divmod(d, 7)
    m = 0
    if w > 4:
        w = 0
        m = now.month()-date.month()
        d = now.day()-date.day()
        if m<0:
            m = 12-m
        if d<0:
            m -= 1
            d1 = DateTime(date.year(), date.month()+1, 1) - date
            d = d1 + now.day() -1
            if d > 7:
                w,d = divmod(d, 7)


    t = ((int(y), 'years', ), (m, 'month'), (int(w), 'weeks', ), (int(d), 'days', ), )
    t1 = ['%s %s' % e for e in t if e[0]]


    if len(t1)>1:
        return ', '.join(t1) + ' ago.'
    else:
        h = int((d-int(d))*24)
        m = int((d-int(d))*24*60 - h*60)
        s = (d-int(d))*24*60*60 - h*60*60 - m*60
        t = ((int(d), 'days'), (h, 'hours', ), (m, 'minutes', ), (s, 'seconds', ), )
        t1 = ['%s %s' % e for e in t if e[0]]
        return ', '.join(t1) + ' ago.'

return smartdate(date)
