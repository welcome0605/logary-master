# Logary Stackdriver


 - [Access Control][access-control]
 - [Roles][roles]
 - [Granting, changing and revoking access][policies]
 - [Service Accounts overview][sa-o]

Want a quick-start? Install the [Rutta Helm chart][helm]

You can run the following to set up a GCP service account with the right permissions;

```bash
gcloud iam service-accounts get-iam-policy logary-ci-writer@logary-ci.iam.gserviceaccount.com
gcloud projects add-iam-policy-binding logary-ci \
    --member serviceAccount:logary-ci-writer@logary-ci.iam.gserviceaccount.com \
    --role roles/logging.logWriter
```

So in your case, if you're using [Rutta][rutta], you can configure it like this;

```bash
export RUTTA_SA_NAME="logary-rutta"
export PROJECT_ID="corp-stage"
export RUTTA_SA_EMAIL="${RUTTA_SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

# Create it
gcloud iam service-accounts --project "${PROJECT_ID}" create "${RUTTA_SA_NAME}" \
  "--display-name=${RUTTA_SA_NAME}"

# Configure its permissions
gcloud iam service-accounts get-iam-policy "${RUTTA_SA_EMAIL}"
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
    --member "serviceAccount:${RUTTA_SA_EMAIL}" \
    --role roles/logging.logWriter

# Create its key
gcloud iam service-accounts keys create "${RUTTA_SA_NAME}.json" \
    --iam-account "${RUTTA_SA_EMAIL}"
```

If you've set this up with the Helm chart (and you've configured your ingresses), you can now test your logging with:

    curl -X POST -d '{"message": "Hello world"}' https://api.example.com/i/logary -i

 [access-control]: https://cloud.google.com/logging/docs/access-control
 [roles]: https://cloud.google.com/iam/docs/granting-roles-to-service-accounts
 [policies]: https://cloud.google.com/iam/docs/granting-changing-revoking-access
 [sa-o]: https://cloud.google.com/iam/docs/understanding-service-accounts
 [helm]: https://github.com/logary/logary/tree/master/src/services/rutta-helm-chart/README.md
