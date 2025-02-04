import * as React from 'react';
import classNames from 'classnames';

import {
  ExclamationCircleIcon,
  InProgressIcon,
  OffIcon,
  PausedIcon,
  SyncAltIcon,
  UnknownIcon,
} from '@patternfly/react-icons';
import { global_danger_color_100 as dangerColor } from '@patternfly/react-tokens/dist/js/global_danger_color_100';

import { faSpin } from './utils';

type IconProps = {
  title: string;
  'data-test-id'?: string;
  className?: string;
};

const RedExclamationCircleIcon: React.FC<IconProps> = ({
  title,
  'data-test-id': dataTestId,
  className,
}): React.ReactElement => (
  <ExclamationCircleIcon
    color={dangerColor.value}
    title={title}
    data-test-id={dataTestId}
    className={className}
  />
);

export enum statuses {
  Stopped = 'Stopped',
  Migrating = 'Migrating',
  Provisioning = 'Provisioning',
  Starting = 'Starting',
  Running = 'Running',
  Paused = 'Paused',
  Stopping = 'Stopping',
  Terminating = 'Terminating',
  Unknown = 'Unknown',
  CrashLoopBackOff = 'CrashLoopBackOff',
  FailedUnschedulable = 'FailedUnschedulable',
  ErrorUnschedulable = 'ErrorUnschedulable',
  ErrImagePull = 'ErrImagePull',
  ImagePullBackOff = 'ImagePullBackOff',
  ErrorPvcNotFound = 'ErrorPvcNotFound',
  ErrorDataVolumeNotFound = 'ErrorDataVolumeNotFound',
  DataVolumeError = 'DataVolumeError',
  WaitingForVolumeBinding = 'WaitingForVolumeBinding',
}

const statusToIconHandler = {
  get: (mapper: Record<statuses, React.ComponentClass | React.FC<IconProps>>, status: statuses) => {
    const statusIcon = mapper[status];
    if (statusIcon) return statusIcon;

    return UnknownIcon;
  },
};

export const statusToIcon = new Proxy(
  {
    [statuses.Stopped]: OffIcon,
    [statuses.Migrating]: InProgressIcon,
    [statuses.Provisioning]: InProgressIcon,
    [statuses.Starting]: InProgressIcon,
    [statuses.Running]: SyncAltIcon,
    [statuses.Paused]: PausedIcon,
    [statuses.Stopping]: InProgressIcon,
    [statuses.Terminating]: InProgressIcon,
    [statuses.WaitingForVolumeBinding]: InProgressIcon,
    [statuses.ErrImagePull]: RedExclamationCircleIcon,
    [statuses.CrashLoopBackOff]: RedExclamationCircleIcon,
    [statuses.FailedUnschedulable]: RedExclamationCircleIcon,
    [statuses.ErrorUnschedulable]: RedExclamationCircleIcon,
    [statuses.ImagePullBackOff]: RedExclamationCircleIcon,
    [statuses.ErrorPvcNotFound]: RedExclamationCircleIcon,
    [statuses.ErrorDataVolumeNotFound]: RedExclamationCircleIcon,
    [statuses.DataVolumeError]: RedExclamationCircleIcon,
    [statuses.Unknown]: UnknownIcon,
  },
  statusToIconHandler,
);

export enum customStatusLabels {
  Starting = 'Starting',
  Error = 'Error',
  Other = 'Other',
  Deleting = 'Deleting',
}

const statusLabelHandler = {
  get: (mapper: Record<string, string>, status: string) => {
    const statusLabel = mapper[status];
    if (statusLabel) return statusLabel;

    return customStatusLabels.Other;
  },
};

export const statusToLabel = new Proxy(
  {
    ...statuses,
    [statuses.Terminating]: customStatusLabels.Deleting,
    [statuses.Provisioning]: customStatusLabels.Starting,
    [statuses.WaitingForVolumeBinding]: customStatusLabels.Starting,
    [statuses.ErrImagePull]: customStatusLabels.Error,
    [statuses.CrashLoopBackOff]: customStatusLabels.Error,
    [statuses.FailedUnschedulable]: customStatusLabels.Error,
    [statuses.ErrorUnschedulable]: customStatusLabels.Error,
    [statuses.ImagePullBackOff]: customStatusLabels.Error,
    [statuses.ErrorPvcNotFound]: customStatusLabels.Error,
    [statuses.ErrorDataVolumeNotFound]: customStatusLabels.Error,
    [statuses.DataVolumeError]: customStatusLabels.Error,
    [statuses.Unknown]: customStatusLabels.Other,
  },
  statusLabelHandler,
);

export type StatusIconProps = {
  /** String representing the status property.
   * Supported statuses now:
   * - Stopped
   * - Migrating
   * - Provisioning
   * - Starting
   * - Running
   * - Paused
   * - Stopping
   * - Terminating
   * - Unknown
   * - CrashLoopBackOff
   * - FailedUnschedulable
   * - ErrorUnschedulable
   * - ErrImagePull
   * - ImagePullBackOff
   * - ErrorPvcNotFound
   * - ErrorDataVolumeNotFound
   * - DataVolumeError
   * - WaitingForVolumeBinding
   * */
  status: string;
  /**
   * Data attribute for end-to-end testing
   */
  'data-test-id'?: string;
  /**
   *
   * To have a rotating icon, set this prop to true.
   * @default false
   */
  spin?: boolean;
};

/**
 * StatusIcon renders icons for k8s elements to visualize [resource lifecycle phases](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase).
 * It can accomodate statuses of different resourceses like virtual machines, virtual machine instances and in general all the resorces that follow the k8s lifecycle pharses.
 *
 * All the icons are svg based with *width* and *height* of *1em*. The icon *color* inherit the css container's *color* property, except for the error icons that are only red.
 *
 * Icons has also a *title* for accessibility depends on the provided status and can be inspected on mouse hover
 *
 * Please use the spin property to indicate that something is “loading” or in the middle of processing following the PatterFly guidelines.
 * Indeed having several elements spinnings and moving in the page can distract the user from important tasks and warnings that need more attentions.
 *
 */
export const StatusIcon: React.FC<StatusIconProps> = React.memo(
  ({ status, 'data-test-id': dataTestId, spin = false }) => {
    const Icon = statusToIcon[status as statuses];
    const title = statusToLabel[status];

    return <Icon title={title} data-test-id={dataTestId} className={classNames(spin && faSpin)} />;
  },
);

StatusIcon.displayName = 'StatusIcon';
