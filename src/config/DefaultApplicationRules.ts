/* eslint-disable no-irregular-whitespace */
export const defaultApplicationRules = {
  storage: {
    limit: 5 * 1024, // 50 MB
  },
  documents: {
    uploadFiles: 1,
    maxSize: 10 * 1024, // 10 MB
  },
  heatmaps: {
    sessions: 5,
  },
}
