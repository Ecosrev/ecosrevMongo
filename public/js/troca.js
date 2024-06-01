const urlBase = 'http://localhost:4000/api'
const access_token = localStorage.getItem('token') || null
const resultadoModal = new bootstrap.Modal(document.getElementById('modalMensagem'))
const attForm = new bootstrap.Modal(document.getElementById('modalForm'))

async function carregaBeneficio(){
    const tabela = document.getElementById('dadosTabela')
    tabela.innerHTML = '' //limpa antes de recarregar
    //Faremos a requisição GET para a nossa API REST
    await fetch(`${urlBase}/beneficio`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'access-token' : access_token
        }
    })
    .then(response => response.json())
    .then(data => {
        //console.table(data)
        data.forEach(beneficio => {
            tabela.innerHTML += `
            <tr>
              <td>${beneficio.nome}</td>
              <td>${new Date(beneficio.data).toLocaleDateString()}</td>
              <td>${beneficio.endereco}</td>
              <td>${beneficio.pontos}</td>
              <td>${beneficio.quantidade}</td>
              <td>
              <input type="checkbox" value="${beneficio.pontos}" class="pontos" name="pontos" onclick="pontos()" />
              <label for="pontos">Adicionar</label>
              </td>
            </tr>
            `
        })
    })
    document.getElementById("uPontos").innerHTML += ""
}

function pontos(){
    isCheck = [] //Iniciando a variável de valores checkados
    var c = document.getElementsByClassName("pontos") // Iniciando a variável com endereçamento das checkboxes
    for (var i = 0; i < c.length; i++) { //Iniciando loop que chama a função
            for (var co = 0; co < c.length; co++){ // Loop de alimentação do array de checkboxes checados
                isCheck.push(c[co].checked)
                console.log(isCheck)
            }
            if (isCheck.includes(true)) // Se houver um valor verdadeiro ele mostra o total do resgate, senão, oculta novamente
                document.getElementById("divsaldo").style.display = "block"
            else{
                document.getElementById("divsaldo").style.display = "none"
            }
            isCheck = [] // limpa o array
            s = 0 // inicializando a variável de soma de valores
            for (var co = 0; co < c.length; co++){
                if(c[co].checked == true){ // alimentando a variável de soma de valores apenas dos valores checkados
                    s += Number(c[co].value)
                    console.log(c)
                }
            }
            document.getElementById("saldo").innerHTML = "Total: " + s // substituindo o texto de um h3 para o valor total do resgate
            if (s > 300){ // mudando a cor dos pontos caso ultrapasse o total de pontos do usuário, no caso 300
                document.getElementById("saldo").style.color = "red"
            }
            else{
                document.getElementById("saldo").style.color = "black"
            }
        }
}

async function removeBeneficio(id){
    if(confirm('Deseja realmente excluir este beneficio?')){
        await fetch(`${urlBase}/beneficio/${id}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json',
            'access-token' : access_token
            }
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

async function atualizaBeneficio(beneficio){
    await fetch(`${urlBase}/beneficio`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'access-token' : access_token
        },
        body: JSON.stringify(beneficio)
    })
    .then(response => response.json())
    .then(data => {
        if (data.acknowledged) {
            alert('Beneficio atualizado com sucesso!')
            //atualizamos a listagem
            carregaBeneficio()
        } else if (data.errors){
 const errorMessages = data.errors.map(error => error.msg).join('\n')
 document.getElementById('mensagem').innerHTML = `<span class='text-danger'>${errorMessages}</span>`
 resultadoModal.show() //Mostra o modal
        }
    })
}

document.getElementById('botaoAtt').addEventListener('click', function (event){
    event.preventDefault() // evita o recarregamento
    //let beneficio = {} // Objeto beneficio
    beneficio = {
        "_id": document.getElementById('idAtt').value,
        "nome": document.getElementById('nome1').value,
        "data": document.getElementById('data2').value,
        "endereco": document.getElementById('endereco3').value,
        "pontos": document.getElementById('pontos4').value,
        "quantidade": document.getElementById('quantidade5').value
    } /* fim do objeto */
    //alert(JSON.stringify(beneficio)) //apenas para testes
    atualizaBeneficio(beneficio)
    attForm.hide()
})

async function carregaAtt(id){
    attForm.show()
    await fetch(`${urlBase}/beneficio/id/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'access-token' : access_token
        }
    })
    .then(response => response.json())
    .then(data => {
        //console.log(data[0]._id)
        document.getElementById('idAtt').value = data[0]._id
        document.getElementById('nome1').value = data[0].nome
        document.getElementById('data2').value = data[0].data
        document.getElementById('endereco3').value = data[0].endereco
        document.getElementById('pontos4').value = data[0].pontos
        document.getElementById('quantidade5').value = data[0].quantidade
    })
}


