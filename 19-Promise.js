function Promise(executor){
    this.PromistState = 'pending';
    this.PromistResult = null;
    //保存实例对象的this的值
    const self = this;

    //resolve函数
    function resolve(data){
        //1.修改对象的状态（promiseState）
        self.PromistState = 'fulfilled';
        //2.设置对象结果值（promiseResult）
        self.PromistResult = data;
    }
    //reject函数
    function reject(data){
        //1.修改对象的状态（promiseState）
        self.PromistState = 'rejected';
        //2.设置对象结果值（promiseResult）
        self.PromistResult = data;
    }

    try{
        //同步调用【执行器方法】
        executor(resolve,reject);
    } catch(e) {
        //修改promise的状态为‘失败’
        reject(e);
    }
    
}

//添加then方法
Promise.prototype.then = function(onResolved, onRejected){

}