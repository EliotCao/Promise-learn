class Promise {
    constructor(executor){
        this.PromiseState = 'pending';
        this.PromiseResult = null;
        this.callbacks = [];
        //保存实例对象的this的值
        const self = this;

        //resolve函数
        function resolve(data){
            //判断状态
            if(self.PromiseState !== 'pending') return;
            //1.修改对象的状态（promiseState）
            self.PromiseState = 'fulfilled';
            //2.设置对象结果值（promiseResult）
            self.PromiseResult = data;
            //调用成功的回调函数
            setTimeout(()=>{
                self.callbacks.forEach(item => {
                    item.onResolved(data);
                });
            });
        }
        //reject函数
        function reject(data){
            //判断状态
            if(self.PromiseState !== 'pending') return;
            //1.修改对象的状态（promiseState）
            self.PromiseState = 'rejected';
            //2.设置对象结果值（promiseResult）
            self.PromiseResult = data;
            //执行回调
            setTimeout(()=>{
                self.callbacks.forEach(item => {
                    item.onRejected(data);
                });
            });
        }

        try{
            //同步调用【执行器方法】
            executor(resolve,reject);
        } catch(e) {
            //修改promise的状态为"失败"
            reject(e);
        }
    }

    then(onResolved, onRejected){
        const self = this;
        //判断回调函数参数
        if(typeof onRejected !== 'function'){
            onRejected = reason => {
                throw reason;
            }
        }
        if(typeof onResolved !== 'function'){
            onResolved = value => value;
        }
        return new Promise((resolve,reject) => {
            //封装函数被
            function callback(type){
                try{
                    //获取回调函数的执行结果
                    let result = type(self.PromiseResult);
                    if(result instanceof Promise){
                        //如果是promise类型的对象
                        result.then(v => {
                            resolve(v);
                        },r => {
                            reject(r);
                        })
                    } else {
                        //结果的对象状态为"成功"
                        resolve(result);
                    }
                }catch(e){
                    reject(e);
                }
            }
            //调用回调函数
            if(this.PromiseState === 'fulfilled'){
                setTimeout(() => {
                    callback(onResolved)
                });
            }
            
            if(this.PromiseState === 'rejected'){
                setTimeout(() => {
                    callback(onRejected);
                });
            }

            //判断pending状态
            if(this.PromiseState === 'pending'){
                //保存回调函数
                this.callbacks.push({
                    onResolved: function(){
                        callback(onResolved);
                    },
                    onRejected: function(){
                        callback(onRejected);
                    }
                });
            }
        });
    }

    catch(onRejected){
        return this.then(undefined,onRejected);
    }

    static resolve(value){
        //返回promise对象
        return new Promise((resolve,reject) => {
            if(value instanceof Promise){
                value.then(v => {
                    resolve(v);
                },r => {
                    reject(r);
                })
            }else{
                //状态设置为成功
                resolve(value);
            }
        });
    }

    static reject(reason){
        return new Promise((resolve,reject) => {
            reject(reason);
        })
    }

    static all(promises){
        //返回结果为Promise对象
        return new Promise((resolve,reject) => {
            let count = 0;
            let arr = [];
            for (let index = 0; index < promises.length; index++) {
                promises[index].then(v => {
                    //得知对象的状态是成功
                    //每个promise对象都成功
                    // resolve();
                    count++;
                    //将当前promise对象成功的结果存入到数组中
                    arr[index] = v;
                    if(count === promises.length){
                        resolve(arr);
                    }
                }, r => {
                    reject(r);
                });
            }
        });
    }

    static race(promises){
        return new Promise((resolve,reject) => {
            for (let index = 0; index < promises.length; index++) {
                promises[index].then(v => {
                    resolve(v);
                }, r => {
                    reject(r);
                });
            }
        })
    }
}