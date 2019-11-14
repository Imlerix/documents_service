const DocumentRoute = require('./DocumentRoute');
const DocTypeRoute = require('./DocTypeRoute');

module.exports = [
    {path: '/documents', route: DocumentRoute},
    {path: '/doctypes', route: DocTypeRoute},
]


