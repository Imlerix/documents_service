const DocumentRoute = require('./DocumentRoute');
const DocTypeRoute = require('./DocTypeRoute');
const LogRoute = require('./LogRoute');
const IndexRoute = require('./IndexRoute');

module.exports = [
    {path: '/documents', route: DocumentRoute},
    {path: '/doctypes', route: DocTypeRoute},
    {path: '/logs', route: LogRoute},
    {path: '/', route: IndexRoute},
]
