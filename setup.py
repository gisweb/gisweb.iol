from setuptools import setup, find_packages
import os

version = '1.0'
long_description = (
    open('README.txt').read()
    + '\n' +
    'Contributors\n'
    '============\n'
    + '\n' +
    open('CONTRIBUTORS.txt').read()
    + '\n' +
    open('CHANGES.txt').read()
    + '\n')

setup(name='gisweb.iol',
      version=version,
      description="Templates, scripts and assets to support gisweb iol Plomino application",
      long_description=long_description,
      # Get more strings from
      # http://pypi.python.org/pypi?%3Aaction=list_classifiers
      classifiers=[
        "Environment :: Web Environment",
        "Framework :: Plone",
        "Operating System :: OS Independent",
        "Programming Language :: Python",
        "Programming Language :: Python :: 2.6",
        "Topic :: Software Development :: Libraries :: Python Modules",
        ],
      keywords='',
      author='Roberto Starnini',
      author_email='roberto.starnin@gisweb.it',
      url='http://svn.plone.org/svn/collective/',
      license='gpl',
      packages=find_packages('src'),
      package_dir={'': 'src'},
      namespace_packages=['gisweb', ],
      include_package_data=True,
      zip_safe=False,
      install_requires=[
          'setuptools',
          'gisweb.utils',
          'Products.CMFPlomino',
          'collective.wtf',
          'Products.CMFPlacefulWorkflow',
          'collective.wkpdfview', 
          'zope.app.component',
          # -*- Extra requirements: -*-
          'dict2xml'
      ],
      extras_require={
        'test': [
            'plone.app.testing[robot]>=4.2.2',
            'plone.app.robotframework',
            'robotframework-selenium2library>=1.2.0',
        ]
      },
      entry_points="""
      # -*- Entry points: -*-
      [z3c.autoinclude.plugin]
      target = plone
      """,
      )
