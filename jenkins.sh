#!/bin/bash
rm env -rf
if [ "$PLONE_VERSION" == "4.0" ] ; then sed "4 a\    http://good-py.appspot.com/release/plone.app.registry/1.0b2?plone=4.0.9" buildout.cfg > buildout.cfg.new && mv buildout.cfg{.new,}  ; fi
if [ "$PLONE_VERSION" == "4.0" ] ; then cat plone_4.0_4.1_versions.txt >> buildout.cfg ; fi
if [ "$PLONE_VERSION" == "4.1" ] ; then sed "4 a\    http://good-py.appspot.com/release/plone.app.registry/1.0b2?plone=4.1.6" buildout.cfg > buildout.cfg.new && mv buildout.cfg{.new,}  ; fi
if [ "$PLONE_VERSION" == "4.1" ] ; then cat plone_4.0_4.1_versions.txt >> buildout.cfg ; fi
if [ "$BOOTSTRAP_TEMPLATE" == "BOOTSTRAP" ] ; then cat bootstrap_versions.txt >> buildout.cfg ; fi

virtualenv -p python2.7 env --no-site-packages
env/bin/python bootstrap.py
# For reasons unclear to me in a jenkins multiple axis project
# the shebangs of those files don' work; It's probably related to their lengths
# Explicitly naming the python interpreter is a workaround
# that will make the buildout and tests run
env/bin/python bin/develop up -f
env/bin/python bin/buildout install test
bash -c "sleep 60 && recordmydesktop --no-cursor --no-sound --output=session.ogv & echo -n \$! > recordmydesktop_pid"
env/bin/python bin/test
kill `cat recordmydesktop_pid`
while ls /proc/`cat recordmydesktop_pid` > /dev/null ; do sleep 1; done
git checkout buildout.cfg
