## JSDoc

O JSDoc é um sistema de documentação integrado ao **TypeScript Language Server** do VS Code, um processo lá que roda em segundo plano e faz tudo funcionar, autocomplete os sublinhados com erros e etc

E há um problema no JavaScript puro, que é não ter tipos, então o Language Server não sabe nada sobre os parâmetros de uma função, O JSDoc resolve isso com o `/** */`, que o Language Server le e trata internamente como se fosse TypeScript:

```javascript
//Sem JSDoc o editor não sabe nada sobre tipo e valor 
function salvarHistorico(tipo, valor) {}

//Com JSDoc o editor conhece os tipos
/**
 * @param {'temp'|'umid'|'luz'} tipo
 * @param {number|string} valor
 */
function salvarHistorico(tipo, valor) {}
```

Na prática, se você chamar a função com um valor errado, o editor sublinha:

```javascript
salvarHistorico('temperatura', 25) //sublinhado, 'temperatura' não está na lista
salvarHistorico('temp', 25)        //ok
```

