# Discord Bad Domains

This repo holds three lists; Discord's "bad domains" list with the associated domain (if found), my list of phishing/scamming sites and my list with their hashes.

## Developer or Bot Developer?
If you wish to check against the list for auto-banning you can with:
```
POST https://bad-domains.walshy.dev/check

Content-Type: application/json

{"domain": "example.com"}
```

which will return:
```json
{
    "badDomain": true|false,
    "detection": "discord|community",
}
```

You can decide what to do based on the result. The fields are as follows:
* `badDomain`: If the domain is found in the community or official list.
* `detection`: The method of detection. `discord` means it's on the official banned list; `community` means it's on the community list.

### Want to help?
If you wish to submit a bad domain then simply send a request like so:

```
POST https://bad-domains.walshy.dev/report

Content-Type: application/json

{"domain": "bad-domain.com"}
```

This will check against the bad domain list and if it's a match, update the list. Otherwise, it will report it to me and I will manually review.

## Access the lists
Unlimited access to `bad-domains.json` and `domains.txt` with the following endpoints:

* GET https://bad-domains.walshy.dev/bad-domains.json
* GET https://bad-domains.walshy.dev/domains.txt (or https://bad-domains.walshy.dev/domains.json if you prefer)