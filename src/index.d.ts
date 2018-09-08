import * as React from "react";
import * as redux from "redux";

export interface Notification {
  key: string;
  message: string;
  trigger: redux.Action;
  showDismiss: boolean;
}

export interface ListeningTo {
  hideAfter?: number;
  defaultMessage?: string;
  showDismiss: boolean;
}

export interface NotificationsState {
  listeningTo: {
    [event: string]: ListeningTo[];
  };
  notifications: {
    [event: string]: Notification[];
  };
}

export interface InlineNotificationProps {
  triggeredBy: string | string[];
  defaultMessage?: string;
  hideAfter?: number;
  renderNotification?: (
    notification: Notification,
    dismiss: (e?: MouseEvent) => void
  ) => JSX.Element;
  renderContainer?: (notifications: JSX.Element[]) => JSX.Element;
}

export const reducer: redux.Reducer<NotificationsState>;
export const middleware: redux.Middleware;
export const InlineNotification: React.ComponentClass<InlineNotificationProps>;
