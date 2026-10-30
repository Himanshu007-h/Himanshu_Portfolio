import type { Architecture, ArchNode } from '../types'

const INFO = {
  s4: 'SAP S/4HANA is the system of record. It exposes data and business events through OData services, IDocs and APIs that the integration layer consumes or feeds.',
  cpi: 'SAP Cloud Integration acts as the middleware layer responsible for routing, transformation, authentication and orchestration.',
  sftp: 'Secure file transfer endpoint used for encrypted payment file transmission.',
  pgp: 'PGP encryption is applied inside the iFlow so the payment file is encrypted before it leaves the integration platform.',
  bank: 'The bank-side SFTP endpoint that receives the encrypted payment file for processing.',
  rest: 'An external REST/JSON API owned by a third party. CPI authenticates against it and consumes or pushes JSON payloads.',
  map: 'Mapping and transformation (Message Mapping, XSLT or Groovy) converts the source structure to the target contract.',
  odata: 'OData service on S/4HANA used to read or create business data through SAP Gateway.',
  cap: 'SAP CAP service layer sitting between CPI and the shipping API, handling order shaping and API specific logic.',
  ship: 'External shipping / courier API that creates orders and later calls back through a webhook with tracking updates.',
  cc: 'SAP Cloud Connector is the secure tunnel between BTP and the private network. Connections are outbound from the internal side, so internal APIs are never exposed directly to the internet.',
  priv: 'The private network segment (VPN / on-premise) where the internal API lives, unreachable from the public internet.',
  intapi: 'The internal API that is only reachable from the private network.',
  client: 'Any API consumer: a web app, mobile app or partner system calling the API.',
  apim: 'SAP API Management is the gateway in front of backends: authentication, policies, rate limiting, analytics and a stable public contract.',
  proxy: 'The API proxy defines the public endpoint and attaches policies. It decouples consumers from the backend implementation.',
  backend: 'The backend API (SAP or non-SAP) that actually serves the request.',
}

const n = (
  id: string,
  label: string,
  kind: ArchNode['kind'],
  x: number,
  y: number,
  info: string,
): ArchNode => ({ id, label, kind, x, y, info })

export const archBankPayment: Architecture = {
  id: 'bank-payment',
  title: 'S/4HANA → CPI → Bank SFTP',
  subtitle: 'Encrypted payment file delivery with sent-flag callback',
  nodes: [
    n('s4', 'SAP S/4HANA', 'system', -0.9, 0, INFO.s4),
    n('cpi', 'SAP CPI', 'middleware', -0.3, 0, INFO.cpi),
    n('pgp', 'PGP Encrypt', 'security', 0.25, 0, INFO.pgp),
    n('sftp', 'SFTP', 'file', 0.65, 0, INFO.sftp),
    n('bank', 'Bank', 'system', 1.0, 0, INFO.bank),
  ],
  edges: [
    { from: 's4', to: 'cpi', label: 'payment data' },
    { from: 'cpi', to: 'pgp' },
    { from: 'pgp', to: 'sftp' },
    { from: 'sftp', to: 'bank' },
  ],
}

export const archContractBooking: Architecture = {
  id: 'contract-booking',
  title: 'Third Party API → CPI → S/4HANA',
  subtitle: 'REST/JSON in, OData out',
  nodes: [
    n('api', 'Third Party REST API', 'api', -0.95, 0, INFO.rest),
    n('cpi', 'SAP CPI', 'middleware', -0.3, 0, INFO.cpi),
    n('map', 'Mapping', 'transform', 0.25, 0, INFO.map),
    n('odata', 'S/4HANA OData', 'system', 0.7, 0, INFO.odata),
    n('cb', 'Contract Booking', 'system', 1.05, 0, 'The resulting contract booking document created in SAP S/4HANA.'),
  ],
  edges: [
    { from: 'api', to: 'cpi', label: 'JSON' },
    { from: 'cpi', to: 'map' },
    { from: 'map', to: 'odata' },
    { from: 'odata', to: 'cb' },
  ],
}

export const archShipping: Architecture = {
  id: 'shipping',
  title: 'S/4HANA → CPI → CAP → Shipping API',
  subtitle: 'Order creation with webhook shipment tracking',
  nodes: [
    n('s4', 'SAP S/4HANA', 'system', -0.95, -0.35, INFO.s4),
    n('cpi', 'SAP CPI', 'middleware', -0.35, -0.35, INFO.cpi),
    n('cap', 'SAP CAP', 'cloud', 0.25, -0.35, INFO.cap),
    n('ship', 'Shipping API', 'api', 0.85, -0.35, INFO.ship),
    n('hook', 'Webhook', 'api', 0.85, 0.5, 'The shipping platform calls a CPI endpoint whenever shipment status changes.'),
    n('cpi2', 'SAP CPI', 'middleware', 0.0, 0.5, INFO.cpi),
    n('s42', 'SAP S/4HANA', 'system', -0.95, 0.5, INFO.s4),
  ],
  edges: [
    { from: 's4', to: 'cpi', label: 'order' },
    { from: 'cpi', to: 'cap' },
    { from: 'cap', to: 'ship' },
    { from: 'ship', to: 'hook', label: 'status' },
    { from: 'hook', to: 'cpi2' },
    { from: 'cpi2', to: 's42', label: 'tracking' },
  ],
}

export const archODataBC: Architecture = {
  id: 'odata-bc',
  title: 'S/4HANA → CPI → Business Central',
  subtitle: 'Dynamic plant-based OData V2 filtering',
  nodes: [
    n('s4', 'SAP S/4HANA', 'system', -0.95, 0, INFO.s4),
    n('odata', 'Custom OData V2', 'system', -0.4, 0, INFO.odata),
    n('cpi', 'SAP CPI', 'middleware', 0.1, 0, INFO.cpi),
    n('groovy', 'Groovy Dynamic Filter', 'transform', 0.55, 0, 'A Groovy script builds the OData query at runtime so the plant (Werks) filter is applied dynamically per request.'),
    n('bc', 'Business Central', 'system', 1.0, 0, 'Microsoft Business Central, the target system receiving the filtered material data.'),
  ],
  edges: [
    { from: 's4', to: 'odata' },
    { from: 'odata', to: 'cpi', label: 'GET' },
    { from: 'cpi', to: 'groovy' },
    { from: 'groovy', to: 'bc' },
  ],
}

export const archCloudConnector: Architecture = {
  id: 'cloud-connector',
  title: 'CPI → Cloud Connector → Private API',
  subtitle: 'Reaching an internal API without exposing it',
  nodes: [
    n('cpi', 'SAP CPI', 'middleware', -0.95, 0, INFO.cpi),
    n('cc', 'Cloud Connector', 'network', -0.3, 0, INFO.cc),
    n('priv', 'Private Network', 'network', 0.3, 0, INFO.priv),
    n('api', 'Internal API', 'api', 0.9, 0, INFO.intapi),
  ],
  edges: [
    { from: 'cpi', to: 'cc', label: 'secure tunnel' },
    { from: 'cc', to: 'priv' },
    { from: 'priv', to: 'api' },
  ],
}

export const archAPIM: Architecture = {
  id: 'apim',
  title: 'Client → API Management → Backend',
  subtitle: 'Policies, authentication, rate limiting, monitoring',
  nodes: [
    n('client', 'Client', 'api', -0.95, 0, INFO.client),
    n('apim', 'API Management', 'cloud', -0.35, 0, INFO.apim),
    n('proxy', 'API Proxy', 'transform', 0.25, 0, INFO.proxy),
    n('backend', 'Backend API', 'system', 0.85, 0, INFO.backend),
    n('mon', 'Monitoring', 'security', -0.35, 0.65, 'API analytics and monitoring show traffic, errors and latency per proxy.'),
    n('pol', 'Policies', 'security', 0.25, -0.65, 'Policies enforce authentication (OAuth / Basic), rate limiting (Spike Arrest / Quota) and payload handling before a request reaches the backend.'),
  ],
  edges: [
    { from: 'client', to: 'apim', label: 'request' },
    { from: 'apim', to: 'proxy' },
    { from: 'proxy', to: 'backend' },
    { from: 'apim', to: 'mon' },
    { from: 'proxy', to: 'pol' },
  ],
}

export const labArchitectures: Architecture[] = [
  archBankPayment,
  archContractBooking,
  archShipping,
  archCloudConnector,
  archAPIM,
]
