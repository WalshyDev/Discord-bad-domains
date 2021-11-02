# Discord Bad Domains

This repo holds three lists; Discord's "bad domains" list with the associated domain (if found), my list of phishing/scamming sites and my list with their hashes.

## Want to help?
If you wish to submit a bad domain then simply send a request like so:
```
POST https://bad-domains.walshy.dev/report

Content-Type: application/json

{"domain": "bad-domain.com"}
```

This will check against the bad domain list and if it's a match, update the list.