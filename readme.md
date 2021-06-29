# ctrler
ctrler (controller) is a plugin to help API management.
The scenario is like `MVC` but focus on `view` and `controller` for front-end developer.
Create a folder named `controller` and put all API together, call it when you need it.
And you can also handle response JSON data at first, return the data what you only need.

## Dependencies
| Package  | Version |
| :------: | :-----: |
| axios    | 0.21.1  |

## Installation
npm
```node 
npm i https://github.com/fryanshenatwork/ctrler
```
or just download dist folder


## Usage
### Create an instance
**axiosInstance** - [axios instance](https://github.com/axios/axios#creating-an-instance)
**dataHandler** - response data first handler
``` javascript
const sampleController = ctrler.create({
      axiosInstance: {
        baseURL: 'https://some-domain.com/api/',
        timeout: 1000,
        headers: {'X-Custom-Header': 'foobar'}
      },
      dataHandler: {
        success: function (res) {
          if (
            res.data &&
            res.data.status === true
          ) {
            return res.data
          } else {
            throw new Error('Response Error') // Response Error
          }
        }
      }
    })
```

### Error state management
The methods to manage error state

**add** - Add new error state
```javascript
 sampleController.error.add({
    code: ['1061', 'Response Error'],
    descript: 'Response Error Message'
})
```
**get** - Get existed error state
Following sample will return same result
```javascript
sampleController.error.get('1061')
sampleController.error.get('Response Error')
```
**rewrite** - Rewrite existed error state
```javascript
sampleController.error.rewrite({
    code: '1061',
    descript: {
        'en': 'Response Data Error',
        'zh-tw': '回應的內容錯誤'
    }
})
```
**remove** - Remove existed error state
```javascript
sampleController.error.remove('1061')
```

### Controller management
**add** - Add controller
`name` (required, unique) - Name of the controller, you will need it to call API
`descript` - Controller description, it will return when error occure
`action` (required) - Can be an object or function to call [axios API](https://github.com/axios/axios#axios-api)
```javascript
sampleController.controller
	.add({
		name: 'server.testing',
		descript: 'Test server is awake',
		action: {
			method: 'get',
			url: 'status'
	}
	.add({
		name: 'server.testing.anotherway',
		descript: 'Test server is awake',
		action: (fetch) => {
			fetch({
				method: 'get',
				url: 'status'
			})
		}
})
```

**remove** - Remove controller
`parms` - String, name of the controller you added
```javascript
sampleController.controller
	.remove('server.testing.anotherway')
```

**use** - The only way to call controller you added
```javascirpt
sampleController.controller.use('server.testing')
	.then((res) => {
		console.log('Response Data', res)
	})
	.catch(ers => {
		console.error('Error occurred', ers)
	})
```

## Developer Documentation
### Development
run `npm run dev` to start dev-server, default port is `8080` you can modify the port in `package.json`

### Production
1. run `npm run build` to compile, and it will build files in `dist/`
2. `index.html` will contain js and css script all you need, copy and replace development path.