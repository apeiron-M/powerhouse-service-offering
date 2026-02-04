import { useState, useCallback } from "react";
import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import type {
  SubscriptionInstanceAction,
  SubscriptionInstanceDocument,
} from "@powerhousedao/contributor-billing/document-models/subscription-instance";
import type {
  ClientRequest,
  RequestType,
  RequestStatus,
} from "../../../document-models/subscription-instance/gen/schema/types.js";
import {
  approveRequest,
  rejectRequest,
} from "../../../document-models/subscription-instance/gen/requests/creators.js";

interface PendingRequestsPanelProps {
  document: SubscriptionInstanceDocument;
  dispatch: DocumentDispatch<SubscriptionInstanceAction>;
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

const REQUEST_STATUS_COLORS: Record<RequestStatus, string> = {
  PENDING: "#f59e0b",
  APPROVED: "#10b981",
  REJECTED: "#ef4444",
  WITHDRAWN: "#6b7280",
};

interface ProcessRequestModalProps {
  isOpen: boolean;
  request: ClientRequest | null;
  mode: "approve" | "reject";
  onClose: () => void;
  onConfirm: (response: string) => void;
}

function ProcessRequestModal({
  isOpen,
  request,
  mode,
  onClose,
  onConfirm,
}: ProcessRequestModalProps) {
  const [response, setResponse] = useState("");

  const handleConfirm = useCallback(() => {
    onConfirm(response);
    setResponse("");
  }, [onConfirm, response]);

  const handleClose = useCallback(() => {
    setResponse("");
    onClose();
  }, [onClose]);

  if (!isOpen || !request) return null;

  const isApprove = mode === "approve";

  return (
    <div className="si-modal-overlay" onClick={handleClose}>
      <div className="si-modal" onClick={(e) => e.stopPropagation()}>
        <div className="si-modal__header">
          <h3 className="si-modal__title">
            {isApprove ? "Approve Request" : "Reject Request"}
          </h3>
          <span className="si-modal__subtitle">
            {REQUEST_TYPE_LABELS[request.type]}
          </span>
        </div>
        <div className="si-modal__body">
          <div className="si-request-details">
            {request.requestedBy && (
              <div className="si-request-detail">
                <span className="si-request-detail__label">Requested by:</span>
                <span className="si-request-detail__value">
                  {request.requestedBy}
                </span>
              </div>
            )}
            {request.reason && (
              <div className="si-request-detail">
                <span className="si-request-detail__label">Reason:</span>
                <span className="si-request-detail__value">
                  {request.reason}
                </span>
              </div>
            )}
            {request.requestedLimit !== null && (
              <div className="si-request-detail">
                <span className="si-request-detail__label">
                  Requested Limit:
                </span>
                <span className="si-request-detail__value">
                  {request.requestedLimit}
                </span>
              </div>
            )}
            {request.requestedTierName && (
              <div className="si-request-detail">
                <span className="si-request-detail__label">
                  Requested Tier:
                </span>
                <span className="si-request-detail__value">
                  {request.requestedTierName}
                </span>
              </div>
            )}
            {request.requestedTeamSize !== null && (
              <div className="si-request-detail">
                <span className="si-request-detail__label">
                  Requested Team Size:
                </span>
                <span className="si-request-detail__value">
                  {request.requestedTeamSize}
                </span>
              </div>
            )}
          </div>
          <div className="si-form-group">
            <label className="si-form-label" htmlFor="operator-response">
              {isApprove
                ? "Response (optional)"
                : "Rejection reason (required)"}
            </label>
            <textarea
              id="operator-response"
              className="si-input si-input--textarea"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder={
                isApprove
                  ? "Add a note for the client..."
                  : "Explain why this request is being rejected..."
              }
              rows={3}
            />
          </div>
        </div>
        <div className="si-modal__footer">
          <button
            type="button"
            className="si-btn si-btn--ghost"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={
              isApprove ? "si-btn si-btn--success" : "si-btn si-btn--danger"
            }
            onClick={handleConfirm}
            disabled={!isApprove && !response.trim()}
          >
            {isApprove ? "Approve" : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function PendingRequestsPanel({
  document,
  dispatch,
}: PendingRequestsPanelProps) {
  const state = document.state.global;
  const [selectedRequest, setSelectedRequest] = useState<ClientRequest | null>(
    null,
  );
  const [processMode, setProcessMode] = useState<"approve" | "reject">(
    "approve",
  );
  const [showProcessed, setShowProcessed] = useState(false);

  const pendingRequests = state.pendingRequests.filter(
    (r) => r.status === "PENDING",
  );
  const processedRequests = state.pendingRequests.filter(
    (r) => r.status !== "PENDING",
  );

  const handleApprove = useCallback((request: ClientRequest) => {
    setSelectedRequest(request);
    setProcessMode("approve");
  }, []);

  const handleReject = useCallback((request: ClientRequest) => {
    setSelectedRequest(request);
    setProcessMode("reject");
  }, []);

  const handleProcessConfirm = useCallback(
    (response: string) => {
      if (!selectedRequest) return;

      if (processMode === "approve") {
        dispatch(
          approveRequest({
            requestId: selectedRequest.id,
            processedAt: new Date().toISOString(),
            operatorResponse: response || null,
          }),
        );
      } else {
        dispatch(
          rejectRequest({
            requestId: selectedRequest.id,
            processedAt: new Date().toISOString(),
            operatorResponse: response,
          }),
        );
      }

      setSelectedRequest(null);
    },
    [dispatch, selectedRequest, processMode],
  );

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (pendingRequests.length === 0 && processedRequests.length === 0) {
    return null;
  }

  return (
    <>
      <div className="si-panel">
        <div className="si-panel__header">
          <h3 className="si-panel__title">
            Client Requests
            {pendingRequests.length > 0 && (
              <span className="si-panel__badge si-panel__badge--warning">
                {pendingRequests.length}
              </span>
            )}
          </h3>
          {processedRequests.length > 0 && (
            <button
              type="button"
              className="si-btn si-btn--xs si-btn--ghost"
              onClick={() => setShowProcessed(!showProcessed)}
            >
              {showProcessed ? "Hide" : "Show"} History
            </button>
          )}
        </div>

        <div className="si-panel__content">
          {pendingRequests.length === 0 ? (
            <p className="si-panel__empty">No pending requests</p>
          ) : (
            <div className="si-requests-list">
              {pendingRequests.map((request) => (
                <div key={request.id} className="si-request-card">
                  <div className="si-request-card__header">
                    <span className="si-request-card__type">
                      {REQUEST_TYPE_LABELS[request.type]}
                    </span>
                    <span
                      className="si-request-card__status"
                      style={{
                        color: REQUEST_STATUS_COLORS[request.status],
                      }}
                    >
                      {request.status}
                    </span>
                  </div>
                  <div className="si-request-card__body">
                    {request.requestedBy && (
                      <span className="si-request-card__info">
                        by {request.requestedBy}
                      </span>
                    )}
                    <span className="si-request-card__time">
                      {formatDate(request.requestedAt)}
                    </span>
                  </div>
                  {request.reason && (
                    <p className="si-request-card__reason">{request.reason}</p>
                  )}
                  <div className="si-request-card__actions">
                    <button
                      type="button"
                      className="si-btn si-btn--xs si-btn--success"
                      onClick={() => handleApprove(request)}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="si-btn si-btn--xs si-btn--danger-ghost"
                      onClick={() => handleReject(request)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Processed Requests History */}
          {showProcessed && processedRequests.length > 0 && (
            <div className="si-requests-history">
              <h4 className="si-requests-history__title">Request History</h4>
              <div className="si-requests-list si-requests-list--compact">
                {processedRequests.map((request) => (
                  <div
                    key={request.id}
                    className="si-request-card si-request-card--processed"
                  >
                    <div className="si-request-card__header">
                      <span className="si-request-card__type">
                        {REQUEST_TYPE_LABELS[request.type]}
                      </span>
                      <span
                        className="si-request-card__status"
                        style={{
                          color: REQUEST_STATUS_COLORS[request.status],
                        }}
                      >
                        {request.status}
                      </span>
                    </div>
                    <div className="si-request-card__body">
                      {request.processedAt && (
                        <span className="si-request-card__time">
                          {formatDate(request.processedAt)}
                        </span>
                      )}
                    </div>
                    {request.operatorResponse && (
                      <p className="si-request-card__response">
                        {request.operatorResponse}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <ProcessRequestModal
        isOpen={selectedRequest !== null}
        request={selectedRequest}
        mode={processMode}
        onClose={() => setSelectedRequest(null)}
        onConfirm={handleProcessConfirm}
      />
    </>
  );
}
