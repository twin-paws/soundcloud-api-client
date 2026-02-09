export class SoundCloudError extends Error {
  /** HTTP status code */
  status: number;
  /** HTTP status text */
  statusText: string;
  /** SC error code (e.g. "401 - Unauthorized") */
  error?: string;
  /** SC error description */
  errorDescription?: string;
  /** The full response body if available */
  body?: unknown;

  constructor(
    status: number,
    statusText: string,
    body?: { error?: string; error_description?: string; errors?: unknown[] },
  ) {
    const msg =
      body?.error_description || body?.error || `${status} ${statusText}`;
    super(msg);
    this.name = "SoundCloudError";
    this.status = status;
    this.statusText = statusText;
    this.error = body?.error;
    this.errorDescription = body?.error_description;
    this.body = body;
  }

  get isUnauthorized() {
    return this.status === 401;
  }
  get isForbidden() {
    return this.status === 403;
  }
  get isNotFound() {
    return this.status === 404;
  }
  get isRateLimited() {
    return this.status === 429;
  }
}
