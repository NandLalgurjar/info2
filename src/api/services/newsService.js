exports.allNews=async(req)=>{
    try{

        

    }catch(err){
        console.log(err);
        throw err;   
    }
}






exports.allCoins=async(req)=>{

    try{
        let authToken="26854dccd246c7e9295b4e1d80771c39fa739837";
        let data=await axios.get(`https://cryptopanic.com/api/v1/posts/?auth_token=${authToken}`);
        return {
            status:200,
            message:"Data fetched successfully",
            data:data
        } 

    }catch(err){
        console.log(err);
        throw err;
    }
}


exports.byCoinId=async(req)=>{
    try{
        let authToken="26854dccd246c7e9295b4e1d80771c39fa739837";
        let coinId=req.query.coinId;
        let data=await axios.get(`https://cryptopanic.com/api/v1/posts/?auth_token=${authToken}&currencies=${coinId}`);
        return {
            status:200,
            message:"Data fetched successfully",
            data:data
        } 


    }catch(err){
        console.log(err);
        throw err;
    }
}


exports.videoNews=async(req)=>{
    try{
        let authToken="26854dccd246c7e9295b4e1d80771c39fa739837";
       
        let data=await axios.get(`https://cryptopanic.com/api/v1/posts/?auth_token=${authToken}&kind=media`);
        return {
            status:200,
            message:"Data fetched successfully",
            data:data
        }  

    }catch(err){
        console.log(err);
        throw err;  
    }
}