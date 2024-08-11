const sql = require('mssql')
const fs = require('fs')
const child_process = require('node:child_process')

const main = async () => {
    try {
        // make sure that any items are correctly URL encoded in the connection string
        const conn = await sql.connect(
            'Server=COMPET01\\AXSQLEXPRESS;DSN=Axoft;Description=Axoft;UID=Axoft;PWD=Axoft;APP=Microsoft Office XP;WSID=GERNOTE;DATABASE=Compet_SA;Network=DBNM;Encrypt=false'
        )

        console.log('Se conectó a la base de datos')

        const result = await sql.query`SELECT STA11.COD_ARTICU, STA83.TEXTO, STA11.OBSERVACIONES, STA11.CAMPOS_ADICIONALES
        FROM Compet_SA.dbo.STA11 STA11, Compet_SA.dbo.STA83 STA83
        WHERE STA11.COD_ARTICU = STA83.COD_ARTICU`

        console.log('Se cargaron', result.recordset.length, 'productos')

        fs.writeFileSync(
            './src/pages/api/data.json',
            JSON.stringify(result.recordset)
        )

        console.log('Se generó el archivo data.json')

        conn.close()

        console.log('Se cerró la conexión a la base de datos')

        console.log('Build ... (puede tardar) ...')
        child_process.execSync('npm run build', { stdio: 'inherit' })

        console.log('Deploy to Firebase ... (puede tardar) ...')
        child_process.execSync('firebase deploy', { stdio: 'inherit' })

        console.log('TODO TERMINADO!!!')

        process.exit(0)
    } catch (err) {
        console.warn('Ocurrión un error en el proceso')
        console.error(err)
    }
}

main()
