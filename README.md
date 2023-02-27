<!-- Centered part -->
<div align="center">
  <h1>rules.art.js</h1>
  <p>Use rules.art API more easily.</p>
  <!-- Badges -->
  <p>
    <a href="https://www.npmjs.com/package/rules.art.js"><img src="https://img.shields.io/npm/v/rules.art.js.svg?style=flat-square" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/rules.art.js"><img src="https://img.shields.io/npm/dm/rules.art.js.svg?style=flat-square" alt="NPM downloads" /></a>
    <a href="https://www.npmjs.com/package/rules.art.js"><img src="https://img.shields.io/npm/l/rules.art.js.svg?style=flat-square" alt="License" /></a>
  </p>
</div>

---

## Installation

```bash
$ npm install rules.art.js
```

## Usage

```ts
import { Client } from 'rules.art.js';

const client = new Client();

client.login("email@example.com", "password").then((response) => {
    if (response.needs2FA) {
        client.twoFactorSignIn(response.twoFactorSecret, "123456").then((res) => {
            console.log("Logged in as", res.username,"!");
        });
    }
});
```

Then, start cooking!
