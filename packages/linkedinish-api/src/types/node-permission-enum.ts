export const NodePermissionEnum = {
  UNKNOWN: "UNKNOWN",
};

export type NodePermissionEnum =
  (typeof NodePermissionEnum)[keyof typeof NodePermissionEnum];

export const NodeRoleEnum = {
  RECLUSTER_CONTROLLER: "RECLUSTER_CONTROLLER",
  K8S_CONTROLLER: "K8S_CONTROLLER",
  K8S_WORKER: "K8S_WORKER",
};

export type NodeRoleEnum = (typeof NodeRoleEnum)[keyof typeof NodeRoleEnum];

export const NodeStatusEnum = {
  ACTIVE: "ACTIVE",
  ACTIVE_READY: "ACTIVE_READY",
  ACTIVE_NOT_READY: "ACTIVE_NOT_READY",
  ACTIVE_DELETING: "ACTIVE_DELETING",
  BOOTING: "BOOTING",
  INACTIVE: "INACTIVE",
  UNKNOWN: "UNKNOWN",
};

export type NodeStatusEnum =
  (typeof NodeStatusEnum)[keyof typeof NodeStatusEnum];
