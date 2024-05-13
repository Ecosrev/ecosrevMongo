const urlBase = 'http://localhost:4000/api'

async function carregaBeneficio(){
    const tabela = document.getElementById('dadosTabela')
    tabela.innerHTML = '' //limpa antes de recarregar
    //Faremos a requisição GET para a nossa API REST
    await fetch(`${urlBase}/beneficio`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        // console.table(data)
        data.forEach(beneficio => {
            tabela.innerHTML += `
            <tr>
              <td>${beneficio.nome}</td>
              <td>${new Date(beneficio.data).toLocaleDateString()}</td>
              <td>${beneficio.endereco}</td>
              <td>${beneficio.pontos}</td>
              <td>${beneficio.quantidade}</td>
              <td>
        <button class='btn btn-danger btn-sm' onclick='removeBeneficio("${beneficio._id}")'>🗑 Excluir </button>
              </td>
            </tr>
            `
        })
    })
}

async function removeBeneficio(id){
    if(confirm('Deseja realmente excluir este beneficio?')){
        await fetch(`${urlBase}/beneficio/${id}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        })
        .then(response => response.json())
        .then(data => {
            if (data.deletedCount > 0){carregaBeneficio() //atualizamos a UI
            }
        })
        .catch(error => {
            document.getElementById('mensagem').innerHTML = `Erro ao remover o beneficio: ${error.message}`
            resultadoModal.show() //exibe o modal com o erro
        })
    }
}
document.getElementById('formBeneficio').addEventListener('submit', function (event){
    event.preventDefault() // evita o recarregamento
    let beneficio = {} // Objeto beneficio
    beneficio = {
        "nome": document.getElementById('nome1').value,
        "data": document.getElementById('data2').value,
        "endereco": document.getElementById('endereco3').value,
        "pontos": document.getElementById('pontos4').value,
        "quantidade": document.getElementById('quantidade5').value
    } /* fim do objeto */
    //alert(JSON.stringify(beneficio)) //apenas para testes
    salvaBeneficio(beneficio)
})

async function salvaBeneficio(beneficio){
    await fetch(`${urlBase}/beneficio`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(beneficio)
    })
    .then(response => response.json())
    .then(data => {
        if (data.acknowledged) {
            alert('Beneficio incluído com sucesso!')
            //atualizamos a listagem
        } else if (data.errors){
 const errorMessages = data.errors.map(error => error.msg).join('\n')
        }
    })

}