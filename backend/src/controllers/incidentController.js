 const connection = require('../database/connection');
 
 module.exports = {
     async index(request,response) {
        const {page = 1} = request.query;
        
        const count = await conneciton ('incidents').count();

        console.log(count);

        const incidents = await connection('incidents')
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
            .limit(5)
            .offset((page -1) * 5)
            .select(['incidents.*','ong.name', 'ong.email', 'ongs.whatsapp', 'ong.city', 'ong.uf']);
            
            response.header('X total-count', count['count(*)'])
           
        return response.json(incidents);
     },     
        async create(request, response){
        const {title, description,value} = request.body;
        const ong_id = request.headers.authorization;

    const [id] = await connection ('incidents').insert({
            title,
            description,
            value,
            ong_id,
        });

        return response.json({id});

     },

     async delete(request, response) {
         const {id} = request.params;
         const ong_id = request.headers.authorization;

         const incident = await connection('incidents')
            .where('id',id)
            .select('ong_id')
            .first();

             


     }
 };