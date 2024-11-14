# Custom Nodemon

A lightweight and customizable file watcher for Node.js applications that automatically restarts your application when file changes are detected, similar to the original Nodemon.

## Features

- Automatically restarts your Node.js application on file changes.
- Customizable watch directory and entry file.
- Lightweight and easy to use.

## Installation

You can install the package globally using npm. First, ensure you have [Node.js](https://nodejs.org/) and npm installed on your machine.

1. **Install the package locally:**

   ```bash
   npm install my-package
   ```

2. **Configure your entry point in your package.json:**

    ```json
        "nodemon": "npx my-nodemon <ENTRY_POINT>"
    ```
