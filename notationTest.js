   const { Client } = require('@notionhq/client');

   // Replace with your integration token
   const notion = new Client({ auth: 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 });

   // Replace with your database ID
   const databaseId = '2128d94745cf800bb6dfc528311875a8' ;

   (async () => {
     const response = await notion.databases.query({ database_id: databaseId });
     console.log('Database entries:', response.results);
   })();