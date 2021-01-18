function Promise(executor){
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
        self.callbacks.forEach(item => {
            item.onResolved(data);
        })
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
        self.callbacks.forEach(item => {
            item.onRejected(data);
        })
    }

    try{
        //同步调用【执行器方法】
        executor(resolve,reject);
    } catch(e) {
        //修改promise的状态为"失败"
        reject(e);
    }
}

//添加then方法
Promise.prototype.then = function(onResolved, onRejected){
    return new Promise((resolve,reject) => {
        //调用回调函数
        if(this.PromiseState === 'fulfilled'){
            try{
                //获取回调函数的执行结果
                let result = onResolved(this.PromiseResult);
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
        
        if(this.PromiseState === 'rejected'){
            onRejected(this.PromiseResult);
        }

        //判断pending状态
        if(this.PromiseState === 'pending'){
            //保存回调函数
            this.callbacks.push({
                onResolved: onResolved,
                onRejected: onRejected
            });
        }
    });
}