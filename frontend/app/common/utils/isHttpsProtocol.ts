export default function isHttpsProtocol(): boolean {
  return window.location.protocol === 'https:'
}
