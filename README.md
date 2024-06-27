# Re-news-er 🗞️

Do you have a DC Library Card? Then use this script to automate renewing your free subscriptions to the NY Times and The Washington Post! 📖🤓📰

## Why script this? 👨‍💻

An awesome benefit of having a DC Library Card is that you can get free access to the NY Times and the Washington Post!

However, there are limits. On the NY Times, the subscription only lasts for **one day**. The Washington Post subscription is a little better, but it still only lasts for **seven days**. 

I'm a lazy programmer who doesn't want to go through the effort of clicking the links on the DC Library's site to renew my subscriptions each day/week, so I wrote a script to do that for me. Now, I don't go a day without having my subscriptions!

## How to use the script 🪄

To use this script:

1. Clone this repo with `git clone git@github.com:jdk2pq/re-news-er.git && cd re-news-er`.
2. Copy `.env.template` to `.env` and add your login credentials to their respective env var.
3. Run `pnpm install` (or your package manager of choice, but I use `pnpm` and recommend you do too).
4. Run `pnpm run start`.

The script supports adding multiple accounts by just appending new objects to the arrays in your `.env` file, so feel free to add as many accounts as you'd like.

## Warning! ⚠️

Using this script _may_ get your IP blocked by bot detection scripts on both sites (but it shouldn't affect your user account). I've seen this most frequently on the NY Times site, and they'll usually give you some kind of captcha to solve to prove you aren't a robot. I'm still hacking away at trying to solve those captchas with this script, but luckily, it seems like the block is temporary, and changing your IP or waiting a day or so gets you unblocked.