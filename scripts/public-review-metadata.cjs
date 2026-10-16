'use strict';
// Project private reviewer identifiers without changing reviewed content or QA state.
const reviewerKeys = new Set(['reviewer', 'independentReviewer', 'finalHashVerifiedBy', 'blindReviewer']);
function projectReviewMetadata(value, publicReviewer = 'independent-content-review') {
  if (Array.isArray(value)) return value.map(item => projectReviewMetadata(item, publicReviewer));
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).map(([key, entry]) => {
    const privateIdentifier = typeof entry === 'string' && (/^[a-z][a-z0-9]*(?:_[a-z0-9]+)+$/.test(entry) || /\/(?:workspace|home|Users|root|agent_notes)\//.test(entry));
    return [key, reviewerKeys.has(key) && privateIdentifier
      ? (key === 'blindReviewer' ? 'independent-blind-review' : publicReviewer)
      : projectReviewMetadata(entry, publicReviewer)];
  }));
}
module.exports = { projectReviewMetadata };
