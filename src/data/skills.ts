import type { SkillLayer } from '../types'

/** Ordered bottom (1) to top (7) of the integration stack. */
export const skillLayers: SkillLayer[] = [
  {
    id: 'systems',
    order: 1,
    name: 'SAP Systems',
    blurb: 'The systems of record the integrations connect.',
    items: ['SAP BTP', 'SAP S/4HANA', 'SAP PI/PO', 'SAP Gateway (IWFND)', 'IDoc processing', 'Basic ABAP (SU01, SM59, STRUST)'],
    color: '#7c6cff',
  },
  {
    id: 'integration',
    order: 2,
    name: 'Integration',
    blurb: 'Designing and running iFlows.',
    items: ['SAP Integration Suite', 'SAP Cloud Integration (CPI)', 'iFlow Design', 'Content Modifier', 'Router', 'Splitter / Gather', 'Exception Subprocess', 'Value Mapping', 'Error Handling Frameworks'],
    color: '#38d4f5',
  },
  {
    id: 'transformation',
    order: 3,
    name: 'Transformation',
    blurb: 'Reshaping data between contracts.',
    items: ['Message Mapping', 'XSLT', 'Groovy', 'XML', 'JSON', 'SQL'],
    color: '#4ade80',
  },
  {
    id: 'connectivity',
    order: 4,
    name: 'Connectivity',
    blurb: 'Adapters and protocols.',
    items: ['SOAP', 'REST', 'HTTP', 'OData V2/V4', 'IDoc', 'SFTP', 'JDBC', 'File', 'Mail', 'Cloud Connector', 'VPN / Private API'],
    color: '#ffc857',
  },
  {
    id: 'security',
    order: 5,
    name: 'Security',
    blurb: 'Protecting data in motion.',
    items: ['PGP', 'Keystore', 'Certificates', 'SSL/TLS', 'OAuth', 'Basic Authentication'],
    color: '#fb7185',
  },
  {
    id: 'apim',
    order: 6,
    name: 'API Management',
    blurb: 'Governing how APIs are exposed.',
    items: ['API Proxy', 'Policies', 'Authentication', 'Rate limiting', 'Backend connection'],
    color: '#c084fc',
  },
  {
    id: 'monitoring',
    order: 7,
    name: 'Monitoring',
    blurb: 'Keeping production healthy.',
    items: ['CPI Operations Cockpit', 'SAP BTP Cockpit', 'Production troubleshooting', 'Git / GitHub', 'VS Code'],
    color: '#2dd4bf',
  },
]

export const programming = ['Groovy', 'XSLT', 'XML', 'JSON', 'SQL', 'Python', 'C++', 'OOP', 'Data Structures & Algorithms', 'DBMS']
