# Mushroom Observer Mobile

## Introduction

This is the Mushroom Observer mobile application. It is a React Native app for iOS and Android with the goal of allowing users to create observations and upload photos from their mobile device and while in the field.

## Setup

- Follow the instructions for [setting up a React Native development environment](https://reactnative.dev/docs/environment-setup) until you reach the section "Creating a new application"
- Clone this repository from GitHub using `git clone git@github.com:MushroomObserver/mushroom-observer-mobile.git`
  - Follow the instructions for [adding an SSH key to your GitHub account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) if you do not already have one added
- Navigate into the project directory using `cd mushroom-observer-mobile` and then run `npm install`
- Create `.env.development` based on `.env.template`
  - Set `MUSHROOM_OBSERVER_API_URL` to `http://localhost:3000` if using [developer-startup](), or `https://www.mushroomovserver.org` for the live site
  - Set `MUSHROOM_OBSERVER_API_KEY` to one you create on your local development server or the live site
    - To create an API key, go to your Mushroom Observer account preferences and then click "API Key Manager" on the right side
    - Enter a name for your API key and then click "Create a New Key"
    - Use the new key as your app's API key

## Development

- Run `npm start` to start the build server
- In another terminal instance, run `npm run android-dev` to start the app on an Android emulator or run `npm run ios-dev` to start the app in an iOS simulator
- Changes should be reflected after a file save

## Reference Material

- [TypeScript](https://www.typescriptlang.org/docs/) - JavaScript with type support
- [React Native](https://reactnative.dev/docs/getting-started) - Cross platform development
- [Redux Toolkit](https://redux-toolkit.js.org/introduction/getting-started) - Redux helpers for data management
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) - Data fetching that works with Redux Toolkit
- [RNUILib](https://wix.github.io/react-native-ui-lib/) - UI Toolkit for React Native

Information about more specific packages or tools can generally be found at their GitHub repositories.

If you'd like to become an active contributor, please send us a message.
