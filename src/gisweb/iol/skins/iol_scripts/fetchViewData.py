## Script (Python) "fetchViewData"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=id=None, as_json=True, as_dict=False, only_allowed=True, start=1, limit=-1
##title=
##
"""
id: a PlominoDocument id or a list of PlominoDocument ids
    in case of this script is used as an ajax callback you can pass more then one id value
    repeating the key "id"

this method is a patched version of:
https://github.com/silviot/Plomino/blob/2043b6e94503a1eda6831e11f7b3875c0890581b/Products/CMFPlomino/PlominoView.py#L660
"""

from Products.CMFPlomino.PlominoUtils import json_dumps
from gisweb.utils import fetchViewDocuments

from Products.CMFPlomino.PlominoUtils import asUnicode, asList

def main():

    data = []
    categorized = context.getCategorized()
    search = None
    sort_index = None

    start = int(context.REQUEST.get('iDisplayStart', 1))
    iDisplayLength = context.REQUEST.get('iDisplayLength', None)
    if iDisplayLength:
        limit = int(iDisplayLength)
    else:
        limit = -1
    search = search or context.REQUEST.get('sSearch', '').lower()
    if search:
        search = ' '.join([term+'*' for term in search.split(' ')])
    sort_column = context.REQUEST.get('iSortCol_0')
    if sort_column:
        sort_index = context.getIndexKey(
                context.getColumns()[int(sort_column)-1].id)
    reverse = context.REQUEST.get('sSortDir_0', None)
    if reverse == 'desc':
        reverse = 0
    if reverse == 'asc':
        reverse = 1

    if limit < 1:
        limit = None

    if id != None:
        query = dict(id=id)
    else:
        query = dict()
    results = fetchViewDocuments(context,
        start=start,
        limit=limit,
        only_allowed=only_allowed,
        getObject=False,
        fulltext_query=search,
        sortindex=sort_index,
        reverse=reverse,
        **query)

    total = display_total = len(results)
    columnids = [col.id for col in context.getColumns()
            if not getattr(col, 'HiddenColumn', False)]
    for b in results:
        row = [b.getPath()] # [b.getPath().split('/')[-1]]
        for colid in columnids:
            v = getattr(b, context.getIndexKey(colid), '')
            if isinstance(v, basestring):
                v = asUnicode(v).encode('utf-8').replace('\r', '')
            else:
                v = [asUnicode(e).encode('utf-8').replace('\r', '') for e in v]
            row.append(v or '&nbsp;')
        if categorized:
            for cat in asList(row[1]):
                entry = [c for c in row]
                entry[1] = cat
                data.append(entry)
        else:
            data.append(row)

    if as_dict:
        data = map(lambda row: dict(zip(['url']+columnids, row)), data)

    if as_json:
        context.REQUEST.RESPONSE.setHeader("Content-type", "application/json")
        return json_dumps(
            {'iTotalRecords': total,
            'iTotalDisplayRecords': display_total,
            'aaData': data })
    else:
        return data

return main()
