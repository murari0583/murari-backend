
// ek method banayega aur export kar dega 
//  agar koi error asyc aur await me aa jaye to wo catch nahi hota 
// isliye asyncHandler banaye hai ki wo error middleware tak pahuch 
// jaye aur ham solve kar de
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch(next);
    };
};

export { asyncHandler };