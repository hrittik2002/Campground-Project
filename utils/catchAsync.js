/***
 * we have passed a function func as parameter.........then we returned that same
 * function func but if it catches error then we go for next  
 */

module.exports = func => {
    return (req , res , next)=>{
        func(req , res , next).catch(next);
    }
}