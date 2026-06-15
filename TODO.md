# TODO

- [ ] Update `frontend/src/pages/Dashboard.jsx` search-other stats mapping:
  - [ ] Implement exact API response handling: support `data.data.matchedUser` and direct response object.
  - [ ] Extract submitStats counts using `acSubmissionNum[0..3].count` for total/easy/medium/hard.
  - [ ] Extract username via `username || profile.username`; ranking via `profile.ranking || ranking`.
  - [ ] Ensure state assignment never stores `N/A`; missing fields -> `0`.
  - [ ] Add required debugging logs: raw API response, mapped object before `setSearchedOtherStats`, export object before XLSX.
- [ ] Fix Excel export:
  - [ ] Use `searchedOtherStats` directly after successful state update.
  - [ ] Add guard/disable export button when data not ready.
- [ ] Fix UI:
  - [ ] Render real numbers; if missing, show `0` (no "N/A").

