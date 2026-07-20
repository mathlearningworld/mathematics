/**
 * ──────────────────────────────────────────────
 * Mathematics Platform — Knowledge Graph Errors
 * ──────────────────────────────────────────────
 * Pure error types for Knowledge Graph integrity contracts.
 * No Prisma, HTTP, or environment dependencies.
 * ──────────────────────────────────────────────
 */

/**
 * Stable error codes for Knowledge Graph contract violations.
 */
export const ErrorCodes = Object.freeze({
  KNOWLEDGE_INVALID_STATE_TRANSITION: "KNOWLEDGE_INVALID_STATE_TRANSITION",
  KNOWLEDGE_CODE_IMMUTABLE: "KNOWLEDGE_CODE_IMMUTABLE",
  KNOWLEDGE_VERSION_CONFLICT: "KNOWLEDGE_VERSION_CONFLICT",
  KNOWLEDGE_ENDPOINT_NOT_FOUND: "KNOWLEDGE_ENDPOINT_NOT_FOUND",
  KNOWLEDGE_ENDPOINT_RETIRED: "KNOWLEDGE_ENDPOINT_RETIRED",
  KNOWLEDGE_DUPLICATE_DEPENDENCY: "KNOWLEDGE_DUPLICATE_DEPENDENCY",
  KNOWLEDGE_SELF_DEPENDENCY: "KNOWLEDGE_SELF_DEPENDENCY",
  KNOWLEDGE_REQUIRED_CYCLE: "KNOWLEDGE_REQUIRED_CYCLE",
  KNOWLEDGE_PUBLICATION_BLOCKED: "KNOWLEDGE_PUBLICATION_BLOCKED",
  KNOWLEDGE_RETIREMENT_BLOCKED: "KNOWLEDGE_RETIREMENT_BLOCKED",
});

/**
 * KnowledgeGraphContractError — thrown when a Knowledge Graph integrity
 * contract is violated.
 *
 * @param {string} code — one of the ErrorCodes values
 * @param {string} message — human-readable description
 * @param {object} [details] — optional structured context
 */
export class KnowledgeGraphContractError extends Error {
  /**
   * @param {string} code
   * @param {string} message
   * @param {object} [details]
   */
  constructor(code, message, details) {
    super(message);
    this.name = "KnowledgeGraphContractError";
    this.code = code;
    this.message = message;
    this.details = details ?? {};
  }
}
