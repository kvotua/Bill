let currentItemsState = [];

function createCheckItem(item) {
  const itemLine = document.createElement('div');
  itemLine.className = 'item-line';
  itemLine.setAttribute('data-item-id', item.id);

  itemLine.innerHTML = `
    <span class="item-name">${item.name}</span>
    <span class="dotted-line"></span>
    <span class="item-quantity">${item.quantity} ${item.unit}</span>
    <span class="dotted-line low"></span>
    <span class="item-price">${formatPrice(item.price * item.quantity)}</span>
  `;

  return itemLine;
}

function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
}

export function renderCheck(diffItem) {
  if (diffItem.addItems) {
    currentItemsState = currentItemsState.concat(diffItem.addItems);
  }
  if (diffItem.removeItemsId) {
    currentItemsState = currentItemsState.filter(
      item => !diffItem.removeItemsId.includes(item.id)
    );
  }
  if (diffItem.editItems) {
    diffItem.editItems.forEach(updatedItem => {
      const index = currentItemsState.findIndex(
        item => item.id === updatedItem.id
      );
      if (index !== -1) {
        currentItemsState[index] = updatedItem;
      }
    });
  }

  if (diffItem.editItems) {
    diffItem.editItems.forEach((item, index) => {
      updateItem(item, index);
    });
  }

  if (diffItem.removeItemsId) {
    diffItem.removeItemsId.forEach((itemId, index) => {
      removeItemWithAnimation(itemId, index);
    });
  }

  if (diffItem.addItems) {
    const delay = diffItem.removeItemsId ? 400 : 0;
    setTimeout(() => {
      diffItem.addItems.forEach((item, index) => {
        addItem(item, index);
      });
    }, delay);
  }
}

export function diffItems(items) {
  if (currentItemsState.length === 0) {
    return {
      addItems: items,
    };
  }

  const newItemsMap = new Map(items.map(item => [item.id, item]));
  const currentItemsMap = new Map(
    currentItemsState.map(item => [item.id, item])
  );

  const itemsToAdd = [];
  const itemsToRemoveIds = [];
  const itemsToEdit = [];

  items.forEach(newItem => {
    if (!currentItemsMap.has(newItem.id)) {
      itemsToAdd.push(newItem);
    }
  });

  currentItemsState.forEach(currentItem => {
    if (!newItemsMap.has(currentItem.id)) {
      itemsToRemoveIds.push(currentItem.id);
    }
  });

  items.forEach(newItem => {
    const currentItem = currentItemsMap.get(newItem.id);
    if (currentItem) {
      const isQuantityChanged = currentItem.quantity !== newItem.quantity;
      const isPriceChanged = Math.abs(currentItem.price - newItem.price) > 0.01;

      if (isQuantityChanged || isPriceChanged) {
        itemsToEdit.push(newItem);
      }
    }
  });

  return {
    addItems: itemsToAdd.length > 0 ? itemsToAdd : null,
    removeItemsId: itemsToRemoveIds.length > 0 ? itemsToRemoveIds : null,
    editItems: itemsToEdit.length > 0 ? itemsToEdit : null,
  };
}

export function addItem(newItem, index = 1) {
  const container = document.getElementById('checkItems');
  const element = createCheckItem(newItem);
  element.style.opacity = '0';
  element.style.transform = 'translateY(20px)';
  container.appendChild(element);

  setTimeout(
    () => {
      element.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    },
    (index + 1) * 100
  );

  return newItem.id;
}

function updateItem(updatedItem, index = 1) {
  const element = document.querySelector(`[data-item-id="${updatedItem.id}"]`);
  if (!element) return;

  const quantityElement = element.querySelector('.item-quantity');
  const priceElement = element.querySelector('.item-price');

  if (quantityElement) {
    quantityElement.textContent = `${updatedItem.quantity} ${updatedItem.unit}`;
  }
  if (priceElement) {
    priceElement.textContent = formatPrice(
      updatedItem.price * updatedItem.quantity
    );
  }

  element.style.transition = 'background-color 0.3s ease';
  element.style.backgroundColor = '#6f66c275';

  setTimeout(() => {
    element.style.backgroundColor = '';
  }, 1000);

  return updatedItem.id;
}

function removeItemWithAnimation(itemId) {
  const element = document.querySelector(`[data-item-id="${itemId}"]`);
  if (!element) return;

  const allItems = Array.from(document.querySelectorAll('.item-line'));
  const currentIndex = allItems.indexOf(element);
  const subsequentItems = allItems.slice(currentIndex + 1);

  element.style.transition = 'all 0.4s ease';
  element.style.opacity = '0';
  element.style.transform = 'translateX(-100%)';
  element.style.height = '0';
  element.style.margin = '0';
  element.style.padding = '0';
  element.style.border = 'none';

  subsequentItems.forEach((item, index) => {
    item.style.transition = 'transform 0.4s ease';
    item.style.transform = `translateY(-${element.offsetHeight}px)`;
  });

  setTimeout(() => {
    subsequentItems.forEach(item => {
      item.style.transition = 'transform 0s';
      item.style.transform = 'translateY(0)';
    });
    element.remove();
  }, 400);
}
