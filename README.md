# Promise尚硅谷课程 BV1GA411x7z1

# Promise 

https://www.bilibili.com/video/BV1GA411x7z1

Promise是对异步操作的封装，支持链式调用，解决回调地狱问题。

```
const p = new Promise((resolve,reject) => {
	//...
})

p.then(() => {
	//成功
},() => {
	//失败
})
```

## promise对象状态属性

### PromiseState

pending (未决定的)-> resolved / fullfilled（成功的）

pending -> rejected（失败）

只有这两种，且一个promise对象只能改变一次。

### PromiseResult

保存对象成功/失败的结果

### 工作流程

![](C:\Users\RZNQGT\Desktop\Screenshot 2021-01-13 094025.png)

## API

### 构造函数Promise(excutor){}

```javascript
executor函数：执行器，(resolve,reject) => {}
resolve函数：内部定义成功时调用的函数value => {}
reject函数：内部定义成功时调用的函数value => {}
说明：executor函数在promise内部立即同步调用，异步操作在执行器中执行。
```

### then

```javascript
(onResolved,onRejected) => {}
onResolved函数：成功的回调函数 (value) => {}
onRejected函数：失败的回调函数 (value) => {}
```

### catch

```javascript
(value) => {}
//内部由then方法实现
```

### resolve

```javascript
//属于promise函数对象，而非示例对象
//如果参数为 非Promise类型的对象，则返回结果为成功的Promise对象
//如果参数为 Promise类型的对象，则参数的结果决定了resolve的结果
```

### reject

```javascript

```

### all

```javascript
promises => {} 
//返回一个新的promise,等待所有promise执行完成，结果为所有成功的promise的结果
//若存在失败则状态为失败，结果为失败priomise的结果
```

### race

```javascript
promises => {} 
//返回一个新的promise,第一个执行完成promise状态就是的结果的状态
```

## 关键问题

### 对象状态修改

```javascript
//1.resolve
resollve('ok')
//2.reject
reject('error')
//3.抛出错误
throw 'error'

```

### 执行多个回调

```javascript
//指定的多个回调在对应状态（成功/失败）都会调用

//改变promise状态和指定回调函数先后
//1.都有可能，正常情况下是先指定回调再改变状态，但也可以先改状态再指定回调
//2.如何先改变状态再指定回调？
//	  1.在执行器中直接调用resolve()/reject()（同步任务）
//	  2.延迟更长时间才调用then()
//3.什么时间才能得到数据？
//	  1.如果先指定的回调，那当状态发生改变时，回调函数就会调用，得到数据
//    2.如果先改变的状态，那当指定回调时，回调函数就会调用，得到数据

//改变状态与回调执行顺序
//代码块为同步代价时，先改变状态（resolve/reject）然后执行回调，异步代码块时，反之

//回调执行时机
//如果是先改变状态，则调用then方法时执行回调
//如果是先指定回调，再改变状态，则改变状态之后执行回调
```

### then方法返回结果

```javascript
//返回为一个Promise,其状态由then指定的回调执行的结果决定。
//1.抛出错误 则返回为reject,值为抛出的错误
//2.非promise对象，返回成功，值为非promise对象
//3.promise，返回由该promise决定
```

### 串联多个任务

```javascript
let p = new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve('ok');
    },1000);
});

p.then(value => {
    return new Promise((resolve,reject) => {
        resolve('ok');
    });
}).then(value => {
    console.log(value);
}).then(value => {
    console.log(value);
})
```

### 异常穿透

```javascript
let p = new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve('ok');
        // reject('error');
    },1000);
});

p.then(value => {
    console.log(111);
    throw '抛出错误'
}).then(value => {
    console.log(222);
}).then(value => {
    console.log(333);
}).catch(reason => {
    console.log(reason);
})
```

### 中断promise链

```javascript
let p = new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve('ok');
        // reject('error');
    },1000);
});

p.then(value => {
    console.log(111);
    //有且仅有一个方式，返回pending状态的primise
    return new Promise(() => {});
}).then(value => {
    console.log(222);
}).then(value => {
    console.log(333);
}).catch(reason => {
    console.log(reason);
})
```

## 自定义封装