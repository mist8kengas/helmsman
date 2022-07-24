# Helmsman

CI/CD from GitHub to your own servers

### Description

Helmsman is a microservice that allows you to have CI/CD features on your own server

### Prerequisites/Dependencies

-   Public-facing server via port forwarding or reverse proxying (nginx/ngrok)
-   [Node](https://nodejs.org/)
-   [Node Package Manager (npm)](https://www.npmjs.com/)

### Installation

```bash
# download/clone the repository
git clone https://github.com/mist8kengas/helmsman

# install the required packages
npm install

# build the program
npm run build

# start Helmsman
npm start
```

### Configuration (.env file)

Copy the contents of the example environment file `.env.example` to `.env` and modify the contents:
| Variable | Description | Required | Default |
| --------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| **HELMSMAN_HTTP_PORT** | Port the web server listens to | | `5000` |
| **HELMSMAN_HTTP_ADDR** | Address the web server listens to | | `localhost` |
| **HELMSMAN_WEBHOOK_SECRET** | Secret used in the webhook on your GitHub repository. [How to set your secret token](https://docs.github.com/en/developers/webhooks-and-events/webhooks/securing-your-webhooks#setting-your-secret-token) | Yes | _N/A_ |

### Configuration (setting up CI/CD)

When you first run the program, an empty JSON file `ci_cd.json` will be created automatically in the `./var/config` directory, this is where you will configure your CI/CD

The structure of this file is:

```json
{
    "<username>/<repository>/<branch>": {
        "<event>": "<command>"
    }
}
```

-   `<username>/<repository>` is the full name of the repository (eg: [mist8kengas/helmsman](https://github.com/mist8kengas/helmsman))
-   `<branch>` is the target branch in the repository. **OPTIONAL**
-   `<event>` refers to the name of the event that triggered the webhook (eg: `ping`, `push`, `release`, etc.) [See all the possible event names here](https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads)
-   `<command>` will be executed by the program, so be careful what you put in here. Similar to command-execution via CLI (eg: `echo "Hello!"`)

### Creating the webhook

Once you have finished configuring Helmsman, it's time to create the webhook on your GitHub repository

1. Go to the Settings of your repository
2. Under 'Code and automation', click on 'Webhooks'
3. Click 'Add webhook'
4. Set 'Payload URL' to the public URL of Helmsman with appended path `/webhook` (eg: `https://example.com/webhook`)
5. Set 'Content type' to `application/json`
6. Set 'Secret' to the secret you set in your `.env` file
7. Select which events would you like to be sent to Helmsman
8. Click on 'Add webhook' and you're set!

_**NOTE** If you are not using SSL: After you have finished adding the webhook, edit your webhook and disable 'SSL verification'._
