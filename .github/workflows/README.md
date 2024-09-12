# Deploy to Vercel

- [Deploy to Vercel](#deploy-to-vercel)
  - [Required Secrets](#required-secrets)
    - [APP\_ENVIRONMENT\_VARIABLES](#app_environment_variables)
    - [VERCEL\_TOKEN](#vercel_token)
    - [VERCEL\_ORG\_ID](#vercel_org_id)
    - [VERCEL\_PROJECT\_ID](#vercel_project_id)

## Required Secrets

The GitHub repo must have the following
GitHub Actions' secrets properly set:

```plain
APP_ENVIRONMENT_VARIABLES
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

### APP_ENVIRONMENT_VARIABLES

is a one-line string contains all the environment
variables required to build the app (i.e. the content
of a `.env.local` file). Note that:

1. Those variables must be valid, but they need
    not be *correct in production*. For example,
    FRONTEND_SECRET could be a dummy secret which
    is not used in production (while it is still
    valid as a secret, i.e. doesn't contain invalid
    characters etc.) This is because **the build**
    **is only required to run tests in a CI/CD**
    **environment, not the production environment.**
    This is called *building for testing only*.

2. If there are several environment variables, replace
    each newline as its escaped form `\n`. For example,
    if you want the following content of `.env.local`
    to be used when *building for testing only*:

    ```sh
    A=1
    B=text
    ```

    then you should set `APP_ENVIRONMENT_VARIABLES`
    secret as follows:

    ```plain
    A=1\nB=text
    ```

    Note that GitHub automatically escapes the backslashes
    `\` for you, so no need to write `A=1\\nB=text`.

### VERCEL_TOKEN

Go to <https://vercel.com/account/tokens>, create a
new token, then use it as the value of `VERCEL_TOKEN`
secret. Of course, you must have logged in to Vercel
with the account that is expected to be used to
deploy this app.

### VERCEL_ORG_ID

Go to <https://vercel.com>, select the right organization
in the Organization Selector (or **Scope Selector**) at the
top left corner of the dashboard.

*The right organization* is the org/scope that contains
the project to be deployed!

Then, click the **Settings** menu item. In the
left sidebar, select **General**. Scroll down
till you see **Team ID**. Copy the value of that
box and set it as the value of `VERCEL_ORG_ID`
secret.

### VERCEL_PROJECT_ID

Go to the project's dashboard on Vercel. Click
the **Settings** menu item. In the left sidebar,
select **General**. Scroll down till you see
**Project ID**. Copy the value of that box and
set it as the value of `VERCEL_PROJECT_ID`
secret.
