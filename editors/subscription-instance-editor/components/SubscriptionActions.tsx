import { useState, useCallback } from "react";
import { generateId } from "document-model/core";
import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import type {
  SubscriptionInstanceAction,
  SubscriptionInstanceDocument,
} from "@powerhousedao/contributor-billing/document-models/subscription-instance";
import type { ViewMode } from "../types.js";
import {
  setAutoRenew,
  activateSubscription,
  pauseSubscription,
  resumeSubscription,
  cancelSubscription,
  renewExpiringSubscription,
} from "../../../document-models/subscription-instance/gen/subscription/creators.js";
import {
  createClientRequest,
  withdrawRequest,
} from "../../../document-models/subscription-instance/gen/requests/creators.js";
import type { RequestType } from "../../../document-models/subscription-instance/gen/schema/types.js";

interface SubscriptionActionsProps {
  document: SubscriptionInstanceDocument;
  dispatch: DocumentDispatch<SubscriptionInstanceAction>;
  mode: ViewMode;
}

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  confirmVariant?: "danger" | "warning" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
  showReasonInput?: boolean;
  reason?: string;
  onReasonChange?: (reason: string) => void;
}

function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel,
  confirmVariant = "primary",
  onConfirm,
  onCancel,
  showReasonInput,
  reason,
  onReasonChange,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const buttonClass =
    confirmVariant === "danger"
      ? "si-btn si-btn--danger"
      : confirmVariant === "warning"
        ? "si-btn si-btn--warning"
        : "si-btn si-btn--primary";

  return (
    <div className="si-modal-overlay" onClick={onCancel}>
      <div className="si-modal" onClick={(e) => e.stopPropagation()}>
        <div className="si-modal__header">
          <h3 className="si-modal__title">{title}</h3>
        </div>
        <div className="si-modal__body">
          <p className="si-modal__message">{message}</p>
          {showReasonInput && (
            <textarea
              className="si-input si-input--textarea"
              placeholder="Reason (optional)"
              value={reason}
              onChange={(e) => onReasonChange?.(e.target.value)}
            />
          )}
        </div>
        <div className="si-modal__footer">
          <button
            type="button"
            className="si-btn si-btn--ghost"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button type="button" className={buttonClass} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

const REQUEST_TYPE_LABELS: Record<RequestType, string> = {
  PAUSE_SUBSCRIPTION: "Pause Subscription",
  RESUME_SUBSCRIPTION: "Resume Subscription",
  CANCEL_SUBSCRIPTION: "Cancel Subscription",
  INCREASE_METRIC_LIMIT: "Increase Metric Limit",
  ADD_SERVICE: "Add Service",
  REMOVE_SERVICE: "Remove Service",
  CHANGE_TIER: "Change Tier",
  UPDATE_TEAM_SIZE: "Update Team Size",
};

export function SubscriptionActions({
  document,
  dispatch,
  mode,
}: SubscriptionActionsProps) {
  const state = document.state.global;
  const [confirmAction, setConfirmAction] = useState<
    "pause" | "cancel" | "resume" | "renew" | null
  >(null);
  const [reason, setReason] = useState("");

  // Get pending requests for the current client
  const myPendingRequests = state.pendingRequests.filter(
    (r) => r.status === "PENDING",
  );

  const hasPendingPauseRequest = myPendingRequests.some(
    (r) => r.type === "PAUSE_SUBSCRIPTION",
  );
  const hasPendingResumeRequest = myPendingRequests.some(
    (r) => r.type === "RESUME_SUBSCRIPTION",
  );
  const hasPendingCancelRequest = myPendingRequests.some(
    (r) => r.type === "CANCEL_SUBSCRIPTION",
  );

  const handleToggleAutoRenew = useCallback(() => {
    dispatch(setAutoRenew({ autoRenew: !state.autoRenew }));
  }, [dispatch, state.autoRenew]);

  // Operator direct actions
  const handleActivate = useCallback(() => {
    dispatch(
      activateSubscription({
        activatedSince: new Date().toISOString(),
      }),
    );
  }, [dispatch]);

  const handleOperatorPause = useCallback(() => {
    dispatch(
      pauseSubscription({
        pausedSince: new Date().toISOString(),
      }),
    );
    setConfirmAction(null);
  }, [dispatch]);

  const handleOperatorResume = useCallback(() => {
    dispatch(
      resumeSubscription({
        timestamp: new Date().toISOString(),
      }),
    );
    setConfirmAction(null);
  }, [dispatch]);

  const handleOperatorCancel = useCallback(() => {
    dispatch(
      cancelSubscription({
        cancelledSince: new Date().toISOString(),
        cancellationReason: reason || null,
      }),
    );
    setConfirmAction(null);
    setReason("");
  }, [dispatch, reason]);

  const handleOperatorRenew = useCallback(() => {
    dispatch(
      renewExpiringSubscription({
        timestamp: new Date().toISOString(),
      }),
    );
    setConfirmAction(null);
  }, [dispatch]);

  // Client request actions
  const handleClientRequest = useCallback(
    (type: RequestType) => {
      dispatch(
        createClientRequest({
          requestId: generateId(),
          type,
          requestedAt: new Date().toISOString(),
          requestedBy: state.customerName || null,
          reason: reason || null,
        }),
      );
      setConfirmAction(null);
      setReason("");
    },
    [dispatch, state.customerName, reason],
  );

  const handleWithdrawRequest = useCallback(
    (requestId: string) => {
      dispatch(
        withdrawRequest({
          requestId,
          withdrawnAt: new Date().toISOString(),
        }),
      );
    },
    [dispatch],
  );

  // Determine which handler to use based on mode
  const handleConfirm = useCallback(() => {
    if (mode === "operator") {
      switch (confirmAction) {
        case "pause":
          handleOperatorPause();
          break;
        case "resume":
          handleOperatorResume();
          break;
        case "cancel":
          handleOperatorCancel();
          break;
        case "renew":
          handleOperatorRenew();
          break;
      }
    } else {
      // Client mode - create requests
      switch (confirmAction) {
        case "pause":
          handleClientRequest("PAUSE_SUBSCRIPTION");
          break;
        case "resume":
          handleClientRequest("RESUME_SUBSCRIPTION");
          break;
        case "cancel":
          handleClientRequest("CANCEL_SUBSCRIPTION");
          break;
      }
    }
  }, [
    mode,
    confirmAction,
    handleOperatorPause,
    handleOperatorResume,
    handleOperatorCancel,
    handleOperatorRenew,
    handleClientRequest,
  ]);

  const isPending = state.status === "PENDING";
  const isActive = state.status === "ACTIVE";
  const isPaused = state.status === "PAUSED";
  const isExpiring = state.status === "EXPIRING";
  const isCancelled = state.status === "CANCELLED";

  return (
    <>
      <div className="si-actions">
        {/* Auto-renew toggle - both modes */}
        <div className="si-actions__row">
          <span className="si-actions__label">Auto-renew</span>
          <button
            type="button"
            className={`si-toggle ${state.autoRenew ? "si-toggle--active" : ""}`}
            onClick={handleToggleAutoRenew}
            role="switch"
            aria-checked={state.autoRenew}
          >
            <span className="si-toggle__track">
              <span className="si-toggle__thumb" />
            </span>
          </button>
        </div>

        {/* Status Actions - contextual based on current status */}
        {mode === "operator" && (
          <div className="si-actions__buttons">
            {isPending && (
              <button
                type="button"
                className="si-btn si-btn--sm si-btn--success"
                onClick={handleActivate}
              >
                <svg
                  className="si-btn__icon"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Activate
              </button>
            )}

            {isActive && (
              <button
                type="button"
                className="si-btn si-btn--sm si-btn--warning"
                onClick={() => setConfirmAction("pause")}
              >
                <svg
                  className="si-btn__icon"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Pause
              </button>
            )}

            {isPaused && (
              <button
                type="button"
                className="si-btn si-btn--sm si-btn--success"
                onClick={() => setConfirmAction("resume")}
              >
                <svg
                  className="si-btn__icon"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                Resume
              </button>
            )}

            {isExpiring && (
              <button
                type="button"
                className="si-btn si-btn--sm si-btn--primary"
                onClick={() => setConfirmAction("renew")}
              >
                <svg
                  className="si-btn__icon"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
                Renew
              </button>
            )}

            {!isCancelled && (
              <button
                type="button"
                className="si-btn si-btn--sm si-btn--danger-ghost"
                onClick={() => setConfirmAction("cancel")}
              >
                <svg
                  className="si-btn__icon"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                Cancel
              </button>
            )}
          </div>
        )}

        {/* Client view - request actions */}
        {mode === "client" && !isCancelled && (
          <div className="si-actions__buttons">
            {isActive && !hasPendingPauseRequest && (
              <button
                type="button"
                className="si-btn si-btn--sm si-btn--ghost"
                onClick={() => setConfirmAction("pause")}
              >
                Request Pause
              </button>
            )}
            {isActive && hasPendingPauseRequest && (
              <span className="si-actions__pending-badge">Pause Pending</span>
            )}
            {isPaused && !hasPendingResumeRequest && (
              <button
                type="button"
                className="si-btn si-btn--sm si-btn--ghost"
                onClick={() => setConfirmAction("resume")}
              >
                Request Resume
              </button>
            )}
            {isPaused && hasPendingResumeRequest && (
              <span className="si-actions__pending-badge">Resume Pending</span>
            )}
            {!hasPendingCancelRequest && (
              <button
                type="button"
                className="si-btn si-btn--sm si-btn--danger-ghost"
                onClick={() => setConfirmAction("cancel")}
              >
                Request Cancellation
              </button>
            )}
            {hasPendingCancelRequest && (
              <span className="si-actions__pending-badge si-actions__pending-badge--danger">
                Cancellation Pending
              </span>
            )}
          </div>
        )}

        {/* Client's pending requests summary */}
        {mode === "client" && myPendingRequests.length > 0 && (
          <div className="si-actions__pending-list">
            <span className="si-actions__pending-title">
              Your pending requests:
            </span>
            {myPendingRequests.map((request) => (
              <div key={request.id} className="si-actions__pending-item">
                <span className="si-actions__pending-type">
                  {REQUEST_TYPE_LABELS[request.type]}
                </span>
                <button
                  type="button"
                  className="si-btn si-btn--xs si-btn--ghost"
                  onClick={() => handleWithdrawRequest(request.id)}
                >
                  Withdraw
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={confirmAction === "pause"}
        title={mode === "operator" ? "Pause Subscription" : "Request Pause"}
        message={
          mode === "operator"
            ? "Are you sure you want to pause this subscription? Services will be temporarily suspended."
            : "Submit a request to pause your subscription. The operator will review your request."
        }
        confirmLabel={
          mode === "operator" ? "Pause Subscription" : "Submit Request"
        }
        confirmVariant="warning"
        onConfirm={handleConfirm}
        onCancel={() => {
          setConfirmAction(null);
          setReason("");
        }}
        showReasonInput={mode === "client"}
        reason={reason}
        onReasonChange={setReason}
      />

      <ConfirmModal
        isOpen={confirmAction === "resume"}
        title={mode === "operator" ? "Resume Subscription" : "Request Resume"}
        message={
          mode === "operator"
            ? "Are you sure you want to resume this subscription? Services will be reactivated."
            : "Submit a request to resume your subscription. The operator will review your request."
        }
        confirmLabel={
          mode === "operator" ? "Resume Subscription" : "Submit Request"
        }
        confirmVariant="primary"
        onConfirm={handleConfirm}
        onCancel={() => {
          setConfirmAction(null);
          setReason("");
        }}
        showReasonInput={mode === "client"}
        reason={reason}
        onReasonChange={setReason}
      />

      <ConfirmModal
        isOpen={confirmAction === "cancel"}
        title={
          mode === "operator" ? "Cancel Subscription" : "Request Cancellation"
        }
        message={
          mode === "operator"
            ? "Are you sure you want to cancel this subscription? This action cannot be undone."
            : "Submit a request to cancel your subscription. The operator will review your request."
        }
        confirmLabel={
          mode === "operator" ? "Cancel Subscription" : "Submit Request"
        }
        confirmVariant="danger"
        onConfirm={handleConfirm}
        onCancel={() => {
          setConfirmAction(null);
          setReason("");
        }}
        showReasonInput={true}
        reason={reason}
        onReasonChange={setReason}
      />

      <ConfirmModal
        isOpen={confirmAction === "renew"}
        title="Renew Subscription"
        message="This will renew the expiring subscription and set it back to active status."
        confirmLabel="Renew Subscription"
        confirmVariant="primary"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />
    </>
  );
}
