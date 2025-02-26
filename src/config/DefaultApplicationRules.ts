/* eslint-disable no-irregular-whitespace */
export const defaultApplicationRules = {
  storage: {
    limit: 50 * 1024, // 50 MB
  },
  documents: {
    uploadFiles: 5,
    maxSize: 10 * 1024, // 10 MB
  },
  sessions: {
    maxSessionsPerFile: 50,
  },
}
