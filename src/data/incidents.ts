import type { Incident } from '../types'

export const incidents: Incident[] = [
  {
    code: '401',
    title: 'Unauthorized',
    causes: ['Invalid credentials', 'Expired token', 'Missing authorization', 'Incorrect authentication configuration'],
    resolution:
      'Validate authentication configuration, credentials / token and backend authorization.',
  },
  {
    code: '403',
    title: 'Forbidden',
    causes: ['User authenticated but lacks the required role or scope', 'Firewall or web filter blocking the call', 'Backend policy rejecting the caller'],
    resolution:
      'Check roles and scopes on the backend, then confirm whether a firewall, proxy or policy is rejecting the request before it reaches the application.',
  },
  {
    code: 'SSL',
    title: 'Certificate Issues',
    causes: ['Missing root or intermediate certificate in the keystore', 'Expired certificate', 'Hostname mismatch', 'Wrong certificate type for the use case'],
    resolution:
      'Inspect the certificate chain, import the missing certificates into the CPI keystore (or STRUST in SAP), and verify validity and hostname.',
  },
  {
    code: 'TLS',
    title: 'Handshake Failures',
    causes: ['Protocol or cipher mismatch', 'Client certificate not accepted by the server', 'Intermediary terminating or altering the connection'],
    resolution:
      'Compare supported protocols and ciphers on both ends, confirm the client certificate is trusted by the receiver, and test the path without intermediaries.',
  },
  {
    code: 'OData',
    title: 'OData Errors',
    causes: ['Invalid filter or query option', 'Service not activated in the Gateway (IWFND)', 'Missing authorization on the entity set', 'Payload not matching the service metadata'],
    resolution:
      'Check the service in IWFND, review the error log in the Gateway, validate the query against $metadata and re-test with a minimal request.',
  },
  {
    code: 'IDoc',
    title: 'IDoc Errors',
    causes: ['Partner profile or port missing', 'Mapping produced invalid segment data', 'Application error during posting', 'RFC destination (SM59) failing'],
    resolution:
      'Review IDoc status and error messages in SAP, check the partner profile and the SM59 destination, then fix the data or configuration and reprocess.',
  },
  {
    code: 'CC',
    title: 'Cloud Connector Connectivity',
    causes: ['Tunnel to the subaccount is down', 'Virtual host or resource not exposed', 'Internal host blocked by network or web filtering', 'Location ID mismatch'],
    resolution:
      'Verify the Cloud Connector subaccount connection, the access control entries and the location ID, then test reachability from the Cloud Connector host to the internal API.',
  },
  {
    code: 'SFTP',
    title: 'SFTP Issues',
    causes: ['Host key not trusted', 'Authentication failure (user, password or key)', 'Wrong directory or file permission', 'Network or firewall restriction'],
    resolution:
      'Confirm host key and credentials, check directory permissions and path, and verify connectivity from the CPI tenant to the SFTP host.',
  },
  {
    code: 'API',
    title: 'API Failures',
    causes: ['Backend returning 5xx or timing out', 'Payload or header rejected by the receiver', 'Rate limiting or quota applied by the gateway', 'Endpoint or version changed'],
    resolution:
      'Read the message processing log, replay the payload against the endpoint, check gateway policies and compare with the receiver API documentation.',
  },
  {
    code: 'AUTH',
    title: 'Authentication Failures',
    causes: ['Wrong authentication type selected in the adapter', 'Credential alias missing or outdated in security material', 'OAuth client or scope misconfigured', 'Certificate-based login not mapped to a user'],
    resolution:
      'Match the adapter authentication type to what the receiver expects, verify the credential alias and OAuth client settings, and confirm the user mapping.',
  },
]
