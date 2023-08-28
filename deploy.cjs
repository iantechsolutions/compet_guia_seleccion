const sql = require('mssql')

async () => {
    try {
        // make sure that any items are correctly URL encoded in the connection string
        await sql.connect('DSN=Axoft;Description=Axoft;UID=Axoft;PWD=Axoft;APP=Microsoft Office XP;WSID=GERNOTE;DATABASE=Compet_SA;Network=DBNM')
        
        const result = await sql.query`SELECT RTRIM(STA11.COD_ARTICU), STA11.TEXTO, STA11.CAMPOS_ADICIONALES, FROM Compet_SA.dbo.STA11`

        console.dir(result)
    } catch (err) {
        console.warn("Ocurrión un error en el proceso de conexión a la base de datos")
        console.error(err)
    }
}