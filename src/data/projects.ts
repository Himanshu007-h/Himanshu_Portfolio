import type { Architecture, Project } from '../types'
import {
  archAPIM,
  archBankPayment,
  archCloudConnector,
  archContractBooking,
  archODataBC,
  archShipping,
} from './architectures'

const archMigration: Architecture = {
  id: 'migration',
  title: 'SAP PI/PO → SAP BTP CPI',
  subtitle: 'Scenario-by-scenario migration with parallel validation',
  nodes: [
    { id: 'src', label: 'Source Systems', kind: 'system', x: -0.95, y: 0, info: 'Existing SAP and non-SAP systems that exchange messages through IDoc, SOAP and REST.' },
    { id: 'pipo', label: 'SAP PI/PO', kind: 'middleware', x: -0.35, y: -0.5, info: 'The legacy on-premise middleware being retired, scenario by scenario.' },
    { id: 'cpi', label: 'SAP BTP CPI', kind: 'cloud', x: -0.35, y: 0.5, info: 'SAP Cloud Integration on BTP, the migration target. Scenarios are rebuilt as iFlows.' },
    { id: 'map', label: 'Mapping / Groovy', kind: 'transform', x: 0.25, y: 0.5, info: 'Message Mapping, XSLT and Groovy replace the PI/PO mappings and adapter modules.' },
    { id: 'tgt', label: 'Target Systems', kind: 'system', x: 0.95, y: 0, info: 'Receiving systems, cut over without downtime after UAT and hypercare.' },
  ],
  edges: [
    { from: 'src', to: 'pipo', label: 'before' },
    { from: 'src', to: 'cpi', label: 'after' },
    { from: 'cpi', to: 'map' },
    { from: 'map', to: 'tgt' },
    { from: 'pipo', to: 'tgt' },
  ],
}

const archWhatsApp: Architecture = {
  id: 'whatsapp',
  title: 'SAP → CPI → Meta Graph API → WhatsApp',
  subtitle: 'Invoice PDF delivered to the customer',
  nodes: [
    { id: 'sap', label: 'SAP System', kind: 'system', x: -1.0, y: 0, info: 'SAP produces the invoice and triggers the integration.' },
    { id: 'cpi', label: 'SAP CPI', kind: 'middleware', x: -0.55, y: 0, info: 'SAP Cloud Integration acts as the middleware layer responsible for routing, transformation, authentication and orchestration.' },
    { id: 'pdf', label: 'Invoice PDF', kind: 'file', x: -0.1, y: 0, info: 'The invoice document that is attached to the outbound WhatsApp message.' },
    { id: 'meta', label: 'Meta Graph API', kind: 'api', x: 0.35, y: 0, info: 'Meta Graph API (WhatsApp Business) receives the document and message request from CPI.' },
    { id: 'wa', label: 'WhatsApp', kind: 'cloud', x: 0.72, y: 0, info: 'WhatsApp delivers the message to the end customer.' },
    { id: 'cust', label: 'Customer', kind: 'system', x: 1.05, y: 0, info: 'The customer who receives the invoice on their phone.' },
  ],
  edges: [
    { from: 'sap', to: 'cpi' },
    { from: 'cpi', to: 'pdf' },
    { from: 'pdf', to: 'meta' },
    { from: 'meta', to: 'wa' },
    { from: 'wa', to: 'cust' },
  ],
}

export const projects: Project[] = [
  {
    slug: 'pi-po-to-cpi-migration',
    index: '01',
    title: 'SAP PI/PO → SAP BTP CPI Migration',
    tagline: 'Enterprise integration migration',
    summary:
      'Migrated 20+ integration scenarios from SAP PI/PO to SAP BTP Cloud Integration for enterprise automotive and financial-services clients.',
    tech: ['SAP PI/PO', 'SAP BTP', 'SAP CPI', 'IDoc', 'SOAP', 'REST', 'Groovy', 'XSLT', 'Message Mapping'],
    architecture: archMigration,
    details: {
      problem:
        'Business-critical interfaces ran on SAP PI/PO and had to move to SAP BTP Cloud Integration without interrupting live business processes.',
      flow: [
        'Analyse each PI/PO scenario: sender, receiver, mapping, adapters and error handling',
        'Rebuild the scenario as a CPI iFlow with equivalent behaviour',
        'Validate against PI/PO output with structured test cases',
        'Support UAT, then cut over scenario by scenario',
        'Monitor through hypercare in CPI Operations Cockpit',
      ],
      security:
        'Authentication and certificates are re-established on the CPI tenant (keystore, Basic/OAuth, certificate-based) and verified per receiver before cutover.',
      transformation:
        'PI/PO mappings are rebuilt using Message Mapping, XSLT and Groovy, with IDoc, SOAP and REST adapters on the CPI side.',
      errorHandling:
        'Exception subprocesses and monitoring replace PI/PO error handling so failures stay visible and recoverable during hypercare.',
      impact:
        'Zero-downtime cutover through structured testing, UAT support and hypercare monitoring.',
    },
  },
  {
    slug: 'bank-payment-neft-rtgs',
    index: '02',
    title: 'Bank Payment Integration — NEFT / RTGS',
    tagline: 'SAP S/4HANA → Bank payment integration',
    summary:
      'Payment files generated from SAP S/4HANA, encrypted with PGP in CPI and delivered to the bank over SFTP, with a sent-flag callback to SAP.',
    tech: ['SAP S/4HANA', 'SAP CPI', 'PGP', 'SFTP', 'Groovy', 'Keystore'],
    architecture: archBankPayment,
    features: [
      'Payment file generation',
      'Dynamic file naming',
      'PGP encryption',
      'SFTP transmission',
      'Sent-flag callback',
      'End-to-end payment status reconciliation',
      'Error handling',
      'Monitoring',
    ],
    details: {
      problem:
        'Outgoing NEFT / RTGS payments had to reach the bank as encrypted files in the bank-mandated format, and SAP needed to know which payments were actually sent.',
      flow: [
        'S/4HANA sends payment data to CPI',
        'CPI builds the payment file and applies dynamic file naming',
        'File is PGP-encrypted',
        'File is delivered to the bank over SFTP',
        'A sent-flag callback updates SAP so payment status can be reconciled end to end',
      ],
      security:
        'PGP encryption of the payload and SFTP transport, with keys and credentials managed in the CPI keystore and security material.',
      transformation:
        'Payment data is transformed into the bank file layout, with the file name generated dynamically at runtime.',
      errorHandling:
        'Exception handling on encryption and transfer failures, and monitoring in CPI Operations Cockpit. The sent flag is only set after a successful transmission.',
      impact:
        'Automated, secure payment file delivery with a clear sent / not-sent status in SAP for reconciliation.',
    },
  },
  {
    slug: 'contract-booking',
    index: '03',
    title: 'Contract Booking Integration',
    tagline: 'Third party API → SAP S/4HANA',
    summary:
      'A third-party REST API feeds contract data through CPI, where it is mapped and posted to S/4HANA via OData to create the contract booking.',
    tech: ['REST', 'JSON', 'SAP CPI', 'Message Mapping', 'Groovy', 'OData', 'SAP S/4HANA'],
    architecture: archContractBooking,
    details: {
      problem:
        'Contract data originating in an external platform had to be booked in SAP S/4HANA without manual re-entry.',
      flow: [
        'Third-party REST API provides contract data as JSON',
        'CPI receives and validates the payload',
        'Mapping and Groovy transform it to the S/4HANA OData structure',
        'CPI calls the S/4HANA OData service',
        'The contract booking is created in S/4HANA',
      ],
      security:
        'Authentication towards the external API and towards S/4HANA is configured in CPI (credentials / OAuth as required by each side).',
      transformation:
        'JSON to OData payload mapping using Message Mapping, with Groovy for logic that does not fit declarative mapping.',
      errorHandling:
        'Errors from S/4HANA OData are captured and surfaced for monitoring and reprocessing instead of being silently dropped.',
      impact:
        'Contracts flow from the external platform into SAP automatically, removing manual booking effort.',
    },
  },
  {
    slug: 'logistics-shipping',
    index: '04',
    title: 'Order Creation + Webhook Shipment Tracking',
    tagline: 'Logistics shipping integration',
    summary:
      'S/4HANA orders are sent through CPI and SAP CAP to a shipping API, and shipment updates return through a webhook into CPI and S/4HANA.',
    tech: ['SAP S/4HANA', 'SAP CPI', 'SAP CAP', 'REST', 'Webhook', 'JSON'],
    architecture: archShipping,
    details: {
      problem:
        'Shipping orders had to be created in an external logistics platform from S/4HANA, and shipment status had to flow back into SAP without polling.',
      flow: [
        'S/4HANA sends the order to CPI',
        'CPI forwards to a SAP CAP service which shapes the request',
        'CAP calls the Shipping API to create the order',
        'The shipping platform later calls a webhook endpoint exposed through CPI',
        'CPI updates S/4HANA with the tracking information',
      ],
      security:
        'Authentication on the outbound shipping API and on the inbound webhook endpoint, handled in CPI and CAP.',
      transformation:
        'S/4HANA order structure to shipping API JSON on the outbound path, and webhook JSON to the S/4HANA update structure on the return path.',
      errorHandling:
        'Failures on order creation and on inbound webhook processing are caught in CPI and visible in monitoring.',
      impact:
        'Two-way integration: orders go out automatically and tracking comes back event-driven.',
    },
  },
  {
    slug: 'whatsapp-invoice',
    index: '05',
    title: 'Automated Invoice Delivery — Meta Graph API',
    tagline: 'Invoice delivery on WhatsApp',
    summary:
      'Invoices from SAP are converted to PDF in CPI and sent to customers on WhatsApp through the Meta Graph API.',
    tech: ['SAP CPI', 'Meta Graph API', 'REST', 'PDF', 'OAuth / Token', 'Groovy'],
    architecture: archWhatsApp,
    details: {
      problem:
        'Customers needed to receive invoices on the channel they actually use, without staff sending documents manually.',
      flow: [
        'SAP triggers the invoice delivery',
        'CPI prepares the invoice PDF',
        'CPI calls the Meta Graph API to send the document',
        'WhatsApp delivers the invoice to the customer',
      ],
      security:
        'Access token based authentication to the Meta Graph API, stored as secure parameters in CPI.',
      transformation:
        'Invoice data and PDF content are shaped into the Graph API message and media request format.',
      errorHandling:
        'API failures are caught in the iFlow and visible in monitoring for retry.',
      impact:
        'Invoices are delivered automatically to customers on WhatsApp.',
    },
  },
  {
    slug: 'dynamic-odata-bc',
    index: '06',
    title: 'SAP S/4HANA → Microsoft Business Central',
    tagline: 'Dynamic OData integration',
    summary:
      'A GET integration over a custom OData V2 service with a Groovy-built dynamic plant filter, delivering material data to Business Central.',
    tech: ['OData V2', 'Groovy', 'SAP CPI', 'SAP S/4HANA', 'Microsoft Business Central'],
    architecture: archODataBC,
    details: {
      problem:
        'Different consumers needed material data for different plants, and a fixed query could not serve them.',
      flow: [
        'CPI receives the request including the plant value',
        'A Groovy script builds the OData query filter dynamically (plant-based)',
        'CPI performs a GET on the custom OData V2 service in S/4HANA',
        'Result is passed to Microsoft Business Central',
      ],
      security:
        'Authentication to S/4HANA Gateway and to Business Central handled in CPI.',
      transformation:
        'Groovy sets the OData query at runtime, and the response is mapped to the Business Central structure.',
      errorHandling:
        'OData and connectivity errors are captured and logged for monitoring.',
      impact:
        'One reusable iFlow serves multiple plants through dynamic filtering instead of one iFlow per plant.',
    },
  },
  {
    slug: 'cloud-connector-private-api',
    index: '07',
    title: 'Cloud Connector + Private API Integration',
    tagline: 'Private API connectivity',
    summary:
      'CPI reaches an internal API through SAP Cloud Connector, so the API never has to be opened to the public internet.',
    tech: ['SAP CPI', 'SAP Cloud Connector', 'VPN / Private Network', 'HTTP', 'SSL/TLS'],
    architecture: archCloudConnector,
    details: {
      problem:
        'An internal API lived inside a private network and could not be called from the cloud without exposing it.',
      flow: [
        'CPI sends the request towards a virtual host',
        'Cloud Connector, installed inside the network, receives it through its outbound tunnel',
        'The request is forwarded to the internal API',
        'The response returns along the same path',
      ],
      security:
        'The tunnel is initiated from inside the network, so no inbound firewall ports are opened and the API is not publicly reachable. Access is limited to explicitly exposed hosts and resources.',
      transformation:
        'Payload handling stays in CPI. Cloud Connector only provides connectivity.',
      errorHandling:
        'Typical failures such as tunnel down, virtual host mapping, SSL and network filtering are checked on both the Cloud Connector and CPI sides.',
      impact:
        'Internal systems become integrable without weakening the network perimeter.',
    },
  },
  {
    slug: 'api-management',
    index: '08',
    title: 'Enterprise API Management',
    tagline: 'SAP API Management',
    summary:
      'API proxies in front of backend services, with authentication, policies, rate limiting and monitoring.',
    tech: ['SAP API Management', 'API Proxy', 'Policies', 'OAuth', 'Rate Limiting', 'Monitoring'],
    architecture: archAPIM,
    details: {
      problem:
        'Backend APIs needed a controlled, secure and observable public entry point instead of direct access.',
      flow: [
        'Client calls the API proxy endpoint',
        'API Management applies authentication and policies',
        'Rate limiting protects the backend',
        'Request is forwarded to the backend API',
        'Traffic is observed through monitoring and analytics',
      ],
      security:
        'Authentication and traffic policies are enforced at the gateway so the backend is shielded from unauthenticated or excessive traffic.',
      transformation:
        'Policies can adjust headers, payloads and routing between the proxy and the backend.',
      errorHandling:
        'Fault handling policies return controlled error responses, and monitoring shows failing proxies.',
      impact:
        'A consistent, secure and monitored API layer across backend services.',
    },
  },
]

export const getProject = (slug: string) => projects.find((p) => p.slug === slug)
