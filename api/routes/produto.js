import express from 'express'
import { connectToDatabase } from '../utils/mongodb.js'
import { check, validationResult } from 'express-validator'
import auth from '../middleware/auth.js'
import calcularPontos from '../microservice/calculoPontos.js'

const router = express.Router()
const { db, ObjectId } = await connectToDatabase()
const nomeCollection = 'produto'

const validaProduto = [
check('nome')
  .not().isEmpty().trim().withMessage('É obrigatório informar o nome do produto')
  .isLength({min:5}).withMessage('O nome é muito curto. Mínimo de 2')  
  .isLength({max:200}).withMessage('O nome é muito longo. Máximo de 200'),
check('categoria').notEmpty().withMessage('A categoria é obrigatório'),
check('reutilizavel').notEmpty().withMessage('A categoria é obrigatório')

]

router.get('/', auth, async (req, res) => {
  const { limit, skip, order } = req.query //Obter da URL
  try {
    const docs = []
    await db.collection(nomeCollection)
      .find()
      .limit(parseInt(limit) || 10)
      .skip(parseInt(skip) || 0)
      .sort({ order: 1 })
      .forEach((doc) => {
        docs.push(doc)
      })
    res.status(200).json(docs)
  } catch (err) {
    res.status(500).json(
      {
        message: 'Erro ao obter a listagem dos produtos',
        error: `${err.message}`
      })
  }
})

router.get('/id/:id', auth, async (req, res) => {
  try {
    const docs = []
    await db.collection(nomeCollection)
      .find({ '_id': { $eq: new ObjectId(req.params.id) } }, {})
      .forEach((doc) => {
        docs.push(doc)
      })
    res.status(200).json(docs)
  } catch (err) {
    res.status(500).json({
      errors: [{
        value: `${err.message}`,
        msg: 'Erro ao obter o produto pelo ID',
        param: '/id/:id'
      }]
    })
  }
})

router.delete('/:id', auth, async(req, res) => {
  const result = await db.collection(nomeCollection).deleteOne({
    "_id": { $eq: new ObjectId(req.params.id)}
  })
  if (result.deletedCount === 0){
    res.status(404).json({
      errors: [{
        value: `Não há nenhum produto com o id ${req.params.id}`,
        msg: 'Erro ao excluir o benefício',
        param: '/:id'
      }]
    })
  } else {
    res.status(200).send(result)
  }
})


router.post('/', auth, validaProduto, async(req, res) => {
  try{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array()})
    }
    const produto = await db.collection(nomeCollection).insertOne(req.body)
  console.log(calcularPontos(req.body.categoria, req.body.reutilizavel))
    res.status(201).json(produto) //201 é o status created            
  } catch (err){
    res.status(500).json({message: `${err.message} Erro no Server`})
  }
})

router.put('/', auth, validaProduto, async(req, res) => {
  let idDocumento = req.body._id //armazenamos o _id do documento
  delete req.body._id //removemos o _id do body que foi recebido na req.
  try {
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
      }
      const produto = await db.collection(nomeCollection)
      .updateOne({'_id': {$eq: new ObjectId(idDocumento)}},
                 {$set: req.body})
      res.status(202).json(produto) //Accepted           
  } catch (err){
    res.status(500).json({errors: err.message})
  }
})
export default router