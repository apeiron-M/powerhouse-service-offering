import { useState, useCallback } from "react";
import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import type {
  SubscriptionInstanceAction,
  SubscriptionInstanceDocument,
} from "@powerhousedao/contributor-billing/document-models/subscription-instance";
import type { ViewMode } from "../types.js";
import { StatusBadge } from "./StatusBadge.js";
import { updateCustomerWallet } from "../../../document-models/subscription-instance/gen/customer/creators.js";

interface CustomerInfoProps {
  document: SubscriptionInstanceDocument;
  dispatch: DocumentDispatch<SubscriptionInstanceAction>;
  mode: ViewMode;
}

export function CustomerInfo({ document, dispatch, mode }: CustomerInfoProps) {
  const state = document.state.global;
  const [isEditingWallet, setIsEditingWallet] = useState(false);
  const [walletAddress, setWalletAddress] = useState(
    state.customerWalletAddress || "",
  );

  const getPrimaryChannel = () => {
    return (
      state.communications.find((c) => c.isPrimary) || state.communications[0]
    );
  };

  const primaryChannel = getPrimaryChannel();

  const formatChannelType = (type: string) => {
    const labels: Record<string, string> = {
      EMAIL: "Email",
      TELEGRAM: "Telegram",
      DISCORD: "Discord",
      SLACK: "Slack",
      WHATSAPP: "WhatsApp",
    };
    return labels[type] || type;
  };

  const handleSaveWallet = useCallback(() => {
    dispatch(
      updateCustomerWallet({
        walletAddress: walletAddress || null,
      }),
    );
    setIsEditingWallet(false);
  }, [dispatch, walletAddress]);

  const handleCancelEdit = useCallback(() => {
    setWalletAddress(state.customerWalletAddress || "");
    setIsEditingWallet(false);
  }, [state.customerWalletAddress]);

  const isValidEthAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  return (
    <div className="si-panel si-panel--compact">
      <div className="si-panel__header">
        <h3 className="si-panel__title">
          {mode === "client" ? "Your Information" : "Customer Information"}
        </h3>
      </div>

      <div className="si-customer-info">
        {/* Customer Details */}
        <div className="si-customer-info__section">
          {state.customerName && (
            <div className="si-customer-info__row">
              <span className="si-customer-info__label">Name</span>
              <span className="si-customer-info__value">
                {state.customerName}
              </span>
            </div>
          )}

          {state.customerEmail && (
            <div className="si-customer-info__row">
              <span className="si-customer-info__label">Email</span>
              <span className="si-customer-info__value">
                {state.customerEmail}
              </span>
            </div>
          )}

          {state.customerType && (
            <div className="si-customer-info__row">
              <span className="si-customer-info__label">Type</span>
              <span className="si-customer-info__value">
                {state.customerType === "TEAM" ? "Team" : "Individual"}
                {state.customerType === "TEAM" && state.teamMemberCount && (
                  <span className="si-customer-info__detail">
                    {" "}
                    ({state.teamMemberCount} members)
                  </span>
                )}
              </span>
            </div>
          )}

          {/* Wallet Address - Editable for client */}
          <div className="si-customer-info__row">
            <span className="si-customer-info__label">Payment Wallet</span>
            {isEditingWallet ? (
              <div className="si-customer-info__edit-wallet">
                <input
                  type="text"
                  className="si-input si-input--sm si-input--mono"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="0x..."
                />
                <div className="si-customer-info__edit-actions">
                  <button
                    type="button"
                    className="si-btn si-btn--xs si-btn--ghost"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="si-btn si-btn--xs si-btn--primary"
                    onClick={handleSaveWallet}
                    disabled={
                      walletAddress !== "" && !isValidEthAddress(walletAddress)
                    }
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <span className="si-customer-info__value">
                {state.customerWalletAddress ? (
                  <span className="si-customer-info__value--mono">
                    {state.customerWalletAddress.slice(0, 6)}...
                    {state.customerWalletAddress.slice(-4)}
                  </span>
                ) : (
                  <span className="si-customer-info__value--empty">
                    Not set
                  </span>
                )}
                {mode === "client" && (
                  <button
                    type="button"
                    className="si-customer-info__edit-btn"
                    onClick={() => setIsEditingWallet(true)}
                    aria-label="Edit wallet address"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                )}
              </span>
            )}
          </div>
        </div>

        {/* KYC Status - Operator view or if required */}
        {(mode === "operator" || state.kycStatus !== "NOT_REQUIRED") &&
          state.kycStatus && (
            <div className="si-customer-info__section">
              <div className="si-customer-info__row">
                <span className="si-customer-info__label">KYC Status</span>
                <StatusBadge status={state.kycStatus} size="sm" />
              </div>
            </div>
          )}

        {/* Primary Contact */}
        {primaryChannel && (
          <div className="si-customer-info__section">
            <div className="si-customer-info__row">
              <span className="si-customer-info__label">Primary Contact</span>
              <span className="si-customer-info__value">
                {formatChannelType(primaryChannel.type)}:{" "}
                {primaryChannel.identifier}
                {primaryChannel.verifiedAt && (
                  <svg
                    className="si-customer-info__verified"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </span>
            </div>
          </div>
        )}

        {/* Budget Category - Operator view */}
        {mode === "operator" && state.budget && (
          <div className="si-customer-info__section">
            <div className="si-customer-info__row">
              <span className="si-customer-info__label">Budget Category</span>
              <span className="si-customer-info__value">
                {state.budget.label}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
