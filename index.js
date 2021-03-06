const express = require('express')
const config = require('config')
const pg = require('pg')
const port = process.env.PORT || config.get("server.port")

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const listaPedidos = []
const pool = new pg.Pool ({
    connectionString: "postgres://dfklydznfnfkjg:92047acfb7be3dcfce573bbdbe6f1f3aca1989f5193c2a3b738796c510cc2e9c@ec2-54-205-183-19.compute-1.amazonaws.com:5432/df87khmiok88e3",
    ssl: {
        rejectUnauthorized: false
    }
})

app.route('/reset').get((req, res) => { 
    let qry = "DROP TABLE IF EXISTS pedidos;"
    qry += "CREATE TABLE pedidos ("
    qry += "cliente char(200),"
    qry += "sabor char(50),"
    qry += "quantidade int,"
    qry += "tamanho char(25)"
    qry += ");"
    pool.query(qry, (err, dbres) => {
        if (err) { 
            res.status(500).send(err)
        } else { 
            res.status(200).send("Banco de dados resetado")
        }
    })
})

app.route('/pedidos').get((req, res) => {
    console.log("/pedidos acionado")
    let qry = "SELECT * FROM pedidos;"
    pool.query(qry, (err, dbres) => { 
        if(err) { 
            res.status(500).send(err)
        } else { 
            res.status(200).json(dbres.rows)
        }
    });
})

app.route('/pedido/adicionar').post((req, res) => { 
    console.log("/pedido/adicionar acionado")
    let qry = "INSERT INTO pedidos (cliente, sabor, quantidade, tamanho) "
    qry += ` VALUES ('${req.body.cliente}', '${req.body.sabor}', ${req.body.quantidade}, '${req.body.tamanho}');`
    pool.query(qry, (err, dbres) => { 
        if (err) { 
            res.status(500).send(err)
        } else { 
            res.status(200).send("Pedido adicionado com sucesso")
        }
    });
})

app.listen(port, () => { 
    console.log("Iniciando o servidor na porta ", port)
})

console.log("Inicio do projeto")