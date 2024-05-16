// Importe o módulo necessário para conectar-se ao seu banco de dados
import { connectToDatabase } from '../utils/mongodb.js'

const { db, ObjectId } = await connectToDatabase()
const nomeCollection = 'produto'
 
// Função para calcular o total de pontos com base na categoria e na reutilização
export default function calcularPontos(categoria, reutilizavel) {
    const categoriasMultiplicadores = {
        micro: 1.1,
        pequeno: 1.2,
        medio: 1.3,
        grande: 1.5
    };
    const multiplicador = categoriasMultiplicadores[categoria];
    if (!multiplicador) {
        throw new Error('Categoria inválida');
    }
    let total = 100 * multiplicador;
    if (reutilizavel) {
        total *= 2;
    }
    return total;
}
