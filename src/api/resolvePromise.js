// copied from lab

export function resolvePromise(prms, promiseState, afterPromiseCallback = null){
    if (prms == null){
        return;
    }
    // Setting the promise state promise to prms
    promiseState.promise = prms;
    // Setting the data and error to null
    promiseState.data = null;
    promiseState.error = null;
    promiseState.isDone = false;

    // Handling the promise
    prms.then(promiseACB).catch(errorPrmsACB);

    function promiseACB(data){
        if (promiseState.promise === prms){
            promiseState.data = data;
            promiseState.isDone = true;
            if (afterPromiseCallback) {
                afterPromiseCallback(data);
            }
        }
    }
    
    function errorPrmsACB(error){
        if (promiseState.promise === prms){
            promiseState.error = error;
        }
    }
}