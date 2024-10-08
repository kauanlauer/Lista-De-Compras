const commonItems = [
    "Arroz", "Feijão", "Macarrão", "Sal", "Açúcar", "Farinha", "Café", "Chá",
    "Sabonete", "Shampoo", "Pasta de dente", "Bucha", "Álcool", "Detergente",
    "Sabão em pó", "Desinfetante", "Água sanitária", "Amaciante", "Óleo",
    "Vinagre", "Molho de tomate", "Leite", "Pão", "Manteiga", "Queijo",
    "Presunto", "Ovos", "Carne", "Frango", "Peixe", "Frutas", "Legumes",
    "Verduras", "Biscoitos", "Chocolate", "Papel higiênico", "Papel toalha",
    "Guardanapos", "Saco de lixo", "Alumínio", "Filme plástico", "Fósforos",
    "Velas", "Pilhas", "Lâmpadas", "Escova de dentes", "Fio dental"
];
  let shoppingList = [];

  function loadShoppingList() {
      const savedList = localStorage.getItem('shoppingList');
      if (savedList) {
          shoppingList = JSON.parse(savedList);
      }
  }

  function saveShoppingList() {
      localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
  }

  function updateShoppingList() {
      const list = document.getElementById('shoppingList');
      list.innerHTML = '';
      shoppingList.forEach((item, index) => {
          const li = document.createElement('li');
          li.innerHTML = `
              ${item.name} - Quantidade: ${item.quantity}
              <input type="number" step="0.01" placeholder="Preço" value="${item.price}" onchange="updatePrice(${index}, this.value)">
              <button onclick="removeItem(${index})">Remover</button>
          `;
          list.appendChild(li);
      });
      updateTotal();
      saveShoppingList();
  }

  function addItem(name, quantity) {
      shoppingList.push({ name, quantity, price: 0 });
      updateShoppingList();
  }

  function removeItem(index) {
      shoppingList.splice(index, 1);
      updateShoppingList();
  }

  function clearShoppingList() {
      shoppingList = [];
      updateShoppingList();
  }

  // Carregue a lista ao iniciar a página
  document.addEventListener('DOMContentLoaded', function() {
      loadShoppingList();
      updateShoppingList();

      const addItemBtn = document.getElementById('addItemBtn');
      const viewListBtn = document.getElementById('viewListBtn');
      const addItemScreen = document.getElementById('addItemScreen');
      const viewListScreen = document.getElementById('viewListScreen');
      const addItemForm = document.getElementById('addItemForm');
      const itemNameInput = document.getElementById('itemName');
      const suggestionList = document.createElement('ul');
      suggestionList.id = 'suggestionList';
      suggestionList.style.display = 'none';
      itemNameInput.parentNode.insertBefore(suggestionList, itemNameInput.nextSibling);

      itemNameInput.addEventListener('input', function() {
          const inputValue = this.value.toLowerCase();
          const filteredItems = commonItems.filter(item => 
              item.toLowerCase().startsWith(inputValue)
          );

          suggestionList.innerHTML = '';
          filteredItems.forEach(item => {
              const li = document.createElement('li');
              li.textContent = item;
              li.addEventListener('click', function() {
                  itemNameInput.value = item;
                  suggestionList.style.display = 'none';
              });
              suggestionList.appendChild(li);
          });

          suggestionList.style.display = filteredItems.length > 0 ? 'block' : 'none';
      });

      document.addEventListener('click', function(e) {
          if (e.target !== itemNameInput && e.target !== suggestionList) {
              suggestionList.style.display = 'none';
          }
      });

      function showAddItemScreen() {
          addItemScreen.classList.remove('hidden');
          viewListScreen.classList.add('hidden');
      }

      function showViewListScreen() {
          addItemScreen.classList.add('hidden');
          viewListScreen.classList.remove('hidden');
          updateShoppingList();
      }

      addItemBtn.addEventListener('click', showAddItemScreen);
      viewListBtn.addEventListener('click', showViewListScreen);

      addItemForm.addEventListener('submit', function(e) {
          e.preventDefault();
          const name = document.getElementById('itemName').value;
          const quantity = parseInt(document.getElementById('itemQuantity').value);

          if (name && quantity) {
              addItem(name, quantity);
              this.reset();
          }
      });

      showAddItemScreen();
  });

  function showScreen(screenToShow) {
      document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
      screenToShow.classList.remove('hidden');
  }

  function updatePrice(index, price) {
      shoppingList[index].price = parseFloat(price);
      updateTotal();
      saveShoppingList();
  }

  function updateTotal() {
      total = shoppingList.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      document.getElementById('totalAmount').textContent = total.toFixed(2);
  }
        function generateReport() {
          let reportContent = "Lista de Compras\n\n";
          let total = 0;

          shoppingList.forEach(item => {
              const itemTotal = item.quantity * item.price;
              reportContent += `${item.name} - Quantidade: ${item.quantity} - Preço: R$ ${item.price.toFixed(2)} - Total: R$ ${itemTotal.toFixed(2)}\n`;
              total += itemTotal;
          });

          reportContent += `\nTotal da compra: R$ ${total.toFixed(2)}`;

          // Criar um Blob com o conteúdo do relatório
          const blob = new Blob([reportContent], { type: 'text/plain' });

          // Criar um URL temporário para o Blob
          const url = URL.createObjectURL(blob);

          // Criar um elemento <a> invisível
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = 'relatorio_compras.txt';

          // Adicionar o elemento ao corpo do documento
          document.body.appendChild(a);

          // Simular um clique no elemento
          a.click();

          // Remover o elemento e revogar o URL
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }