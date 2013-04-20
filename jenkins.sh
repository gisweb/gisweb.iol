#!/bin/bash
rm env -rf
if [ "$PLONE_VERSION" == "4.0" ] ; then sed "4 a\    http://good-py.appspot.com/release/plone.app.registry/1.0b2?plone=4.0.9" buildout.cfg > buildout.cfg.new && mv buildout.cfg{.new,}  ; fi
if [ "$PLONE_VERSION" == "4.0" ] ; then cat plone_4.0_4.1_versions.txt >> buildout.cfg ; fi
if [ "$PLONE_VERSION" == "4.1" ] ; then sed "4 a\    http://good-py.appspot.com/release/plone.app.registry/1.0b2?plone=4.1.6" buildout.cfg > buildout.cfg.new && mv buildout.cfg{.new,}  ; fi
if [ "$PLONE_VERSION" == "4.1" ] ; then cat plone_4.0_4.1_versions.txt >> buildout.cfg ; fi
virtualenv -p python2.7 env
pwd
ls
ls bin
cat bin/buildout
env/bin/python bootstrap.py
bin/buildout
bin/test
git checkout buildout.cfg