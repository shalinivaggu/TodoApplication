https://github.com/shalinivaggu/TodoApplication.git
      driver: sqlite3.Database,
    })

    app.listen(3000, () => {
      console.log('Server Started....')
    })
  } catch (e) {
    console.log(`error found \n ${e}`)
    process.exit(1)
  }
}

InitializeServer()

app.get('/todos/', async (request, response) => {
  const {status, priority, search_q} = request.query

  let getQuery = ''

  if (status && priority) {
    getQuery = `
      SELECT * FROM todo WHERE status = "${status}" AND priority = "${priority}";
    `
  } else if (status && !priority) {
    console.log('priority undefined')
    getQuery = `
      SELECT * FROM todo WHERE status = "${status}";
    `
  } else if (!status && priority) {
    getQuery = `
      SELECT * FROM todo WHERE priority = "${priority}";
    `
  } else {
    getQuery = `
      SELECT * FROM todo WHERE todo LIKE "%${search_q}%";
    `
  }

  try {
    const dbResponse = await db.all(getQuery)
    response.send(dbResponse)
  } catch (error) {
    console.error(`Error Found: ${error}`)
    response.status(500).send('Internal Server Error')
  }
})

app.get('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params

  const getQuery = `
  select * from todo where id = ${todoId};
  `
  const dbResponse = await db.get(getQuery)
  response.send(dbResponse)
})

app.post('/todos/', async (request, response) => {
  const requestDetails = request.body

  const {id, todo, priority, status} = requestDetails

  const getQuery = `
  insert into todo (id , todo , priority , status) 
  values (${id} , "${todo}" , "${priority}" , "${status}");
  `
  try {
    const dbResponse = await db.run(getQuery)
    response.send('Todo Successfully Added')
  } catch (e) {
    console.log(`error found.....\n${e}`)
  }
})

app.put('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params

  const {status, priority, todo} = request.body

  if (status) {
    let getQuery = `
    UPDATE todo
    set status = "${status}" 
    where id = ${todoId};
    `

    await db.run(getQuery)
    response.send('Status Updated')
  }

  if (priority) {
    let getQuery = `
    UPDATE todo
    set priority = "${priority}" 
    where id = ${todoId};
    `

    await db.run(getQuery)
    response.send('Priority Updated')
  }

  if (todo) {
    let getQuery = `
    UPDATE todo
    set todo = "${todo}" 
    where id = ${todoId};
    `

    await db.run(getQuery)
    response.send('Todo Updated')
  }
})

app.delete('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params

  const getQuery = `
  delete from todo 
  where id = ${todoId};
  `

  await db.run(getQuery)

  response.send('Todo Deleted')
})

module.exports = app
