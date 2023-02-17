module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true,
        "jquery": true
    },
    "extends": "eslint:recommended",
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
    },
    "plugins": [
        "html"
    ],
    "globals": {
        "videojs": true,
        "Sortable":true,
        "emotions":true,
        "mental_states":true,
        "identity":true,
        "traits":true,
        "emotion_sorter":true,
        "mental_state_sorter":true,
        "identity_sorter":true,
        "trait_sorter":true
    }
}
