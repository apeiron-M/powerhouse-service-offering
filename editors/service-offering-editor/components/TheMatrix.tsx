import { useState, useMemo } from "react";
import { generateId } from "document-model/core";
import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import type {
  ServiceOfferingDocument,
  ServiceOfferingAction,
  Service,
  ServiceSubscriptionTier,
  ServiceLevel,
  OptionGroup,
  ServiceUsageLimit,
} from "resourceServices/document-models/service-offering";
import {
  addServiceLevel,
  updateServiceLevel,
  removeServiceLevel,
  addUsageLimit,
  updateUsageLimit,
  removeUsageLimit,
  addService,
  addOptionGroup,
  updateOptionGroup,
} from "../../../document-models/service-offering/gen/creators.js";

interface TheMatrixProps {
  document: ServiceOfferingDocument;
  dispatch: DocumentDispatch<ServiceOfferingAction>;
  groupSetupFees?: Record<string, number | null>;
}

const SERVICE_LEVELS: {
  value: ServiceLevel;
  label: string;
  shortLabel: string;
  color: string;
}[] = [
  {
    value: "INCLUDED",
    label: "Included",
    shortLabel: "✓",
    color: "var(--so-emerald-600)",
  },
  {
    value: "OPTIONAL",
    label: "Optional",
    shortLabel: "Optional",
    color: "var(--so-sky-600)",
  },
  {
    value: "NOT_INCLUDED",
    label: "Not Included",
    shortLabel: "—",
    color: "var(--so-slate-400)",
  },
  {
    value: "NOT_APPLICABLE",
    label: "Not Applicable",
    shortLabel: "/",
    color: "var(--so-slate-300)",
  },
  {
    value: "CUSTOM",
    label: "Custom",
    shortLabel: "Custom",
    color: "var(--so-amber-600)",
  },
  {
    value: "VARIABLE",
    label: "Variable",
    shortLabel: "#",
    color: "var(--so-violet-600)",
  },
];

const UNGROUPED_ID = "__ungrouped__";

const FACET_CATEGORIES = {
  FUNCTION: {
    label: "SNO Function",
    options: [
      { id: "operational-hub", label: "Operational Hub" },
      { id: "embryonic-hub", label: "Embryonic Hub" },
    ],
  },
  LEGAL_ENTITY: {
    label: "Legal Entity",
    options: [
      { id: "swiss-association", label: "Swiss Association" },
      { id: "bvi-ltd", label: "BVI Ltd" },
      { id: "unaffiliated", label: "Unaffiliated" },
    ],
  },
  TEAM_STRUCTURE: {
    label: "Team",
    options: [
      { id: "remote-team", label: "Remote" },
      { id: "on-premise", label: "On-Premise" },
      { id: "hybrid", label: "Hybrid" },
    ],
  },
  ANONYMITY: {
    label: "Anonymity",
    options: [
      { id: "high-anonymity", label: "High" },
      { id: "highest-anonymity", label: "Highest" },
    ],
  },
};

const matrixStyles = `
  .matrix {
    background: var(--so-white);
    border-radius: var(--so-radius-lg);
    box-shadow: var(--so-shadow-md);
    overflow: hidden;
  }

  /* Facet Selector */
  .matrix__facets {
    padding: 1.25rem 1.5rem;
    background: linear-gradient(to bottom, var(--so-slate-50), var(--so-white));
    border-bottom: 1px solid var(--so-slate-200);
  }

  .matrix__facets-row {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 1.5rem;
  }

  .matrix__facet-group {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .matrix__facet-label {
    font-family: var(--so-font-mono);
    font-size: 0.625rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--so-slate-500);
  }

  .matrix__facet-select {
    font-family: var(--so-font-sans);
    font-size: 0.8125rem;
    color: var(--so-slate-700);
    background: var(--so-white);
    border: 1px solid var(--so-slate-200);
    border-radius: var(--so-radius-md);
    padding: 0.5rem 2rem 0.5rem 0.75rem;
    cursor: pointer;
    outline: none;
    transition: var(--so-transition-fast);
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    background-size: 1rem;
  }

  .matrix__facet-select:hover {
    border-color: var(--so-slate-300);
  }

  .matrix__facet-select:focus {
    border-color: var(--so-violet-400);
    box-shadow: 0 0 0 3px var(--so-violet-100);
  }

  /* Toggle Button Group */
  .matrix__toggle-group {
    display: flex;
    background: var(--so-white);
    border: 1px solid var(--so-slate-200);
    border-radius: var(--so-radius-md);
    overflow: hidden;
  }

  .matrix__toggle-btn {
    padding: 0.5rem 0.875rem;
    font-family: var(--so-font-sans);
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--so-slate-600);
    background: var(--so-white);
    border: none;
    cursor: pointer;
    transition: var(--so-transition-fast);
  }

  .matrix__toggle-btn:not(:first-child) {
    border-left: 1px solid var(--so-slate-200);
  }

  .matrix__toggle-btn:hover:not(.matrix__toggle-btn--active) {
    background: var(--so-slate-50);
  }

  .matrix__toggle-btn--active {
    background: var(--so-violet-100);
    color: var(--so-violet-700);
  }

  /* Facet Notice */
  .matrix__facet-notice {
    margin-top: 0.875rem;
    padding: 0.625rem 0.875rem;
    background: var(--so-amber-50);
    border: 1px solid var(--so-amber-200);
    border-radius: var(--so-radius-md);
  }

  .matrix__facet-notice-text {
    font-size: 0.75rem;
    color: var(--so-amber-700);
  }

  .matrix__facet-notice-text strong {
    color: var(--so-amber-800);
  }

  /* Table */
  .matrix__table-wrap {
    overflow-x: auto;
  }

  .matrix__table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8125rem;
  }

  /* Header */
  .matrix__corner-cell {
    position: sticky;
    left: 0;
    z-index: 10;
    background: var(--so-white);
    padding: 1rem;
    text-align: left;
    font-weight: 400;
    color: var(--so-slate-500);
    border-bottom: 1px solid var(--so-slate-200);
    min-width: 260px;
  }

  .matrix__tier-header {
    padding: 1rem;
    text-align: center;
    border-bottom: 1px solid var(--so-slate-200);
    min-width: 140px;
    cursor: pointer;
    transition: var(--so-transition-fast);
    background: var(--so-white);
  }

  .matrix__tier-header:hover:not(.matrix__tier-header--selected) {
    background: var(--so-violet-50);
  }

  .matrix__tier-header--selected {
    background: var(--so-violet-600);
    color: var(--so-white);
  }

  .matrix__tier-header-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.375rem;
  }

  .matrix__tier-radio {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    border: 2px solid var(--so-slate-300);
    transition: var(--so-transition-fast);
  }

  .matrix__tier-header--selected .matrix__tier-radio {
    border-color: var(--so-white);
    background: var(--so-violet-600);
    box-shadow: inset 0 0 0 3px var(--so-white);
  }

  .matrix__tier-name {
    font-family: var(--so-font-sans);
    font-weight: 600;
  }

  .matrix__tier-price {
    font-size: 0.6875rem;
    opacity: 0.7;
  }

  .matrix__tier-header--selected .matrix__tier-price {
    color: var(--so-violet-200);
  }

  /* Section Header */
  .matrix__section-header {
    background: var(--so-slate-100);
    padding: 0.625rem 1rem;
    font-family: var(--so-font-mono);
    font-size: 0.625rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--so-slate-600);
    border-bottom: 1px solid var(--so-slate-200);
  }

  /* Group Header */
  .matrix__group-header {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--so-slate-200);
  }

  .matrix__group-header--setup {
    background: var(--so-amber-100);
  }

  .matrix__group-header--optional {
    background: var(--so-sky-100);
  }

  .matrix__group-header--regular {
    background: var(--so-slate-100);
  }

  .matrix__group-header-sticky {
    position: sticky;
    left: 0;
    z-index: 10;
  }

  .matrix__group-header-inner {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .matrix__group-toggle {
    position: relative;
    width: 2.5rem;
    height: 1.25rem;
    border-radius: 9999px;
    border: none;
    cursor: pointer;
    transition: var(--so-transition-base);
  }

  .matrix__group-toggle--on {
    background: var(--so-violet-600);
  }

  .matrix__group-toggle--off {
    background: var(--so-slate-300);
  }

  .matrix__group-toggle-knob {
    position: absolute;
    top: 0.125rem;
    width: 1rem;
    height: 1rem;
    background: var(--so-white);
    border-radius: 50%;
    box-shadow: var(--so-shadow-sm);
    transition: var(--so-transition-fast);
  }

  .matrix__group-toggle--on .matrix__group-toggle-knob {
    left: calc(100% - 1.125rem);
  }

  .matrix__group-toggle--off .matrix__group-toggle-knob {
    left: 0.125rem;
  }

  .matrix__group-name {
    font-family: var(--so-font-sans);
    font-weight: 600;
    color: var(--so-slate-800);
  }

  .matrix__group-badge {
    display: inline-block;
    padding: 0.25rem 0.625rem;
    border-radius: var(--so-radius-sm);
    font-size: 0.625rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .matrix__group-badge--included {
    background: var(--so-emerald-100);
    color: var(--so-emerald-700);
  }

  .matrix__group-badge--optional {
    background: var(--so-sky-200);
    color: var(--so-sky-700);
  }

  /* Service Row */
  .matrix__service-row {
    transition: var(--so-transition-fast);
  }

  .matrix__service-row--setup {
    background: var(--so-amber-50);
  }

  .matrix__service-row--optional {
    background: var(--so-sky-50);
  }

  .matrix__service-row--regular {
    background: var(--so-slate-50);
  }

  .matrix__service-row:hover {
    filter: brightness(0.98);
  }

  .matrix__service-cell {
    padding: 0.625rem 1rem;
    padding-left: 2rem;
    border-bottom: 1px solid var(--so-slate-100);
    position: sticky;
    left: 0;
    z-index: 10;
  }

  .matrix__service-title {
    font-family: var(--so-font-sans);
    font-size: 0.8125rem;
    color: var(--so-slate-700);
  }

  .matrix__level-cell {
    padding: 0.625rem 1rem;
    text-align: center;
    border-bottom: 1px solid var(--so-slate-100);
    cursor: pointer;
    transition: var(--so-transition-fast);
  }

  .matrix__level-cell:hover {
    background: rgba(255, 255, 255, 0.5);
  }

  .matrix__level-cell--selected {
    box-shadow: inset 0 0 0 2px var(--so-violet-500);
  }

  .matrix__level-cell--highlight {
    background: var(--so-violet-50);
  }

  .matrix__level-value {
    font-family: var(--so-font-sans);
    font-weight: 500;
  }

  /* Metric Row */
  .matrix__metric-row {
    background: inherit;
  }

  .matrix__metric-cell {
    padding: 0.375rem 1rem;
    padding-left: 3rem;
    border-bottom: 1px solid var(--so-slate-100);
    position: sticky;
    left: 0;
    z-index: 10;
  }

  .matrix__metric-name {
    font-family: var(--so-font-sans);
    font-size: 0.6875rem;
    font-style: italic;
    color: var(--so-slate-500);
  }

  .matrix__metric-value-cell {
    padding: 0.375rem 1rem;
    text-align: center;
    border-bottom: 1px solid var(--so-slate-100);
  }

  .matrix__metric-value {
    font-size: 0.6875rem;
    color: var(--so-slate-500);
  }

  /* Add Service Row */
  .matrix__add-service-row td {
    padding: 0.5rem 1rem;
    padding-left: 2rem;
    border-bottom: 1px solid var(--so-slate-100);
  }

  .matrix__add-service-btn {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-family: var(--so-font-sans);
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--so-violet-600);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: var(--so-transition-fast);
  }

  .matrix__add-service-btn:hover {
    color: var(--so-violet-700);
  }

  .matrix__add-service-icon {
    width: 1rem;
    height: 1rem;
  }

  /* Total Rows */
  .matrix__total-row {
    background: var(--so-slate-100);
  }

  .matrix__total-row td {
    padding: 0.625rem 1rem;
    font-weight: 600;
    color: var(--so-slate-700);
    border-bottom: 1px solid var(--so-slate-300);
  }

  .matrix__total-row td:first-child {
    position: sticky;
    left: 0;
    z-index: 10;
    background: var(--so-slate-100);
  }

  .matrix__setup-total-row {
    background: var(--so-slate-50);
  }

  .matrix__setup-total-row td {
    padding: 0.625rem 1rem;
    font-weight: 600;
    color: var(--so-slate-700);
    border-bottom: 1px solid var(--so-slate-200);
  }

  .matrix__setup-total-row td:first-child {
    position: sticky;
    left: 0;
    z-index: 10;
    background: var(--so-slate-50);
  }

  /* Grand Total */
  .matrix__grand-total-row {
    background: var(--so-violet-100);
  }

  .matrix__grand-total-row td {
    padding: 0.875rem 1rem;
    font-weight: 700;
    color: var(--so-violet-900);
    border-top: 2px solid var(--so-violet-300);
  }

  .matrix__grand-total-row td:first-child {
    position: sticky;
    left: 0;
    z-index: 10;
    background: var(--so-violet-100);
  }

  .matrix__grand-total-cell--selected {
    background: var(--so-violet-600);
    color: var(--so-white);
  }

  /* Empty State */
  .matrix__empty {
    padding: 4rem 2rem;
    text-align: center;
  }

  .matrix__empty-icon {
    width: 4rem;
    height: 4rem;
    margin: 0 auto 1rem;
    color: var(--so-slate-300);
  }

  .matrix__empty-title {
    font-family: var(--so-font-sans);
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--so-slate-900);
    margin-bottom: 0.5rem;
  }

  .matrix__empty-text {
    font-size: 0.875rem;
    color: var(--so-slate-500);
    max-width: 28rem;
    margin: 0 auto;
  }

  /* Detail Panel */
  .matrix__panel-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    z-index: 50;
  }

  .matrix__panel {
    width: 24rem;
    height: 100%;
    background: var(--so-white);
    box-shadow: var(--so-shadow-xl);
    overflow-y: auto;
    animation: panel-slide-in 0.2s ease-out;
  }

  @keyframes panel-slide-in {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  .matrix__panel-header {
    background: var(--so-violet-600);
    color: var(--so-white);
    padding: 1rem;
  }

  .matrix__panel-header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.25rem;
  }

  .matrix__panel-tier {
    font-family: var(--so-font-mono);
    font-size: 0.6875rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.8;
  }

  .matrix__panel-close {
    padding: 0.25rem;
    background: transparent;
    border: none;
    color: var(--so-white);
    cursor: pointer;
    border-radius: var(--so-radius-sm);
    transition: var(--so-transition-fast);
  }

  .matrix__panel-close:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .matrix__panel-close-icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  .matrix__panel-title {
    font-family: var(--so-font-sans);
    font-size: 1.125rem;
    font-weight: 600;
  }

  .matrix__panel-body {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .matrix__panel-section-label {
    display: block;
    font-family: var(--so-font-sans);
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--so-slate-700);
    margin-bottom: 0.75rem;
  }

  .matrix__panel-level-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .matrix__panel-level-btn {
    padding: 0.625rem 0.875rem;
    font-family: var(--so-font-sans);
    font-size: 0.8125rem;
    font-weight: 500;
    border-radius: var(--so-radius-md);
    border: 2px solid var(--so-slate-200);
    background: var(--so-white);
    cursor: pointer;
    transition: var(--so-transition-fast);
  }

  .matrix__panel-level-btn:hover:not(.matrix__panel-level-btn--active) {
    border-color: var(--so-slate-300);
  }

  .matrix__panel-level-btn--active {
    border-color: var(--so-violet-500);
    background: var(--so-violet-50);
    color: var(--so-violet-700);
  }

  .matrix__panel-input {
    width: 100%;
    font-family: var(--so-font-sans);
    font-size: 0.8125rem;
    color: var(--so-slate-900);
    background: var(--so-white);
    border: 1px solid var(--so-slate-200);
    border-radius: var(--so-radius-md);
    padding: 0.625rem 0.875rem;
    outline: none;
    transition: var(--so-transition-fast);
  }

  .matrix__panel-input:focus {
    border-color: var(--so-violet-400);
    box-shadow: 0 0 0 3px var(--so-violet-100);
  }

  .matrix__panel-limits-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }

  .matrix__panel-add-btn {
    font-family: var(--so-font-sans);
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--so-violet-600);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: var(--so-transition-fast);
  }

  .matrix__panel-add-btn:hover {
    color: var(--so-violet-700);
  }

  .matrix__panel-empty-text {
    font-size: 0.8125rem;
    font-style: italic;
    color: var(--so-slate-500);
  }

  .matrix__panel-limit-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: var(--so-slate-50);
    border-radius: var(--so-radius-md);
    margin-bottom: 0.75rem;
  }

  .matrix__panel-limit-item:hover .matrix__panel-limit-actions {
    opacity: 1;
  }

  .matrix__panel-limit-content {
    flex: 1;
    cursor: pointer;
    padding: 0.25rem;
    margin: -0.25rem;
    border-radius: var(--so-radius-sm);
    transition: var(--so-transition-fast);
  }

  .matrix__panel-limit-content:hover {
    background: var(--so-slate-100);
  }

  .matrix__panel-limit-metric {
    font-family: var(--so-font-sans);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--so-slate-900);
  }

  .matrix__panel-limit-value {
    font-size: 0.8125rem;
    color: var(--so-slate-500);
  }

  .matrix__panel-limit-actions {
    display: flex;
    gap: 0.25rem;
    opacity: 0;
    transition: var(--so-transition-fast);
  }

  .matrix__panel-limit-btn {
    padding: 0.25rem;
    background: transparent;
    border: none;
    color: var(--so-slate-400);
    cursor: pointer;
    border-radius: var(--so-radius-sm);
    transition: var(--so-transition-fast);
  }

  .matrix__panel-limit-btn:hover {
    background: var(--so-slate-100);
  }

  .matrix__panel-limit-btn--edit:hover {
    color: var(--so-violet-600);
  }

  .matrix__panel-limit-btn--remove:hover {
    color: var(--so-rose-500);
  }

  .matrix__panel-limit-icon {
    width: 1rem;
    height: 1rem;
  }

  /* Edit Form */
  .matrix__panel-edit-form {
    padding: 0.75rem;
    background: var(--so-violet-50);
    border-radius: var(--so-radius-md);
    margin-bottom: 0.75rem;
  }

  .matrix__panel-edit-form > div {
    margin-bottom: 0.625rem;
  }

  .matrix__panel-edit-form > div:last-child {
    margin-bottom: 0;
  }

  .matrix__panel-edit-label {
    display: block;
    font-family: var(--so-font-mono);
    font-size: 0.625rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--so-slate-500);
    margin-bottom: 0.25rem;
  }

  .matrix__panel-edit-hint {
    font-size: 0.6875rem;
    color: var(--so-slate-400);
    margin-top: 0.25rem;
  }

  .matrix__panel-edit-actions {
    display: flex;
    gap: 0.5rem;
  }

  .matrix__panel-edit-btn {
    flex: 1;
    padding: 0.5rem 0.75rem;
    font-family: var(--so-font-sans);
    font-size: 0.8125rem;
    font-weight: 500;
    border-radius: var(--so-radius-md);
    cursor: pointer;
    transition: var(--so-transition-fast);
  }

  .matrix__panel-edit-btn--primary {
    background: var(--so-violet-600);
    color: var(--so-white);
    border: none;
  }

  .matrix__panel-edit-btn--primary:hover {
    background: var(--so-violet-700);
  }

  .matrix__panel-edit-btn--secondary {
    background: var(--so-slate-200);
    color: var(--so-slate-700);
    border: none;
  }

  .matrix__panel-edit-btn--secondary:hover {
    background: var(--so-slate-300);
  }

  .matrix__panel-footer {
    padding: 1rem;
    border-top: 1px solid var(--so-slate-200);
  }

  .matrix__panel-done-btn {
    width: 100%;
    padding: 0.625rem 1rem;
    font-family: var(--so-font-sans);
    font-size: 0.875rem;
    font-weight: 600;
    background: var(--so-violet-600);
    color: var(--so-white);
    border: none;
    border-radius: var(--so-radius-md);
    cursor: pointer;
    transition: var(--so-transition-fast);
  }

  .matrix__panel-done-btn:hover {
    background: var(--so-violet-700);
  }

  /* Modal */
  .matrix__modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
  }

  .matrix__modal {
    width: 24rem;
    background: var(--so-white);
    border-radius: var(--so-radius-lg);
    box-shadow: var(--so-shadow-xl);
    padding: 1.5rem;
    animation: modal-pop 0.2s ease-out;
  }

  @keyframes modal-pop {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .matrix__modal-title {
    font-family: var(--so-font-sans);
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--so-slate-900);
    margin-bottom: 1rem;
  }

  .matrix__modal-field {
    margin-bottom: 1rem;
  }

  .matrix__modal-label {
    display: block;
    font-family: var(--so-font-sans);
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--so-slate-700);
    margin-bottom: 0.5rem;
  }

  .matrix__modal-input {
    width: 100%;
    font-family: var(--so-font-sans);
    font-size: 0.875rem;
    color: var(--so-slate-900);
    background: var(--so-white);
    border: 1px solid var(--so-slate-200);
    border-radius: var(--so-radius-md);
    padding: 0.625rem 0.875rem;
    outline: none;
    transition: var(--so-transition-fast);
  }

  .matrix__modal-input:focus {
    border-color: var(--so-violet-400);
    box-shadow: 0 0 0 3px var(--so-violet-100);
  }

  .matrix__modal-hint {
    font-size: 0.8125rem;
    color: var(--so-slate-500);
    margin-bottom: 1rem;
  }

  .matrix__modal-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
  }

  .matrix__modal-btn {
    padding: 0.5rem 1rem;
    font-family: var(--so-font-sans);
    font-size: 0.8125rem;
    font-weight: 500;
    border-radius: var(--so-radius-md);
    cursor: pointer;
    transition: var(--so-transition-fast);
  }

  .matrix__modal-btn--cancel {
    background: transparent;
    color: var(--so-slate-600);
    border: none;
  }

  .matrix__modal-btn--cancel:hover {
    color: var(--so-slate-800);
  }

  .matrix__modal-btn--primary {
    background: var(--so-violet-600);
    color: var(--so-white);
    border: none;
  }

  .matrix__modal-btn--primary:hover:not(:disabled) {
    background: var(--so-violet-700);
  }

  .matrix__modal-btn--primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export function TheMatrix({
  document,
  dispatch,
  groupSetupFees = {},
}: TheMatrixProps) {
  const { state } = document;
  const services = state.global.services ?? [];
  const tiers = state.global.tiers ?? [];
  const optionGroups = state.global.optionGroups ?? [];

  const [enabledOptionalGroups, setEnabledOptionalGroups] = useState<
    Set<string>
  >(new Set(optionGroups.filter((g) => g.defaultSelected).map((g) => g.id)));

  const [selectedCell, setSelectedCell] = useState<{
    serviceId: string;
    tierId: string;
  } | null>(null);

  const [addServiceModal, setAddServiceModal] = useState<{
    groupId: string;
    isSetupFormation: boolean;
  } | null>(null);
  const [newServiceName, setNewServiceName] = useState("");

  const [selectedTierIdx, setSelectedTierIdx] = useState<number>(0);

  const [selectedFacets, setSelectedFacets] = useState<Record<string, string>>({
    FUNCTION: "operational-hub",
    LEGAL_ENTITY: "swiss-association",
    TEAM_STRUCTURE: "remote-team",
    ANONYMITY: "high-anonymity",
  });

  const getServiceGroup = (service: Service): string | null => {
    for (const tier of tiers) {
      const binding = tier.serviceLevels.find(
        (sl) => sl.serviceId === service.id,
      );
      if (binding?.optionGroupId) {
        return binding.optionGroupId;
      }
    }
    return null;
  };

  const groupedServices = useMemo(() => {
    const groups: Map<string, Service[]> = new Map();
    optionGroups.forEach((g) => groups.set(g.id, []));
    groups.set(UNGROUPED_ID, []);

    services.forEach((service) => {
      const groupId = getServiceGroup(service) || UNGROUPED_ID;
      const groupServices = groups.get(groupId) || [];
      groupServices.push(service);
      groups.set(groupId, groupServices);
    });

    return groups;
  }, [services, tiers, optionGroups]);

  const setupGroups = useMemo(() => {
    return optionGroups.filter((g) => {
      const groupServices = groupedServices.get(g.id) || [];
      return groupServices.some((s) => s.isSetupFormation);
    });
  }, [optionGroups, groupedServices]);

  const regularGroups = useMemo(() => {
    return optionGroups.filter((g) => {
      const groupServices = groupedServices.get(g.id) || [];
      return !groupServices.some((s) => s.isSetupFormation) && !g.isAddOn;
    });
  }, [optionGroups, groupedServices]);

  const addonGroups = useMemo(() => {
    return optionGroups.filter((g) => g.isAddOn);
  }, [optionGroups]);

  const ungroupedSetupServices = useMemo(() => {
    return (groupedServices.get(UNGROUPED_ID) || []).filter(
      (s) => s.isSetupFormation,
    );
  }, [groupedServices]);

  const ungroupedRegularServices = useMemo(() => {
    return (groupedServices.get(UNGROUPED_ID) || []).filter(
      (s) => !s.isSetupFormation,
    );
  }, [groupedServices]);

  const getServiceLevelForTier = (
    serviceId: string,
    tier: ServiceSubscriptionTier,
  ) => {
    return tier.serviceLevels.find((sl) => sl.serviceId === serviceId);
  };

  const getUniqueMetricsForService = (serviceId: string): string[] => {
    const metricsSet = new Set<string>();
    tiers.forEach((tier) => {
      tier.usageLimits
        .filter((ul) => ul.serviceId === serviceId)
        .forEach((ul) => metricsSet.add(ul.metric));
    });
    return Array.from(metricsSet);
  };

  const getUsageLimitForMetric = (
    serviceId: string,
    metric: string,
    tier: ServiceSubscriptionTier,
  ): ServiceUsageLimit | undefined => {
    return tier.usageLimits.find(
      (ul) => ul.serviceId === serviceId && ul.metric === metric,
    );
  };

  const handleSetServiceLevel = (
    serviceId: string,
    tierId: string,
    level: ServiceLevel,
    existingLevelId?: string,
    optionGroupId?: string,
  ) => {
    if (existingLevelId) {
      dispatch(
        updateServiceLevel({
          tierId,
          serviceLevelId: existingLevelId,
          level,
          lastModified: new Date().toISOString(),
        }),
      );
    } else {
      dispatch(
        addServiceLevel({
          tierId,
          serviceLevelId: generateId(),
          serviceId,
          level,
          optionGroupId,
          lastModified: new Date().toISOString(),
        }),
      );
    }
  };

  const toggleOptionalGroup = (groupId: string) => {
    setEnabledOptionalGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  const handleAddService = () => {
    if (!addServiceModal || !newServiceName.trim()) return;

    const newServiceId = generateId();

    dispatch(
      addService({
        id: newServiceId,
        title: newServiceName.trim(),
        description: null,
        isSetupFormation: addServiceModal.isSetupFormation,
        lastModified: new Date().toISOString(),
      }),
    );

    tiers.forEach((tier) => {
      dispatch(
        addServiceLevel({
          tierId: tier.id,
          serviceLevelId: generateId(),
          serviceId: newServiceId,
          level: "INCLUDED",
          optionGroupId: addServiceModal.groupId,
          lastModified: new Date().toISOString(),
        }),
      );
    });

    setNewServiceName("");
    setAddServiceModal(null);
  };

  const openAddServiceModal = (groupId: string, isSetupFormation: boolean) => {
    setAddServiceModal({ groupId, isSetupFormation });
    setNewServiceName("");
  };

  const getLevelDisplay = (
    serviceLevel:
      | { level: ServiceLevel | `${ServiceLevel}`; customValue?: string | null }
      | undefined,
  ) => {
    if (!serviceLevel) return { label: "—", color: "var(--so-slate-300)" };

    const level = serviceLevel.level;
    const config = SERVICE_LEVELS.find((l) => l.value === level);

    if (level === "CUSTOM" && serviceLevel.customValue) {
      return {
        label: serviceLevel.customValue,
        color: config?.color || "var(--so-amber-600)",
      };
    }

    return {
      label: config?.shortLabel || level,
      color: config?.color || "var(--so-slate-600)",
    };
  };

  if (services.length === 0 || tiers.length === 0) {
    return (
      <>
        <style>{matrixStyles}</style>
        <div className="matrix">
          <div className="matrix__empty">
            <svg
              className="matrix__empty-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            <h3 className="matrix__empty-title">Matrix Not Ready</h3>
            <p className="matrix__empty-text">
              {services.length === 0 && tiers.length === 0
                ? "Add services in the Service Catalog and tiers in Tier Definition to configure the matrix."
                : services.length === 0
                  ? "Add services in the Service Catalog to configure the matrix."
                  : "Add tiers in Tier Definition to configure the matrix."}
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{matrixStyles}</style>
      <div className="matrix">
        {/* Facet Selector */}
        <div className="matrix__facets">
          <div className="matrix__facets-row">
            {Object.entries(FACET_CATEGORIES).map(([key, category]) => (
              <div key={key} className="matrix__facet-group">
                <span className="matrix__facet-label">{category.label}</span>
                {key === "ANONYMITY" ? (
                  <div className="matrix__toggle-group">
                    {category.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() =>
                          setSelectedFacets((prev) => ({
                            ...prev,
                            [key]: option.id,
                          }))
                        }
                        className={`matrix__toggle-btn ${
                          selectedFacets[key] === option.id
                            ? "matrix__toggle-btn--active"
                            : ""
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <select
                    value={selectedFacets[key] || ""}
                    onChange={(e) =>
                      setSelectedFacets((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    className="matrix__facet-select"
                  >
                    {category.options.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
          {selectedFacets.ANONYMITY === "highest-anonymity" && (
            <div className="matrix__facet-notice">
              <p className="matrix__facet-notice-text">
                <strong>Highest Anonymity:</strong> Additional setup services
                may be required for enhanced privacy configurations.
              </p>
            </div>
          )}
        </div>

        <div className="matrix__table-wrap">
          <table className="matrix__table">
            <thead>
              <tr>
                <th className="matrix__corner-cell" />
                {tiers.map((tier, idx) => (
                  <th
                    key={tier.id}
                    onClick={() => setSelectedTierIdx(idx)}
                    className={`matrix__tier-header ${
                      idx === selectedTierIdx
                        ? "matrix__tier-header--selected"
                        : ""
                    }`}
                  >
                    <div className="matrix__tier-header-inner">
                      <div className="matrix__tier-radio" />
                      <span className="matrix__tier-name">{tier.name}</span>
                      <span className="matrix__tier-price">
                        {tier.isCustomPricing
                          ? "Custom"
                          : `$${tier.pricing.amount}/mo`}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              <tr>
                <td
                  colSpan={tiers.length + 1}
                  className="matrix__section-header"
                >
                  Service Catalog
                </td>
              </tr>

              {setupGroups.map((group) => (
                <ServiceGroupSection
                  key={group.id}
                  group={group}
                  services={groupedServices.get(group.id) || []}
                  tiers={tiers}
                  isSetupFormation={true}
                  isOptional={false}
                  isEnabled={true}
                  onToggle={() => {}}
                  getServiceLevelForTier={getServiceLevelForTier}
                  getUniqueMetricsForService={getUniqueMetricsForService}
                  getUsageLimitForMetric={getUsageLimitForMetric}
                  getLevelDisplay={getLevelDisplay}
                  selectedCell={selectedCell}
                  setSelectedCell={setSelectedCell}
                  handleSetServiceLevel={handleSetServiceLevel}
                  dispatch={dispatch}
                  setupFee={groupSetupFees[group.id]}
                  onAddService={openAddServiceModal}
                  selectedTierIdx={selectedTierIdx}
                />
              ))}

              {ungroupedSetupServices.length > 0 && (
                <ServiceGroupSection
                  key="ungrouped-setup"
                  group={{
                    id: UNGROUPED_ID,
                    name: "Setup & Formation",
                    description: null,
                    isAddOn: false,
                    defaultSelected: true,
                  }}
                  services={ungroupedSetupServices}
                  tiers={tiers}
                  isSetupFormation={true}
                  isOptional={false}
                  isEnabled={true}
                  onToggle={() => {}}
                  getServiceLevelForTier={getServiceLevelForTier}
                  getUniqueMetricsForService={getUniqueMetricsForService}
                  getUsageLimitForMetric={getUsageLimitForMetric}
                  getLevelDisplay={getLevelDisplay}
                  selectedCell={selectedCell}
                  setSelectedCell={setSelectedCell}
                  handleSetServiceLevel={handleSetServiceLevel}
                  dispatch={dispatch}
                  setupFee={groupSetupFees[UNGROUPED_ID]}
                  selectedTierIdx={selectedTierIdx}
                />
              )}

              {regularGroups.map((group) => (
                <ServiceGroupSection
                  key={group.id}
                  group={group}
                  services={groupedServices.get(group.id) || []}
                  tiers={tiers}
                  isSetupFormation={false}
                  isOptional={false}
                  isEnabled={true}
                  onToggle={() => {}}
                  getServiceLevelForTier={getServiceLevelForTier}
                  getUniqueMetricsForService={getUniqueMetricsForService}
                  getUsageLimitForMetric={getUsageLimitForMetric}
                  getLevelDisplay={getLevelDisplay}
                  selectedCell={selectedCell}
                  setSelectedCell={setSelectedCell}
                  handleSetServiceLevel={handleSetServiceLevel}
                  onAddService={openAddServiceModal}
                  selectedTierIdx={selectedTierIdx}
                  dispatch={dispatch}
                />
              ))}

              {ungroupedRegularServices.length > 0 && (
                <ServiceGroupSection
                  key="ungrouped-regular"
                  group={{
                    id: UNGROUPED_ID,
                    name: "Recurring Operational Services",
                    description: null,
                    isAddOn: false,
                    defaultSelected: true,
                  }}
                  services={ungroupedRegularServices}
                  tiers={tiers}
                  isSetupFormation={false}
                  isOptional={false}
                  isEnabled={true}
                  onToggle={() => {}}
                  getServiceLevelForTier={getServiceLevelForTier}
                  getUniqueMetricsForService={getUniqueMetricsForService}
                  getUsageLimitForMetric={getUsageLimitForMetric}
                  getLevelDisplay={getLevelDisplay}
                  selectedCell={selectedCell}
                  setSelectedCell={setSelectedCell}
                  handleSetServiceLevel={handleSetServiceLevel}
                  dispatch={dispatch}
                  selectedTierIdx={selectedTierIdx}
                />
              )}

              <tr className="matrix__total-row">
                <td>SUBTOTAL</td>
                {tiers.map((tier) => (
                  <td key={tier.id} style={{ textAlign: "center" }}>
                    {tier.isCustomPricing
                      ? "Custom"
                      : `$${tier.pricing.amount}`}
                  </td>
                ))}
              </tr>

              {addonGroups.map((group) => (
                <ServiceGroupSection
                  key={group.id}
                  group={group}
                  services={groupedServices.get(group.id) || []}
                  tiers={tiers}
                  isSetupFormation={false}
                  isOptional={true}
                  isEnabled={enabledOptionalGroups.has(group.id)}
                  onToggle={() => toggleOptionalGroup(group.id)}
                  getServiceLevelForTier={getServiceLevelForTier}
                  getUniqueMetricsForService={getUniqueMetricsForService}
                  getUsageLimitForMetric={getUsageLimitForMetric}
                  getLevelDisplay={getLevelDisplay}
                  selectedCell={selectedCell}
                  setSelectedCell={setSelectedCell}
                  handleSetServiceLevel={handleSetServiceLevel}
                  dispatch={dispatch}
                  onAddService={openAddServiceModal}
                  selectedTierIdx={selectedTierIdx}
                />
              ))}

              <tr className="matrix__grand-total-row">
                <td>Grand Total (Recurring)</td>
                {tiers.map((tier, idx) => {
                  const tierPrice = tier.pricing.amount || 0;
                  const grandTotal = tierPrice;

                  return (
                    <td
                      key={tier.id}
                      className={
                        idx === selectedTierIdx
                          ? "matrix__grand-total-cell--selected"
                          : ""
                      }
                      style={{ textAlign: "center" }}
                    >
                      {tier.isCustomPricing ? "Custom" : `$${grandTotal}/mo`}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        {selectedCell && (
          <ServiceLevelDetailPanel
            serviceId={selectedCell.serviceId}
            tierId={selectedCell.tierId}
            services={services}
            tiers={tiers}
            optionGroups={optionGroups}
            dispatch={dispatch}
            onClose={() => setSelectedCell(null)}
          />
        )}

        {addServiceModal && (
          <div className="matrix__modal-overlay">
            <div className="matrix__modal">
              <h3 className="matrix__modal-title">Add New Service</h3>
              <div className="matrix__modal-field">
                <label className="matrix__modal-label">Service Name</label>
                <input
                  type="text"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  placeholder="Enter service name"
                  className="matrix__modal-input"
                  autoFocus
                />
              </div>
              <p className="matrix__modal-hint">
                This service will be added as{" "}
                {addServiceModal.isSetupFormation
                  ? "Setup/Formation"
                  : "Recurring"}
                .
              </p>
              <div className="matrix__modal-actions">
                <button
                  onClick={() => setAddServiceModal(null)}
                  className="matrix__modal-btn matrix__modal-btn--cancel"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddService}
                  disabled={!newServiceName.trim()}
                  className="matrix__modal-btn matrix__modal-btn--primary"
                >
                  Add Service
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

interface ServiceGroupSectionProps {
  group: OptionGroup;
  services: Service[];
  tiers: ServiceSubscriptionTier[];
  isSetupFormation: boolean;
  isOptional: boolean;
  isEnabled: boolean;
  onToggle: () => void;
  getServiceLevelForTier: (
    serviceId: string,
    tier: ServiceSubscriptionTier,
  ) => any;
  getUniqueMetricsForService: (serviceId: string) => string[];
  getUsageLimitForMetric: (
    serviceId: string,
    metric: string,
    tier: ServiceSubscriptionTier,
  ) => ServiceUsageLimit | undefined;
  getLevelDisplay: (serviceLevel: any) => { label: string; color: string };
  selectedCell: { serviceId: string; tierId: string } | null;
  setSelectedCell: (cell: { serviceId: string; tierId: string } | null) => void;
  handleSetServiceLevel: (
    serviceId: string,
    tierId: string,
    level: ServiceLevel,
    existingLevelId?: string,
    optionGroupId?: string,
  ) => void;
  dispatch: DocumentDispatch<ServiceOfferingAction>;
  setupFee?: number | null;
  onAddService?: (groupId: string, isSetupFormation: boolean) => void;
  selectedTierIdx: number;
}

function ServiceGroupSection({
  group,
  services,
  tiers,
  isSetupFormation,
  isOptional,
  isEnabled,
  onToggle,
  getServiceLevelForTier,
  getUniqueMetricsForService,
  getUsageLimitForMetric,
  getLevelDisplay,
  selectedCell,
  setSelectedCell,
  setupFee,
  onAddService,
  selectedTierIdx,
}: ServiceGroupSectionProps) {
  const showGroup = services.length > 0 || onAddService;
  if (!showGroup) return null;

  const headerClass = isSetupFormation
    ? "matrix__group-header--setup"
    : isOptional
      ? "matrix__group-header--optional"
      : "matrix__group-header--regular";

  const rowClass = isSetupFormation
    ? "matrix__service-row--setup"
    : isOptional
      ? "matrix__service-row--optional"
      : "matrix__service-row--regular";

  return (
    <>
      <tr className={`matrix__group-header ${headerClass}`}>
        <td className={`matrix__group-header-sticky ${headerClass}`}>
          <div className="matrix__group-header-inner">
            {isOptional && (
              <button
                onClick={onToggle}
                className={`matrix__group-toggle ${isEnabled ? "matrix__group-toggle--on" : "matrix__group-toggle--off"}`}
              >
                <span className="matrix__group-toggle-knob" />
              </button>
            )}
            <span className="matrix__group-name">{group.name}</span>
          </div>
        </td>
        <td
          colSpan={tiers.length}
          className={headerClass}
          style={{ textAlign: "center" }}
        >
          <span
            className={`matrix__group-badge ${
              isSetupFormation || !isOptional
                ? "matrix__group-badge--included"
                : "matrix__group-badge--optional"
            }`}
          >
            {isSetupFormation
              ? "INCLUDED"
              : isOptional
                ? "OPTIONAL"
                : "INCLUDED"}
          </span>
        </td>
      </tr>

      {services.map((service) => {
        const metrics = getUniqueMetricsForService(service.id);

        return (
          <ServiceRowWithMetrics
            key={service.id}
            service={service}
            metrics={metrics}
            tiers={tiers}
            rowClass={rowClass}
            getServiceLevelForTier={getServiceLevelForTier}
            getUsageLimitForMetric={getUsageLimitForMetric}
            getLevelDisplay={getLevelDisplay}
            selectedCell={selectedCell}
            setSelectedCell={setSelectedCell}
            selectedTierIdx={selectedTierIdx}
          />
        );
      })}

      {onAddService && group.id !== "__ungrouped__" && (
        <tr className={`matrix__add-service-row ${rowClass}`}>
          <td className={rowClass}>
            <button
              onClick={() => onAddService(group.id, isSetupFormation)}
              className="matrix__add-service-btn"
            >
              <svg
                className="matrix__add-service-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              + Add a Service
            </button>
          </td>
          <td colSpan={tiers.length} className={rowClass} />
        </tr>
      )}

      {isSetupFormation && (
        <tr className="matrix__setup-total-row">
          <td>TOTAL SETUP FEE</td>
          <td colSpan={tiers.length} style={{ textAlign: "center" }}>
            {setupFee
              ? `$${setupFee} flat fee (applied to all tiers)`
              : "No setup fee configured"}
          </td>
        </tr>
      )}

      {isOptional && (
        <tr className={`matrix__total-row ${headerClass}`}>
          <td className={headerClass}>SUBTOTAL</td>
          {tiers.map((tier, tierIdx) => {
            const priceDisplay = "$0";

            return (
              <td
                key={tier.id}
                style={{
                  textAlign: "center",
                  background:
                    tierIdx === selectedTierIdx && isEnabled
                      ? "var(--so-violet-200)"
                      : undefined,
                  color:
                    tierIdx === selectedTierIdx && isEnabled
                      ? "var(--so-violet-900)"
                      : undefined,
                }}
              >
                {isEnabled ? priceDisplay : "$0"}
              </td>
            );
          })}
        </tr>
      )}
    </>
  );
}

interface ServiceRowWithMetricsProps {
  service: Service;
  metrics: string[];
  tiers: ServiceSubscriptionTier[];
  rowClass: string;
  getServiceLevelForTier: (
    serviceId: string,
    tier: ServiceSubscriptionTier,
  ) => any;
  getUsageLimitForMetric: (
    serviceId: string,
    metric: string,
    tier: ServiceSubscriptionTier,
  ) => ServiceUsageLimit | undefined;
  getLevelDisplay: (serviceLevel: any) => { label: string; color: string };
  selectedCell: { serviceId: string; tierId: string } | null;
  setSelectedCell: (cell: { serviceId: string; tierId: string } | null) => void;
  selectedTierIdx: number;
}

function ServiceRowWithMetrics({
  service,
  metrics,
  tiers,
  rowClass,
  getServiceLevelForTier,
  getUsageLimitForMetric,
  getLevelDisplay,
  selectedCell,
  setSelectedCell,
  selectedTierIdx,
}: ServiceRowWithMetricsProps) {
  return (
    <>
      <tr className={`matrix__service-row ${rowClass}`}>
        <td className={`matrix__service-cell ${rowClass}`}>
          <span className="matrix__service-title">{service.title}</span>
        </td>
        {tiers.map((tier, tierIdx) => {
          const serviceLevel = getServiceLevelForTier(service.id, tier);
          const display = getLevelDisplay(serviceLevel);
          const isSelected =
            selectedCell?.serviceId === service.id &&
            selectedCell?.tierId === tier.id;

          return (
            <td
              key={tier.id}
              className={`matrix__level-cell ${
                isSelected ? "matrix__level-cell--selected" : ""
              } ${tierIdx === selectedTierIdx ? "matrix__level-cell--highlight" : ""}`}
              onClick={() =>
                setSelectedCell(
                  isSelected
                    ? null
                    : { serviceId: service.id, tierId: tier.id },
                )
              }
            >
              <span
                className="matrix__level-value"
                style={{ color: display.color }}
              >
                {display.label}
              </span>
            </td>
          );
        })}
      </tr>

      {metrics.map((metric) => (
        <tr
          key={`${service.id}-${metric}`}
          className={`matrix__metric-row ${rowClass}`}
        >
          <td className={`matrix__metric-cell ${rowClass}`}>
            <span className="matrix__metric-name">{metric}</span>
          </td>
          {tiers.map((tier, tierIdx) => {
            const usageLimit = getUsageLimitForMetric(service.id, metric, tier);

            return (
              <td
                key={tier.id}
                className={`matrix__metric-value-cell ${
                  tierIdx === selectedTierIdx
                    ? "matrix__level-cell--highlight"
                    : ""
                }`}
              >
                <span className="matrix__metric-value">
                  {usageLimit
                    ? usageLimit.limit
                      ? `Up to ${usageLimit.limit}`
                      : "Unlimited"
                    : "—"}
                </span>
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}

interface ServiceLevelDetailPanelProps {
  serviceId: string;
  tierId: string;
  services: Service[];
  tiers: ServiceSubscriptionTier[];
  optionGroups: OptionGroup[];
  dispatch: DocumentDispatch<ServiceOfferingAction>;
  onClose: () => void;
}

function ServiceLevelDetailPanel({
  serviceId,
  tierId,
  services,
  tiers,
  optionGroups,
  dispatch,
  onClose,
}: ServiceLevelDetailPanelProps) {
  const service = services.find((s) => s.id === serviceId);
  const tier = tiers.find((t) => t.id === tierId);

  if (!service || !tier) return null;

  const serviceLevel = tier.serviceLevels.find(
    (sl) => sl.serviceId === serviceId,
  );
  const usageLimits = tier.usageLimits.filter(
    (ul) => ul.serviceId === serviceId,
  );

  const [newMetric, setNewMetric] = useState("");
  const [newLimit, setNewLimit] = useState("");
  const [customValue, setCustomValue] = useState(
    serviceLevel?.customValue || "",
  );

  const handleAddLimit = () => {
    if (!newMetric.trim()) return;
    dispatch(
      addUsageLimit({
        tierId: tier.id,
        limitId: generateId(),
        serviceId: service.id,
        metric: newMetric.trim(),
        limit: newLimit ? parseInt(newLimit) : undefined,
        resetPeriod: "MONTHLY",
        lastModified: new Date().toISOString(),
      }),
    );
    setNewMetric("");
    setNewLimit("");
  };

  const handleRemoveLimit = (limitId: string) => {
    dispatch(
      removeUsageLimit({
        tierId: tier.id,
        limitId,
        lastModified: new Date().toISOString(),
      }),
    );
  };

  const handleSetLevel = (level: ServiceLevel) => {
    if (serviceLevel) {
      dispatch(
        updateServiceLevel({
          tierId: tier.id,
          serviceLevelId: serviceLevel.id,
          level,
          customValue: level === "CUSTOM" ? customValue : undefined,
          lastModified: new Date().toISOString(),
        }),
      );
    } else {
      dispatch(
        addServiceLevel({
          tierId: tier.id,
          serviceLevelId: generateId(),
          serviceId: service.id,
          level,
          customValue: level === "CUSTOM" ? customValue : undefined,
          lastModified: new Date().toISOString(),
        }),
      );
    }
  };

  const handleUpdateCustomValue = () => {
    if (serviceLevel && serviceLevel.level === "CUSTOM") {
      dispatch(
        updateServiceLevel({
          tierId: tier.id,
          serviceLevelId: serviceLevel.id,
          customValue,
          lastModified: new Date().toISOString(),
        }),
      );
    }
  };

  return (
    <div className="matrix__panel-overlay">
      <div className="matrix__panel">
        <div className="matrix__panel-header">
          <div className="matrix__panel-header-top">
            <span className="matrix__panel-tier">{tier.name} Tier</span>
            <button onClick={onClose} className="matrix__panel-close">
              <svg
                className="matrix__panel-close-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <h3 className="matrix__panel-title">{service.title}</h3>
        </div>

        <div className="matrix__panel-body">
          <div>
            <label className="matrix__panel-section-label">Service Level</label>
            <div className="matrix__panel-level-grid">
              {SERVICE_LEVELS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSetLevel(option.value)}
                  className={`matrix__panel-level-btn ${
                    serviceLevel?.level === option.value
                      ? "matrix__panel-level-btn--active"
                      : ""
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {serviceLevel?.level === "CUSTOM" && (
            <div>
              <label className="matrix__panel-section-label">
                Custom Value
              </label>
              <input
                type="text"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                onBlur={handleUpdateCustomValue}
                placeholder="e.g., Expedited, Basic, Pro"
                className="matrix__panel-input"
              />
            </div>
          )}

          <div>
            <div className="matrix__panel-limits-header">
              <label
                className="matrix__panel-section-label"
                style={{ marginBottom: 0 }}
              >
                Usage Limits / Metrics
              </label>
              <button
                onClick={() => setNewMetric("New Metric")}
                className="matrix__panel-add-btn"
              >
                + Add Limit
              </button>
            </div>

            {usageLimits.map((limit) => (
              <MetricLimitItem
                key={limit.id}
                limit={limit}
                tierId={tier.id}
                dispatch={dispatch}
                onRemove={() => handleRemoveLimit(limit.id)}
              />
            ))}

            {usageLimits.length === 0 && !newMetric && (
              <p className="matrix__panel-empty-text">
                No metrics added yet. Metrics will appear as nested rows under
                this service in the matrix.
              </p>
            )}

            {newMetric && (
              <div className="matrix__panel-edit-form">
                <div>
                  <input
                    type="text"
                    value={newMetric}
                    onChange={(e) => setNewMetric(e.target.value)}
                    placeholder="Metric name (e.g., API Calls, Storage)"
                    className="matrix__panel-input"
                    autoFocus
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={newLimit}
                    onChange={(e) => setNewLimit(e.target.value)}
                    placeholder="e.g., 3, Unlimited, As needed"
                    className="matrix__panel-input"
                  />
                </div>
                <div className="matrix__panel-edit-actions">
                  <button
                    onClick={handleAddLimit}
                    className="matrix__panel-edit-btn matrix__panel-edit-btn--primary"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setNewMetric("");
                      setNewLimit("");
                    }}
                    className="matrix__panel-edit-btn matrix__panel-edit-btn--secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="matrix__panel-footer">
          <button onClick={onClose} className="matrix__panel-done-btn">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

interface MetricLimitItemProps {
  limit: ServiceUsageLimit;
  tierId: string;
  dispatch: DocumentDispatch<ServiceOfferingAction>;
  onRemove: () => void;
}

function MetricLimitItem({
  limit,
  tierId,
  dispatch,
  onRemove,
}: MetricLimitItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editMetric, setEditMetric] = useState(limit.metric);
  const [editLimit, setEditLimit] = useState(limit.limit?.toString() || "");

  const handleSave = () => {
    dispatch(
      updateUsageLimit({
        tierId,
        limitId: limit.id,
        metric: editMetric.trim() || limit.metric,
        limit: editLimit ? parseInt(editLimit) : undefined,
        lastModified: new Date().toISOString(),
      }),
    );
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditMetric(limit.metric);
    setEditLimit(limit.limit?.toString() || "");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="matrix__panel-edit-form">
        <div>
          <label className="matrix__panel-edit-label">Metric Name</label>
          <input
            type="text"
            value={editMetric}
            onChange={(e) => setEditMetric(e.target.value)}
            placeholder="Metric name"
            className="matrix__panel-input"
            autoFocus
          />
        </div>
        <div>
          <label className="matrix__panel-edit-label">Limit Value</label>
          <input
            type="text"
            value={editLimit}
            onChange={(e) => setEditLimit(e.target.value)}
            placeholder="e.g., 3, Unlimited, As needed"
            className="matrix__panel-input"
          />
          <p className="matrix__panel-edit-hint">
            Can be numeric (3) or descriptive (Unlimited, Custom)
          </p>
        </div>
        <div className="matrix__panel-edit-actions">
          <button
            onClick={handleSave}
            className="matrix__panel-edit-btn matrix__panel-edit-btn--primary"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="matrix__panel-edit-btn matrix__panel-edit-btn--secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="matrix__panel-limit-item">
      <div
        className="matrix__panel-limit-content"
        onClick={() => setIsEditing(true)}
      >
        <div className="matrix__panel-limit-metric">{limit.metric}</div>
        <div className="matrix__panel-limit-value">
          {limit.limit ? `Up to ${limit.limit}` : "Unlimited"}
        </div>
      </div>
      <div className="matrix__panel-limit-actions">
        <button
          onClick={() => setIsEditing(true)}
          className="matrix__panel-limit-btn matrix__panel-limit-btn--edit"
          title="Edit metric"
        >
          <svg
            className="matrix__panel-limit-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
        <button
          onClick={onRemove}
          className="matrix__panel-limit-btn matrix__panel-limit-btn--remove"
          title="Remove metric"
        >
          <svg
            className="matrix__panel-limit-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
