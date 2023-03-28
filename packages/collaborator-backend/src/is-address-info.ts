import type { WebSocket, AddressInfo } from "ws";

/**Type Guard */

export function isAddressInfo(property: AddressInfo | null | string): property is AddressInfo {
  return !!property;
}
