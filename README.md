# Odnoklassniki app sdk

## Usage

```js
import OKSDK from '@odnoklassniki/ok-apps-sdk';

// Init SDK
await OKSDK.init();
```

For use in a browser, include the file [`dist/browser.min.js`](https://unpkg.com/@odnoklassniki/ok-apps-sdk/dist/browser.min.js) and use as follows

```html
<script src="https://unpkg.com/@odnoklassniki/ok-apps-sdk/dist/browser.min.js"></script>

<script>
    // Init SDK
    OKSDK.init()
        .then(mode => {...})
        .catch(error => {...});
</script>
```

## API Reference

### `OKSDK.Methods`

Contains groups of methods that avalable and recommended for use

Some of them return promise with response 

**Response fields**

- `status` Text with status _ok_ | _error_
- `data` Data of response _string_ | _boolean_ | _number_ | _object_

**Example**
```js
const {status, data: appId} = await OKSDK.Methods.Utils.getAppId();
```

Some of them return value synchronously

**Example**
```js
const isSupported = OKSDK.Methods.Utils.isSupported(); // boolean
```

Some of them need callback to be provided

**Callback arguments**

- `status` Text with status _ok_ | _error_
- `data` Data of response _string_ | _boolean_ | _number_ | _object_

**Example**
```js
const callback = (status, data) => {
    console.log(data);
};

OKSDK.Methods.Utils.observeServiceCallbacks('DEVICE_ORIENTATION', callback);
```

### `OKSDK.invoke`
### `OKSDK.invokeUIMethod` @Depricated

This methods allow you to call methods as it was done in previous versions of SDK

**Parameters**

- `method` _required_ Method name
- `params` _optional_ Array of parameters
- `callback` _optional_ Callback for getting result

**Example**

```js
// Sending event to client
OKSDK.invoke('joinGroup', [groupId], ({status, data}) => {});
```

### `OKSDK.Client.call`

Call API methods

**Parameters**

- `params` _required_ Object with call params including method name
- `callback` _optional_ A function that will be called after the server responds
- `resig` _optional_ Required when it is necessary to request user confirmation for any action through a separate preview. In all other cases, call the function with only 2 parameters.

Method can be used with callback or with promise

**Example**

```js
// Sending event to client
const params = {
    "method":"friends.get"
};

const callback = (status, data, error) => {
    if (error) {
        processError(error);
    } else {
        processFriendIds(data);
    }
};

OKSDK.Client.call(params, callback);
```

OR 

```js
// Sending event to client
const params = {
    "method":"friends.get"
};

const data = await OKSDK.Client.call(params);
```

