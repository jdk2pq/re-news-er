# Re-news-er

Automate renewing your free subscriptions to the NY Times and The Washington Post!

## Why script this?

In DC, all DC Library Card members get free access to the NY Times and the Washington Post.

However, Access to the NY Times must be refreshed every day, while access to the Washington Post must be refreshed every 7 days. I'm lazy, and a programmer, so I wrote a script to go click the right links and log in to my accounts for me so that I don't go a day without having my subscription available.

## How to use the script

To use this script, simply copy `.env.template` to `.env` and add your login credentials to their respective env var.

There is support for adding multiple accounts by just appending new objects to the list, so feel free to add as many accounts as you'd like.

Then, just run `pnpm run start`, and the script should take care of the rest!
